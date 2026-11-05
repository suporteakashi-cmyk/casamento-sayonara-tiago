import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ngiaelgzvhvzvvqzzvgl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MJVrdMna33f58u31bJtd_w_lL30OVd0';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'sua-chave-anon-publica-aqui'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch all gifts for the public catalog from live Supabase
 */
export async function getGifts(filter = 'all') {
  let query = supabase
    .from('gifts')
    .select('*')
    .order('created_at', { ascending: false });

  if (filter === 'available') {
    query = query.eq('status', 'available');
  } else if (filter === 'reserved') {
    query = query.in('status', ['reserved', 'received']);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Format items so both 'details' (existing in DB) and model/color are cleanly presented
  return (data || []).map((item) => ({
    ...item,
    model: item.model || (item.details?.toLowerCase().includes('modelo') ? item.details : null),
    color: item.color || (item.details?.toLowerCase().includes('cor') || item.details?.toLowerCase().includes('tom') ? item.details : null),
    notes: item.notes || item.details || null,
  }));
}

/**
 * Atomic reservation via PostgreSQL RPC function 'reserve_gift'
 * Prevents race conditions and double bookings
 */
export async function reserveGift({ giftId, guestName, guestWhatsapp, guestMessage }) {
  const { data, error } = await supabase.rpc('reserve_gift', {
    p_gift_id: giftId,
    p_guest_name: guestName.trim(),
    p_guest_whatsapp: guestWhatsapp ? guestWhatsapp.trim() : null,
  });

  if (error) {
    throw error;
  }

  // The database returns an object: { success: true|false, message: '...' }
  if (data && data.success === false) {
    const customErr = new Error(data.message || 'PRESENT_ALREADY_RESERVED');
    customErr.details = data.message;
    throw customErr;
  }

  return data;
}

/**
 * Admin: Sign In via Supabase Auth
 */
export async function adminSignIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Admin: Sign Out
 */
export async function adminSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Admin: Get Session
 */
export async function getAdminSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/**
 * Admin: Upload image to Supabase Storage bucket 'gift-photos'
 */
export async function uploadGiftImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `gifts/${fileName}`;

  // Try existing 'gift-photos' bucket first, fallback to 'gift-images'
  let targetBucket = 'gift-photos';

  let { data, error } = await supabase.storage
    .from(targetBucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error && error.message?.includes('Bucket not found')) {
    targetBucket = 'gift-images';
    const retry = await supabase.storage
      .from(targetBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    data = retry.data;
    error = retry.error;
  }

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(targetBucket)
    .getPublicUrl(filePath);

  return publicUrl;
}

/**
 * Admin: Create gift
 */
export async function createGift(giftData) {
  // Support both 'details' column and separated columns
  const payload = {
    name: giftData.name.trim(),
    description: giftData.description?.trim() || null,
    details: [giftData.model, giftData.color, giftData.notes].filter(Boolean).join(' | ') || giftData.details || null,
    image_url: giftData.image_url?.trim() || null,
    status: giftData.status || 'available',
  };

  const { data, error } = await supabase
    .from('gifts')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Update gift
 */
export async function updateGift(giftId, giftData) {
  const payload = {
    name: giftData.name.trim(),
    description: giftData.description?.trim() || null,
    details: [giftData.model, giftData.color, giftData.notes].filter(Boolean).join(' | ') || giftData.details || null,
    image_url: giftData.image_url?.trim() || null,
    status: giftData.status || 'available',
  };

  const { data, error } = await supabase
    .from('gifts')
    .update(payload)
    .eq('id', giftId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Delete gift
 */
export async function deleteGift(giftId) {
  const { error } = await supabase
    .from('gifts')
    .delete()
    .eq('id', giftId);

  if (error) throw error;
  return true;
}

/**
 * Admin: Fetch all reservations with gift details
 */
export async function getReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      gift_id,
      guest_name,
      guest_whatsapp,
      created_at,
      gifts:gift_id (
        id,
        name,
        details,
        image_url,
        status
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Admin: Cancel reservation and release gift back to 'available'
 */
export async function cancelReservation(reservationId, giftId) {
  const { error: cancelError } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId);

  if (cancelError) throw cancelError;

  if (giftId) {
    const { error: giftError } = await supabase
      .from('gifts')
      .update({ status: 'available' })
      .eq('id', giftId);

    if (giftError) throw giftError;
  }

  return true;
}

/**
 * Admin: Release a reserved gift directly
 */
export async function releaseGift(giftId) {
  const { data, error } = await supabase
    .from('gifts')
    .update({ status: 'available' })
    .eq('id', giftId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Mark gift as received
 */
export async function markGiftReceived(giftId) {
  const { data, error } = await supabase
    .from('gifts')
    .update({ status: 'received' })
    .eq('id', giftId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

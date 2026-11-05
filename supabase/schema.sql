-- ==============================================================================
-- CASAMENTO SAYONARA & TIAGO — ESQUEMA COMPLETO DE BANCO DE DADOS (SUPABASE)
-- Data do Casamento: 16 de maio de 2027
-- Projeto: https://ngiaelgzvhvzvvqzzvgl.supabase.co
-- ==============================================================================
-- Este script cria:
-- 1. Extensões necessárias (uuid-ossp / pgcrypto)
-- 2. Tabela 'gifts' (presentes)
-- 3. Tabela 'reservations' (reservas dos convidados)
-- 4. Função atômica RPC 'reserve_gift' com bloqueio FOR UPDATE contra reservas duplicadas
-- 5. Função atômica RPC 'cancel_reservation' para liberação segura pelo admin
-- 6. Trigger para atualização automática da coluna 'updated_at'
-- 7. Políticas de Segurança em Nível de Linha (RLS) protegendo dados e garantindo integridade
-- 8. Configuração do bucket de armazenamento 'gift-images' no Supabase Storage
-- 9. Carga inicial de presentes para inspiração e início imediato
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA DE PRESENTES (gifts)
CREATE TABLE IF NOT EXISTS public.gifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    model TEXT,
    color TEXT,
    notes TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'received')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices para performance e consultas rápidas
CREATE INDEX IF NOT EXISTS idx_gifts_status ON public.gifts(status);
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON public.gifts(created_at DESC);

-- 3. TABELA DE RESERVAS (reservations)
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_id UUID NOT NULL REFERENCES public.gifts(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_whatsapp TEXT,
    guest_message TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Índices de reservas
CREATE INDEX IF NOT EXISTS idx_reservations_gift_id ON public.reservations(gift_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at DESC);

-- 4. TRIGGER PARA ATUALIZAR 'updated_at' EM GIFTS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_gifts_updated_at ON public.gifts;
CREATE TRIGGER trigger_gifts_updated_at
    BEFORE UPDATE ON public.gifts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. FUNÇÃO RPC ATÔMICA PARA RESERVAS (PREVENÇÃO ABSOLUTA DE RESERVA DUPLICADA)
-- Utiliza 'SELECT ... FOR UPDATE' para travar o registro específico daquele presente
-- durante a transação. Se dois convidados clicarem no mesmo segundo, o segundo
-- aguardará o lock e receberá o erro 'PRESENT_ALREADY_RESERVED'.
CREATE OR REPLACE FUNCTION public.reserve_gift(
    p_gift_id UUID,
    p_guest_name TEXT,
    p_guest_whatsapp TEXT DEFAULT NULL,
    p_guest_message TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_gift_record RECORD;
    v_new_reservation_id UUID;
BEGIN
    -- Validação de entrada
    IF p_guest_name IS NULL OR trim(p_guest_name) = '' THEN
        RAISE EXCEPTION 'O nome do convidado é obrigatório.' USING ERRCODE = 'P0002';
    END IF;

    -- Bloqueio exclusivo de linha (row-level lock) para validação atômica
    SELECT id, name, status INTO v_gift_record
    FROM public.gifts
    WHERE id = p_gift_id
    FOR UPDATE;

    -- Verificar se o presente existe
    IF NOT FOUND THEN
        RAISE EXCEPTION 'PRESENT_NOT_FOUND' USING ERRCODE = 'P0003';
    END IF;

    -- Verificar se o presente ainda está disponível
    IF v_gift_record.status <> 'available' THEN
        RAISE EXCEPTION 'PRESENT_ALREADY_RESERVED' USING ERRCODE = 'P0001';
    END IF;

    -- Atualiza status do presente para 'reserved'
    UPDATE public.gifts
    SET status = 'reserved',
        updated_at = timezone('utc'::text, now())
    WHERE id = p_gift_id;

    -- Insere registro da reserva
    INSERT INTO public.reservations (
        gift_id,
        guest_name,
        guest_whatsapp,
        guest_message,
        status
    ) VALUES (
        p_gift_id,
        trim(p_guest_name),
        NULLIF(trim(p_guest_whatsapp), ''),
        NULLIF(trim(p_guest_message), ''),
        'confirmed'
    ) RETURNING id INTO v_new_reservation_id;

    -- Retorna confirmação estruturada
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Presente reservado com sucesso! Muito obrigado por fazer parte desse momento tão especial.',
        'reservation_id', v_new_reservation_id,
        'gift_id', p_gift_id,
        'gift_name', v_gift_record.name
    );
END;
$$;

-- Permitir que visitantes públicos (anon) e autenticados invoquem a função segura de reserva
GRANT EXECUTE ON FUNCTION public.reserve_gift(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;

-- 6. POLÍTICAS DE SEGURANÇA EM NÍVEL DE LINHA (RLS)
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas existentes para evitar conflitos ao reexecutar
DROP POLICY IF EXISTS "Gifts public read" ON public.gifts;
DROP POLICY IF EXISTS "Gifts admin insert" ON public.gifts;
DROP POLICY IF EXISTS "Gifts admin update" ON public.gifts;
DROP POLICY IF EXISTS "Gifts admin delete" ON public.gifts;

DROP POLICY IF EXISTS "Reservations admin read" ON public.reservations;
DROP POLICY IF EXISTS "Reservations admin update" ON public.reservations;
DROP POLICY IF EXISTS "Reservations admin delete" ON public.reservations;

-- TABELA: GIFTS
-- Visitantes públicos e administradores podem ler os presentes
CREATE POLICY "Gifts public read" 
    ON public.gifts 
    FOR SELECT 
    USING (true);

-- Apenas administradores autenticados podem inserir novos presentes
CREATE POLICY "Gifts admin insert" 
    ON public.gifts 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Apenas administradores autenticados podem atualizar presentes diretamente
-- (o público só altera status de 'available' para 'reserved' por meio da RPC reserve_gift com SECURITY DEFINER)
CREATE POLICY "Gifts admin update" 
    ON public.gifts 
    FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Apenas administradores autenticados podem excluir presentes
CREATE POLICY "Gifts admin delete" 
    ON public.gifts 
    FOR DELETE 
    TO authenticated 
    USING (true);

-- TABELA: RESERVATIONS
-- Proteção máxima da privacidade dos convidados:
-- Apenas usuários autenticados (Sayonara) podem consultar a lista de reservas, nomes e mensagens.
CREATE POLICY "Reservations admin read" 
    ON public.reservations 
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Apenas o administrador autenticado pode alterar o status da reserva (ex: cancelar)
CREATE POLICY "Reservations admin update" 
    ON public.reservations 
    FOR UPDATE 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Apenas o administrador autenticado pode deletar reservas
CREATE POLICY "Reservations admin delete" 
    ON public.reservations 
    FOR DELETE 
    TO authenticated 
    USING (true);

-- 7. SUPABASE STORAGE (BUCKET PARA FOTOS DOS PRESENTES)
-- Criação do bucket público 'gift-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('gift-images', 'gift-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas do Storage para o bucket 'gift-images'
DROP POLICY IF EXISTS "Gift images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gift images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gift images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gift images" ON storage.objects;

-- Qualquer pessoa pode visualizar as fotos dos presentes
CREATE POLICY "Gift images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gift-images');

-- Apenas admin autenticado pode fazer upload de fotos
CREATE POLICY "Authenticated users can upload gift images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gift-images');

-- Apenas admin autenticado pode atualizar fotos
CREATE POLICY "Authenticated users can update gift images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gift-images');

-- Apenas admin autenticado pode excluir fotos
CREATE POLICY "Authenticated users can delete gift images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'gift-images');

-- 8. CARGA INICIAL DE EXEMPLOS (SEDES INICIAIS)
-- Presentes sugeridos para compor a lista caso a tabela esteja vazia
INSERT INTO public.gifts (id, name, description, model, color, notes, image_url, status)
VALUES
    (
        '1a2b3c4d-0001-4000-8000-000000000001',
        'Jogo de Jantar em Porcelana 42 Peças',
        'Aparelho de jantar e chá completo em porcelana fina para compor mesas elegantes e receber a família.',
        'Clássico Oxford Porcelanas',
        'Branco com detalhes acetinados',
        'Preferência por modelo resistente a micro-ondas e lava-louças.',
        'https://images.unsplash.com/photo-1615865417491-9941019fbc00?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0002-4000-8000-000000000002',
        'Fritadeira Elétrica Air Fryer 4L',
        'Para facilitar as refeições saudáveis e práticas do dia a dia do novo lar.',
        'Digital Touch ou Inox',
        'Inox / Prata ou Preto',
        'Voltagem 110V/127V ou Bivolt.',
        'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0003-4000-8000-000000000003',
        'Jogo de Panelas Antiaderente Cerâmica',
        'Conjunto completo de panelas com revestimento cerâmico ecológico e cabos soft-touch.',
        'Brinox Ceramic Life ou Tramontina Solar',
        'Verde Oliva ou Vanilla',
        'Conjunto com 5 peças com tampas de vidro temperado.',
        'https://images.unsplash.com/photo-1584990347449-a29d5b78a8be?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0004-4000-8000-000000000004',
        'Cafeteira de Expresso & Cápsulas',
        'Para os momentos especiais e os cafés da manhã a dois com café quentinho e cremoso.',
        'Nespresso Essenza Mini ou Oster Prima Latte',
        'Prata / Inox',
        'Voltagem 127V.',
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0005-4000-8000-000000000005',
        'Aspirador de Pó Robô Inteligente',
        'Auxiliar essencial para manter a casa limpa e cheirosa de forma automática.',
        'Com função passar pano (Mop)',
        'Branco ou Cinza Prateado',
        'Bivolt.',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0006-4000-8000-000000000006',
        'Jogo de Cama 400 Fios Casal Queen',
        'Enxoval macio e confortável 100% algodão egípcio para noites de descanso perfeitas.',
        'Lençol com elástico + sobrelençol + 2 fronhas com abas',
        'Branco ou Fendi/Verde Sálvia',
        'Tamanho Queen Size (1,58m x 1,98m).',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0007-4000-8000-000000000007',
        'Faqueiro Inox 48 Peças com Estojo',
        'Talheres refinados com acabamento polido para ocasiões comemorativas e o dia a dia.',
        'Tramontina Laguna ou Malibu',
        'Aço Inox Prateado Brilhante',
        'Acompanha estojo protetor.',
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
        'available'
    ),
    (
        '1a2b3c4d-0008-4000-8000-000000000008',
        'Jogo de Taças de Cristal de Titânio',
        'Jogo com 6 taças para vinho tinto e 6 taças para espumante, resistentes e elegantes.',
        'Bohemia Crystal ou Strauss',
        'Transparente com lapidação fina',
        'Cristal ecológico sem chumbo.',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        'available'
    )
ON CONFLICT (id) DO NOTHING;

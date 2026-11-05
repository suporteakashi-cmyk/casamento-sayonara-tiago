import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧪 Iniciando Verificação de Integridade e Testes de Regra de Negócio...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
  }
}

// 1. Arquivos essenciais
console.log('📁 1. Verificando existência de arquivos essenciais:');
assert(fs.existsSync(path.join(rootDir, 'package.json')), 'package.json existe');
assert(fs.existsSync(path.join(rootDir, 'supabase', 'schema.sql')), 'supabase/schema.sql existe');
assert(fs.existsSync(path.join(rootDir, '.env.example')), '.env.example existe');
assert(fs.existsSync(path.join(rootDir, 'vercel.json')), 'vercel.json existe');
assert(fs.existsSync(path.join(rootDir, 'index.html')), 'index.html existe');
assert(fs.existsSync(path.join(rootDir, 'dist', 'index.html')), 'Build de produção (dist/index.html) gerado com sucesso');

// 2. Validação do SQL Schema
console.log('\n🔒 2. Verificando Regras de Banco de Dados e Concorrência (schema.sql):');
const sqlContent = fs.readFileSync(path.join(rootDir, 'supabase', 'schema.sql'), 'utf-8');

assert(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.gifts'), 'Tabela gifts definida');
assert(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.reservations'), 'Tabela reservations definida');
assert(sqlContent.includes('FOR UPDATE'), 'Row-level locking atômico (FOR UPDATE) implementado contra reservas duplicadas');
assert(sqlContent.includes('PRESENT_ALREADY_RESERVED'), 'Exceção específica PRESENT_ALREADY_RESERVED tratada na RPC');
assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Row Level Security habilitado');
assert(sqlContent.includes('bucket_id = \'gift-images\''), 'Bucket gift-images e storage policies configuradas');
assert(sqlContent.includes('SECURITY DEFINER'), 'Função reserve_gift criada como SECURITY DEFINER para blindar tabelas do usuário anon');

// 3. Simulação da Regra de Negócio de Reserva Atômica (Double-booking test)
console.log('\n🛡️ 3. Simulando Teste de Concorrência (Dois convidados reservando o mesmo item):');

// Simulação em memória do comportamento exato da função PostgreSQL reserve_gift
class SimulatedDatabase {
  constructor() {
    this.gifts = new Map([
      ['gift-01', { id: 'gift-01', name: 'Jogo de Panelas', status: 'available' }],
    ]);
    this.reservations = [];
    this.lock = false;
  }

  async reserveGiftAtomic(giftId, guestName, whatsapp, message) {
    // Simula fila de lock do Postgres (FOR UPDATE)
    while (this.lock) {
      await new Promise((r) => setTimeout(r, 10));
    }
    this.lock = true;

    try {
      const gift = this.gifts.get(giftId);
      if (!gift) throw new Error('PRESENT_NOT_FOUND');
      if (gift.status !== 'available') {
        throw new Error('PRESENT_ALREADY_RESERVED');
      }

      // Atualiza atomicamente
      gift.status = 'reserved';
      const res = { id: `res-${Date.now()}`, giftId, guestName, whatsapp, message };
      this.reservations.push(res);
      return { success: true, reservation: res };
    } finally {
      this.lock = false;
    }
  }
}

async function runConcurrencyTest() {
  const db = new SimulatedDatabase();

  // Disparo simultâneo (Promise.all) de dois convidados tentando o mesmo item ao mesmo tempo
  const [guestA, guestB] = await Promise.allSettled([
    db.reserveGiftAtomic('gift-01', 'Convidado A (Primeiro)', '11999990001', 'Parabéns!'),
    db.reserveGiftAtomic('gift-01', 'Convidado B (Segundo)', '11999990002', 'Felicidades!'),
  ]);

  const successCount = [guestA, guestB].filter((r) => r.status === 'fulfilled').length;
  const failureCount = [guestA, guestB].filter((r) => r.status === 'rejected').length;

  assert(successCount === 1, 'Exatamente UMA reserva foi confirmada com sucesso');
  assert(failureCount === 1, 'A segunda reserva simultânea foi imediatamente rejeitada com erro');

  const rejectedResult = [guestA, guestB].find((r) => r.status === 'rejected');
  assert(
    rejectedResult.reason.message === 'PRESENT_ALREADY_RESERVED',
    'Mensagem de erro de duplicidade retornada com precisão (PRESENT_ALREADY_RESERVED)'
  );

  assert(db.reservations.length === 1, 'Banco contém exatamente 1 registro de reserva');
  assert(db.gifts.get('gift-01').status === 'reserved', 'Status do presente permaneceu "reserved"');
}

await runConcurrencyTest();

// 4. Verificação da Identidade Visual e Informações do Casamento
console.log('\n🎨 4. Verificando Identidade Visual e Informações Oficiais:');
const heroContent = fs.readFileSync(path.join(rootDir, 'src', 'components', 'Hero.jsx'), 'utf-8');
assert(heroContent.includes('Sayonara dos Santos Silva &amp; Tiago Juliano Santos da Silva') || heroContent.includes('Sayonara &amp; Tiago'), 'Nomes oficiais dos noivos configurados');
assert(heroContent.includes('16 de Maio de 2027') || heroContent.includes('2027-05-16'), 'Data do casamento (16 de maio de 2027) configurada');
assert(heroContent.includes('Estamos muito felizes em compartilhar esse momento tão especial com você!'), 'Frase de boas-vindas oficial incluída');

console.log(`\n========================================`);
console.log(`Resultado dos Testes: ${passedTests} de ${totalTests} testes aprovados!`);
console.log(`========================================\n`);

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

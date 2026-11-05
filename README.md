# Casamento Sayonara & Tiago — Lista Oficial de Presentes

Aplicação completa, elegante e moderna para a lista de presentes do casamento de **Sayonara dos Santos Silva** e **Tiago Juliano Santos da Silva**, marcado para **16 de maio de 2027**.

O projeto conta com catálogo público, sistema de reserva automática atômica com prevenção rigorosa contra reservas duplicadas via banco de dados, painel administrativo protegido para a Sayonara, gerador de QR Code integrado para convites físicos e integração completa com o Supabase.

---

## 🌿 Identidade Visual & Paleta Oficial

- **Verde Oliva** (`#556B2F`, `#3D4D22`, `#ECF0E6`): Cor principal, simbolizando paz, longevidade e elegância botânica.
- **Prata** (`#CBD5E1`, `#D8DEE4`, reflexos sutis): Detalhes de bordas, cartões e divisores refinados.
- **Branco & Fendi** (`#FAF9F5`, `#FFFFFF`): Fundos predominantes, limpos e agradáveis.
- **Tipografia**: *Cormorant Garamond* (títulos clássicos e românticos), *Cinzel* (monogramas e detalhes) e *Plus Jakarta Sans* (legibilidade impecável em mobile).

---

## 🚀 Funcionalidades Concluídas

### 1. Página Pública dos Convidados
- **Destaque Romântico**: Nomes dos noivos, data do casamento e mensagem oficial de boas-vindas.
- **Contagem Regressiva**: Timer ao vivo até 16 de maio de 2027.
- **Como Funciona**: Guia em 3 passos simples, deixando claro que não há venda nem cobrança no site.
- **Catálogo de Presentes**:
  - Filtros: *Todos*, *Disponíveis* e *Reservados*.
  - Campo de busca instantâneo por nome, modelo ou cor.
  - Cartões com fotografia, modelo desejado, cor desejada e observações.
  - Presentes reservados continuam visíveis, porém bloqueados ("Já reservado com carinho").
  - Ausência proposital de preços, botões de pagamento ou links de lojas.

### 2. Sistema de Reserva Automática Atômica (Anti-Concorrência)
- Botão *"Quero presentear com este item"* abre modal solicitando:
  - Nome completo do convidado (obrigatório).
  - WhatsApp (opcional, com máscara automática de telefone brasileiro).
  - Mensagem de carinho aos noivos (opcional).
- **Garantia contra reservas duplicadas no PostgreSQL**:
  - Implementada a função segura `reserve_gift` no arquivo `supabase/schema.sql`.
  - Utiliza `SELECT ... FOR UPDATE` para travar o registro do presente na transação antes de alternar o status para `reserved` e registrar na tabela `reservations`.
  - Se dois convidados tentarem reservar o mesmo item no mesmo milissegundo, apenas o primeiro tem êxito e o segundo recebe imediatamente um aviso de que o presente já foi reservado.
  - Efeito comemorativo de confetes e mensagem oficial sugerida: *"Presente reservado com sucesso! Muito obrigado por fazer parte desse momento tão especial."*

### 3. Painel Administrativo da Sayonara (Área dos Noivos)
- Acesso restrito com e-mail e senha via **Supabase Auth**.
- **Dashboard**:
  - Contadores: Total de presentes, disponíveis, reservados e recebidos.
  - Tabela com as últimas reservas recebidas.
- **Gerenciamento de Presentes**:
  - Adicionar novo presente.
  - Editar presente existente.
  - Excluir presente (com diálogo de confirmação).
  - Upload de fotografias diretamente para o Supabase Storage (`gift-images`) ou inserção de URL externa com pré-visualização em tempo real.
  - Alteração de status: *Disponível*, *Reservado* ou *Recebido*.
  - Liberar presente reservado de volta para a lista pública.
- **Gerenciamento de Reservas**:
  - Nome do convidado, data e hora da reserva.
  - Botão de WhatsApp que abre direto a conversa com o convidado (`wa.me/...`).
  - Mensagem carinhosa deixada pelo convidado.
  - Cancelar reserva (com confirmação, restaurando o presente para a lista pública).
  - Marcar presente como recebido.
- **Gerador de QR Code**:
  - Gera QR Code em alta definição direcionado para a página pública da lista.
  - Permite personalizar a URL (para o link oficial de produção).
  - Botão de download em formato PNG e botão de impressão para estampar nos convites físicos.

---

## 🛠️ Tecnologias Utilizadas

- **React 19**
- **Vite 6**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Supabase JS** (`@supabase/supabase-js`)
- **Lucide React** (Ícones botânicos e elegantes)
- **Canvas-Confetti** (Animação comemorativa)
- **QRCode** (Geração de QR codes dinâmicos para convites)

---

## 📋 Como Configurar e Executar

### 1. Clonar ou Abrir a Pasta do Projeto
O projeto está criado em:
```bash
cd "C:\Users\gustavo.santos\.gemini\antigravity\scratch\casamento-sayonara-tiago"
```

### 2. Configurar as Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha com a chave pública do Supabase:
```env
VITE_SUPABASE_URL=https://ngiaelgzvhvzvvqzzvgl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_MJVrdMna33f58u31bJtd_w_lL30OVd0
```

> **Status da Conexão:** A Publishable Key já está devidamente configurada no arquivo `.env`.
> 
> **Usuário da Sayonara no Supabase Auth:**
> O acesso administrativo já está cadastrado no Supabase com o e-mail:
> `sayonaradossantossilvasantos8@gmail.com`
> Para acessar a **Área dos Noivos**, basta utilizar esse e-mail e a senha definida no Supabase.

### 5. Executar em Desenvolvimento Local
```bash
npm run dev
```
O Vite iniciará o servidor local em `http://localhost:3000`.

### 6. Testes Automatizados
Para rodar os testes de integridade e simulação de concorrência:
```bash
npm test
```

### 7. Gerar Build de Produção
```bash
npm run build
```
Os arquivos otimizados serão compilados na pasta `dist/`.

---

## 🌐 Publicação na Vercel

O projeto já contém o arquivo `vercel.json` configurado para roteamento Single Page Application (SPA).

1. Acesse [vercel.com](https://vercel.com) e conecte seu repositório Git.
2. Ao importar o projeto, adicione as variáveis de ambiente em **Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://ngiaelgzvhvzvvqzzvgl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<sua-chave-anon>`
3. Clique em **Deploy**.
4. Em menos de 1 minuto o site estará publicado e acessível em qualquer smartphone, tablet ou computador.
5. Acesse o painel da Sayonara, clique em **"Gerar QR Code"**, copie o link da Vercel para gerar o QR Code oficial de alta resolução e imprima nos convites do casamento!

---

**Casamento Sayonara dos Santos Silva & Tiago Juliano Santos da Silva**  
*16 de maio de 2027*

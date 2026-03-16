# 🧪 VitaLab · Sistema de Fórmulas Manipuladas

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

A **VitaLab** é uma plataforma moderna para criação e gestão de fórmulas manipuladas personalizada. Este projeto é o resultado da migração de um sistema legado estático para uma aplicação full-stack de alta performance, utilizando **Next.js**, **Prisma 7** e **Clean Architecture**.

---

## ✨ Funcionalidades

- 🛒 **Catálogo Inteligente**: Filtre ativos por categoria e encontre exatamente o que precisa.
- ⚗️ **Calculadora de Fórmulas**: Monte sua fórmula em tempo real com cálculo automático de dosagem, peso e custo.
- 🏥 **Gestão de Parceiros**: Selecione a farmácia de manipulação de sua preferência.
- 📋 **Acompanhamento de Pedidos**: Visualize o status da sua solicitação e as notas enviadas pelo farmacêutico.
- 👩‍🔬 **Painel do Farmacêutico**: Interface dedicada para revisão, ajuste e aprovação técnica de fórmulas.
- 🎨 **Design Premium**: Interface planejada com foco em experiência do usuário (UX), utilizando uma paleta de cores harmoniosa e micro-animações.

---

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**, garantindo separação de responsabilidades e facilidade de manutenção:

- **Camada de Apresentação (`/app` & `/components`)**: Componentes React dinâmicos e páginas SSR/Client-side.
- **Camada de Serviço (`/services`)**: Lógica de negócio pura (cálculos de preços, orquestração de pedidos).
- **Camada de Repositório (`/repositories`)**: Acesso à dados encapsulado com Prisma.
- **Camada de Domínio (`/prisma`)**: Definição de modelos e esquemas de dados.

---

## 🚀 Tecnologias

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Banco de Dados**: PostgreSQL
- **UI & Styling**: Tailwind CSS + Shadcn/UI
- **Ícones**: Lucide React
- **Tipagem**: TypeScript

---

## 🛠️ Como Iniciar

### 1. Requisitos
- Node.js 20+
- pnpm (recomendado) ou npm
- Instância local do PostgreSQL

### 2. Configuração
Clone o repositório e instale as dependências:
```bash
pnpm install
```

Configure as variáveis de ambiente no arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pharmarket?schema=public"
```

### 3. Banco de Dados
Sincronize o esquema e popule o banco com os dados iniciais:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Execução
Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```
Acesse em: `http://localhost:3000`

---

## 📖 Notas de Implementação

- **Cálculo de Preços**: Toda a lógica de precificação foi movida para o servidor (`PricingService`) para garantir segurança e consistência.
- **Adaptação Prisma 7**: Implementado o suporte a `driver adapters` para conexões diretas via `pg pool`.

---

Desenvolvido com ❤️ para a **VitaLab**.

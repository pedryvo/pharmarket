import "dotenv/config";
import pg from 'pg';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL or DIRECT_URL is not set');
  }

  console.log('Seed via PG direto...');
  const pool = new pg.Pool({ connectionString });

  try {
    // 1. Check/Create Admin
    const adminEmail = 'admin@admin.com';
    const checkRes = await pool.query('SELECT id FROM "User" WHERE email = $1', [adminEmail]);

    if (checkRes.rows.length === 0) {
      console.log('Criando usuário admin padrão...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const id = crypto.randomUUID();
      await pool.query(
        'INSERT INTO "User" (id, email, password, name, role) VALUES ($1, $2, $3, $4, $5)',
        [id, adminEmail, hashedPassword, 'Administrador Vitalab', 'ADMIN']
      );
      console.log('Usuário admin criado.');
    } else {
      console.log('Usuário admin já existe.');
    }

    // 2. Check/Create Settings
    const settingsRes = await pool.query('SELECT id FROM "PlatformSetting" WHERE id = 1');
    if (settingsRes.rows.length === 0) {
      console.log('Criando configurações iniciais...');
      await pool.query('INSERT INTO "PlatformSetting" (id, name, factor, "capCost") VALUES (1, $1, $2, $3)', ['VitaLab', 3.5, 0.05]);
      console.log('Configurações criadas.');
    }

    console.log('Seed concluído com sucesso!');
  } finally {
    await pool.end();
  }
}

main().catch(err => {
  console.error('Erro no seed PG:', err);
  process.exit(1);
});

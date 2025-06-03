import { Client } from 'pg';

async function waitForPostgres(maxAttempts = 5) {
  const client = new Client({
    user: 'postgres',
    password: 'acomoda2025',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.connect();
      console.log('✓ PostgreSQL está rodando');
      return client;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error('\n✗ PostgreSQL não está rodando. Execute:');
        console.error('sudo service postgresql start');
        process.exit(1);
      }
      console.log(`Tentativa ${attempt}/${maxAttempts}: Aguardando PostgreSQL...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

async function initDatabase() {
  let client;
  try {
    client = await waitForPostgres();
    
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'bancodados'"
    );

    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE bancodados');
      console.log('✓ Banco "bancodados" criado com sucesso');
    } else {
      console.log('✓ Banco "bancodados" já existe');
    }
  } catch (error) {
    console.error('✗ Erro ao inicializar banco:', error);
    process.exit(1);
  } finally {
    if (client) await client.end();
  }
}

initDatabase();

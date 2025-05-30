const fetch = require('node-fetch');

async function createTestUser() {
  try {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: 'admin',
        senha: 'admin123',
        nome: 'Administrador',
        email: 'admin@acomoda.com',
      }),
    });
    
    const data = await response.json();
    console.log('Usuário criado com sucesso:', data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
}

createTestUser();

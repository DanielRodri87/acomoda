const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando instalação forçada das dependências...');

try {
  // Instalar express globalmente e localmente
  console.log('Instalando express globalmente e localmente...');
  execSync('npm install -g express', { stdio: 'inherit' });
  execSync('npm install --save express@4.18.2', { stdio: 'inherit' });
  
  // Instalar dependências específicas do NestJS
  console.log('Instalando dependências do NestJS...');
  execSync('npm install --save @nestjs/platform-express@10.0.0', { stdio: 'inherit' });
  
  // Criar pastas necessárias
  console.log('Criando diretórios necessários...');
  const uploadDir = path.join(__dirname, 'public', 'uploads', 'casas');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Verificar se express foi instalado
  try {
    require.resolve('express');
    console.log('Express instalado com sucesso!');
  } catch (e) {
    console.error('Erro ao verificar express:', e);
    console.log('Tentando instalar novamente com outra abordagem...');
    execSync('npm install --save express', { stdio: 'inherit' });
  }

  console.log('Instalação concluída! Execute "npm run start:dev" para iniciar o servidor.');
} catch (error) {
  console.error('Ocorreu um erro durante a instalação:', error);
}

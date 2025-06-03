const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando processo de correção de dependências...');

try {
  // Limpar cache do npm
  console.log('Limpando cache do npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });

  // Remover node_modules e package-lock.json
  console.log('Removendo node_modules e package-lock.json...');
  execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });

  // Instalar dependências específicas com versões fixas
  console.log('Instalando dependências específicas...');
  const dependencies = [
    'express@4.18.2',
    '@nestjs/platform-express@10.0.0',
    '@nestjs/serve-static@4.0.0',
    'multer@1.4.5-lts.1',
    '@types/express@4.17.17',
    '@types/multer@1.4.7',
    'pg@8.11.0'
  ];

  dependencies.forEach(dep => {
    console.log(`Instalando ${dep}...`);
    execSync(`npm install --save ${dep}`, { stdio: 'inherit' });
  });

  // Reinstalar todas as dependências do projeto
  console.log('Reinstalando todas as dependências do projeto...');
  execSync('npm install', { stdio: 'inherit' });

  // Garantir que o diretório de uploads exista
  const uploadsDir = path.join(__dirname, 'public', 'uploads', 'casas');
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Criando diretório ${uploadsDir}...`);
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  console.log('Processo de correção concluído com sucesso!');
  console.log('Execute "npm run start:dev" para iniciar o servidor.');

} catch (error) {
  console.error('Ocorreu um erro durante o processo:', error);
  process.exit(1);
}

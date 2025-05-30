const { execSync } = require('child_process');
const fs = require('fs');

console.log('Verificando e instalando dependências necessárias...');

const dependencies = [
  'express',
  '@nestjs/platform-express', 
  '@nestjs/serve-static',
  'multer',
  'pg',
  '@types/express',
  '@types/multer'
];

dependencies.forEach(dep => {
  try {
    console.log(`Instalando ${dep}...`);
    execSync(`npm install --save ${dep}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Erro ao instalar ${dep}:`, error);
  }
});

// Verificar se o diretório de uploads existe
const uploadDir = './public/uploads/casas';
if (!fs.existsSync(uploadDir)) {
  console.log(`Criando diretório ${uploadDir}...`);
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log('Instalação concluída! Execute "npm start" para iniciar o servidor.');

function loadHTML(elementId, filePath) {
    fetch(filePath)
      .then(response => {
          if (!response.ok) throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
          return response.text();
      })
      .then(data => {
          document.getElementById(elementId).innerHTML = data;
      })
      .catch(error => console.error('Erro:', error));
}

loadHTML("navbar", "/components/navbar.html");

// Função para converter imagem para Base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Adicionar event listener para o ícone da câmera
const cameraButton = document.getElementById('cameraButton');
if (cameraButton) {
  cameraButton.addEventListener('click', () => {
    document.getElementById('imageInput').click();
  });
}

// Adicionar event listener para o input de imagem
const imageInput = document.getElementById('imageInput');
if (imageInput) {
  imageInput.addEventListener('change', async function(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar tamanho do arquivo (8MB máximo)
      if (file.size > 8 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 8MB');
        e.target.value = '';
        return;
      }

      try {
        const base64Image = await getBase64(file);
        document.getElementById('profileImage').src = base64Image;
        // Armazenar a imagem para envio posterior
        window.selectedImage = base64Image;
      } catch (err) {
        console.error('Erro ao converter imagem:', err);
      }
    }
  });
}

// Atualizar o handler do formulário
const form = document.getElementById('registerForm');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const user = form.querySelector('input[placeholder="Digite seu user aqui"]').value;
    const tipo = form.querySelector('input[name="tipo"]:checked')?.parentElement.textContent.trim() || '';
    const primeiro_nome = form.querySelectorAll('input[placeholder="Digite seu nome aqui"]')[0].value;
    const segundo_nome = form.querySelectorAll('input[placeholder="Digite seu nome aqui"]')[1].value;
    const email = form.querySelector('input[type="email"]').value;
    const numero = form.querySelector('input[type="tel"]').value;
    const senha = form.querySelectorAll('input[type="password"]')[0].value;
    const imagem = window.selectedImage || null;

    const data = { 
      user, 
      tipo, 
      primeiro_nome, 
      segundo_nome, 
      email, 
      numero, 
      senha,
      imagem 
    };

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        // alert('Cadastro realizado com sucesso!');
        window.location.href = '../index.html';
      } else {
        // alert('Erro ao cadastrar usuário.');
      }
    } catch (err) {
      console.error('Erro:', err);
      // alert('Erro de conexão com o servidor.');
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const user = loginForm.querySelector('#user').value;
      const senha = loginForm.querySelector('#senha').value;
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, senha })
        });
        if (res.ok) {
          // alert('Login realizado com sucesso!');
          window.location.href = 'pages/main_screen.html';
        } else {
          // alert('Usuário ou senha inválidos!');
        }
      } catch (err) {
        // alert('Erro de conexão com o servidor.');
      }
    });
  }
});

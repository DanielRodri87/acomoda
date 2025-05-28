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

    const data = { user, tipo, primeiro_nome, segundo_nome, email, numero, senha };

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Cadastro realizado com sucesso!');
        window.location.href = '../index.html';
      } else {
        alert('Erro ao cadastrar usuário.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  });
}

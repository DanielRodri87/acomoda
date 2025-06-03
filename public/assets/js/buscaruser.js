/**
 * Script para gerenciar informações do usuário logado
 * - Verifica se o usuário está logado
 * - Carrega os dados do usuário na página
 * - Busca dados atualizados do servidor
 * - Implementa a funcionalidade de logout
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    const userData = localStorage.getItem('userData');
    if (!userData) {
        // Redirecionar para a página de login se não estiver logado
        window.location.href = '/';
        return;
    }

    // Parsear dados do usuário do localStorage
    const user = JSON.parse(userData);
    
    // Atualizar elementos da página com os dados do usuário
    updateUserInterface(user);
    
    // Opcional: atualizar dados do usuário do servidor
    fetchUserData(user.user);
    
    // Configurar evento de logout
    setupLogoutButton();
});

/**
 * Atualiza a interface com os dados do usuário
 */
function updateUserInterface(user) {
    // Elementos na página principal
    if (document.getElementById('user-first-name')) {
        document.getElementById('user-first-name').textContent = user.primeiro_nome || "Usuário";
    }
    if (document.getElementById('user-email')) {
        document.getElementById('user-email').textContent = user.email || "email@exemplo.com";
    }
    
    // Elemento do nome completo na página de perfil do locador
    if (document.getElementById('user-full-name')) {
        document.getElementById('user-full-name').textContent = 
            (user.primeiro_nome + " " + (user.segundo_nome || "")).trim() || "Nome do Usuário";
    }
    
    // Elementos no overlay de perfil
    if (document.getElementById('overlay-full-name')) {
        document.getElementById('overlay-full-name').textContent = 
            (user.primeiro_nome + " " + (user.segundo_nome || "")).trim();
    }
    if (document.getElementById('info-full-name')) {
        document.getElementById('info-full-name').textContent = 
            (user.primeiro_nome + " " + (user.segundo_nome || "")).trim();
    }
    if (document.getElementById('info-phone')) {
        document.getElementById('info-phone').textContent = user.numero || "Não informado";
    }
    if (document.getElementById('info-email')) {
        document.getElementById('info-email').textContent = user.email || "Não informado";
    }
    if (document.getElementById('info-cpf')) {
        document.getElementById('info-cpf').textContent = user.cpf || "Não informado";
    }
    
    // Atualizar imagem do perfil se disponível
    const profileImages = document.querySelectorAll('.profile-user-image');
    if (user.imagem && profileImages.length > 0) {
        profileImages.forEach(img => img.src = user.imagem);
    }
}

/**
 * Busca dados atualizados do usuário no servidor
 */
async function fetchUserData(userId) {
    try {
        const response = await fetch(`/users/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            
            // Atualizar localStorage com dados mais recentes
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Atualizar a interface com os novos dados
            updateUserInterface(userData);
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
}

/**
 * Configura o botão de logout
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Limpar dados do usuário do localStorage
            localStorage.removeItem('userData');
            // Redirecionar para a página de login
            window.location.href = '/';
        });
    }
}

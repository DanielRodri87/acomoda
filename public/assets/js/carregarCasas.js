document.addEventListener('DOMContentLoaded', () => {
    // Função para buscar casas da API
    async function buscarCasas() {
        try {
            console.log('Buscando casas da API...');
            const response = await fetch('/api/casas');
            if (!response.ok) {
                throw new Error('Falha ao carregar casas');
            }
            const data = await response.json();
            console.log('Casas recebidas:', data);
            
            // Verificar a estrutura da resposta
            if (data && Array.isArray(data.data)) {
                return data.data; // Se a API retorna { data: [...casas] }
            } else if (Array.isArray(data)) {
                return data; // Se a API retorna diretamente [...casas]
            } else {
                console.error('Formato de resposta inesperado:', data);
                return [];
            }
        } catch (error) {
            console.error('Erro ao buscar casas:', error);
            return [];
        }
    }

    // Função para criar um card de casa
    function criarCardCasa(casa) {
        // Criar elemento do card
        const card = document.createElement('div');
        card.className = 'accommodation-card';
        
        // Formatar valor para moeda brasileira
        const valorFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(casa.valor);

        // Extrair informações da descrição
        const infoQuartos = extrairInfoQuartos(casa.descricao);
        
        card.innerHTML = `
            <div class="image-info">
                <a href="home+.html?id=${casa.idCasa}">
                    <img src="${casa.fotoPrincipal}" alt="${casa.nome}">
                </a>
            </div>
            <div class="accommodation-info">
                <div class="accommodation-title">${casa.nome} <span class="rating">4.8 ★</span></div>
                <div class="accommodation-details">${infoQuartos}</div>
                <div class="price">${valorFormatado} <span style="font-size: 12px;">${casa.observacao || ''}</span></div>
            </div>
        `;
        
        return card;
    }
    
    // Função auxiliar para extrair detalhes de quartos da descrição
    function extrairInfoQuartos(descricao) {
        // Implementação simplificada - isso poderia ser melhorado
        // para extrair informações estruturadas da descrição
        if (descricao && descricao.length > 50) {
            return descricao.substring(0, 50) + '...';
        }
        return descricao || 'Informações não disponíveis';
    }

    // Função principal para carregar e exibir casas
    async function carregarExibirCasas() {
        const casas = await buscarCasas();
        console.log('Total de casas encontradas:', casas.length);
        
        // Verificar se os containers existem
        const republicasContainer = document.getElementById('republicas-container');
        const individuaisContainer = document.getElementById('individuais-container');
        
        if (!republicasContainer || !individuaisContainer) {
            console.error('Containers não encontrados no DOM');
            
            // Tentativa de encontrar qualquer container de acomodação
            const accommodationsContainers = document.querySelectorAll('.accommodations');
            if (accommodationsContainers.length > 0) {
                console.log('Encontrados containers alternativos:', accommodationsContainers.length);
                
                // Usar o primeiro container disponível
                const container = accommodationsContainers[0];
                
                // Limpar o conteúdo original
                container.innerHTML = '';
                
                // Exibir todas as casas no primeiro container
                if (casas.length > 0) {
                    casas.forEach(casa => {
                        const card = criarCardCasa(casa);
                        container.appendChild(card);
                    });
                } else {
                    container.innerHTML = '<p>Nenhuma acomodação disponível no momento.</p>';
                }
            }
            return;
        }
        
        // Se os containers existirem, continuar com a lógica original
        // Tentar remover mensagens de carregamento se existirem
        const loadingRepublicas = document.getElementById('loading-republicas');
        const loadingIndividuais = document.getElementById('loading-individuais');
        
        if (loadingRepublicas) loadingRepublicas.style.display = 'none';
        if (loadingIndividuais) loadingIndividuais.style.display = 'none';
        
        // Limpar os containers antes de adicionar novos cards
        republicasContainer.innerHTML = '';
        individuaisContainer.innerHTML = '';
        
        // Contadores para estatísticas
        let contRepublicas = 0;
        let contIndividuais = 0;
        
        casas.forEach(casa => {
            // Melhorar a lógica para separar os tipos de casa
            // Considere palavras-chave ou padrões comuns na descrição
            const isRepublica = casa.descricao && 
                (casa.descricao.toLowerCase().includes('compartilhada') || 
                 casa.descricao.toLowerCase().includes('república') ||
                 casa.descricao.toLowerCase().includes('republica') ||
                 casa.descricao.toLowerCase().includes('compartilhado') ||
                 casa.descricao.toLowerCase().includes('estudantes'));
            
            const container = isRepublica ? republicasContainer : individuaisContainer;
            const card = criarCardCasa(casa);
            container.appendChild(card);
            
            // Incrementar contadores
            isRepublica ? contRepublicas++ : contIndividuais++;
        });
        
        console.log(`Casas exibidas: ${contRepublicas} repúblicas, ${contIndividuais} individuais`);
        
        // Se não houver casas, mostrar mensagem
        if (contRepublicas === 0) {
            republicasContainer.innerHTML = '<p>Nenhuma república disponível no momento.</p>';
        }
        
        if (contIndividuais === 0) {
            individuaisContainer.innerHTML = '<p>Nenhuma acomodação individual disponível no momento.</p>';
        }
    }
    
    // Iniciar o carregamento das casas
    carregarExibirCasas();
});

document.addEventListener("DOMContentLoaded", () => {
    // Função para buscar casas da API
    async function buscarCasas() {
        try {
            console.log("Buscando casas da API...");
            const response = await fetch("/api/casas");
            if (!response.ok) {
                // Tenta ler a mensagem de erro do corpo da resposta, se houver
                let errorMsg = `Erro HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch (jsonError) {
                    // Ignora erro ao parsear JSON, mantém a mensagem original
                }
                throw new Error(errorMsg);
            }
            const result = await response.json();
            console.log("Casas recebidas:", result);

            // Verificar a estrutura da resposta (considerando que pode ser { success: true, data: [...] })
            if (result && result.success && Array.isArray(result.data)) {
                return result.data; // Retorna o array de casas
            } else if (Array.isArray(result)) {
                 // Caso a API retorne diretamente o array (menos comum com NestJS)
                 console.warn("API retornou um array diretamente. Verifique se este é o comportamento esperado.");
                 return result;
            } else {
                console.error("Formato de resposta inesperado ou falha na API:", result);
                 // Lança um erro se a estrutura não for a esperada ou success for false
                 throw new Error(result.message || "Formato de resposta inesperado da API.");
            }
        } catch (error) {
            console.error("Erro ao buscar casas:", error);
            // Propaga o erro para ser tratado na função que chama
            throw error; 
        }
    }

    // Função para criar um card de casa (mantida como no seu original)
    function criarCardCasa(casa) {
        const card = document.createElement("div");
        card.className = "accommodation-card";

        const valorFormatado = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(casa.valor);

        // Função auxiliar para extrair detalhes (mantida como no seu original)
        function extrairInfoQuartos(descricao) {
            if (descricao && descricao.length > 50) {
                return descricao.substring(0, 50) + "...";
            }
            return descricao || "Informações não disponíveis";
        }
        const infoQuartos = extrairInfoQuartos(casa.descricao);

        card.innerHTML = `
            <div class="image-info">
                <a href="home+.html?id=${casa.idCasa}">
                    <img src="${casa.fotoPrincipal || '../assets/images/placeholder-casa.png'}" alt="${casa.nome}">
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

    // Função principal para carregar e exibir casas
    async function carregarExibirCasas() {
        const republicasContainer = document.getElementById("republicas-container");
        const individuaisContainer = document.getElementById("individuais-container");
        const loadingRepublicas = document.getElementById("loading-republicas");
        const loadingIndividuais = document.getElementById("loading-individuais");

        // Garante que os containers existam antes de prosseguir
        if (!republicasContainer || !individuaisContainer) {
            console.error("Erro crítico: Containers 'republicas-container' ou 'individuais-container' não encontrados no DOM.");
            // Poderia exibir uma mensagem de erro geral na página aqui
            return;
        }

        // Limpa containers e exibe loading inicial
        republicasContainer.innerHTML = '';
        individuaisContainer.innerHTML = '';
        if (loadingRepublicas) loadingRepublicas.style.display = 'block';
        if (loadingIndividuais) loadingIndividuais.style.display = 'block';

        try {
            const casas = await buscarCasas();
            console.log("Total de casas encontradas:", casas.length);

            // Remove os indicadores de carregamento após buscar os dados
            if (loadingRepublicas) loadingRepublicas.style.display = 'none';
            if (loadingIndividuais) loadingIndividuais.style.display = 'none';

            let contRepublicas = 0;
            let contIndividuais = 0;

            casas.forEach(casa => {
                const card = criarCardCasa(casa);
                
                // *** LÓGICA DE SEPARAÇÃO ATUALIZADA PARA USAR O CAMPO 'tipo' ***
                if (casa.tipo === "República Universitária") {
                    republicasContainer.appendChild(card);
                    contRepublicas++;
                } else if (casa.tipo === "Solitário") {
                    individuaisContainer.appendChild(card);
                    contIndividuais++;
                } else {
                    // Opcional: Logar casas com tipo inesperado ou não definido
                    console.warn(`Casa ID ${casa.idCasa} com tipo inesperado ou não definido:`, casa.tipo);
                    // Poderia adicionar a um container 'outros' se existisse
                }
            });

            console.log(`Casas exibidas: ${contRepublicas} repúblicas, ${contIndividuais} individuais`);

            // Exibe mensagem se nenhuma casa for encontrada em uma seção
            if (contRepublicas === 0) {
                republicasContainer.innerHTML = '<p class="no-results">Nenhuma república universitária encontrada.</p>';
            }
            if (contIndividuais === 0) {
                individuaisContainer.innerHTML = '<p class="no-results">Nenhuma acomodação para solitários encontrada.</p>';
            }

        } catch (error) {
            console.error("Erro final ao carregar e exibir casas:", error);
            // Remove loading e exibe mensagem de erro nos containers
            if (loadingRepublicas) loadingRepublicas.style.display = 'none';
            if (loadingIndividuais) loadingIndividuais.style.display = 'none';
            
            const errorMessage = `<p class="error-message">Erro ao carregar acomodações: ${error.message}. Tente recarregar a página.</p>`;
            republicasContainer.innerHTML = errorMessage;
            individuaisContainer.innerHTML = errorMessage;
        }
    }

    // Iniciar o carregamento das casas
    carregarExibirCasas();
});


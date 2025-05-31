document.addEventListener("DOMContentLoaded", () => {
    // Função para buscar casas da API
    async function buscarCasas() {
        try {
            console.log("Buscando casas da API...");
            const response = await fetch("/api/casas");
            if (!response.ok) {
                let errorMsg = `Erro HTTP ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg = errorData.message;
                    }
                } catch (jsonError) { /* Ignora erro */ }
                throw new Error(errorMsg);
            }
            const result = await response.json();
            console.log("Casas recebidas:", result);

            if (result && result.success && Array.isArray(result.data)) {
                return result.data;
            } else if (Array.isArray(result)) {
                 console.warn("API retornou um array diretamente.");
                 return result;
            } else {
                 throw new Error(result.message || "Formato de resposta inesperado da API.");
            }
        } catch (error) {
            console.error("Erro ao buscar casas:", error);
            throw error;
        }
    }

    // Função para criar um card de casa
    function criarCardCasa(casa) {
        const card = document.createElement("div");
        card.className = "accommodation-card";

        const valorFormatado = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(casa.valor);

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

        if (!republicasContainer || !individuaisContainer) {
            console.error("Erro crítico: Containers não encontrados no DOM.");
            return;
        }

        republicasContainer.innerHTML = '';
        individuaisContainer.innerHTML = '';
        if (loadingRepublicas) loadingRepublicas.style.display = 'block';
        if (loadingIndividuais) loadingIndividuais.style.display = 'block';

        try {
            const todasAsCasas = await buscarCasas();
            console.log("Total de casas encontradas antes do filtro:", todasAsCasas.length);

            // *** FILTRO ADICIONADO AQUI para remover casas com status 'Ocupada' ***
            const casasDisponiveis = todasAsCasas.filter(casa => casa.status !== 'Ocupada');
            console.log("Total de casas disponíveis (não ocupadas):", casasDisponiveis.length);

            if (loadingRepublicas) loadingRepublicas.style.display = 'none';
            if (loadingIndividuais) loadingIndividuais.style.display = 'none';

            let contRepublicas = 0;
            let contIndividuais = 0;

            // Itera sobre as casas DISPONÍVEIS
            casasDisponiveis.forEach(casa => {
                const card = criarCardCasa(casa);
                
                if (casa.tipo === "República Universitária") {
                    republicasContainer.appendChild(card);
                    contRepublicas++;
                } else if (casa.tipo === "Solitário") {
                    individuaisContainer.appendChild(card);
                    contIndividuais++;
                } else {
                    console.warn(`Casa ID ${casa.idCasa} (Disponível) com tipo inesperado:`, casa.tipo);
                }
            });

            console.log(`Casas disponíveis exibidas: ${contRepublicas} repúblicas, ${contIndividuais} individuais`);

            if (contRepublicas === 0) {
                republicasContainer.innerHTML = '<p class="no-results">Nenhuma república universitária disponível encontrada.</p>';
            }
            if (contIndividuais === 0) {
                individuaisContainer.innerHTML = '<p class="no-results">Nenhuma acomodação para solitários disponível encontrada.</p>';
            }

        } catch (error) {
            console.error("Erro final ao carregar e exibir casas:", error);
            if (loadingRepublicas) loadingRepublicas.style.display = 'none';
            if (loadingIndividuais) loadingIndividuais.style.display = 'none';
            
            const errorMessage = `<p class="error-message">Erro ao carregar acomodações: ${error.message}. Tente recarregar a página.</p>`;
            republicasContainer.innerHTML = errorMessage;
            individuaisContainer.innerHTML = errorMessage;
        }
    }

    carregarExibirCasas();
});


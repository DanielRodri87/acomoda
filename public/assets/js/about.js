const developers = [
    {
        name: "Luis Gustavo Luz De Deus Ramos",
        photo: "../assets/images/about/foto_luis.png",
        bio: "Nascido em 24 de maio de 2004, em Picos, Piauí, é estudante de Sistemas de Informação na Universidade Federal do Piauí (UFPI) e atua como desenvolvedor front-end na Acomoda. Com dedicação e foco, contribui para a criação de interfaces intuitivas e funcionais, sempre buscando soluções inovadoras para melhorar a experiência dos usuários.",
        linkedin: "https://www.linkedin.com/in/luis-gustavo-luz-de-deus-ramos-7b1b9b369/"
    },
    {
        name: "Daniel Rodrigues de Sousa",
        photo: "../assets/images/about/foto_daniel.png",
        bio: "Natural de Acauã, Piauí, Daniel Rodrigues de Sousa nasceu em 26 de maio de 2005. Atualmente, é estudante de Sistemas de Informação na Universidade Federal do Piauí (UFPI) e trabalha como desenvolvedor full-stack na Acomoda. Com uma paixão por tecnologia especialmente, pelo desenvolvimento, ele se dedica a criar experiências digitais que sejam tanto funcionais quanto agradáveis aos usuários.",
        linkedin: "https://www.linkedin.com/in/danielrodrigues87/"
    },
    {
        name: "Iago Roberto Esmério Almeida",
        photo: "../assets/images/about/foto_iago.png",
        bio: "Natural de Jaicós, Piauí, Iago Roberto Esmério Almeida nasceu em 30 de Novembro de 2003. Atualmente, é estudante de Sistemas de Informação na Universidade Federal do Piauí (UFPI) e trabalha como desenvolvedor full-stack na Acomoda. Além dos seus trabalhos na Acomoda, atua com pesquisador científico em Sistemas Distribuídos e outras atuações onde pode aplicar sua admiração pela tecnologia.",
        linkedin: "https://www.linkedin.com/in/iago-roberto-734667328/"
    },
    {
        name: "Francinaldo de Sousa Barbosa",
        photo: "../assets/images/about/foto_francinaldo.png",
        bio: "Nascido em 16 de outubro de 2005, em Paulistana, Piauí, Francinaldo é estudante de Sistemas de Informação na Universidade Federal do Piauí (UFPI) e atua como desenvolvedor full-stack na Acomoda. Com um olhar atento aos detalhes e uma paixão por design, ele se dedica a criar interfaces que não apenas funcionam bem, mas também encantam os usuários.",
        linkedin: "https://www.linkedin.com/in/francinaldosb/"
    },
];

let currentDevIndex = 0;

function updateDeveloperCard(index) {
    const devPhoto = document.getElementById('dev-photo');
    const devName = document.getElementById('dev-name');
    const devBio = document.getElementById('dev-bio');

    devPhoto.src = developers[index].photo;
    devName.textContent = developers[index].name;
    devBio.textContent = developers[index].bio;
}

document.getElementById('saibamais').addEventListener('click', () => {
    window.open(developers[currentDevIndex].linkedin, '_blank');
});

document.getElementById('prev-btn').addEventListener('click', (e) => {
    e.preventDefault();
    currentDevIndex = (currentDevIndex - 1 + developers.length) % developers.length;
    updateDeveloperCard(currentDevIndex);
});

document.getElementById('next-btn').addEventListener('click', (e) => {
    e.preventDefault();
    currentDevIndex = (currentDevIndex + 1) % developers.length;
    updateDeveloperCard(currentDevIndex);
});

// Inicializar com o primeiro desenvolvedor
updateDeveloperCard(currentDevIndex);

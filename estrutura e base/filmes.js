const movies = [
    { 
        title: "Capitão América: Admirável Mundo Novo", 
        image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSIUfdySawxK4dbASkVb4zNpqEToBFEpHN-fgJciLL1-mnRZwEQ", 
        description: "Conta a história de Sam Wilson, o novo Capitão América, que se envolve em um incidente internacional.",
        link: "https://www.youtube.com/watch?v=-YhegkTNdk4" 
    },
    { 
        title: "O Macaco", 
        image: "https://br.web.img2.acsta.net/img/d2/e5/d2e517612de9e1db2463aeec34dc6d29.jpg", 
        description: "Os gêmeos Bill e Hal descobrem um antigo macaco de brinquedo e uma série de mortes começa a acontecer.",
        link: "https://www.youtube.com/watch?v=ZWdhgGTAelE" 
    },
    { 
        title: "Ainda Estou Aqui", 
        image: "https://gvshopping.com.br/wp-content/webp-express/webp-images/uploads/2024/11/9de5c6b8-7295-4e18-8c03-f07b69814fa8.jpg.webp", 
        description: "O desaparecimento do ex-deputado Rubens Paiva durante a ditadura militar brasileira.",
        link: "https://www.youtube.com/watch?v=gDunV808Yf4" 
    },
    { 
        title: "Flow", 
        image: "https://maceioshopping.com/app/uploads/2025/02/flow-poster.jpg", 
        description: "A jornada de um gatinho preto e seus amigos enfrentando a elevação do nível do mar.",
        link: "https://www.youtube.com/watch?v=Gl7uxk60m0o" 
    },
    { 
        title: "Mufasa: O Rei Leão", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvPMCE0yPnTrwhtED3r-CukIQMKOJ1y2dAEQ&s", 
        description: "A história de Mufasa, o pai de Simba, anos antes dos eventos do filme original.",
        link: "https://www.youtube.com/watch?v=Fg7tIazk3tk" 
    },
    { 
        title: "Uma Advogada Brilhante", 
        image: "https://ingresso-a.akamaihd.net/prd/img/movie/uma-advogada-brilhante/e94e6aca-ebf3-48af-819d-4e4ebc2600c4.webp ", 
        description: "Michelle é um advogado que precisa lidar com a constante confusão de seu nome.",
        link: "https://www.youtube.com/watch?v=QEjm-p-IDCg" 
    },
    { 
        title: "Mickey 17", 
        image: "https://br.web.img2.acsta.net/c_310_420/img/d4/c0/d4c0542e0a90a9bb353e3d96711b74e0.jpg", 
        description: "Um colaborador é enviado a uma expedição humana para colonizar um mundo gelado.",
        link: "https://www.youtube.com/watch?v=GQUAxORWmqc" 
    },
    { 
        title: "Minecraft", 
        image: "https://br.web.img3.acsta.net/img/ec/9e/ec9ec53e8a23b4f934bcb0ae2b4ee0b1.jpg", 
        description: "O Ender Dragon inicia um caminho de destruição e um grupo parte para salvar o Overworld.",
        link: "https://www.youtube.com/watch?v=Z5bfhDMi-_I" 
    }
];
function displayMovies(filteredMovies = movies) {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = ""; 

    filteredMovies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p class="movie-desc">${movie.description}</p>
            <button class="trailer-button" onclick="window.open('${movie.link}', '_blank')">Ver Trailer</button>`;
        movieList.appendChild(movieDiv);
    });
}
function searchMovies() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(query) || 
        movie.description.toLowerCase().includes(query)
    );
    displayMovies(filteredMovies);
}
document.addEventListener("DOMContentLoaded", () => displayMovies());
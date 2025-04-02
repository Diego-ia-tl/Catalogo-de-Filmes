const movies = [
    { title: "Capitão América: Admirável Mundo Novo", image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSIUfdySawxK4dbASkVb4zNpqEToBFEpHN-fgJciLL1-mnRZwEQ", description: "Conta a história de Sam Wilson, o novo Capitão América, que se envolve em um incidente internacional." },
    { title: "O Macaco", image: "https://br.web.img2.acsta.net/img/d2/e5/d2e517612de9e1db2463aeec34dc6d29.jpg", description: "Os gêmeos Bill e Hal (Theo James), que descobrem um antigo macaco de brinquedo no sótão de seu pai. A partir desse momento, uma série de mortes terríveis começa a acontecer." },
    { title: "Ainda Estou Aqui", image: "https://gvshopping.com.br/wp-content/webp-express/webp-images/uploads/2024/11/9de5c6b8-7295-4e18-8c03-f07b69814fa8.jpg.webp", description: "O filme Ainda Estou Aqui fala sobre o desaparecimento do ex-deputado Rubens Paiva durante a ditadura militar brasileira." },
    { title: "Flow", image: "https://maceioshopping.com/app/uploads/2025/02/flow-poster.jpg", description: "O filme narra a jornada de um gatinho preto e seus amigos animais enfrentando a elevação do nível do mar em um cenário surreal." },
    { title: "Mufasa: O Rei Leão", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvPMCE0yPnTrwhtED3r-CukIQMKOJ1y2dAEQ&s", description: " O Rei Leão conta a história de Mufasa, o pai de Simba, anos antes dos acontecimentos do filme original. O filme mostra que ninguém nasce 100% bom ou 100% mau, e que as escolhas que fazemos moldam o nosso destino. " },
    { title: "Uma Advogada Brilhante", image: "https://jardimdasamericas.com.br/uploads/2025/03/capa-filme-uma-advogada-brilhante-f4a0c-large.jpg", description: " Michelle é um advogado em plena ascendência que precisa lidar com a inconveniente e constante confusão de seu nome, de origem italiana, com um nome feminino. " },
    { title: "Mickey 17", image: "https://br.web.img2.acsta.net/c_310_420/img/d4/c0/d4c0542e0a90a9bb353e3d96711b74e0.jpg", description: "Um colaborador é enviado em uma expedição humana para colonizar o mundo gelado de Niflheim. Após uma iteração morrer, um novo corpo é regenerado com a maioria de suas memórias intactas." },
    { title: "Minecraft", image: "https://br.web.img3.acsta.net/img/ec/9e/ec9ec53e8a23b4f934bcb0ae2b4ee0b1.jpg", description: "O malévolo Ender Dragon inicia um caminho de destruição, levando uma jovem e seu grupo de aventureiros improváveis a partir para salvar o Overworld." }
];

function displayMovies() {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = ""; 

    movies.forEach(movie => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");
        movieDiv.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>${movie.description}</p>
        `;
        movieList.appendChild(movieDiv);
    });
}

document.addEventListener("DOMContentLoaded", displayMovies);
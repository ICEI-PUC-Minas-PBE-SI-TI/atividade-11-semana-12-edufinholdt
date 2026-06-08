const API_KEY = "2e0fc9adf0f0c6130d2ec6aef943d0ae";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const message = document.getElementById("message");

async function fetchMovies(query = "") {
    try {
        showMessage("Carregando filmes...");

        let url;

        if (query.trim() === "") {
            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
        } else {
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao buscar os filmes.");
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        showMessage("Erro ao carregar os filmes. Verifique sua chave da API.");
        console.error(error);
        return [];
    }
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const poster = document.createElement("img");

    if (movie.poster_path) {
        poster.src = `${IMG_URL}${movie.poster_path}`;
    } else {
        poster.src = "https://via.placeholder.com/500x750?text=Sem+Imagem";
    }

    poster.alt = movie.title;

    const info = document.createElement("div");
    info.classList.add("movie-info");

    const title = document.createElement("h2");
    title.textContent = movie.title;

    const year = document.createElement("p");
    year.textContent = `Ano: ${movie.release_date ? movie.release_date.substring(0, 4) : "Não informado"}`;

    const note = document.createElement("p");
    note.classList.add("note");
    note.textContent = `Nota: ${movie.vote_average.toFixed(1)}`;

    const overview = document.createElement("p");

    if (movie.overview) {
        overview.textContent = movie.overview.length > 120
            ? movie.overview.substring(0, 120) + "..."
            : movie.overview;
    } else {
        overview.textContent = "Sinopse não disponível.";
    }

    info.appendChild(title);
    info.appendChild(year);
    info.appendChild(note);
    info.appendChild(overview);

    card.appendChild(poster);
    card.appendChild(info);

    return card;
}

function renderMovies(movies) {
    movieList.innerHTML = "";

    if (movies.length === 0) {
        showMessage("Nenhum filme encontrado.");
        return;
    }

    showMessage("");

    movies.forEach(movie => {
        const card = createMovieCard(movie);
        movieList.appendChild(card);
    });
}

function showMessage(text) {
    message.textContent = text;
}

async function searchMovies() {
    const query = searchInput.value;
    const movies = await fetchMovies(query);
    renderMovies(movies);
}

async function init() {
    const movies = await fetchMovies();
    renderMovies(movies);
}

btnSearch.addEventListener("click", searchMovies);

searchInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchMovies();
    }
});

init();


  
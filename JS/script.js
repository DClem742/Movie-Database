// API configuration
const API_KEY = '6ba10e55';
const BASE_URL = 'https://www.omdbapi.com/';
const API_URL = `${BASE_URL}?apikey=${API_KEY}&s=movie&type=movie`;
const SEARCH_URL = `${BASE_URL}?apikey=${API_KEY}&type=movie&s=`;

// DOM elements
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

function showWelcomeMessage() {
    document.body.classList.add('welcome-page');
    main.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to the Movie Database</h2>
            <p>Enter a movie title in the search bar above to get started!</p>
        </div>
    `;
}
showWelcomeMessage();

function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if(data.Response === "True") {
                showMovies(data.Search);
            } else {
                main.innerHTML = `<h1>${data.Error}</h1>`;
            }
        });
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach(movie => {
        const {Title, Poster, Year, imdbID} = movie;
        
        // Fetch additional details for each movie
        fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=short`)
            .then(res => res.json())
            .then(movieDetails => {
                const {Plot, imdbRating} = movieDetails;
                const movieEl = document.createElement('div');
                movieEl.classList.add('movie');

                movieEl.innerHTML = `
                    <img src="${Poster}" alt="${Title}">
                    <div class="movie-info">
                        <h3>${Title} (${Year})</h3>
                        <p>Rating: ${imdbRating}</p>
                    </div>
                    <div class="overview">
                        <h4>Plot:</h4>
                        <p>${Plot}</p>
                    </div>
                `;
                main.appendChild(movieEl);
            });
    });
}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if(searchTerm) {
        getMovies(SEARCH_URL + searchTerm);
    }
});
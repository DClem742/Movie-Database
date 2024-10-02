// API configuration
const API_KEY = '6ba10e55'; //my OMDB API key
const BASE_URL = 'https://www.omdbapi.com/'; // base url for OMDB API
const API_URL = `${BASE_URL}?apikey=${API_KEY}&s=movie&type=movie`; //url for initial movie search
const SEARCH_URL = `${BASE_URL}?apikey=${API_KEY}&type=movie&s=`; //url for user-initiated movie search

// DOM elements
const main = document.getElementById('main'); //main container for movie results
const form = document.getElementById('form'); //search form
const search = document.getElementById('search'); //search input field

// Function to display welcome message
function showWelcomeMessage() {
    document.body.classList.add('welcome-page'); // add welcome-page class to body element
    main.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome to the Movie Database</h2>
            <p>Enter a movie title in the search bar above to get started!</p>
        </div>
    `;
    // set welcome message HTML
}
showWelcomeMessage(); // Call the function to show welcome message on page load

// Function to fetch and display movies
function getMovies(url) {
    fetch(url) //Fetch data from the provided URL
        .then(res => res.json()) //Parse the response as JSON
        .then(data => {
            if(data.Response === "True") { // Check if the API response is successful
                showMovies(data.Search); // Display the movies if found
            } else {
                main.innerHTML = `<h1>${data.Error}</h1>`; //display error message if no movies found
            }
        });
}
// Function to display movies on the page
function showMovies(movies) {
    main.innerHTML = ''; //clear the main container

    movies.forEach(movie => {
        const {Title, Poster, Year, imdbID} = movie; //sections for each movie object
        
        // Fetch additional details for each movie
        fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=short`)
            .then(res => res.json())
            .then(movieDetails => {
                const {Plot, imdbRating} = movieDetails; //section for movie details
                const movieEl = document.createElement('div'); //create a new div for the movie
                movieEl.classList.add('movie'); // add 'movie' class to the div

                //set the HTML content for the movie element
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
                main.appendChild(movieEl); //Add the movie element to the main container
            });
    });
}

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault(); //prevent default form submission 
    const searchTerm = search.value; //get the search term from the input field
    if(searchTerm) { ///if the search term is not empty
        getMovies(SEARCH_URL + searchTerm); //Fetch for movies with the search term
        search.value = ''; // Clear the search input after submission
    }
});
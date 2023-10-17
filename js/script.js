const app = {
  currentPage: window.location.pathname,
};

const api = {
  url: 'https://api.themoviedb.org/3',
  token:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjFjZTQyN2Y0MjZkNGY2ZDdlZDY1M2M1ODc5NDI2NCIsInN1YiI6IjY1MjBhNGRjYzUwYWQyMDEyYzFjOTVlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B_rwN6U7ofnmC2y2VeZqJzeo_LJN60H-1xNElbd8Czk',
  paths: {
    popularMovies: '/movie/popular',
  },
};

function highlightCurrentMenu() {
  document.querySelectorAll('.nav-link').forEach((menu) => {
    if (menu.getAttribute('href') === app.currentPage) {
      menu.classList.add('active');
    }
  });
}

// ROUTER
function init() {
  switch (app.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');
      getPopularMovies();
      break;

    case 'movie-details.html':
      console.log('Movie Details');
      break;

    case 'search.html':
      console.log('Search');
      break;

    case 'shows.html':
      console.log('Shows');
      break;

    case 'tv-details.html':
      console.log('TV Details');
      break;
  }

  highlightCurrentMenu();
}

// GET CABEÇALHO
function getHeader() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${api.token}`,
  };
}

// GET GENERICO
async function get(endpoint) {
  const resp = await fetch(api.url + endpoint, {
    method: 'GET',
    headers: getHeader(),
  });

  console.log(resp.json);
  return resp.json();
}

// GET POPULAR MOVIES
async function getPopularMovies() {
  const data = await get(api.paths.popularMovies);
  const movies = data.results;
  console.log(movies);
  const popularMoviesContainer = document.querySelector('#popular-movies');
  popularMoviesContainer.innerHTML = '';

  movies.forEach((movie) => setPopularMovie(movie, popularMoviesContainer));
}

function setPopularMovie(movie, popularMoviesContainer) {
  const card = createElement('div', ['card']);
  const link = createElement(
    'a',
    [],
    [
      {
        name: 'href',
        value: `./movie-details.html?id=${movie.id}`,
      },
    ]
  );
  const image = createElement(
    'img',
    ['card-img-top'],
    [
      {
        name: 'src',
        value: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : './images/no-image.jpg',
      },
      {
        name: 'alt',
        value: 'Movie Title',
      },
    ]
  );

  const cardBody = createElement('div', ['card-body']);
  const cardTitle = createElement('h5', ['card-title']);
  cardTitle.innerText = movie.title;

  const cardText = createElement('p', ['card-text']);
  const textMuted = createElement('small', ['text-muted']);
  textMuted.innerText = `Release: ${movie.release_date}`;

  card.appendChild(link);
  link.appendChild(image);
  card.appendChild(cardBody);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);
  cardText.appendChild(textMuted);
  popularMoviesContainer.appendChild(card);
}

function createElement(tag, classes, attributes) {
  const element = document.createElement(tag);

  if (classes !== undefined) {
    classes.forEach((c) => element.classList.add(c));
  }

  if (attributes !== undefined) {
    attributes.forEach((a) => element.setAttribute(a.name, a.value));
  }

  return element;
}

document.addEventListener('DOMContentLoaded', init);

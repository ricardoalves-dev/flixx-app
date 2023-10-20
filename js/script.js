const app = {
  currentPage: window.location.pathname,
};

const api = {
  url: 'https://api.themoviedb.org/3',
  token:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjFjZTQyN2Y0MjZkNGY2ZDdlZDY1M2M1ODc5NDI2NCIsInN1YiI6IjY1MjBhNGRjYzUwYWQyMDEyYzFjOTVlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B_rwN6U7ofnmC2y2VeZqJzeo_LJN60H-1xNElbd8Czk',
  paths: {
    popularMovies: '/movie/popular',
    popularTvShows: '/tv/popular',
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
  console.log(app.currentPage);
  switch (app.currentPage) {
    case '/':
    case '/index.html':
      console.log('Home');

      getPopular(api.paths.popularMovies);
      break;

    case 'movie-details.html':
      console.log('Movie Details');
      break;

    case 'search.html':
      console.log('Search');
      break;

    case '/shows.html':
      console.log('Shows');
      getPopular(api.paths.popularTvShows);
      break;

    case 'tv-details.html':
      console.log('TV Details');
      break;
  }

  highlightCurrentMenu();
}

function toggleSpinner() {
  const spinner = document.querySelector('.spinner');
  spinner.classList.toggle('show');
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
  toggleSpinner();
  try {
    const resp = await fetch(api.url + endpoint, {
      method: 'GET',
      headers: getHeader(),
    });

    console.log(resp.json);
    return resp.json();
  } finally {
    toggleSpinner();
  }
}

// CARDS
async function getCards(url) {
  const response = await get(url);
  const data = response.results;
  console.log(data);
  const cardArray = [];
  data.forEach((dataElement) => cardArray.push(getCard(dataElement)));

  return cardArray;
}

function getCard(dataElement) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.appendChild(getCardLink(dataElement));
  card.appendChild(getCardBody(dataElement));

  return card;
}

function getCardLink(dataElement) {
  const link = document.createElement('a');
  link.setAttribute('href', `./movie-details.html?id=${dataElement.id}`);
  link.appendChild(getCardImage(dataElement));

  return link;
}

function getCardImage(dataElement) {
  const image = document.createElement('img');
  image.classList.add('card-img-top');
  image.setAttribute(
    'src',
    dataElement.poster_path
      ? `https://image.tmdb.org/t/p/w500${dataElement.poster_path}`
      : './images/no-image.jpg'
  );

  return image;
}

function getCardBody(dataElement) {
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.appendChild(getCardTitle(dataElement));
  cardBody.appendChild(getCardText(dataElement));

  return cardBody;
}

function getCardTitle(dataElement) {
  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.innerText = dataElement.title
    ? dataElement.title
    : dataElement.name;

  return cardTitle;
}

function getCardText(dataElement) {
  const cardText = document.createElement('p');
  cardText.classList.add('card-text');

  const text = document.createElement('small');
  text.classList.add('text-muted');
  text.innerText = dataElement.release_date
    ? `Release: ${dataElement.release_date}`
    : `Aired: ${dataElement.first_air_date}`;

  cardText.appendChild(text);

  return cardText;
}

async function getPopular(endPoint) {
  console.log(endPoint);
  const popularContentContainer =
    endPoint === api.paths.popularMovies
      ? document.querySelector('#popular-movies')
      : document.querySelector('#popular-shows');
  popularContentContainer.innerHTML = '';

  const popularCards = await getCards(endPoint);
  popularCards.forEach((card) => popularContentContainer.appendChild(card));
}

document.addEventListener('DOMContentLoaded', init);

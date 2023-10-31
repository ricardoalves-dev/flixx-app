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
    movieDetails: '/movie/{id}',
    tvDetails: '/tv/{id}',
    nowPlaying: '/movie/now_playing',
    search: '/search/{type}',
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
      getPopular(api.paths.popularMovies);
      showSlider();
      break;

    case '/movie-details.html':
      getMovieDetails(api.paths.movieDetails);
      break;

    case '/search.html':
      search();
      break;

    case '/shows.html':
      getPopular(api.paths.popularTvShows);
      break;

    case '/tv-details.html':
      getTvShowsDetails(api.paths.tvDetails);
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

    return resp.json();
  } finally {
    toggleSpinner();
  }
}

// CARDS
async function getCards(endPoint) {
  const response = await get(endPoint);
  const data = response.results;
  const cardArray = [];
  data.forEach((dataElement) => cardArray.push(getCard(dataElement)));

  console.log(cardArray);

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
  link.setAttribute(
    'href',
    window.location.pathname === '/shows.html'
      ? `./tv-details.html?id=${dataElement.id}`
      : `./movie-details.html?id=${dataElement.id}`
  );
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
  const popularContentContainer =
    endPoint === api.paths.popularMovies
      ? document.querySelector('#popular-movies')
      : document.querySelector('#popular-shows');
  popularContentContainer.innerHTML = '';

  const popularCards = await getCards(endPoint);
  popularCards.forEach((card) => popularContentContainer.appendChild(card));
}

function getId() {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('id');
}

async function getMovieDetails(endPoint) {
  const movieDetails = document.querySelector('#movie-details');
  const data = await get(endPoint.replace('{id}', getId()));
  movieDetails.innerHTML = '';
  movieDetails.appendChild(getDetailsTop(data));
  movieDetails.appendChild(getMoviesDetailsBottom(data));
}

async function getTvShowsDetails(endPoint) {
  const tvShowDetails = document.querySelector('#show-details');
  const data = await get(endPoint.replace('{id}', getId()));
  tvShowDetails.innerHTML = '';
  tvShowDetails.appendChild(getDetailsTop(data));
  tvShowDetails.appendChild(getTvShowDetailsBottom(data));
}

function getDetailsTop(data) {
  const detailsTop = document.createElement('div');
  detailsTop.classList.add('details-top');

  detailsTop.appendChild(getDetailsImage(data));
  const div = document.createElement('div');
  div.appendChild(getDetailsTitle(data));
  div.appendChild(getDetailsRating(data));
  div.appendChild(getDetailsReleaseDate(data));
  div.appendChild(getDetailsOverview(data));

  const genresTitle = document.createElement('h5');
  genresTitle.innerText = 'Genres';
  div.appendChild(genresTitle);

  div.appendChild(getDetailsGenres(data));
  div.appendChild(getDetailsHomePage(data));

  detailsTop.appendChild(div);

  return detailsTop;
}

function getDetailsImage(data) {
  const div = document.createElement('div');
  const image = document.createElement('img');
  image.classList.add('card-img-top');
  image.setAttribute('alt', 'Title');
  image.setAttribute(
    'src',
    data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : './images/no-image.jpg'
  );

  div.appendChild(image);
  return div;
}

function getDetailsTitle(data) {
  const title = document.createElement('h2');
  title.innerText = data.original_title ? data.original_title : data.name;

  return title;
}

function getDetailsRating(data) {
  const rating = document.createElement('p');
  const ratingStar = document.createElement('i');
  ratingStar.classList = 'fas fa-star text-primary';
  rating.innerText = data.vote_average.toFixed(1);
  rating.appendChild(ratingStar);

  return rating;
}

function getDetailsReleaseDate(data) {
  const releaseDate = document.createElement('p');
  releaseDate.classList.add('text-muted');
  releaseDate.innerText = data.release_date
    ? `Release: ${data.release_date}`
    : `Aired: ${data.first_air_date}`;

  return releaseDate;
}

function getDetailsOverview(data) {
  const overview = document.createElement('p');
  overview.innerText = data.overview;

  return overview;
}

function getDetailsGenres(data) {
  const genresList = document.createElement('ul');
  genresList.classList.add('list-group');
  data.genres.forEach((g) => {
    const genre = document.createElement('li');
    genre.innerText = g.name;
    genresList.appendChild(genre);
  });

  return genresList;
}

function getDetailsHomePage(data) {
  const link = document.createElement('a');
  link.classList.add('btn');
  link.setAttribute('target', '_blank');
  link.setAttribute('href', data.homepage);
  link.innerText = 'Visit Homepage';

  return link;
}

function getMoviesDetailsBottom(data) {
  const detailsBottom = document.createElement('div');
  detailsBottom.classList.add('details-bottom');

  const movieInfo = document.createElement('h2');
  movieInfo.innerText = 'Movie Info';

  detailsBottom.appendChild(movieInfo);
  detailsBottom.appendChild(getMovieInfo(data));

  const companies = document.createElement('h4');
  companies.innerText = 'Production Companies';
  detailsBottom.appendChild(companies);
  detailsBottom.appendChild(getProductionCompanies(data.production_companies));

  return detailsBottom;
}

function getMovieInfo(data) {
  const movieInfoList = document.createElement('ul');
  movieInfoList.appendChild(
    getInfo(
      'Budget: ',
      `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(data.budget)}`
    )
  );
  movieInfoList.appendChild(
    getInfo(
      'Revenue: ',
      `${new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(data.revenue)}`
    )
  );
  movieInfoList.appendChild(getInfo('Runtime: ', `${data.runtime} minutes`));
  movieInfoList.appendChild(getInfo('Status: ', data.status));

  return movieInfoList;
}

function getInfo(name, value) {
  const info = document.createElement('li');
  const span = document.createElement('span');
  span.classList.add('text-secondary');
  span.innerText = name;
  info.appendChild(span);
  info.appendChild(document.createTextNode(value));

  return info;
}

function getProductionCompanies(data) {
  const companies = document.createElement('div');
  companies.classList.add('list-group');
  for (let index = 0; index < data.length; index++) {
    companies.innerText =
      index === 0
        ? data[index].name
        : companies.innerText + ', ' + data[index].name;
  }

  return companies;
}

function getTvShowDetailsBottom(data) {
  const detailsBottom = document.createElement('div');
  detailsBottom.classList.add('details-bottom');

  const showInfo = document.createElement('h2');
  showInfo.innerText = 'Show Info';

  detailsBottom.appendChild(showInfo);
  detailsBottom.appendChild(getShowInfo(data));

  const companies = document.createElement('h4');
  companies.innerText = 'Production Companies';
  detailsBottom.appendChild(companies);
  detailsBottom.appendChild(getProductionCompanies(data.production_companies));

  return detailsBottom;
}

function getShowInfo(data) {
  const infoList = document.createElement('ul');
  infoList.appendChild(
    getInfo('Number Of Episodes: ', data.number_of_episodes)
  );
  infoList.appendChild(
    getInfo('Last Episode To Air: ', data.last_episode_to_air.name)
  );
  infoList.appendChild(getInfo('Status: ', data.status));

  return infoList;
}

async function getNowPlayingMovies(endPoint) {
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  const { results } = await get(endPoint);

  results.forEach((result) =>
    swiperWrapper.appendChild(getNowPlayingMovieSlide(result))
  );

  console.log(swiperWrapper);
  return swiperWrapper;
}

function getNowPlayingMovieSlide(movie) {
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.innerHTML = `<a href="movie-details.html?id=${movie.id}">
                             <img src="https://image.tmdb.org/t/p/w500${
                               movie.poster_path
                             }" alt="${movie.title}" />
                           </a>
                          <h4 class="swiper-rating">
                             <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
                               1
                             )} / 10
                          </h4>`;
  return swiperSlide;
}

async function showSlider() {
  const swiper = document.querySelector('.swiper');
  swiper.innerHTML = '';
  swiper.appendChild(await getNowPlayingMovies(api.paths.nowPlaying));

  initSwiper();
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function search() {
  const queryParams = new URLSearchParams(window.location.search);
  const searchResults = document.querySelector('#search-results');
  searchResults.innerHTML = '';
  const data = await get(
    `${api.paths.search.replace(
      '{type}',
      queryParams.get('type')
    )}?query=${queryParams.get('search-term')}`
  );

  data.results.forEach((result) => searchResults.appendChild(getCard(result)));
}

document.addEventListener('DOMContentLoaded', init);

const app = {
  currentPage: window.location.pathname,
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
    case 'index.html':
      console.log('Home');
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

document.addEventListener('DOMContentLoaded', init);

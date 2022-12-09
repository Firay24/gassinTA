import FavoriteMovieIdb from '../../data/favorite-movie-idb';
import { createMovieItemTemplate } from '../templates/template-creator';

const Like = {
  async render() {
    return `
      <div class="content">
        <h2 class="content__heading">Your Liked Movie</h2>
        <div id="movies" class="movies">
        </div>
      </div>
    `;
  },

  async afterRender() {
    const movies = await FavoriteMovieIdb.getAllMovies();
    const moviesContainer = document.querySelector('#movies');

    movies.forEach((movie) => {
      // const page = 'result';
      const users = JSON.parse(localStorage.getItem('detail'));
      let page;
      if (users === null) {
        page = 'detail';
      } else if (users.includes(movie.nama_pengguna)) {
        page = 'result';
      } else {
        page = 'detail';
      }
      moviesContainer.innerHTML += createMovieItemTemplate(movie, page);
    });
  },
};

export default Like;

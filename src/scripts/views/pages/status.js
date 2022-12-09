import API_ENDPOINT from '../../globals/api-endpoint';
import { createUserStatusTemplate } from '../templates/template-creator';
import FavoriteMovieIdb from '../../data/favorite-movie-idb';
import UrlParser from '../../routes/url-parser';

const Status = {
  async render() {
    return `
    <div class="room_info">
    <p id="userRoomId"></p>
  </div>
  <div class="user_status">
    <table id="status_table">
      <tr>
        <th>Users</th>
        <th>Status</th>
      </tr>
    </table>
  </div>
    `;
  },
  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const room = await FavoriteMovieIdb.getMovie(parseInt(url.id, 10));
    console.log(`respond ${room.id_room}`);
    const idroomUser = document.getElementById('userRoomId');

    idroomUser.innerText = `Room ID : ${room.id_room}`;

    const options = {
      method: 'GET',
    };

    const response = await fetch(`${API_ENDPOINT.DETAIL_USER(room.id_room)}`, options);
    const responseJson = await response.json();
    const responseJsonArray = responseJson.data.task;
    console.log(`hasil ${JSON.stringify(responseJson)}`);
    const userStatus = document.getElementById('status_table');
    responseJsonArray.forEach((restaurant) => {
      userStatus.innerHTML += createUserStatusTemplate(restaurant);
      console.log(`respond ${restaurant}`);
    });
  },
};

export default Status;

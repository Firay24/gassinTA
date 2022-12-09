/* eslint-disable no-unused-vars */
import UrlParser from '../../routes/url-parser';
import FavoriteMovieIdb from '../../data/favorite-movie-idb';
import API_ENDPOINT from '../../globals/api-endpoint';
import {
  createResultTemplate,
  createResultTemplateHour,
} from '../templates/template-creator';

const Result = {
  async render() {
    return `
      <div class="detile-room">
        <div class="command-sign">
          <div id="command-sign-text">
            <h1>Result Your Schedules</h1>
            <hr>
          </div>
        </div>
        <div class="command-sign">
          <div id="room-description">
            <img id="icon" src="image 24.png" alt="">
            <div> 
              <p id="room-id2"></p>
              <p id="username2"></p>
            </div>
          </div>
          <div id="room-description">
            <p id="event-description2"></p>
            <img id="icon" src="image 22.png" alt="">
          </div>
        </div>
        <div class="command-sign" id="result"></div>
        <button id="submit-button">SUBMIT</button>
      </div>
        `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const room = await FavoriteMovieIdb.getMovie(parseInt(url.id, 10));

    const roomIdContainer2 = document.getElementById('room-id2');
    const usernameContainer2 = document.getElementById('username2');
    const eventDescriptionContainer2 = document.getElementById('event-description2');

    roomIdContainer2.innerText = `Room ID : ${room.id_room}`;
    usernameContainer2.innerText = `Username: ${room.nama_pengguna}`;
    eventDescriptionContainer2.innerText = `${room.nama_room}`;

    const options = {
      method: 'GET',
    };
    const response = await fetch(`${API_ENDPOINT.DETAIL_ROOM(room.id_room)}`, options);
    const responseJson = await response.json();
    const hasilContainer = document.querySelector('#result');

    const tanggal = [];
    responseJson.forEach((hasil) => {
      if (tanggal.includes(hasil.tanggal) === false) {
        tanggal.push(hasil.tanggal);
      }
    });
    const data = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tanggal.length; i++) {
      const hourArray = [];
      // eslint-disable-next-line no-loop-func
      responseJson.forEach((hasil) => {
        if (tanggal[i] === hasil.tanggal) {
          const objectHour = { jamMulai: hasil.jamMulai, jamBerakhir: hasil.jamBerakhir };
          hourArray.push(objectHour);
        }
      });
      data.push(hourArray);
    }

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < tanggal.length; j++) {
      hasilContainer.innerHTML += createResultTemplate(tanggal[j]);
      const hour = document.querySelector('.schedule:last-child .hours');
      // const newhour = hour.textContent;
      // eslint-disable-next-line no-plusplus
      for (let z = 0; z < data[j].length; z++) {
        hour.innerHTML += createResultTemplateHour(data[j][z]);
      }
    }

    let users = [];
    if (users.length === 0) {
      const localItems = JSON.parse(localStorage.getItem('result'));
      if (localItems !== null) {
        users = localItems;
      } else {
        users = [];
        console.log('pengguna kosong');
      }
    } else {
      users = [];
      console.log('pengguna kosong dua');
    }

    users.push(room.nama_pengguna);
    const userResult = JSON.stringify(users);

    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', () => {
      localStorage.setItem('result', userResult);
    });
  },
};

export default Result;

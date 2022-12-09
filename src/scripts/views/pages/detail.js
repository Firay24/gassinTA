/* eslint-disable valid-typeof */
import UrlParser from '../../routes/url-parser';
import FavoriteMovieIdb from '../../data/favorite-movie-idb';
import API_ENDPOINT from '../../globals/api-endpoint';
import { createRoomDetailTemplate } from '../templates/template-creator';

const Detail = {
  async render() {
    return `
    <div class="detile-room">
      <div class="command-sign">
        <div id="command-sign-text">
          <h1>List Your Schedules</h1>
          <hr>
        </div>
      </div>
      <div class="command-sign">
        <div id="room-description">
          <img id="icon" src="image 24.png" alt="">
          <div> 
            <p id="room-id"></p>
            <p id="username"></p>
          </div>
        </div>
        <div id="room-description">
          <p id="event-description"></p>
          <img id="icon" src="image 22.png" alt="">
        </div>
      </div>
      <div class="command-sign" id="input-form"></div>
      <button id="submit-button">SUBMIT</button>
    </div>
      `;
  },

  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const room = await FavoriteMovieIdb.getMovie(parseInt(url.id, 10));
    const inputFormContainer = document.getElementById('input-form');
    // movieContainer.innerHTML = createRoomDetailTemplate(room);

    const roomIdContainer = document.getElementById('room-id');
    const usernameContainer = document.getElementById('username');
    const eventDescriptionContainer = document.getElementById('event-description');

    roomIdContainer.innerText = `Room ID : ${room.id_room}`;
    usernameContainer.innerText = `Username: ${room.nama_pengguna}`;
    eventDescriptionContainer.innerText = `${room.nama_room}`;

    room.hari_dan_tanggal.forEach((date) => {
      inputFormContainer.innerHTML += createRoomDetailTemplate(date);
    });

    const postDataSchedule = async (roomId, nama, jamMulai, jamSelesai) => {
      const schedule = {
        roomId,
        nama,
        jamMulai,
        jamSelesai,
      };

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule),
      };

      const response = await fetch(`${API_ENDPOINT.SCHEDULE}`, options);
      const responseJson = await response.json();
      console.log(responseJson);
    };

    const timeStart = [];
    const timeFinish = [];
    const submitButton = document.getElementById('submit-button');

    const insertSchedule = (event) => {
      room.hari_dan_tanggal.forEach((date) => {
        const timeStartValue = document.querySelectorAll(`#startTimeOnDate${date}`);
        const timeFinishValue = document.querySelectorAll(`#finishTimeOnDate${date}`);
        const timeStartOnEachDate = {
          timeStart: [],
        };
        const timeFinishOnEachDate = {
          timeFinish: [],
        };

        timeStartOnEachDate.date = date;
        timeFinishOnEachDate.date = date;

        timeStartValue.forEach((start) => {
          timeStartOnEachDate.timeStart.push(start.value);
        });
        timeFinishValue.forEach((finish) => {
          timeFinishOnEachDate.timeFinish.push(finish.value);
        });

        timeStart.push(timeStartOnEachDate);
        timeFinish.push(timeFinishOnEachDate);
      });

      postDataSchedule(
        room.id_room,
        room.nama_pengguna,
        timeStart,
        timeFinish,
      );

      console.log(timeStart);
      console.log(timeFinish);
      event.preventDefault();

      let users = [];
      if (users.length === 0) {
        const localItems = JSON.parse(localStorage.getItem('detail'));
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
      localStorage.setItem('detail', userResult);
    };
    submitButton.addEventListener('click', insertSchedule);
  },
};

export default Detail;

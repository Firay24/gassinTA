import API_ENDPOINT from '../../globals/api-endpoint';
import FavoriteMovieIdb from '../../data/favorite-movie-idb';
import {
  createInputForm, createRoomNameInputForm,
} from '../templates/template-creator';

const { nanoid } = require('nanoid');

const Upcoming = {
  async render() {
    return `
      <div class="command-sign">
        <div id="command-sign-text">
          <h1>Enter the number<br>of day options you need</h1>
          <hr>
        </div>
        <img id="command-sign-icon" src="date-and-clock.png" alt="">
      </div>
      <form action="" class="day-options">
        <div id="day-options">
          <input type="number" placeholder="Days" id="number-of-days" min="1" max="7">
          <button type="submit" id="enter-button">ENTER</button>
        </div>
        <div id="room-info">
          <form action="">
            <div id="label">
              <div id="rooms-name-label">
                <label for="user-name">Your name :</label>
              </div>
              <div id="rooms-name-label">
                <label for="rooms-name">Room's name :</label>
              </div>
              <div>
                <label for="days-and-date">Days and date :</label>
              </div>
            </div>
            <div id="input-form">
              <div id="rooms-name-container"></div>
              <div id="date-form-container"></div>
              <div id="create-button-submit"></div>
              <button type="submit" id="create-button">CREATE</button>
            </div>
          </form>
        </div>
      </form>
    `;
  },

  async afterRender() {
    const enterButton = document.getElementById('enter-button');
    const createButton = document.getElementById('create-button');
    const inputContainer = document.querySelector('#date-form-container');
    const roomNameContainer = document.querySelector('#rooms-name-container');
    const label = document.getElementById('label');

    const createFormForRoomInfo = (event) => {
      const numberOfDays = document.getElementById('number-of-days').value;
      roomNameContainer.innerHTML += createRoomNameInputForm();
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= numberOfDays; i++) {
        inputContainer.innerHTML += createInputForm();
      }
      label.style.visibility = 'visible';
      createButton.style.visibility = 'visible';
      event.preventDefault();
    };

    enterButton.addEventListener('click', createFormForRoomInfo);

    const showResponseMessage = (message = 'Check your internet connection') => {
      alert(message);
    };

    const insertBook = async (event) => {
      const roomsName = document.getElementById('rooms-name').value;
      const userName = document.getElementById('user-name').value;
      const daysAndDate = document.querySelectorAll('#days-and-date');
      const dateValues = [];
      daysAndDate.forEach((date) => {
        dateValues.push(date.value);
      });
      console.log(`
      rooms name= ${roomsName}
      tanggal = ${dateValues}
      `);
      event.preventDefault();

      const room = {
        id_room: nanoid(16),
        nama_pengguna: userName,
        nama_room: roomsName,
        hari_dan_tanggal: dateValues,
      };

      try {
        await FavoriteMovieIdb.addMovie(room);
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(room),
        };

        const response = await fetch(`${API_ENDPOINT.ROOM}`, options);
        const responseJson = await response.json();
        showResponseMessage(responseJson.message);
      } catch (error) {
        showResponseMessage(error);
      }
    };
    createButton.addEventListener('click', insertBook);
  },
};

export default Upcoming;

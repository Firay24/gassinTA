/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
// import TheMovieDbSource from '../../data/themoviedb-source';
import FavoriteMovieIdb from '../../data/favorite-movie-idb';
import API_ENDPOINT from '../../globals/api-endpoint';
// import { createMovieItemTemplate } from '../templates/template-creator';
// import { async } from 'regenerator-runtime';

const NowPlaying = {
  async render() {
    return `
      <form action="" class="join-room">
        <input type="" name="" id="join-code" placeholder="Enter your join code" minlength="15" maxlength="16">
        <input type="text" name="" id="username" placeholder="Enter a your name">
        <button id="join-button" type="submit">JOIN</button>
      </form>
    `;
  },

  async afterRender() {
    const joinButton = document.getElementById('join-button');

    const postDataUser = async (idRoom, userName, roomsName, dateValues) => {
      const room = {
        id_room: idRoom,
        nama_pengguna: userName,
        nama_room: roomsName,
        hari_dan_tanggal: dateValues,
      };

      await FavoriteMovieIdb.addMovie(room);
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(room),
      };

      const response = await fetch(`${API_ENDPOINT.USER}`, options);
      const responseJson = await response.json();
      console.log(responseJson);
    };

    const insertBook = async () => {
      const joinCode = document.getElementById('join-code').value;
      const username = document.getElementById('username').value;

      const options = {
        method: 'GET',
      };
      const response = await fetch(`${API_ENDPOINT.ROOM}`, options);
      const responseJson = await response.json();

      console.log(responseJson);
      console.log(`Ini room: ${typeof (responseJson)}`);
      const pilihanHari = [];
      const { room, pilihan_hari } = responseJson.data;
      const roomId = [];

      room.forEach((roomItem) => {
        if (roomItem.id_room == joinCode) {
          console.log(`ID ROOM: ${roomItem.id_room}`);
          roomId.push(roomItem.id_room);

          pilihan_hari.forEach((day) => {
            if (day.id_room == joinCode) {
              pilihanHari.push(day.hari_dan_tanggal);
            }
          });

          postDataUser(
            roomId[0],
            username,
            roomItem.nama_room,
            pilihanHari,
          );
          console.log(`GATAU: ${roomId[0]}`);
        }
      });

      window.location.assign('http://localhost:9009/#/like');
    };

    joinButton.addEventListener('click', insertBook);
  },
};

export default NowPlaying;

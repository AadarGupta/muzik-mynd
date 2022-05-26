import axios from 'axios';

let token = window.localStorage.getItem('token');

export async function findSong() {
  let data = await axios
    .get('https://api.spotify.com/v1/me/tracks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 10,
      },
    })
    .then(({ data }) => data);
  let song = data.items.sort((a1, a2) => {
    return a2.popularity - a1.popularity;
  })[data.items.length - 1];
  return await findData(song.track);
}

async function findData(song) {
  let data = await axios
    .get('https://api.spotify.com/v1/recommendations', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        seed_artists: song.artists[0].id,
        seed_tracks: song.id,
        target_popularity: Math.round(song.popularity / 4),
        min_popularity: 1,
      },
    })
    .then(({ data }) => data);
  let songRecommend = data.tracks.sort((a1, a2) => {
    return a2.popularity - a1.popularity;
  })[data.tracks.length - 1];

  return songRecommend;
}

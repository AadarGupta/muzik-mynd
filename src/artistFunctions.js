import axios from 'axios';

let token = window.localStorage.getItem('token');
let artistRecommend;

export async function getGenre() {
  let artistGenre = await findArtist();
  let genre = artistGenre.genres[0];
  return genre;
}

export async function findArtist() {
  let data = await axios
    .get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        time_range: 'short_term',
        limit: 10,
      },
    })
    .then(({ data }) => data);
  let allArtists = [];
  let arrayOfFound = [];
  for (let i of data.items) {
    arrayOfFound = await relatedArtists(i.id);
    for (let art of arrayOfFound) {
      allArtists.push(art);
    }
  }

  artistRecommend = allArtists.sort((a1, a2) => {
    return a2.followers.total - a1.followers.total;
  })[allArtists.length - 1];
  const genre = artistRecommend.genres[0];
  return artistRecommend;
}

export async function relatedArtists(id) {
  let data = await axios
    .get(`https://api.spotify.com/v1/artists/${id}/related-artists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => data);
  return data.artists;
}

import React, { Component } from 'react';
import axios from 'axios';
import { findArtist, getGenre } from './artistFunctions.js';
import { findSong } from './songFunctions.js';
import './Recommendation.css';
import logoBlue from './logoBlue.png';

let token = window.localStorage.getItem('token');

class Recommendation extends Component {
  state = {
    artistUrl: '',
    artistName: '',
    artistImg: '',
    songUrl: '',
    songName: '',
    songImg: '',
    playlistUrl: '',
    playlistName: '',
    playlistImg: '',
  };

  componentDidMount() {
    this.getArtist();
    this.getSong();
    this.getPlaylist();
  }

  getArtist = async () => {
    let creator = await findArtist();
    this.setState({ artistUrl: creator.external_urls.spotify });
    this.setState({ artistName: creator.name });
    this.setState({ artistImg: creator.images[0].url });
  };

  getSong = async () => {
    let track = await findSong();
    this.setState({ songUrl: track.external_urls.spotify });
    this.setState({ songName: track.name });
    this.setState({ songImg: track.album.images[0].url });
  };

  getPlaylist = async () => {
    let genre = await getGenre();
    let data = await axios
      .get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: genre || 'new releases',
          type: 'playlist',
          limit: 20,
        },
      })
      .then(({ data }) => data);
    const playlist = await data.playlists.items[
      data.playlists.items.length - 1
    ];

    this.setState({ playlistUrl: playlist.external_urls.spotify });
    this.setState({ playlistName: playlist.name });
    this.setState({ playlistImg: playlist.images[0].url });
  };

  render() {
    return (
      <div className='Recommendations'>
        <header className='Recommendation-header'>
          <img className='logoBlue' src={logoBlue} alt='Muzik Mynd' />
          <h1 className='title'>MUZIK MYND</h1>
        </header>
        <div className='Recommendation-content'>
          <div className='Recommended-artist'>
            <h2 className='Artist-header'>Artist</h2>
            <a href={this.state.artistUrl}>
              <img src={this.state.artistImg} className='spotImg' />
              <h3 className='artistName'>{this.state.artistName}</h3>
            </a>
          </div>

          <div className='Recommended-song'>
            <h2 className='Song-header'>Song</h2>
            <a href={this.state.songUrl}>
              <img src={this.state.songImg} className='spotImg' />
              <h3 className='songName'>{this.state.songName}</h3>
            </a>
          </div>

          <div className='Recommended-playlist'>
            <h2 className='Playlist-header'>Playlist</h2>
            <a href={this.state.playlistUrl}>
              <img src={this.state.playlistImg} className='spotImg' />
              <h3 className='playlistName'>{this.state.playlistName}</h3>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Recommendation;

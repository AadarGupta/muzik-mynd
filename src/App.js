import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Recommendation from './Recommendation.js';
import './App.css';
import logo from './logo.png';

// Consult react-reveal for animations

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = process.env.REACT_APP_AUTH_ENDPOINT;
  const RESPONSE_TYPE = process.env.REACT_APP_RESPONSE_TYPE;
  const scopes = ['user-top-read', 'user-library-read'];

  // useState for the token
  const [token, saveToken] = useState('');

  // obtain and update token
  useEffect(() => {
    console.log(process.env.REACT_APP_JOKES);
    // hash = everything after #
    const hash = window.location.hash;
    // token = token from local storage
    let token = window.localStorage.getItem('token');

    // if a token does not exist and the hash exists, get the token from hash
    if (hash && !token) {
      token = hash.substring(14).split('&')[0];
      //console.log(token);

      // update token in localStorage
      window.localStorage.setItem('token', token);
      window.location.hash = '';
    }
    saveToken(token);
  }, []);

  // authenticate with spotify login
  const authSpotify = () => {
    window.location.replace(
      `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes.join(
        '%20'
      )}&response_type=${RESPONSE_TYPE}&show_dialog=true`
    );
  };

  return (
    <div className='App'>
      {!token ? (
        <header className='App-header'>
          <img className='logo' src={logo} alt='Logo' />
          <h1 className='product-name'>MUZIK MYND</h1>
          <span>
            <h3 className='tagline'>Seek for new music</h3>
          </span>
          <Button className='login-spotify' type='submit' onClick={authSpotify}>
            LOGIN TO SPOTIFY
          </Button>
        </header>
      ) : (
        <Recommendation />
      )}
    </div>
  );
}

export default App;

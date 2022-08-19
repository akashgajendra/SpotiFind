import Axios from 'axios';

const SPACE_DELIMITER = "%20";
const SCOPES=['user-read-currently-playing','user-read-playback-state', 'user-read-recently-played','playlist-read-private', 'user-top-read'];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);


export const getPlaylists = async (accessToken) => {

   let response = null, error = null;

   await Axios.get(process.env.REACT_APP_ARTISTS_ENDPOINT, {
     headers: {
       Authorization: "Bearer " + accessToken,
     },
   }).then((res) => {
      response = res.data.items;
   }).catch(err => {
      error = err;
   });

   return { response, error };
};


export const parseSpotifyResponse = (hash) => {
   return hash.substring(1).split('&').reduce((accumulater, param) => {
      const [key, value] = param.split('=');
      accumulater[key] = value;
      return accumulater;
   }, {});
}


export const handleLogin = () => {
   if (!window.location.hash) {
      window.location = `${process.env.REACT_APP_SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=https://spotifind-2bd2a.web.app&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
   } 
}


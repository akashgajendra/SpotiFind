/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var request = require('request'); // "Request" library

var client_id = 'c1c7943de99d41bb9d6b190cf3803c41'; // Your client id
var client_secret = '61c692139e114d54b3ac8f112f0adca2'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    let numSongs = 50;
    let numArtists = 10;

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      //https://open.spotify.com/genre/section0JQ5DAnM3wGh0gz1MXnu3C 
      // Today's top hits in a playlist
      url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      var dict = {};
      for(let i = 0; i < numSongs; i++){
        let pop = body['items'][i]['track']['popularity'];
        for(let l = 0; l < body['items'][i]['track']['artists'].length; l++){
          if(dict[body['items'][i]['track']['artists'][l]['name']] == null){
            dict[body['items'][i]['track']['artists'][l]['name']] = pop;
          }
          else{
            dict[body['items'][i]['track']['artists'][l]['name']] += pop;
          }
        }
      }
      
      //console.log(dict);
      // Create items array
      var ordered = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
      });

      // Sort the array based on the second element
      ordered.sort(function(first, second) {
        return second[1] - first[1];
      });

      // Create a new array with only the first 5 items
      console.log(ordered.slice(0, numArtists));
    });
  }
});

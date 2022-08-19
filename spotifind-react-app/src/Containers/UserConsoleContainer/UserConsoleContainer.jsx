// React
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetWrapper } from "../../Reducers/WrapperReducer";
import { SetTopSongs } from "../../Reducers/APIData";


// Material UI/Styles
import {
   Grid,
   Box,
   Paper,
   Divider,
   Card,
   CardMedia,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Components
import ConsoleColumn from "../../Components/ConsoleColumn/ConsoleColumn";
import ArtistCard from "../../Components/ArtistCard/ArtistCard";
import UserProfileCard from '../../Components/UserProfileCard/UserProfileCard';
import spotify from '../../Assets/spotify_logo.png';
import deezer from '../../Assets/deezer_logo.png';
import GroupCard from "../../Components/GroupCard/GroupCard";
import img from '../../Assets/VerticalTriangles.jpg';

// Firebase
import { firebaseAuth } from "../../firebase";
import { AddFriend, RemoveFriend } from "../../FirebaseFunctions/Users";
import { bgcolor } from "@mui/system";


// const Item = styled(Paper)(({ theme }) => ({
//    ...theme.typography.body2,
//    padding: theme.spacing(1),
//    textAlign: 'center',

//    color: 'inherit',
//    backgroundColor: 'rgb(55,73,87)'
//  }));


//localStorage.setItem('lastfmArtists', 'N/A');

const UserConsoleContainer = () => {
   const users = useSelector(state => state.users);
   const apiData = useSelector(state => state.apiData);
   const groups = useSelector(state => state.groups);
   const friends = useSelector(state => state.friends);
   const dispatch = useDispatch();
   const user = () => users[firebaseAuth.currentUser.uid];



   const dark = useSelector(state=>state.dark_mode)
   var title_bg=(dark)? "rgb(55,73,87)":"#0288D1";
   //rgb(55,73,87) #2196F3 #0288D1 0D47A1 1976D2
   var font_color = (dark) ? "#BAC8C7" : "#FFFFFF";

   const addFriend = async (friendID) => {
      const userID = firebaseAuth.currentUser.uid;
      const { response, error } = await AddFriend(friendID, userID);
      if (error) alert("ERROR", error);
   }

   const removeFriend = async (friendID) => {
      const relationshipID = friends[friendID];
      const { response, error } = await RemoveFriend(relationshipID);
      if (error) alert("ERROR", error);
   }

   const usersNearYou = () => {
      const radius = 0.5;

      return user()['coords'] 
      ? Object.values(users).filter(usr => 
         usr['coords'] &&
         usr['allowLocation'] && 
         !usr.blocked.includes(user().id) && 
         usr.id != firebaseAuth.currentUser.uid && 
         Math.abs(usr['coords'][0] - user()['coords'][0]) < radius &&
         Math.abs(usr['coords'][1] - user()['coords'][1]) < radius
      ) 
      : Object.values(users).filter(user => user.id != firebaseAuth.currentUser.uid)
   }


   useEffect(() => {

      // Get top songs of today/ trending artists
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


      let topSongs = [];
      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {

          let numSongs = 10;

          // use the access token to access the Spotify Web API
          var token = body.access_token;
          var options = {
            //https://open.spotify.com/genre/section0JQ5DAnM3wGh0gz1MXnu3C 
            // Today's top hits in a playlist
            url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks?limit=' + numSongs,
            headers: {
              'Authorization': 'Bearer ' + token
            },
            json: true
          };
          request.get(options, function(error, response, body) {
            for(let i = 0; i < numSongs; i++){
              let output = body['items'][i]['track']['name'] + " by ";        
              for(let l = 0; l < body['items'][i]['track']['artists'].length; l++){
                output = output + body['items'][i]['track']['artists'][l]['name'] + ", ";
              }
              output = output.substr(0, output.length - 2);
              topSongs.push(output);
            }

            dispatch(SetTopSongs(topSongs));
          });
        }
      });


      // // Gets top artists ID
      // var artistsFinal = [];
      // request.post(authOptions, function(error, response, body) {
      //    if (!error && response.statusCode === 200) {

      //     let numSongs = 50;
      //     let numArtists = 10;

      //     // use the access token to access the Spotify Web API
      //     var token = body.access_token;
      //     var options = {
      //       //https://open.spotify.com/genre/section0JQ5DAnM3wGh0gz1MXnu3C 
      //       // Today's top hits in a playlist
      //       url: 'https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks',
      //       headers: {
      //         'Authorization': 'Bearer ' + token
      //       },
      //       json: true
      //     };
      //     request.get(options, function(error, response, body) {
      //       var dict = {};
      //       //console.log(body);
      //       for(let i = 0; i < numSongs; i++){
      //         let pop = body['items'][i]['track']['popularity'];
      //         for(let l = 0; l < body['items'][i]['track']['artists'].length; l++){
      //           if(dict[body['items'][i]['track']['artists'][l]['id']] == null){
      //             dict[body['items'][i]['track']['artists'][l]['id']] = pop;
      //           }
      //           else{
      //             dict[body['items'][i]['track']['artists'][l]['id']] += pop;
      //           }
      //         }
      //       }
            
      //       //console.log(dict);
      //       // Create items array
      //       var ordered = Object.keys(dict).map(function(key) {
      //         return [key, dict[key]];
      //       });

      //       // Sort the array based on the second element
      //       ordered.sort(function(first, second) {
      //         return second[1] - first[1];
      //       });

      //       // Create a new array with only the first x items
      //       //console.log(ordered.slice(0, numArtists));
            
            
      //       let temp = ordered.slice(0, numArtists);
      //       for(let i = 0; i < numArtists; i++){
      //          artistsFinal.push(temp[i][0]);
      //       }

      //       //console.log(artistsFinal);
      //       localStorage.setItem('TopArtists', artistsFinal);               
      //     });
      //   }
      // });


      // var taNames = [];
      // var taFollowers = [];
      // var taGenres = [];
      // var taImages = [];
      // var taURL = [];
      // for(let i = 0; i < 10; i++){
      //    request.post(authOptions, (error, response, body) => {
      //       console.log(localStorage.getItem('TopArtists'));
      //       if (!error && response.statusCode === 200 && !(localStorage.getItem('TopArtists') === null)) {
      //          let artistFinal = localStorage.getItem('TopArtists').split(',')[i];
      //          let urlstr = 'https://api.spotify.com/v1/artists/' + localStorage.getItem('TopArtists').split(',')[i];
      //          console.log(urlstr);
      //          // use the access token to access the Spotify Web API
      //          var token = body.access_token;
      //          var options = {

      //          url: urlstr,
      //          headers: {
      //            'Authorization': 'Bearer ' + token
      //          },
      //          json: true
      //       };
      //          request.get(options, function(error, response, body) {

      //             //console.log("getting artist data " + artistsFinal[i]);
                  
      //             taNames.push(body['name']);
      //             taFollowers.push(body['followers']['total']);
      //             taGenres.push(body['genres']);
      //             taImages.push(body['images'][1]['url']);
      //             taURL.push(body['external_urls']['spotify']);
      //             if(i == 9){
      //                localStorage.setItem('taNames', taNames);
      //                localStorage.setItem('taFollowers', taFollowers);
      //                //localStorage.setItem('taGenres', taGenres);  Genres messed up because local storage stores as string
      //                localStorage.setItem('taImages', taImages);
      //                localStorage.setItem('taURL', taURL);
      //             }
                  
      //          });
               
      //         }

      //    });
         
      // }

   }, [])

   /*
   var topSongsLastfm = [];
   async function getSongsLastfm() {
      //let topSongsLastfm = [];
      let responsefm = await fetch('http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=470896f4af82a11672b188957aa372fc&format=json');
      //let responsefm = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=470896f4af82a11672b188957aa372fc&format=json')}`);

      //console.log(responsefm.status); // 200
      //console.log(responsefm.statusText); // OK
      if (responsefm.status === 200) {
         //console.log("inside");
         let data = await responsefm.text();
         // handle data
         let data2 = JSON.parse(data);
         for(let i = 0; i < 10; i++){
            let temp = data2.tracks.track[i].name + " by " + data2.tracks.track[i].artist.name;
            topSongsLastfm.push(temp);
         }
         //console.log(topSongsLastfm);
         localStorage.setItem('songsLastfm', topSongsLastfm);
      }
   }
   getSongsLastfm();
   */

   var spotify_filter;
   if((apiData && Object.keys(apiData.spotify).length > 0)){
      console.log("not null spotify");
      spotify_filter = "null";
   }
   else{
      console.log('null spotify');
      spotify_filter = "grayscale(100%)";
   }

   var deezer_filter;
   if((localStorage.getItem('Deezer_Artists') != "") && (localStorage.getItem('Deezer_Artists') != null)){
      //console.log("not null deezer");
      deezer_filter = "null";
   }
   else{
      //console.log('null deezer');
      deezer_filter = "grayscale(100%)";
   }

   return user() ? ( 
      <Box sx={{ flexGrow: 1}}>
         <Grid container spacing={2}>
            <Grid item md={3}>
               <Paper sx={{padding: 1, textAlign: 'center', color: font_color,backgroundColor: title_bg}}>Your Favorite Artists</Paper>
               <ConsoleColumn cards={ 
                  apiData.favoriteArtists.map(artist => {
                     return <ArtistCard key={ artist.name } imgUrl={ artist.images[0].url } name={ artist.name  } />
                  })
                  
               } />
            </Grid>
            <Grid item md={3}>
               <Paper sx={{padding: 1, textAlign: 'center', color: font_color,backgroundColor: title_bg}}>
                  { user()['coords'] ? 'Near You' : 'All Users' }
               </Paper>
               <ConsoleColumn cards={ 
                  usersNearYou().map(user => {
                     const {
                        first_name,
                        last_name,
                        email,
                        id,
                     } = user;
                     return <UserProfileCard 
                              key={ id }
                              firstname={ first_name } 
                              lastname={ last_name } 
                              email={ email } 
                              id={ id }
                              img={ user['img'] }
                              friend={ Object.keys(friends).includes(id) }
                              addFriend={ addFriend }
                              removeFriend={ removeFriend }
                           />
                  })
               } />
            </Grid>
            <Grid item md={6} sx={{ 
               overflowY: 'scroll', 
               maxHeight: 'calc(100vh - 70px)',
               "::-webkit-scrollbar": { width: 0 }
            }}>
               <Paper sx={{padding: 1, textAlign: 'center', color: font_color,backgroundColor: title_bg}}>Top Songs</Paper>
                  <table border="1px solid black" style={{ color: dark ? font_color : 'black', marginTop: '20px' }}>
                    <tr>
                      <th>Spotify</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[0]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[1]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[2]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[3]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[4]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[5]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[6]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[7]}</th>
                    </tr>
                    <tr>
                        <th>{apiData.topSongs[8]}</th>
                    </tr>
                     <tr>
                        <th>{apiData.topSongs[9]}</th>
                    </tr>
                  </table>

               <Divider sx={{ marginBottom: '10px', marginTop: '60px' }}/>
               <Paper sx={{padding: 1, textAlign: 'center', color: font_color,backgroundColor: title_bg}}>Trending Artists (Spotify)</Paper>
                  <p>{ localStorage.getItem('taNames') }</p>
               <Divider sx={{ marginBottom: '10px', marginTop: '60px' }}/>
               <Paper sx={{padding: 1, textAlign: 'center', color: font_color,backgroundColor: title_bg}}>Your Favorite Artists (Deezer)</Paper>
                  <p>{ localStorage.getItem('Deezer_Artists') }</p>
               <Divider sx={{ marginBottom: '10px', marginTop: '60px' }}/>
               <Paper sx={{padding: 1, textAlign: 'center', color: font_color,backgroundColor: title_bg}}>Linked Platforms</Paper>
               
               <Box sx={{ display: 'flex', mt: 3 }}>
                        <img src={spotify} alt='spotify' width='350' height='100' style={{filter: spotify_filter }}/>     
                  </Box>
               <Box sx={{ display: 'flex', mb: 6 }}>
                     <img src={deezer} alt='deezer' width='400' height='100' style={{filter: deezer_filter }}/>
               </Box>
            </Grid>
         </Grid>
         
         
      </Box>
         
   ) : (
      <h2>Loading...</h2>
   )
}
 
 
export default UserConsoleContainer;
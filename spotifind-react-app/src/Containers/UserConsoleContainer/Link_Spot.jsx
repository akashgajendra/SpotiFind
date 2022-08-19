import React, { useEffect, useState} from "react";
//import GetSpotifyPlaylist from "./getPlaylist";
//import getSpotifyPlaylist from "./getPlaylist";

//Client ID 07ef2ee432d5473cb64cb21d846d3821
//Client Secret ac8afdd3805843f59c919811f428899
// Material UI
import { 
    Button,
 } from "@mui/material";
 import {
    Link,
 } from '@mui/icons-material'

import axios from "axios";


const CLIENT_ID= "c1c7943de99d41bb9d6b190cf3803c41"
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL_AFTER_LOGIN = "https://spotifind-2bd2a.web.app/";
const SPACE_DELIMITER = "%20";

const SCOPES=['user-read-currently-playing','user-read-playback-state', 'user-read-recently-played','playlist-read-private', 'user-top-read'];
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

const ARTISTS_ENDPOINT="https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10&offset=0";

const getSpotifyResponse=(hash) => {
    const stringAfterHashtag=hash.substring(1);
    const paramsInUrl=stringAfterHashtag.split("&");
    const paramsSplitUp=paramsInUrl.reduce((accumulater,currentValue) => {
        //console.log(currentValue);
        const [key,value]=currentValue.split("=");
        accumulater[key]=value;
        return accumulater;
    },{});

    return paramsSplitUp;
}

const LinkPlatform = () => {
  useEffect(() => {
    if (window.location.hash){
        console.log(window.location.hash);
        
        //CAN MAKE OBJECT OR JUST DESTRUCTURE THE OBTAINED RESULT
        //const object=getSpotifyResponse(window.location.hash);
        
        const {access_token, expires_in, token_type}=getSpotifyResponse(window.location.hash)
        console.log(access_token)
        console.log(token_type)
        console.log(expires_in)
        
        //localStorage.clear();
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("tokenType", token_type);
        localStorage.setItem("expiresIn", expires_in);
        localStorage.setItem("platforms", "Spotify");
    }
  })


   const handleGetPlaylists = () => {
    let userArtists = [];
    axios.get(ARTISTS_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
    }).then((response) => {
        //console.log(response.data);
        let artists = response.data['items'];
        for (let i = 0; i < artists.length; i++){
            userArtists.push(artists[i]['name']);
        }
        console.log(userArtists);
        localStorage.setItem("userArtists", userArtists);
        window.location.reload(true);
    })
    .catch((error) => {
        console.log(error);
    });
    
  };


  const handleLogin=() => {
    localStorage.setItem('visitedSpotify', 'true');
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=https://spotifind-2bd2a.web.app/&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
    this.handleGetPlaylists();
  }


  return (
    <div className="container">
      <Button onClick={handleLogin} variant='contained' color='secondary' sx={{ marginLeft: 3 }} startIcon={ <Link /> }>Link</Button>
      <Button onClick={handleGetPlaylists} variant='contained' color='secondary' sx={{ marginLeft: 3 }} startIcon={ <Link /> }>Display</Button>
    </div>
  );
};

export default LinkPlatform;
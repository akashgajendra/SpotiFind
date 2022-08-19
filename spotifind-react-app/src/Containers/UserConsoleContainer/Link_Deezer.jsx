import axios from "axios";
import React, { useEffect, useState} from "react";


var DEEZER_APP_ID = "514962"
var DEEZER_APP_SECRET = "a57c1085f9b84cbea55b1c9205a2a4fb"
//var DEEZER_REDIRECT_URI = "http://localhost:3000/console"
var DEEZER_REDIRECT_URI = "https://spotifind-2bd2a.web.app/"
var logged_in=false


//PARSER Functions to retrive key tokens
const Split_URL = (link) => {
    var code=link.split("=");
    console.log(code[1])
    return code[1];
}  

const Split_Artists = (id_request) => {
    var num=id_request.split(":").at(-1).substring(0,id_request.split(":").at(-1).length-1)
    //Make an array if convinient
    var final_artists=""
    var temp1=id_request.split("name")
    for (let i = 0; i < num; i++){
        var dum = temp1[i+1].split(',')[0]
        var temp2= dum.substring(3,dum.length-1)
        //final_artists.push(temp2)
        if (i!=num-1){
            final_artists+=temp2+", "
          }
          else{
            final_artists+=temp2
          }
    }
    localStorage.setItem("Deezer_Artists", final_artists);
}

const Split_Auth = (auth_line) => {
    var p1=auth_line.split("=")
    var p2=p1[1].split("&")
    console.log("Split Worked: ", p2[0])
    localStorage.setItem("DEEZER_AUTH_TOKEN", p2[0]);
    return p2[0]
}


//Getter Axios requests

const Get_id = async (auth) => {
    await axios(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.deezer.com/user/me?access_token='+auth)}`)
      .then(response => {        
        localStorage.setItem("DEEZER_ID", response['data']['contents'].split(',')[0].substring(6));
        localStorage.setItem("DEEZER_NAME", response['data']['contents'].split(',')[1].substring(8,response['data']['contents'].split(',')[1].length-1));
        localStorage.setItem("platforms", "Deezer");
      })
      .catch(err => {
        alert("ERROR")
      })
}

const LinkDeezer = async () => {
    window.location="https://connect.deezer.com/oauth/auth.php?app_id="+DEEZER_APP_ID+"&secret="+DEEZER_APP_SECRET+"&redirect_uri="+DEEZER_REDIRECT_URI+"&perms=basic_access,email"
    var Deezer_CODE=Split_URL(window.location.href)
    //GET AUTH
    const get_auth="https://connect.deezer.com/oauth/access_token.php?app_id="+DEEZER_APP_ID+"&secret="+DEEZER_APP_SECRET+"&code="+Deezer_CODE
    axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(get_auth)}`)
        .then(response => {
        var dum=Split_Auth(response['data']['contents'])
    })

    Get_id(localStorage.getItem("DEEZER_AUTH_TOKEN"))

    var artists="https://api.deezer.com/user/"+localStorage.getItem("DEEZER_ID")+"/artists"
    axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(artists)}`)
    .then(response => {
        var resp=response['data']['contents']
        Split_Artists(response['data']['contents'])
    })
    .catch(err => {
        console.log("Artist request: ", err)
        })

}

export default LinkDeezer;

import Axios from 'axios';


async function getUserArtists() {
    var username = window.prompt("Enter your Last.fm username: ");
    let response = await fetch('http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + username + '&api_key=470896f4af82a11672b188957aa372fc&format=json');

    //console.log(response.status); // 200
    //console.log(response.statusText); // OK

    if(response.status != 200){
      window.alert("Entered Last.fm username is not valid.");
    }

    if (response.status === 200) {
        let data = await response.text();
        // handle data
        let data2 = JSON.parse(data);
        let numArtists = 5;
        /* FIXME: If user has less than 5 top artists, this will break
        let numArtists = Object.keys(data2.topartists.artists).length;
        if(numArtists > 5){
         numArtists = 5;
        }
        */
        const artists = [];
        for(let i = 0; i < numArtists; i++){
         //console.log(data2.topartists.artist[i].name);
         artists[i] = data2.topartists.artist[i].name;
        }
        console.log(artists);
        localStorage.setItem('lastfmArtists', artists);
        window.location.reload();
    }
}


// Test using account rj
export const lastfmLink = () => {
   getUserArtists();
}


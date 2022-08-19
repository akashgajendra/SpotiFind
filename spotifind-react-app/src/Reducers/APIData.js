

const SET_TOP_SONGS           = 'SET_TOP_SONGS';
const SET_FAVORITE_ARTISTS    = 'SET_FAVORITE_ARTISTS';
const SET_SPOTIFY_METADATA    = 'SET_SPOTIFY_METADATA';
const RESET_API_DATA          = 'RESET_API_DATA';

export const SetTopSongs = (payload) => ({
   type: SET_TOP_SONGS,
   payload
});

export const SetFavoriteArtists = (payload) => ({
   type: SET_FAVORITE_ARTISTS,
   payload
});

export const SetSpotifyMetadata = (payload) => ({
   type: SET_SPOTIFY_METADATA,
   payload,
});

export const ResetAPIData = () => ({
   type: RESET_API_DATA
});



const initialState = {
   topSongs: [],
   favoriteArtists: [],
   spotify: {},
}

export default (state = initialState, { type, payload }) => {
   switch (type) {
      case SET_TOP_SONGS:
         return { ...state, topSongs: [...payload] };

      case SET_FAVORITE_ARTISTS:
         return { ...state, favoriteArtists: [...payload] };

      case SET_SPOTIFY_METADATA:
         return { ...state, spotify: {...payload} };
      
      case RESET_API_DATA:
         return {
            topSongs: [],
            favoriteArtists: [],
            spotify: {},
         }

      default:
         return state;
   }
}
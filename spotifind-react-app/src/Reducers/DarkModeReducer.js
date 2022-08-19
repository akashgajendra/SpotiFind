const TOGGLE_MODE    = 'TOGGLE_MODE';
const SET_MODE       = 'SET_MODE'


export const ToggleMode = () => ({
   type: TOGGLE_MODE,
});

export const SetMode = (payload) => ({
   type: SET_MODE,
   payload
});

const initialState = true;

export default (state = initialState, { type, payload }) => {
   switch (type) {
      case TOGGLE_MODE:
         return !state;
      case SET_MODE:
         return payload;
      default:
         return state;
   }
}
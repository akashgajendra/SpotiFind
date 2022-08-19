

const TOGGLE_WRAPPER = 'TOGGLE_WRAPPER';
const SET_WRAPPER = 'SET_WRAPPER';


export const ToggleWrapper = () => ({
   type: TOGGLE_WRAPPER,
});

export const SetWrapper = (payload) => ({
   type: SET_WRAPPER,
   payload
});



const initialState = false;

export default (state = initialState, { type, payload }) => {
   switch (type) {
      case TOGGLE_WRAPPER:
         return !state;

      case SET_WRAPPER:
         return payload;
         
      default:
         return state;
   }
}
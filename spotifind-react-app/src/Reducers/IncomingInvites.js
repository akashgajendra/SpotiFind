
// Invites where INVITED is current user

const SET_INCOMING_INVITE     = 'SET_INCOMING_INVITE';
const RESET_INCOMING_INVITES  = 'RESET_INCOMING_INVITES';
const REMOVE_INCOMING_INVITE  = 'REMOVE_INCOMING_INVITE';
const UPDATE_INCOMING_INVITE_STATUS = 'UPDATE_INCOMING_INVITE_STATUS';


export const SetIncomingInvite = (payload) => ({
   type: SET_INCOMING_INVITE,
   payload
});

export const ResetIncomingInvites = () => ({
   type: RESET_INCOMING_INVITES,
});

export const RemoveIncomingInvite = (payload) => ({
   type: REMOVE_INCOMING_INVITE,
   payload
});

export const UpdateIncomingInviteStatus = (payload) => ({
   type: UPDATE_INCOMING_INVITE_STATUS,
   payload
});



const initialState = {
   pending: {},      // Only need to check this one when in Group Forum (If in group, checking groups already checked accepted)
   accepted: {},
   declined: {},
}




export default (state = initialState, { type, payload }) => {
   switch (type) {
      case SET_INCOMING_INVITE:

         const statusCopy = {...state[payload.status]}               // Copy highest status level
         const inviterCopy = statusCopy[payload.inviter] || {}       // Check & Get User ID level
         inviterCopy[payload.groupID] = payload;                     // Set lower level
         return { 
            ...state,
            [payload.status]: {...state[payload.status], [payload.inviter]: inviterCopy },
         }

      case RESET_INCOMING_INVITES:
         return {
            pending: {},     
            accepted: {},
            declined: {},
         }
      
         
      case REMOVE_INCOMING_INVITE:

         const stateCopy = {...state}
         delete stateCopy[payload.status][payload.inviter][payload.groupID]
         return stateCopy;

      case UPDATE_INCOMING_INVITE_STATUS:

         // Delete invite from pending
         const updateStateCopy = {...state}
         delete updateStateCopy['pending'][payload.inviter][payload.groupID]
         
         // Add to new status object
         const update_statusCopy = {...state[payload.status]}
         const update_inviterCopy = update_statusCopy[payload.inviter] || {}
         update_inviterCopy[payload.groupID] = payload
         
         return { 
            ...state,
            [payload.status]: {...state[payload.status], [payload.inviter]: update_inviterCopy },
         }
      default:
         return state;
   }
}
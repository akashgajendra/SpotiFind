


// Invites where INVITER is current user


const SET_OUTGOING_INVITE     = 'SET_OUTGOING_INVITE';
const RESET_OUTGOING_INVITES  = 'RESET_OUTGOING_INVITES';
const REMOVE_OUTGOING_INVITE  = 'REMOVE_OUTGOING_INVITE';
const UPDATE_OUTGOING_INVITE_STATUS    = 'UPDATE_OUTGOING_INVITE_STATUS';



export const SetOutgoingInvite = (payload) => ({
   type: SET_OUTGOING_INVITE,
   payload
});

export const ResetOutgoingInvites = () => ({
   type: RESET_OUTGOING_INVITES
});

export const RemoveOutgoingInvite = (payload) => ({
   type: REMOVE_OUTGOING_INVITE,
   payload
});

export const UpdateOutgoingInviteStatus = (payload) => ({
   type: UPDATE_OUTGOING_INVITE_STATUS,
   payload
});



const initialState = {
   pending: {},      // Only need to check this one when in Group Forum (If in group, checking groups already checked accepted)
   accepted: {},
   declined: {},
}




export default (state = initialState, { type, payload }) => {
   switch (type) {
      case SET_OUTGOING_INVITE:

         const statusCopy = {...state[payload.status]}               // Copy highest status level
         const invitedCopy = statusCopy[payload.invited] || {}       // Check & Get User ID level
         invitedCopy[payload.groupID] = payload;                     // Set lower level
         return { 
            ...state,
            [payload.status]: {...state[payload.status], [payload.invited]: invitedCopy },
         }

      case RESET_OUTGOING_INVITES:
         return {
            pending: {},      
            accepted: {},
            declined: {},
         };
      
      case REMOVE_OUTGOING_INVITE:

         const stateCopy = {...state}
         delete stateCopy[payload.status][payload.invited][payload.groupID]
         return stateCopy;

      case UPDATE_OUTGOING_INVITE_STATUS:

         // Delete invite from pending
         const updateStateCopy = {...state}
         delete updateStateCopy['pending'][payload.invited][payload.groupID]
         
         // Add to new status object
         const update_statusCopy = {...state[payload.status]}
         const update_invitedCopy = update_statusCopy[payload.invited] || {}
         update_invitedCopy[payload.groupID] = payload
         
         return { 
            ...state,
            [payload.status]: {...state[payload.status], [payload.invited]: update_invitedCopy },
         }

      default:
         return state;
   }
}
import { combineReducers } from "redux";

import UsersReducer from './UsersReducer';
import GroupsReducer from "./GroupsReducer";
import WrapperReducer from "./WrapperReducer";
import APIData from "./APIData";
import FriendsReducer from "./FriendsReducer";
import OutgoingInvites from "./OutgoingInvites";
import IncomingInvites from "./IncomingInvites";
import AdminsReducer from "./AdminsReducer";
import DarkModeReducer from "./DarkModeReducer";

const RootReducer = combineReducers({
   users: UsersReducer,
   groups: GroupsReducer,
   wrapper: WrapperReducer,
   apiData: APIData,
   friends: FriendsReducer,
   outgoingInvites: OutgoingInvites,
   incomingInvites: IncomingInvites,
   admins: AdminsReducer,
   dark_mode: DarkModeReducer
});


export default RootReducer;
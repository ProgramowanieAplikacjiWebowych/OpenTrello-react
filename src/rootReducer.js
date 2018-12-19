import { combineReducers } from "redux";

import user from "./reducers/user";
import board from "./reducers/board";

export default combineReducers({
  user,
  board
});

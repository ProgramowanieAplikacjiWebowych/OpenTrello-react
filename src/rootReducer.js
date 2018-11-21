import { combineReducers } from "redux";

import user from "./reducers/user";
import books from "./reducers/books";
import board from "./reducers/board";

export default combineReducers({
  user,
  books,
  board
});

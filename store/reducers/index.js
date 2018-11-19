import { combineReducers } from "redux";

// Reducers
import coffeeReducer from "./coffeeReducer";
import cartReducer from "./cartReducer";
import authReducer from "./authReducer";

export default combineReducers({
  coffee: coffeeReducer,
  cart: cartReducer,
  auth: authReducer
});

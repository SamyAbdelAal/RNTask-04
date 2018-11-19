import * as actionTypes from "./types";
import jwt_decode from "jwt-decode";
import { AsyncStorage } from "react-native";
import axios from "axios";

export const setErrors = errors => ({ type: SET_ERRORS, payload: errors });

const setAuthToken = token => {
  if (token) {
    AsyncStorage.setItem("token", token).then(
      (axios.defaults.headers.common.Authorization = `jwt ${token}`)
    );
  } else {
    AsyncStorage.removeItem("token").then(
      delete axios.defaults.headers.common.Authorization
    );
  }
};

export const checkForExpiredToken = () => {
  return dispatch => {
    const token = AsyncStorage.getItem("token");

    if (token) {
      const currentTime = Date.now() / 1000;
      const user = jwt_decode(token);
      if (user.exp >= currentTime) {
        setAuthToken(token);

        dispatch(setCurrentUser(user));
      } else {
        dispatch(logout());
      }
    }
  };
};

export const loginUser = (userData, history) => dispatch => {
  axios
    .post("http://coffee.q8fawazo.me/api/login/", userData)
    .then(res => res.data)
    .then(user => {
      const decodedUser = jwt_decode(user.token);
      setAuthToken(user.token);
      dispatch(setCurrentUser(decodedUser));

      history.replace("CoffeeList");
    })
    .catch(err => alert(err));
};

export const registerUser = (userData, history) => {
  return dispatch => {
    axios
      .post("http://coffee.q8fawazo.me/api/register/", userData)
      .then(res => res.data)
      .then(user => {
        alert(user);
        dispatch(loginUser(userData, history));
      })
      .catch(err => alert(err));
  };
};

export const logout = history => {
  setAuthToken();
  history.replace("Login");

  return {
    type: actionTypes.LOGOUT_USER
  };
};

const setCurrentUser = user => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: user
});

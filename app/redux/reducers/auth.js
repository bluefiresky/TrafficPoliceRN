/**
 *
 * wuran on 17/1/10.
 */
import { POST_USER_LOGIN_PHONE, POST_USER_LOGOUT } from '../../service/contract.js';

const initial = {
  token : null,
  isLogin : false,
  userId: -1,
  userName: null
}

export const auth = (state = initial, action) => {
  switch(action.type) {
    case POST_USER_LOGIN_PHONE :
      let { sessionId } = action.data;
      let auth = { token: sessionId, isLogin: true };
      global.auth = auth;
      return auth;
    case POST_USER_LOGOUT :
      global.auth = {...initial};
      return {...initial};
    case "LOGIN_FAIL" :
      global.auth = {...initial};
      return {...initial};
  }
  return state;
}

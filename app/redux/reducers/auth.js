/**
 *
 * wuran on 17/1/10.
 */
import { POST_USER_LOGIN, POST_USER_LOGOUT } from '../../service/contract.js';

const initial = {
  token : null,
  isLogin : false,
  userId: -1,
}

export const auth = (state = initial, action) => {
  switch(action.type) {
    case POST_USER_LOGIN :
      let data = action.data.data;
      let auth = { token : data.token, isLogin : true, userId: data.userId, userName: data.mobilePhone };
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

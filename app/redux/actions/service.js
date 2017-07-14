/**
 * Created by wuran on 16/1/3.
 * 用于出发连网操作的 action ，
 * 其结果根据需要，用dispatch({type: ...}) 的方式，
 * 通过redux对获取的数据进行本地化，即state保存和更新
 *
 * 使用方式：
 * @param name 在service类型的文件中的连网函数名：service/user.js -->> function login(){...}
 * @param params params 连网函数所需参数，使用es6语法，保持所有参数名一致
 *
 * 1. 在view页面:
 *   this.props.dispatch( create_service(USER_LOGIN, {mobile : 18610330551, password : '123456'} ))
 *  .then(data => {
 *  })
 * 2. in reducer:
 *  switch (action.type){
 *   ....
 *    case USER_LOGIN :
 *    return ...
 *  }
 */
import Toast from '@remobile/react-native-toast';

import { XIN_SERVICE_ENV } from "../../configs/index.js";
import { getStore } from "../index.js";

import * as mocks from "../../service/mock/index.js";
import * as dists from "../../service/dist/index.js";

import * as Contract from '../../service/contract.js';

export function create_service(name, ...params) {

  console.log('%c create_service the name: -- ' + name + ' -- && and the params -->> ', 'color:limegreen', params);

  let promise = null
  try{
    promise = call_service(name, ...params)
  } catch(ex) {
    console.error(ex)
  }

  // console.log('%c create_service after call_service and the promise -->> ', 'color:limegreen', promise);
  if(!promise) {
    return
  }else{
    return dispatch => {
      return dispatch_reducers(dispatch, promise, name, params);
    }
  }

}

/**
 * 用于联网后　需要 reducer 保存　data　到　state
 */
function dispatch_reducers(dispatch, promise, name, params){
  // dispatch({ type : name + "@Init", requestParams : params });
  const nPromise =
    promise.then( data => {
      if (data.terminate){
        console.log('%c create_service terminate === true and doing ## LOGIN_FAIL ##', 'color:red');
        dispatch({ type : "LOGIN_FAIL" });
      }else{
        if (data.success){
          dispatch({ type : name, requestParams : params, data: data.data });
          return data.data;
        }else{
          Toast.showShortCenter(data.message)
        }
      }
    }).catch( error => {
      console.log('%c create_service && catch error -->> ', 'color:red', error);
    })

  return nPromise
}

function filterDispatch(dispatch, name, params, data){
  if((name === Contract.POST_ACHIEVE_DICTIONARY) && (data.updateFlag === 0)) return;
  console.log(' filterDispatch and the name -->> ', name);
  dispatch({ type : name, requestParams : params, data });
}

/**
 * 用于映射到　正式的连网函数，后获取结果
 */
const forceMocks = [
  // AUDIT_LOGIN
]

function call_service(name, ...params) {
  let env = XIN_SERVICE_ENV;

  if(forceMocks.indexOf(name) !== -1){
    env = 'mock'
  };

  name = name.toLowerCase();
  if(env === 'mock') {
    if( !mocks[name] ) {
      throw 'mock service ' + name + " undefined.";
    }
    return mocks[name].apply(null, params)
  } else if( env === 'dist' ) {
    if( !dists[name] )  {
      throw 'dist service ' + name + " undefined."
    }
    return dists[name].apply(null, params)
  }
}

import qs from "qs";
import 'whatwg-fetch';
import md5 from 'md5';
import R from 'ramda';

import { XIN_SERVICE_URL, XIN_REQ_TIMEOUT, XIN_APISIGN_CLIENTID, XIN_APISIGN_STR, XIN_CURRENT_TIME } from '../configs/index.js';
import { getStore } from "../redux/index.js";

// 生成可用url
const service_url = (path, more) => {
  return XIN_SERVICE_URL + path
}

// http 类型定义
const http_post = http_factory({method : "POST", paramsType : "json"})
const http_get = http_factory({method : "GET", paramsType : "query"})
const http_put = http_factory({method : "PUT", paramsType : "json"})

// 过滤不用token的url
const exceptPath = [
  service_url('/verify/send'), service_url('/user/register'), service_url('/user/shortcutlogin'), service_url('/user/login'),
  service_url('/user/thirdlogin')
]

function filterPath(path, method){
  Array.prototype.contains = function(item){
    return RegExp(item).test(this);
  };
  return exceptPath.contains(path);
}

function http_factory({method, paramsType}) {

  return async (path, params, version = '1') => {
    const state = getStore().getState()
    if(!filterPath(path, method) && !state.auth.isLogin) return {terminate: true};
    const auth = state.auth;

    /** 形成service头和数据包 */
    const meta = {
      method : method,
      timeout : XIN_REQ_TIMEOUT,
      headers : {
        'DIVERSION-VERSION': version,
        'SESSION-TOKEN': auth.token,
        PLATFORM: 'api',
        Uid: auth.userId
      }
    }

    if(paramsType === 'json') {
      meta.body = JSON.stringify(params)
    } else if (paramsType === 'query') {
      const query = qs.stringify(params)
      if(query) {
        path += "?" + query
      }
    }

    /** 开始连网获并取返回数据 */
    console.log('%c service_helpers ## path: ## ' + path + ' ## meta -->> ', 'color:limegreen', meta);
    try{
      const response = await fetch(path, meta);
      console.log('%c service_helpers resopnse-stauts -->> ', 'color:limegreen', response.status );

      if (response.status === 401) {
        return { terminate : true };
      }

      if(response.status >= 400) {
        if(response.status === 404) {
          return { success : false, data : null, message: '系统错误' };
        }else{
          return { success : false, data : null, message : '网络请求错误' }
        }
      }

      if(response.status >= 201 && response.status < 300) {
        return { success : true, data : null };
      }

      const text = await response.text()
      // console.log('%c service_helpers response-text -->> ', 'color:limegreen', text);
      if (response.status == 200 && text.length == 0) {
        return { success : true, data : null };
      }

      const jsonData = JSON.parse(text)
      console.log('%c service_helpers response-jsonData -->> ', 'color:limegreen', jsonData);
      if(response.status == 200){
        let code = jsonData.code;
        if(code == 2000){
          return { success : true, data : jsonData.data };
        } else {
          if(code == 4010 || code == 4100){
            return {terminate: true}
          }
          return { success : false, code: code, message: jsonData.message }
        }
      }else{
        return { success : false, code : jsonData.code, message : jsonData.message };
      }


    }catch(ex) {
      console.log('%c service_helpers fetch error -->> ', 'color:red', ex);
      return { success : false, code : 400, message : "网络请求错误" };
    }

    return jsonData
  }
}

function object2pairs(obj, from, timestamp){
  const pairs = []
  pairs.push({key: 'params', value: JSON.stringify(obj)})
  // pairs.push({key: 'params', value: JSON.stringify({id: '114', content: '反馈内容'})})
  pairs.push({key: 'from', value: from});
  pairs.push({key: 'timestamp', value: timestamp});

  return pairs
}

function sign(params, from, timestamp){

  const pairs = object2pairs(params, from, timestamp)
  const sortByKey = R.sortBy(R.prop('key'))
  const sortedPairs = sortByKey(pairs)

  let str = XIN_APISIGN_STR
  sortedPairs.map(item => {
    str += item.key + '' + item.value
  })
  str += XIN_APISIGN_STR

  // console.log('before md5 sign str -->> ', str);
  let sign = md5(str);
  // console.log('after md5 sign str -->> ', sign);
  return sign;
}

function resolve_url_into_parts( url ) {
  return url.match(/([^/]+)/g)
}

function getFormData( params ) {

  const f = new window.FormData()
  for(let key in params ) {
    if (params.hasOwnProperty(key)) {
      f.append(key, params[key])
    }
  }
  return f
}


function normalize_response( reject) {

  return response => {
    if (response.status >= 200 && response.status < 300 ) {
      return response.json()
    }

    const error = {result_code : -1, error_msg : `[${response.status}]${response.statusText}`}
    reject(error)
  }
}


function normalize_data(resolve, reject) {

  return data => {
    if(!data) { return }
    if (data.result_code !== 0) {
      reject(data)
    }
    else{
      resolve(data.data)
    }
  }
}



function pending_test( url ) {
  let I = setInterval( () => {
    console.error("request is pending ...", url)
  }, 2000)
  return I
}

function stop_pending( I ) {
  return data => {
    clearInterval(I)
    return data
  }
}

export { http_get, http_post, http_put, service_url }

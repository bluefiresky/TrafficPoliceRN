/**
 * create by wuran
 * 用于文字相关的辅助工具
 */

'use strict';

/**  正则  **/
// phone && number 正确:true -- 错误:false

export function checkNumber(value){
  return _checkNumber(value);
}

export function checkPhone(phone){
  return (!!phone && phone.indexOf(1) === 0 && phone.length === 11)
  return _checkNumber(phone);
}

export function checkLength(value, max = 10, min = 0){
  return (!!value && !(value.length < min) && !(value.length > max))
}

export function checkHanZi(value){
  if(!value) return false;

  let reg = /[0-9a-zA-Z，。；、……！：“”、？]/g
  return !reg.test(value);
}

export function checkNumberAndLetters(value){
  let reg = /^[0-9a-zA-Z]*$/
  return reg.test(value);
}

function _checkNumber(value){
  let reg = /^[0-9]*$/
  return reg.test(value);
}

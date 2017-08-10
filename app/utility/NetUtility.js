/**
 * creat by wuran
 */

'use strict';

import { Platform, NetInfo } from 'react-native';

const IsIos = Platform.OS === 'ios';

// return wifi, cell, none, unknown
export async function getCurrentNetInfo(){
  try {
    let info = await NetInfo.fetch();
    console.log('%c NetUtility execute getCurrentNetInfo and the info -->> ' , 'color:dodgerblue', info);
    if(info == 'MOBILE') return 'cell';
    else if(!IsIos) info = info.toLowerCase();
    return info;
  } catch (e) {
    console.log('%c NetUtility getCurrentNetInfo catch error -->> ' , 'color:red', e.message);
  }
}

// return wifi, cell, none, unknown
export async function getCurrentNetIsConnect(){
  try {
    let isConnected = await NetInfo.isConnected.fetch();
    console.log('%c NetUtility execute getCurrentNetIsConnect and the isConnected -->> ' , 'color:dodgerblue', isConnected);
    return isConnected;
  } catch (e) {
    console.log('%c NetUtility getCurrentNetIsConnect catch error -->> ' , 'color:red', e.message);
  }
}

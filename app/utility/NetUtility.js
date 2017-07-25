/**
 * creat by wuran
 */

'use strict';

import { Platform, NetInfo } from 'react-native';

const IsIos = Platform.OS === 'ios';

// return wifi, cell, none
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

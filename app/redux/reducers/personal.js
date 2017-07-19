/**
 *
 * wuran on 17/1/10.
 */
import { GET_USER_INFO } from '../../service/contract.js';
const CLEAR_USER_INFO = 'CLEAR_USER_INFO';

const initial = {
  policeType: -1,     // 2:交警，3:协警
  policeName: null,
  mobile: null,
  depName: null,      // 所属大队
  depCode: null,      // 所属大队编号
  policeNumber: null, // 警员编号
  sealNumber: null,   // 勘查章号
  depSealUrlBase64: null,  // 大队章base64
  depSealUrl: null,   // 大队章URL
  sealUrlBase64: null,     // 勘查章base64
  sealUrl: null,      // 勘查章URL
  cityName: null,     // 所属城市
  cityCode: null,     // 所属城市code
  provinceShortName: null, // 省份简称
  depTelephone:null,  // 交警大队电话
}

export const personal = (state = initial, action) => {
  switch(action.type) {
    case GET_USER_INFO :
      let { policeType, policeName, mobile, depName, policeNumber, sealNumber, depSealUrlBase64, sealUrlBase64, cityName, cityCode, provinceShortName, depCode, depSealUrl, depTelephone, sealUrl } = action.data;
      let personal = { policeType, policeName, mobile, depName, policeNumber, sealNumber, depSealUrlBase64, sealUrlBase64, cityName, cityCode, provinceShortName, depCode, depSealUrl, depTelephone, sealUrl };
      global.personal = personal;
      return personal;
    case CLEAR_USER_INFO :
      global.personal = {...initial};
      return {...initial}
  }
  return state;
}

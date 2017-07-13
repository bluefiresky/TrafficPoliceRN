/**
 *
 * wuran on 17/1/10.
 */
import { POST_ACHIEVE_DICTIONARY } from '../../service/contract.js';
const CLEAR_USER_INFO = 'CLEAR_ACHIEVE_DICTIONARY';

const initial = {
  carTypeList: null,     // 车辆类型集合{name:''}
  damagedList: null,     // 受损部位集合{name:'',code:''}
  formList: null,        // 事故形态集合{name:'',code:''}
  weatherList: null,     // 天气集合{code:'',name:''}
  insureList: null,      // 保险公司集合{inscomname:'',inscomcode:'',insphone:'',insreporttel:''}
  situationList: null,   // 事故情形集合{name:'',code:''}
  updateFlag: -1, // 0无， 1有
  version: 0,    // 字典版本
  helpUrl: null
}

export const dictionary = (state = initial, action) => {
  switch(action.type) {
    case POST_ACHIEVE_DICTIONARY :
      let { carTypeList, damagedList, formList, weatherList, insureList, situationList, updateFlag, version, helpUrl } = action.data;
      if(updateFlag === 1)
        return { carTypeList, damagedList, formList, weatherList, insureList, situationList, updateFlag, version, helpUrl };
      else return state;
    case CLEAR_USER_INFO :
      return {...initial}
  }
  return state;
}

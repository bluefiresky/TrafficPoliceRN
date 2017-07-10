/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-无属性通用接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 强制更新 **/
export const post_forced_update = ({appType, appVersion, version}) => {
  return http_post( 'forced.update', {appType, appVersion}, {}, version )
}

/** 获取字典 **/
export const post_achieve_dictionary = ({v, version}) => {
  return http_post( 'dictionary.get', {version: v}, {}, version )
}

/** 提交意见反馈 **/
export const post_advice_add = ({adviceContent, contactMobile, version}) => {
  return http_post( 'advice.add', {adviceContent, contactMobile}, {}, version )
}

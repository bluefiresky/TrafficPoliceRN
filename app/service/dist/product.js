/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-产品相关其他接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 强制更新 **/
export const post_forced_update = ({appType, appVersion, version}) => {
  return http_post( 'forced.update', {appType, appVersion}, {}, version )
}

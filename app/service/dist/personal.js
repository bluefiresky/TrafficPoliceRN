/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-个人相关接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 获取用户信息 ## action:[ '0' ] */
export const get_user_info = ({version}) => {
  return http_get( 'police.get', {}, {}, version )
}

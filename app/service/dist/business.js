/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-业务相关接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 发送验证码 ## action:[ '0' ] */
export const post_send_dynamic_check_code2 = ({mobile, action}) => {
  return http_post( service_url('/verify/send'), {mobile, action} )
}
/** 获取版本号　## from: [] */
export const get_user_register2 = ({params1, params2}) => {
  return http_get( service_url('/version'), {params1, params2} )
}

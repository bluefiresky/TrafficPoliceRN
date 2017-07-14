/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-授权登录相关
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 发送验证码 ## smsType -> 1:文字;2:语音 */
export const post_send_dynamic_check_code = ({mobile, smsType, version}) => {
  return http_post( 'login.send.sms', {mobile, smsType}, {}, version )
}

/** 发送验证码 ## smsType -> 1:文字;2:语音 */
export const post_send_dynamic_check_code_session = ({mobile, smsType, version}) => {
  return http_post( 'send.sms', {mobile, smsType}, {}, version )
}

/** 校验多个手机号和验证码  */
export const post_sms_codes_check = ({mobileCodeMap, version}) => {
  return http_post( 'sms.codes.check', {mobileCodeMap}, {}, version )
}

/** 注册　## from: [] */
// export const post_user_register = ({code, password, mobile, userSource, version}) => {
//   return http_post( service_url('/user/register'), {code, password, mobile, userSource}, version )
// }
/** 用户登录 */
export const post_user_login_phone = ({mobile, smsCode, version}) => {
  return http_post( 'police.login', {mobile, smsCode}, {}, version )
}

/** 用户退出登录 */
export const post_user_logout = ({version}) => {
  return http_post( 'police.logout', {}, {}, version )
}

/** 用户登录-账号登录　*/
// export const post_user_login_account = ({identity, password, version}) => {
//   return http_post( service_url('/user/login'), {identity, password}, version )
// }

/** 用户登录-第三方登录　*/
// export const post_user_login_third = ({phoneNumber, password, version}) => {
//   return http_post( service_url('/user/thirdlogin'), {phoneNumber, password}, version )
// }

/** 重置密码 */
// export const post_reset_password = ({phoneNumber, password, code, versions}) => {
//   return http_post( service_url('/users/password'), {phoneNumber, password, code}, versions )
// }

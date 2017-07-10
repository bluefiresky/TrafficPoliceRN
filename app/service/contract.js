/**
 * Created by wuran on 17/1/9.
 * 接口名定义文件
 */

export const UPLOAD_IMAGE = 'upload_image';

/*
 * Auth 相关接口名
 */
export const POST_SEND_DYNAMIC_CHECK_CODE = 'post_send_dynamic_check_code';   // 发送手机验证码
// export const POST_USER_REGISTER = 'post_user_register';                       // 注册
export const POST_USER_LOGIN_PHONE = 'post_user_login_phone';                 // 登录-手机
// export const POST_USER_LOGIN_ACCOUNT = 'post_user_login_account';             // 登录-账号
// export const POST_USER_LOGIN_THIRD = 'post_user_login_third';                 // 登录-第三方
// export const POST_RESET_PASSWORD = 'post_reset_password';                     // 重置密码
export const POST_USER_LOGOUT = 'post_user_logout';                           // 退出登录

/*
 * Personal 相关接口名
 */
export const GET_USER_INFO = 'get_user_info';                                 // 获取个人信息
export const POST_FORCE_UPDATE = 'post_forced_update';                        // 强制更新
export const POST_ACHIEVE_DICTIONARY = 'post_achieve_dictionary';             // 获取字典

/*
 * Main 相关接口名
 */
export const POST_ACCIDENTS_SEARCH = 'post_accidents_search';                 // 获取历史案件列表
/*
 * Common 相关接口名
 */
export const POST_ADVICE_ADD = 'post_advice_add';                             // 意见反馈

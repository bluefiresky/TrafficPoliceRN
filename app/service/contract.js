/**
 * Created by wuran on 17/1/9.
 * 接口名定义文件
 */

export const UPLOAD_IMAGE = 'upload_image';

/*
 * Auth 相关接口名
 */
export const POST_SEND_DYNAMIC_CHECK_CODE = 'post_send_dynamic_check_code';   // 发送手机验证码
export const POST_SEND_DYNAMIC_CHECK_CODE_SESSION = 'post_send_dynamic_check_code_session';   // 发送手机验证码(需session)
export const POST_SMS_CODES_CHECK = 'post_sms_codes_check';                    // 校验多个手机号和验证码
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
export const POST_ACCIDENT_DETAILS = 'post_accident_details';                 // 获取历史案件详情
export const GET_REMOTE_FIXDUTY_RESULT = 'get_remote_fixduty_result';         // 获取远程定责结果
export const POST_GENERATE_DUTYCONFIRMATION = 'post_generate_dutyconfirmation'; // 协警生成认定书
export const POST_UPLOAD_ACCIDENT_FILE = 'post_upload_accident_file';         // 上传离线zip
/*
 * Common 相关接口名
 */
export const POST_ADVICE_ADD = 'post_advice_add';                             // 意见反馈

/*
 * 保险报案 相关接口名
 */
 export const POST_ACCIDENT_PERSON = 'post_accident_person';        // 保险报案1-确认报案当事人信息
 export const POST_INSURE_DICTIONARY = 'post_insure_dictionary';   //保险报案2-获取保险数据字典
 export const POST_INSURE_INFO = 'post_insure_info';               //保险报案3-提交保险报案信息接口
 export const POST_SURVEY_FLAG = 'post_survey_flag';               //保险报案4-获取保险报案信息是否需要查勘接口
 export const POST_SURVEY_DETAIL = 'post_survey_detail';           //保险报案5-获取查勘详情接口
 export const POST_SURVEY_INFO = 'post_survey_info';               //保险报案6-提交查勘基本信息接口
 export const POST_SURVEYPHOTO_INFO = 'post_surveyphoto_info';     //保险报案7-提交查勘照片信息接口
 export const POST_SURVEY_FINISH = 'post_survey_finish';           //保险报案8-提交确认查勘完成接口
 export const POST_SURVEYCHO_INFO = 'post_surveyecho_info';        //保险报案9-获取查勘页面回显信息接口
 export const POST_SURVEY_PHOTOS = 'post_survey_photos';           //保险报案10-获取查勘历史照片接口

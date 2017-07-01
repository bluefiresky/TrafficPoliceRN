/**
 *
 * Created by wuran on 17/1/9.
 * 信分期 Service 相关配置
 */

/** 请求服务环境 @type {string} */
export const XIN_SERVICE_ENV = 'dist';  // 连网真实环境
// export const XIN_SERVICE_ENV = 'mock';　// app本地测试环境

/** 请求超时设置 @type {number} */
export const XIN_REQ_TIMEOUT = 10000

/** 请求服务的url @type {string} */
export const XinConfigTitle = "Dev"
// export const XIN_SERVICE_URL = 'https://api.accidentx.zhongchebaolian.com/'
export const XIN_SERVICE_URL = 'http://10.214.175.123:8080/police-api-web/router'
export const XIN_APISIGN_STR = '021711ea-3578-4408-91c0-8f3728964094'
export const XIN_CURRENT_TIME = () => {
  // return new Date("2021/02/08 18:16:13").getTime();
  return Date.parse(new Date());
}

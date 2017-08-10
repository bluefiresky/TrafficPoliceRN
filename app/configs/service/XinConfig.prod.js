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
export const XinConfigTitle = "Prod"
export const XIN_SERVICE_URL = 'https://api.accidentx.zhongchebaolian.com/police-api-web/router' /** 后台访问url */
export const XIN_APISIGN_STR = '021711ea-3578-4408-91c0-8f3728964094'     /** 后台访问验签用到 */
export const XIN_CURRENT_TIME = () => {                               /** 后台访问验签用到的时间戳 */
  return Date.parse(new Date());
}

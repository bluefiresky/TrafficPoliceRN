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
export const XIN_SERVICE_URL = 'https://api.xinfenqi.com/app' /** 后台访问url */
export const XIN_FIRSTP2P_CALLBACK = 'https://api.xinfenqi.com'       /** 获取网信理财用户交互 */
export const XIN_FIRSTP2P_2D = 'http://pub-xfqweb.ncfgroup.org'       /** 扫描，商品二维码的url */
export const XIN_SERVICE_PRODUCT = 'http://store.xinfenqi.com'        /** 没用上 */
export const XIN_FIRSTP2P_UCF = "http://www.firstp2p.com/bind/check"  /** 没用上 */
export const XIN_FIRSTP2P_SALT = 'bb96e88250bd01e1dd518608be144a4a'   /** 生成网信理财访问url用到 */
export const XIN_FIRSTP2P_CLIENT_ID = 'd6e7fefffbfa073c619b9345'      /** 生成网信理财访问url用到 */
export const XIN_APISIGN_CLIENTID = 'xinfenqi_ysukafyklhpyiwnx'       /** 没用上 */
export const XIN_APISIGN_STR = 'FcSRcblYPRyO3iCI^uzsXt*5h$NbAcue'     /** 后台访问验签用到 */
export const XIN_CURRENT_TIME = () => {                               /** 后台访问验签用到的时间戳 */
  return Date.parse(new Date());
}


export const XIN_SERVICE_URL_CRASH = 'https://api.xinfenqi.com/cash/api/v1/'

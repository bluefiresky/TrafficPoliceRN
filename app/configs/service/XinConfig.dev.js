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
export const XIN_SERVICE_URL = 'http://api.zhongchou.com'

export const XIN_FIRSTP2P_CALLBACK = 'http://dev-xfqweb.ncfgroup.org'
export const XIN_FIRSTP2P_2D = 'http://dev-xfqweb.ncfgroup.org'
export const XIN_SERVICE_PRODUCT = 'http://dev-xfqweb.ncfgroup.org'
export const XIN_FIRSTP2P_UCF = "http://test07.firstp2plocal.com/bind/check"
export const XIN_FIRSTP2P_SALT = 'dd2fc3e6ebe5ff234f14da479e02ccc6'
export const XIN_FIRSTP2P_CLIENT_ID = '1d26fd7db15f859dac5ec859'
export const XIN_APISIGN_CLIENTID = 'xinfenqi_ysukafyklhpyiwnx'
export const XIN_APISIGN_STR = '2WDsw9aI6sNFE'
export const XIN_CURRENT_TIME = () => {
  // return new Date("2021/02/08 18:16:13").getTime();
  return Date.parse(new Date());
}


export const XIN_SERVICE_URL_CRASH = 'http://dev-xinpay.ncfgroup.org/cash/api/v1/'

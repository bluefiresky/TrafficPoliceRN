/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-主业务接口
 */

import { http_get, http_post, service_url, http_post_file } from "../service_helpers";

/** 保险报案1-确认报案当事人信息 */
export const post_accident_person = ({taskNum, version}) => {
  return http_post( 'accident.person', {taskNum}, {}, version )
}
/** 保险报案2-获取保险数据字典 */
export const post_insure_dictionary = ({version}) => {
  return http_post( 'insure.dictionary', {}, {}, version )
}
/** 保险报案3-提交保险报案信息接口 */
export const post_insure_info = ({taskno,data,version}) => {
  return http_post( 'insure.info', {taskno,data}, {}, version )
}
/** 保险报案4-获取保险报案信息是否需要查勘接口 */
export const post_survey_flag = ({taskno,version}) => {
  return http_post( 'survey.flag', {taskno}, {}, version )
}
/** 保险报案5-获取查勘详情接口 */
export const post_survey_detail = ({taskno,version}) => {
  return http_post( 'survey.detail', {taskno}, {}, version )
}
/** 保险报案6-提交查勘基本信息接口 */
export const post_survey_info = ({taskno,surveytime,groupname,policetypen,policename,policephone,data,version}) => {
  return http_post( 'survey.info', {taskno,surveytime,groupname,policetypen,policename,policephone,data}, {}, version )
}
/** 保险报案7-提交查勘照片信息接口 */
export const post_surveyphoto_info = ({surveyno,licenseno,photodata,pid,typecode,partcode,plat,plng,pfrom,uploadtime,appsource,version}) => {
  return http_post( 'surveyphoto.info', {surveyno,licenseno,pid,typecode,partcode,plat,plng,pfrom,uploadtime,appsource}, {photodata}, version )
}
/** 保险报案8-提交确认查勘完成接口 */
export const post_survey_finish = ({surveyno,version}) => {
  return http_post( 'survey.finish', {surveyno}, {}, version )
}
/** 保险报案9-获取查勘页面回显信息接口 */
export const post_surveyecho_info = ({taskno,version}) => {
  return http_post( 'surveyecho.info', {taskno}, {}, version )
}
/** 保险报案10-获取查勘历史照片接口 */
export const post_survey_photos = ({taskno,version}) => {
  return http_post( 'survey.photos', {taskno}, {}, version )
}

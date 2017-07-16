/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-主业务接口
 */

import { http_get, http_post, service_url, http_post_file } from "../service_helpers";

/** 获取历史案件列表 */
export const post_accidents_search = ({page, pageNum, startDate, endDate, version}) => {
  return http_post( 'accidents.search', {}, {page, pageNum, startDate, endDate}, version )
}

/** 获取历史案件详情 */
export const post_accident_details = ({taskNo, version}) => {
  return http_post( 'accident.details', {taskNo}, {}, version )
}

/** 上传案件zip */
export const post_upload_accident_file = ({appSource, fileName, file, version}) => {
  return http_post( 'upload.accident.file', {appSource, fileName}, {file}, version )
}

/** 获取远程定责结果 */
export const get_remote_fixduty_result = ({taskNo, version}) => {
  return http_get( 'remote.fixduty.result', {taskNo}, {}, version )
}

/** 协警生成责任认定书 */
export const post_generate_dutyconfirmation = ({taskNo, signatureList, version}) => {
  return http_post( 'generate.dutyconfirmation', {taskNo}, {signatureList}, version )
}

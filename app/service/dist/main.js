/**
 * Created by wuran on 16/1/3.
 * 真实连网函数-主业务接口
 */

import { http_get, http_post, service_url } from "../service_helpers";

/** 获取历史案件列表 */
export const post_accidents_search = ({page, pageNum, startDate, endDate, version}) => {
  return http_post( 'accidents.search', {}, {page, pageNum, startDate, endDate}, version )
}

/** 获取历史案件详情 */
export const post_accident_details = ({taskNo, version}) => {
  return http_post( 'accident.details', {taskNo}, {}, version )
}

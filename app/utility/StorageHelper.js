/**
 * creat by wuran
 */

'use strict';

export class StorageHelper{

  static create({id, basic}){
    global.currentCaseId = id;
    global.storage.save({key: global.personal.mobile, id, data:{id, basic}})
  }

  // 照片信息
  static saveStep1(photo){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        let { id, basic } = res;
        global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo } })
      })
  }

  // 协警处理方式 01：交警单车 02：交警多车 03：协警单车 04：协警多车无争议 05：协警多车有争议
  static saveHandleWay(handleWay){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo } = res;
        global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo, handleWay } })
      })
  }

  // 当事人信息
  static saveStep2(person){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay } = res;
        global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo, handleWay, person } })
      })
  }

  // 证件信息
  static saveStep3(credentials){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay, person } = res;
        global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo, handleWay, person, credentials } })
      })
  }

  // 确认之前信息
  static saveStep4({id, basic, photo, handleWay, person, credentials, sign}){
    global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo, handleWay, person, credentials, sign } })
  }

  // 事故事实
  static saveStep5({supplementary, conciliation}){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay, person, credentials, sign } = res;
        global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation } })
      })
  }

  // 责任信息
  static saveStep6(duty){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation } = res;
        global.storage.save({key: global.personal.mobile, id, data:{ id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty } })
      })
  }

  static getCurrentCaseInfo(callback){
    global.storage.load({key: global.personal.mobile, id:global.currentCaseId})
      .then( res => {
        callback(res);
      })
      .catch(e => {
        console.log(' StorageHelper getCurrentCaseInfo catch error the errMessage -->> ', e.message);
        callback(null)
      })
  }

}

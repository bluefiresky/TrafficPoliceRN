/**
 * creat by wuran
 */

'use strict';

export class StorageHelper{

  static create({id, basic}){
    global.currentCaseId = id;
    global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{id, basic}})
  }

  // 照片信息
  static saveStep1(photo){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo } })
      })
  }

  // 第二步与第三步合成(交警步骤需要第二，第三步合成)
  // 处理方式 01：交警单车 02：交警多车 03：协警单车 04：协警多车无争议 05：协警多车有争议
  static saveStep2_3(handleWay, person){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, person, handleWay } })
      })
  }

  // 处理方式 01：交警单车 02：交警多车 03：协警单车 04：协警多车无争议 05：协警多车有争议
  static saveStep2(handleWay){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, person, handleWay } })
      })
  }

  // 当事人信息
  static saveStep3(person){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, handleWay, person } })
      })
  }

  // 证件信息
  static saveStep4(credentials){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay, person } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, handleWay, person, credentials } })
      })
  }

  // 确认之前信息
  static saveStep5({id, basic, photo, handleWay, person, credentials, sign}){
    global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, handleWay, person, credentials, sign } })
  }

  // 事故事实
  static saveStep6({supplementary, conciliation}){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay, person, credentials, sign } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation } })
      })
  }

  // 责任信息
  static saveStep7(duty){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty } })
      })
  }

  // 获取一条案件数据详情
  static async getCurrentCaseInfo(){
    try {
      return await global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
    } catch (e) {
      console.log(' StorageHelper getCurrentCaseInfo and catch error -->> ', e.message);
      return null;
    }
  }

  // 转存未完成的数据到未上传列表
  static saveAsUnUploaded({ id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty }){
    global.storage.save({key: global.personal.mobile + 'unuploaded', id, data:{id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty}})
    global.storage.remove({key:global.personal.mobile + 'uncompleted', id})
  }

}

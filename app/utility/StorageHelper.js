/**
 * creat by wuran
 */

'use strict';

export class StorageHelper{

  /*
    basic: {
      address: '000测试-北京市朝阳区百子湾南二路78号院-3',
      accidentTime: '2017-07-11 17:10:00',
      latitude: '39.90167',
      longitude: '116.473731',
      weather: '1'
    }
  */
  static create({id, basic}){
    global.currentCaseId = id;
    global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{id, basic}})
  }

  // 照片信息
  /**
    photoList:[
      {
        photoData: 'base64',
        "photoType": "0",
          0	侧前方 1	侧后方, 2	碰撞部位,
          30	甲方驾驶证, 31	甲方行驶证, 32	乙方驾驶证, 33	乙方行驶证, 34	丙方驾驶证, 35	丙方行驶证,
          51  其它现场照片1, 52  其它现场照片2, 53  其它现场照片3 .....
        "photoDate": "2017-07-08 08:33:10"
      },
      ...
    ]
  **/
  static saveStep1(photo){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo } })
      })
  }

  // 第二步与第三步合成(交警步骤需要第二，第三步合成)
  /*
    处理方式 handleWay: 01：交警单车 02：交警多车 03：协警单车 04：协警多车无争议 05：协警多车有争议
    person:[
        {
            "name": "王五",
            "phone": "15010955030",
            "licensePlateNum": "冀CWA356",
            "insureCompanyCode": "110000003003",
            "insureCompanyName": "中国太平洋财产保险股份有限公司",
            "driverNum": "111222121333636666",
            "carType": "小型载客汽车",
            "carInsureNumber": "223369",
            "carInsureDueDate": "2018-04-10",
            "carDamagedPart": "1,3"
        }
    ]
  */
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

  // 证件照信息
  /**
    credentials:[
      {
        photoData: 'base64',
        "photoType": "0",
          0	侧前方 1	侧后方, 2	碰撞部位,
          30	甲方驾驶证, 31	甲方行驶证, 32	乙方驾驶证, 33	乙方行驶证, 34	丙方驾驶证, 35	丙方行驶证,
          51  其它现场照片1, 52  其它现场照片2, 53  其它现场照片3 .....
        "photoDate": "2017-07-08 08:33:10"
      },
      ...
    ]
  **/
  static saveStep4(credentials){
    global.storage.load({key: global.personal.mobile + 'uncompleted', id:global.currentCaseId})
      .then( res => {
        let { id, basic, photo, handleWay, person } = res;
        global.storage.save({key: global.personal.mobile + 'uncompleted', id, data:{ id, basic, photo, handleWay, person, credentials } })
      })
  }

  // 确认之前信息
  /**
    sign:[
        {
            "phone": "15010955030",
            "signData": "base64",
            "signTime": "2017-07-08 08:37:19"
        }
    ]
  **/
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
  /**
    duty:[
        {
            "licensePlateNum": "冀CWA356",
            "dutyType": "0",
            "signData": "",
            "signTime": "2017-07-08 08:39:20",
            "refuseFlag": "01"
        }
    ]
  **/
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

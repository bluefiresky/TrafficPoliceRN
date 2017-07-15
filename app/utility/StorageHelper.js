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
  static create({basic}){
    let key = global.personal.mobile + 'uncompleted';
    let id = String(new Date().getTime());
    let data = {id, basic};
    console.log('%c StorageHelper execute create -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

    global.currentCaseId = id;
    global.storage.save({ key, id, data })
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
  static async saveStep1(photo){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, photo}
      console.log('%c StorageHelper execute saveStep1 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep1 and the message -->> ', 'color:red',e.message);
    }
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
  static async saveStep2_3(handleWay, person){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, handleWay, person}
      console.log('%c StorageHelper execute saveStep2_3 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep2_3 and the message -->> ', 'color:red',e.message);
    }
  }

  // 处理方式 01：交警单车 02：交警多车 03：协警单车 04：协警多车无争议 05：协警多车有争议
  static async saveStep2(handleWay){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, handleWay}
      console.log('%c StorageHelper execute saveStep2 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep2 and the message -->> ', 'color:red',e.message);
    }

  }

  // 当事人信息
  static async saveStep3(person){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, person}
      console.log('%c StorageHelper execute saveStep3 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep3 and the message -->> ', 'color:red',e.message);
    }

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
  static async saveStep4(credentials){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, credentials}
      console.log('%c StorageHelper execute saveStep4 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep4 and the message -->> ', 'color:red',e.message);
    }

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
  static async saveStep5({id, basic, photo, handleWay, person, credentials}){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let itemId = global.currentCaseId;
      let data = {id, basic, photo, handleWay, person, credentials}
      console.log('%c StorageHelper execute saveStep5 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id:itemId, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep5 and the message -->> ', 'color:red',e.message);
    }

  }

  // 事故事实
  static async saveStep6({supplementary, conciliation, localDutyList}){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, supplementary, conciliation, localDutyList}
      console.log('%c StorageHelper execute saveStep6 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep6 and the message -->> ', 'color:red',e.message);
    }

  }

  // 责任信息
  /**
    duty:[
        {
            "licensePlateNum": "冀CWA356",
            "dutyType": "0",
            "signData": "",
            "signTime": "2017-07-08 08:39:20",
            "refuseFlag": "01"  01:签名，02:拒签
        }
    ]
  **/
  static async saveStep7(duty){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      this.loadRes = await global.storage.load({key, id});
      let data = {...this.loadRes, duty}
      console.log('%c StorageHelper execute saveStep7 -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);


      await global.storage.save({ key, id, data })
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper catch error on saveStep7 and the message -->> ', 'color:red',e.message);
    }

  }

  // 获取一条案件数据详情
  static async getCurrentCaseInfo(){
    try {
      let key = global.personal.mobile + 'uncompleted';
      let id = global.currentCaseId;
      let data = await global.storage.load({key, id});
      console.log('%c StorageHelper execute getCurrentCaseInfo -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      return data;
    } catch (e) {
      console.log('%c StorageHelper getCurrentCaseInfo and catch error -->> ', 'color:red', e.message);
    }
  }

  // 获取未完成案件列表
  static async getUnCompletedCaseList(){
    try {
      let list = await global.storage.getAllDataForKey(global.personal.mobile + 'uncompleted');
      console.log('%c StorageHelper execute getUnCompletedCaseList -- the list -->> ' , 'color:dodgerblue', list);
      return list;
    } catch (e) {
      console.log('%c StorageHelper getUnCompletedCaseList and catch error -->> ', 'color:red', e.message);
    } finally {

    }
  }

  static async getUnCompletedCaseSum(){
    try {
      let list = await global.storage.getIdsForKey(global.personal.mobile + 'uncompleted');
      console.log('%c StorageHelper execute getUnCompletedCaseSum -- the list -->> ' , 'color:dodgerblue', list);
      return list.length;
    } catch (e) {
      console.log('%c StorageHelper getUnCompletedCaseList and catch error -->> ', 'color:red', e.message);
    } finally {

    }
  }

  // 获取未上传案件列表
  static async getUnUploadedCaseList(){
    try {
      let list = await global.storage.getAllDataForKey(global.personal.mobile + 'unuploaded');
      console.log('%c StorageHelper execute getCurrentCaseInfo -- the list -->> ' , 'color:dodgerblue', list);
      return list;
    } catch (e) {
      console.log('%c StorageHelper getUnUploadedCaseList and catch error -->> ', 'color:red', e.message);
    } finally {

    }
  }

  static async getUnUploadedCaseSum(){
    try {
      let list = await global.storage.getIdsForKey(global.personal.mobile + 'unuploaded');
      console.log('%c StorageHelper execute getUnUploadedCaseSum -- the list -->> ' , 'color:dodgerblue', list);
      return list.length;
    } catch (e) {
      console.log('%c StorageHelper getUnUploadedCaseList and catch error -->> ', 'color:red', e.message);
    } finally {

    }
  }


  // 转存未完成的数据到未上传列表
  static async saveAsUnUploaded({ id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty }){
    try {
      let key = global.personal.mobile + 'unuploaded';
      let itemId = global.currentCaseId;
      let data = { id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty }
      console.log('%c StorageHelper execute saveAsUnUploaded -- the key -->> ## ' + key + ' ## id -->> ' + id + ' ## the data -->> ' , 'color:dodgerblue', data);

      await global.storage.save({ key, id:itemId, data })
      await global.storage.remove({key:global.personal.mobile + 'uncompleted', id:itemId})
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper saveAsUnUploaded and catch error -->> ', 'color:red', e.message);
    }

  }


  static async removeItem(key, id){
    try {
      console.log('%c StorageHelper execute saveAsUnUploaded -- the key -->> ## ' + key + ' ## id -->> ' + id , 'color:dodgerblue');
      await global.storage.remove({key, id})
      return 'success'
    } catch (e) {
      console.log('%c StorageHelper removeItem and catch error -->> ', 'color:red', e.message);
    }
  }

}

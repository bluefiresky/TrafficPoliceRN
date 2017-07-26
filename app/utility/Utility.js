/**
 * creat by wuran
 */

'use strict';

import { Platform, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import { zip, zipToBase64, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'

const IsIos = Platform.OS === 'ios';

/**
 * File相关操作
**/
export function getFilePathByName(name, type){
  if(type && type === 'zip') return RNFS.DocumentDirectoryPath + `/${name}.zip`;
  else if(type && type === 'json') return RNFS.DocumentDirectoryPath + `/${name}/${name}.json`;
}

// 存储obj为json格式的文件
export async function convertObjtoFile(obj, name){
  let dir = RNFS.DocumentDirectoryPath + `/${name}`;
  let path = dir + `/${name}.json`;
  console.log('%c Utility execute convertObjtoFile and the obj -->> ' , 'color:dodgerblue', obj);

  try {
    let exists = await RNFS.exists(dir);
    if(!exists){
      let make = await RNFS.mkdir(dir);
    }
    let uploadJson = await convertObjToUploadJson(obj);
    await RNFS.writeFile(path, uploadJson, 'utf8');
    return 'success';
  } catch (e) {
    console.log('%c Utility convertObjtoFile catch error -->> ' , 'color:red', e.message);
  }
}


// 根据文件名获取文件, -->> 返回文件内容 <<--
export async function getFileByName(name){
  let path = RNFS.DocumentDirectoryPath + `/${name}/${name}.json`;
  console.log('%c Utility execute getFileByName and the path -->> ' , 'color:dodgerblue', path);

  try {
    let success = await RNFS.readFile(path, 'utf8');
    return 'success';
  } catch (e) {
    console.log('%c Utility getFileByName catch error -->> ' , 'color:red', e.message);
  }

}


// 根据文件名删除文件, -->> 返回文件内容 <<--
export async function deleteFileByName(name, type){
  let filePath = RNFS.DocumentDirectoryPath + `/${name}`;
  let zipPath = RNFS.DocumentDirectoryPath + `/${name}.zip`

  let existsFilePath = RNFS.exists(filePath);
  let existsZipPath = RNFS.exists(zipPath);
  console.log(`%c Utility execute deleteFileByName and the filePath -->> ## ${filePath} ## is exists -> ` , 'color:dodgerblue', existsFilePath);
  console.log(`%c Utility execute deleteFileByName and the zipPath -->> ## ${zipPath} ## is exists -> ` , 'color:dodgerblue', existsZipPath);

  try {
    if(existsFilePath) await RNFS.unlink(filePath);
    if(existsZipPath) await RNFS.unlink(zipPath);
    return 'success';
  } catch (e) {
    console.log('%c Utility deleteFileByName catch error -->> ' , 'color:red', e.message);
  }
}

// 文件生成zip
export async function zipFileByName(name){
  const targetPath = RNFS.DocumentDirectoryPath + `/${name}.zip`
  const sourcePath = RNFS.DocumentDirectoryPath + `/${name}`

  try {
    let base64Str = await zipToBase64(sourcePath, targetPath);
    let stat = await RNFS.stat(targetPath);
    console.log('%c Utility execute zipFileByName and the base64file status-->> ' , 'color:dodgerblue', stat);

    return base64Str;
  } catch (e) {
    console.log('%c Utility zipFileByName catch error -->> ' , 'color:red', e.message);
  }
}

// 根据本地数据生成上传数据格式
async function convertObjToUploadJson(obj){
  let { id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty, taskModal, accidentDes, accidentOther } = obj;
  let imageDocumentPath = Platform.select({ android: '', ios: RNFS.DocumentDirectoryPath + '/images/' });


  let nPhoto = [];
  for(let i=0; i<photo.length; i++){
    let { photoData, photoDate, photoType } = photo[i];
    let result = await NativeModules.ImageToBase64.convertToBase64(imageDocumentPath+photoData);
    nPhoto.push({photoDate, photoType, photoData:result.base64})
  }

  let nCredentials = [];
  for(let i=0; i<credentials.length; i++){
    let { photoData, photoDate, photoType } = credentials[i];
    let result = await NativeModules.ImageToBase64.convertToBase64(imageDocumentPath+photoData);
    nCredentials.push({photoDate, photoType, photoData:result.base64})
  }

  let nDuty = null;
  if(duty){
    nDuty = [];
    for(let i=0; i<duty.length; i++){
      let {licensePlateNum, dutyType, signTime, refuseFlag, signData} = duty[i];
      if(refuseFlag === '01'){
        let result = await NativeModules.ImageToBase64.convertToBase64(imageDocumentPath+signData);
        nDuty.push({licensePlateNum, dutyType, signTime, refuseFlag, signData:result.base64})
      }
    }
  }

  let uploadData = {
    processType: handleWay,
    longitude: basic.longitude,
    latitude: basic.latitude,
    address: basic.address,
    accidentTime: basic.accidentTime,
    accidentDes: accidentDes?accidentDes:'',          // 事故情形
    accidentOther: accidentOther?accidentOther:'',    // 情形描述
    taskModal: taskModal?taskModal:'',                // 事故形态
    weather: basic.weather,
    supplementary: supplementary?supplementary:'',
    conciliation: conciliation?conciliation:'',
    personList: person,
    photoList: nPhoto.concat(nCredentials),
    dutyList: duty?nDuty:null,
    signList: sign?sign:null
  }

  console.log('%c Utility execute convertObjToUploadJson and the uploadData -->> ' , 'color:dodgerblue', uploadData);
  return JSON.stringify(uploadData);
}


/**
   Date 相关操作
**/
export function formatDate(format){
  Date.prototype.Format = function(fmt) {
    let o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
   }
   return (new Date().Format(format))
}

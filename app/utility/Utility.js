/**
 * creat by wuran
 */

'use strict';

import { Platform } from 'react-native';
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
    await RNFS.writeFile(path, convertObjToUploadJson(obj), 'utf8');
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
  // console.log('%c Utility execute deleteFileByName and the filePath -->> ' , 'color:dodgerblue', obj);
  // console.log('%c Utility execute deleteFileByName and the zipPath -->> ' , 'color:dodgerblue', obj);

  try {
    if(RNFS.exists(filePath)) await RNFS.unlink(filePath);
    if(RNFS.exists(zipPath)) await RNFS.unlink(zipPath);
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
    console.log('%c Utility execute zipFileByName and the base64 -->> ' , 'color:dodgerblue', base64Str);

    return base64Str;
  } catch (e) {
    console.log('%c Utility zipFileByName catch error -->> ' , 'color:red', e.message);
  }
}

// 根据本地数据生成上传数据格式
function convertObjToUploadJson(obj){
  let { id, basic, photo, person, credentials, handleWay, sign, supplementary, conciliation, duty } = obj;
  let uploadData = {
    processType: handleWay,
    longitude: basic.longitude,
    latitude: basic.latitude,
    address: basic.address,
    accidentTime: basic.accidentTime,
    accidentDes: '',    // 事故情形
    accidentOther: '',  // 情形描述
    taskModal: '',      // 事故形态
    weather: basic.weather,
    supplementary: supplementary,
    conciliation: conciliation,
    personList: person,
    photoList: Object.assign(photo, credentials),
    dutyList: duty,
    signList: sign
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

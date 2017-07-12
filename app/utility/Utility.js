/**
 * creat by wuran
 */

'use strict';

import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { zip, zipToBase64, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'

const IsIos = Platform.OS === 'ios';

export function getFilePathByName(name, type){
  if(type && type === 'zip') return RNFS.DocumentDirectoryPath + `/${name}.zip`;
  else if(type && type === 'json') return RNFS.DocumentDirectoryPath + `/${name}/${name}.json`;
}

// 存储obj为json格式的文件
export async function convertObjtoFile(obj, name){
  let dir = RNFS.DocumentDirectoryPath + `/${name}`;
  let path = dir + `/${name}.json`;
  console.log('Utility convertObjtoFile and the file path -->> ', path);

  try {
    let exists = await RNFS.exists(dir);
    if(!exists){
      let make = await RNFS.mkdir(dir);
    }
    let success =  await RNFS.writeFile(path, JSON.stringify(obj), 'utf8');
    return 'success';
  } catch (e) {
    console.log('%c convertObjtoFile catch error -->> ' , 'color:red', e.message);
  }
}


// 根据文件名获取文件, -->> 返回文件内容 <<--
export async function getFileByName(name){
  let path = RNFS.DocumentDirectoryPath + `/${name}/${name}.json`;
  console.log('Utility getFileByName and the file path -->> ', path);

  try {
    let success = await RNFS.readFile(path, 'utf8');
    console.log(' ##$%*%(^)*^)^&(*&^*(&%&*^%&*%)) -->> ', success);
    return 'success';
  } catch (e) {
    console.log('%c getFileByName catch error -->> ' , 'color:red', e.message);
  }

}


// 根据文件名删除文件, -->> 返回文件内容 <<--
export async function deleteFileByName(name){
  let path = RNFS.DocumentDirectoryPath + `/${name}/${name}.json`;
  console.log('Utility deleteFileByName and the file path -->> ', path);

  try {
    let success = await RNFS.unlink(path);
    return 'success';
  } catch (e) {
    console.log('%c deleteFileByName catch error -->> ' , 'color:red', e.message);
  }
}

// 文件生成zip
export async function zipFileByName(name){
  const targetPath = `${RNFS.DocumentDirectoryPath}/${name}.zip`
  const sourcePath = RNFS.DocumentDirectoryPath + `/${name}`
  console.log('Utility zipFileByName and the file targetPath -->> ', targetPath);

  try {
    let path = await zipToBase64(sourcePath, targetPath);
    return path;
  } catch (e) {
    console.log('%c zipFileByName catch error -->> ' , 'color:red', e.message);
  }
}

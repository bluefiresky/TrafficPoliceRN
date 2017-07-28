/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,InteractionManager,WebView,NativeModules,Platform,DeviceEventEmitter } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'
import RNFS from 'react-native-fs';

import { W, H, backgroundGrey,formLeftText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { StorageHelper, Utility } from '../../utility/index.js';

import { generateRDS } from './html/rendingshu.js';
import { generateXYS } from './html/xieyishu.js';

const DutyTypeList = [{name:'全责',code:'0'},{name:'无责',code:'1'},{name:'同等责任',code:'2'},{name:'主责',code:'3'},{name:'次责',code:'4'}];
const ButtonW = (W - 60)/2
const DocumentPath = Platform.select({ android: 'file://', ios: RNFS.DocumentDirectoryPath + '/images/' });

class CertificateView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading:false,
      source:null,
      jsCode:''
    }

    this.ref = null;
    this._generateRenDingShu = this._generateRenDingShu.bind(this);
  }

  componentDidMount(){
    // this.setState({loading:true})
    InteractionManager.runAfterInteractions(()=>{
      this._getInfo(async (info) => {
        console.log(' the info -->>', info);
        if(info){
          let html;
          let { handleWay } = info;
          if(handleWay === '04'){
            html = await this._generateXieYiShu(info)
          }else{
            html = await this._generateRenDingShu(info)
          }
          this.setState({loading:false, source:{html, baseUrl:''}})
        }else{
          // this.setState({loading:false})
        }
      });
      // this.props.navigation.state.params.handleWay === '04'?'离线协议书':'离线认定书'
    })
  }

  render(){
    let { source } = this.state;
    return(
      <View style={styles.container}>
        <View style={{flex:1}}>
          <WebView
            ref={(ref) => this.ref = ref}
            automaticallyAdjustContentInsets={true}
            style={{flex:1}}
            source={source}
            javaScriptEnabled={true}
            scalesPageToFit={true}
            startInLoadingState={true}/>
        </View>
        <View style={{flexDirection:'row', marginTop:20, marginBottom:20}}>
          <XButton title={'保存为图片'} onPress={this._onPress.bind(this, 1)} borderRadius={20} style={{backgroundColor:'#ffffff',width:ButtonW,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
          <XButton title={'返回首页'} onPress={this._onPress.bind(this, 2)} borderRadius={20} style={{backgroundColor:'#267BD8',width:ButtonW}} textStyle={{color:'#ffffff',fontSize:14}}/>
        </View>
      </View>
    );
  }

  /**  Private  */
  _onPress(type){
    if(type === 1){
      Toast.showShortCenter('开发中')
    }else{
      let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
      this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName }) ]}) )
      DeviceEventEmitter.emit('InitHome');
    }
  }

  async _getInfo(callback){
    let info = await StorageHelper.getCurrentCaseInfo('unuploaded');
    callback(info)
  }

  async _generateRenDingShu(info){
    let {basic, person, duty } = info;
    let nBasic = {accidentTime:this._convertAccidentTime(basic.accidentTime), weather:this._convertWeather(basic.weather), address:basic.address};

    let nPersonList = [];
    for(let i=0; i < person.length; i++){
      let p = person[i];
      let d = duty[i];
      let signData = '';
      if(d.refuseFlag == '01'){
        let s = await NativeModules.ImageToBase64.convertToBase64(DocumentPath+d.signData);
        signData = s.base64;
      }else{
        signData = d.signData;
      }
      nPersonList.push({name:p.name, phone:p.phone, driverNum:p.driverNum, licensePlateNum:p.licensePlateNum, carType:p.carType, carInsureNumber:p.carInsureNumber, signData:'data:image/jpeg;base64,'+signData})
    }

    if(nPersonList.length === 2){
      nPersonList.push({name:'', phone:'', driverNum:'', licensePlateNum:'', carType:'', carInsureNumber:'', signData:''})
    }else if(nPersonList.length === 3){
      nPersonList.push({name:'', phone:'', driverNum:'', licensePlateNum:'', carType:'', carInsureNumber:'', signData:''})
      nPersonList.push({name:'', phone:'', driverNum:'', licensePlateNum:'', carType:'', carInsureNumber:'', signData:''})
    }

    let factAndResponsibility = this._convertInfoToAccidentContent(basic, person) + this._convertResponsebilityContent(person, duty);

    return generateRDS(nBasic, nPersonList, factAndResponsibility)
  }

  async _generateXieYiShu(info){
    let {basic, person, duty, taskModal, accidentDes } = info;
    let nBasic = {accidentTime:this._convertAccidentTime(basic.accidentTime), weather:this._convertWeather(basic.weather), address:basic.address};

    let nPersonList = [];
    for(let i=0; i < person.length; i++){
      let p = person[i];
      let d = duty[i];
      let signData = '';
      if(d.refuseFlag == '01'){
        let s = await NativeModules.ImageToBase64.convertToBase64(DocumentPath+d.signData);
        signData = s.base64;
      }else{
        signData = d.signData;
      }
      nPersonList.push({name:p.name, phone:p.phone, driverNum:p.driverNum, licensePlateNum:p.licensePlateNum, carType:p.carType, carInsureDueDate:p.carInsureDueDate, carInsureNumber:p.carInsureNumber, signData:'data:image/png;base64,'+signData, signTime:d.signTime, insureCompanyName:p.insureCompanyName})
    }

    let formList = getStore().getState().dictionary.formList;
    let nTaskModal = '';
    for(let i=0; i<formList.length; i++){
      if(formList[i].code === taskModal){
        nTaskModal += '  <span>√'+formList[i].name+'</span>';
      }else{
        nTaskModal += '  <span>□'+formList[i].name+'</span>';
      }
    }

    let damagedList = getStore().getState().dictionary.damagedList;
    let nDamagedList = [];
    for(let i=0; i<person.length; i++){
      let tmp = person[i].carDamagedPart.split(',');
      let tmpDamaged = '';
      for(let j=0; j<damagedList.length; j++){
        if(tmp.indexOf(damagedList[j].code) != -1){
          tmpDamaged+='  <span>√'+damagedList[j].name+'</span>'
        }else{
          tmpDamaged+='  <span>□'+damagedList[j].name+'</span>'
        }
      }
      nDamagedList.push(tmpDamaged);
    }

    let situationList = getStore().getState().dictionary.situationList;
    let nAccidentDes = '';
    for(let i=0; i<situationList.length; i++){
      if(situationList[i].code === accidentDes){
        nAccidentDes += '  <span>√'+situationList[i].name+'</span>';
      }else{
        nAccidentDes += '  <span>□'+situationList[i].name+'</span>';
      }
    }

    let nDutyList = [];
    for(let i=0; i<duty.length; i++){
      let tmp = duty[i].dutyType;
      let tmpDuty = '';
      for(let j=0; j<DutyTypeList.length; j++){
        if(tmp === DutyTypeList[j].code){
          tmpDuty+='  <span>√'+DutyTypeList[j].name+'</span>'
        }else{
          tmpDuty+='  <span>□'+DutyTypeList[j].name+'</span>'
        }
      }
      nDutyList.push(tmpDuty);
    }

    return generateXYS(nBasic, nPersonList, nTaskModal, nDamagedList, nAccidentDes, nDutyList)
  }

  _convertAccidentTime(time){
    if(time) return time.substring(0, time.length - 3);
    return ''
  }

  _convertWeather(code){
    let weatherList = getStore().getState().dictionary.weatherList;
    let name = null;
    for(let i = 0; i < weatherList.length; i++){
      let w = weatherList[i];
      if(w.code == code){
        name = w.name;
        break;
      }
    }
    return name;
  }

  _convertInfoToAccidentContent(basic, person){
    if(!basic) return '';

    let num = person.length;
    let content = '';
    if(num === 1){
      let p = person[0];
      content = `\t\t${basic.accidentTime}, ${p.name}(驾驶证号:${p.driverNum})驾驶车牌号为${p.licensePlateNum}的${p.carType}, 在${basic.address}发生交通事故。`
    }else if(num === 2){
      let p1 = person[0];
      let p2 = person[1];
      content = `\t\t${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}，与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}发生交通事故。`
    }else if(num === 3){
      let p1 = person[0];
      let p2 = person[1];
      let p3 = person[2];
      content = `\t\t${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}，及${p3.name}(驾驶证号:${p3.driverNum})驾驶车牌号为${p3.licensePlateNum}的${p3.carType}发生交通事故。`
    }

    return content;
  }

  _convertResponsebilityContent(person, duty){
    if(!person) return '';

    let num = person.length;
    let content = '';
    if(duty){
      if(num === 1){
        content = `\n${person[0].name}应负此次事故的${this._convertCodeToEntry(duty[0].dutyType, DutyTypeList).name}。`
      }else if(num === 2){
        content = `\n${person[0].name}应负此次事故的${this._convertCodeToEntry(duty[0].dutyType, DutyTypeList).name}，${person[1].name}应负此次事故的${this._convertCodeToEntry(duty[1].dutyType, DutyTypeList).name}。`
      }else if(num === 3){
        content = `\n${person[0].name}应负此次事故的${this._convertCodeToEntry(duty[0].dutyType, DutyTypeList).name}，${person[1].name}应负此次事故的${this._convertCodeToEntry(duty[1].dutyType, DutyTypeList).name}，${person[2].name}应负此次事故的${this._convertCodeToEntry(duty[2].dutyType, DutyTypeList).name}。`
      }
    }

    return content;
  }

  _convertCodeToEntry(code, array){
    if(!code) return;

    let entry = null;
    for(let i=0,max=array.length; i<max; i++){
      let v = array[i];
      if(v.code == code){
        entry = v;
        break;
      }
    }
    return entry;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7',
  }
});

const ExportView = connect()(CertificateView);
ExportView.navigationOptions = ({ navigation }) => {
  let params = navigation.state.params;
  if(params && params.canBack) {
    return {};
  }else{
    return {
      headerLeft:null,
    }
  }
}

module.exports.CertificateView = ExportView;

/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,Alert,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule,commonText,getProvincialData,getNumberData } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, TipModal, Input, InsurancePicker, CarTypePicker, SelectCarNum } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper } from '../../utility/index.js';

const ImageW = (W - 3 * 20) / 2;
const ImageH = (220 * ImageW)/340;
const PhotoTypes = {'0':'侧前方','1':'侧后方','2':'碰撞部位','30':'甲方证件照','31':'乙方证件照','32':'丙方证件照'}
const ProvincialData = getProvincialData();
const NumberData = getNumberData();

class ConfirmInformationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showTip: false,
      tipParams: {},
    }
    this.currentCaseInfo = {};
    this.partyVerData = [{name:'甲方当事人',ver:''},{name:'乙方当事人',ver:''},{name:'丙方当事人',ver:''}];

  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async ()=>{
      this.currentCaseInfo = await StorageHelper.getCurrentCaseInfo();
      // let basic = { address: '北京市朝阳区百子湾南二路78号院-3', latitude:'39.902099', longitude:'116.474151 ', weather: '1', accidentTime: '2017-07-08 08:30:01'};
      // let photo = [
      //   {photoData: testPhotoData, photoType: '0', photoDate:'2017-07-08 08:33:10'},
      //   {photoData: testPhotoData, photoType: '1', photoDate:'2017-07-08 08:33:10'},
      //   {photoData: testPhotoData, photoType: '2', photoDate:'2017-07-08 08:33:10'}
      // ]
      // let person = [
      //   {name:'路人甲',phone:'15811112222',driverNum:'111222121333636666',carInsureNumber:'223369',carType:'小型载客汽车',insureCompanyCode:'110000003003',insureCompanyName: '中国太平洋财产保险股份有限公司',licensePlateNum:'冀CWA356',carInsureDueDate:'2018-04-10',carDamagedPart: ''},
      //   {name:'路人乙',phone:'15833334444',driverNum:'111222121333636666',carInsureNumber:'223369',carType:'小型载客汽车',insureCompanyCode:'110000003003',insureCompanyName: '中国太平洋财产保险股份有限公司',licensePlateNum:'冀CWA356',carInsureDueDate:'2018-04-10',carDamagedPart: ''}
      // ];
      // let credentials = [
      //   {photoData: testPhotoData, photoType: '30', photoDate:'2017-07-08 08:33:10'},
      //   {photoData: testPhotoData, photoType: '31', photoDate:'2017-07-08 08:33:10'},
      // ]
      // this.currentCaseInfo = { basic, photo, person, credentials };
      this.setState({refresh: true})
    })
  }
  //下一步
  gotoNext(){
    let data = this.currentCaseInfo.person;
    for (var i = 0; i < data.length; i++) {
      let title = this.partyVerData[i].name;

      if (!this.checkPhone(data[i].phone)) {
        Toast.showShortCenter(`${title}手机号输入有误`)
        return
      }
      if (!data[i].name) {
        Toast.showShortCenter(`请输入${title}当事人姓名`)
        return
      }
      if (!data[i].driverNum) {
        Toast.showShortCenter(`请输入${title}驾驶证号`)
        return
      }
      if (!data[i].licensePlateNum) {
        Toast.showShortCenter(`请输入${title}车牌号`)
        return
      }
      if (!data[i].insureCompanyName) {
        Toast.showShortCenter(`请选择${title}保险公司`)
        return
      }
      if (!data[i].carType) {
        Toast.showShortCenter(`请输入${title}车辆类型`)
        return
      }
      if (!data[i].carInsureNumber) {
        Toast.showShortCenter(`请输入${title}保险单号`)
        return
      }
      if (!data[i].carInsureDueDate) {
        Toast.showShortCenter(`请输入${title}保险到期日`)
        return
      }
    }
    let self = this;
    self.setState({ showTip: true,
      tipParams:{
        content: '请确认信息是否完整无误，提交后无法修改。',
        left:{label: '返回修改', event: () => {
          self.setState({showTip: false});
        }},
        right:{label: '确认无误', event: async () => {
          let success = await StorageHelper.saveStep5(this.currentCaseInfo)
          self.setState({showTip: false});
          if(success) self.props.navigation.navigate('AccidentFactAndResponsibilityView');
        }}
    }});
  }
  //验证手机号
  checkPhone(phone){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!phone || phone.indexOf(1) !== 0 || phone.length !== 11 || !reg.test(phone)) ? false:true;
  }
  renderImgaeItem(value,index,ind){
    return (
      <View style={{marginLeft:this.rowMargin,marginBottom:15}} key={index}>
          <Image style={{width: this.rowWH,height: this.rowWH * 0.5,justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}
                 source={value.imageURL ? value.imageURL:null}>
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{value.title}</Text>
      </View>
    )
  }
  renderOnePersonInfo(value,ind,credential){
    return (
      <View style={{backgroundColor:'#ffffff',marginTop:10}} key={ind}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`${this.partyVerData[ind].name}信息`}</Text>
        </View>
        <View style={{marginTop:10}}>
          {this.renderRowItem('姓名',value.name,ind,'Name',value)}
          {this.renderRowItem('联系方式',value.phone,ind,'Phone',value)}
          {this.renderRowItem('驾驶证号',value.driverNum,ind,'DrivingLicense',value)}
          <View style={{flexDirection:'row',marginLeft:20,paddingTop:5,paddingBottom:5, alignItems: 'center'}}>
            <SelectCarNum label={'车牌号'} style={{flex:1,marginRight:15}} plateNum={value.licensePlateNum} provincialData={ProvincialData} numberData={NumberData} onChangeValue={(text)=> { value.licensePlateNum = text; }}/>
          </View>
          <View style={{width:W, height:1, backgroundColor:backgroundGrey}} />
          <CarTypePicker
            data={getStore().getState().dictionary.carTypeList}
            label={'交通方式'}
            value={value.carType}
            onChange={(res) => {
              console.log(' ConfirmReportPartyInfoView carType -->> ', res);
              this.onChangeText(res,ind,'CarType',value)
            }}/>
          <InsurancePicker
            data={getStore().getState().dictionary.insureList}
            label={'保险公司'}
            value={value.insureCompanyName}
            onChange={(res) => {
              console.log(' ConfirmReportPartyInfoView insureCompanyName res -->> ', res)
              this.onChangeText(res,ind,'InsuranceCompany',value)
            }}/>
          {this.renderRowItem('保险单号',value.carInsureNumber,ind,'InsuranceCertificateNum',value)}
          <View style={{flexDirection:'row',marginLeft:20,paddingTop:10}}>
            <Text style={{fontSize:14,color:formLeftText}}>保险到期日:</Text>
            <DatePicker
              style={{marginTop:-12,flex:1}}
              date={value.carInsureDueDate}
              mode="date"
              format="YYYY-MM-DD"
              confirmBtnText="确定"
              cancelBtnText="取消"
              iconSource={require('./image/right_arrow.png')}
              customStyles={{dateIcon: {width:7,height:12,marginRight:20}, dateInput: {borderColor:'#ffffff', height:25, marginRight:5, alignItems:'flex-end' }}}
              onDateChange={(date) => {
                console.log('#### date -->> ', date);
                this.onChangeText(date,ind,'InsuranceTime',value)
              }}
            />
          </View>
        </View>
        <View style={{alignItems:'center', marginTop:10, marginBottom:10}}>
          <Image style={{width: ImageW,height: ImageH}} source={{uri: 'data:image/png;base64,'+credential.photoData}} />
          <Text style={{marginTop:10,color:formLeftText,fontSize:12}}>{this._convertPhotoType(credential.photoType)}</Text>
        </View>
      </View>
    )
  }
  onChangeText(text,index,type,item){
    switch (type) {
      case 'Name':
        item.name = text;
        break;
      case 'Phone':
        item.phone = text;
        break;
      case 'DrivingLicense':
        item.driverNum = text;
        break;
      // case 'CarNum':
      //   item.licensePlateNum = text;
      //   break;
      case 'CarType':
        item.carType = text;
        break;
      case 'InsuranceCompany':
        item.insureCompanyName = text.inscomname;
        item.insureCompanyCode = text.inscomcode;
        break;
      case 'InsuranceCertificateNum':
        item.carInsureNumber = text;
        break;
      case 'InsuranceTime':
        item.carInsureDueDate = text;
        break;
    }
    this.setState({refresh: true})
  }

  renderRowItem(title,value,index,type,item){
    let keyboardType = (type === 'Phone' || type === 'DrivingLicense')?'numeric':'default';
    return (
      <View style={{flex:1}}>
        <Input label={title} value={value} placeholder={`请输入${title}`} keyboardType={keyboardType} style={{flex:1, height: 40}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,type,item) }}/>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />
      </View>
    )
  }

  renderBasicItem(title, value, type){
    let v = value;
    if(type === 'AccidentTime') v = this._convertAccidentTime(value);
    if(type === 'Weather') v = this._convertWeather(value);
    return(
      <View style={{flex: 1, flexDirection:'row', height: 30}}>
        <Text style={{width:80, fontSize: 14, color: formRightText}}>{title}</Text>
        <Text style={{fontSize: 14, color: formRightText}}>{v}</Text>
      </View>
    )
  }

  renderItem({item,index}) {
    let source = {uri: 'data:image/png;base64,' + item.photoData}
    return (
      <View style={{marginBottom:15, alignItems: 'center', paddingLeft: 10, paddingRight: 10}} underlayColor={'transparent'} onPress={() => this.takePhoto(item,index)}>
        <Image source={source} style={{width: ImageW, height: ImageH, justifyContent:'center', alignItems: 'center'}} />
        <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{this._convertPhotoType(item.photoType)}</Text>
      </View>
    )
  }

  render(){
    let { basic, photo, person, credentials } = this.currentCaseInfo;
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
           <View style={{backgroundColor:'#ffffff',marginTop:10}}>
             <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
               <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
               <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>基本信息</Text>
             </View>
             <View style={{marginTop:10,marginLeft:20}}>
               {this.renderBasicItem('事故时间', basic?basic.accidentTime:'', 'AccidentTime')}
               {this.renderBasicItem('天气', basic?basic.weather:'', 'Weather')}
               {this.renderBasicItem('事故地点', basic?basic.address:'')}
             </View>
           </View>

           <View style={{backgroundColor:'#ffffff',marginTop:10}}>
             <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
               <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
               <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>现场照片</Text>
             </View>
             <View style={{flex:1,marginTop:15,marginLeft:10}}>
               <FlatList
                 keyExtractor={(data,index) => {return index}}
                 showsVerticalScrollIndicator={false}
                 data={photo}
                 numColumns={2}
                 renderItem={this.renderItem.bind(this)}
                 extraData={this.state}
               />
             </View>
           </View>

           {person?person.map((value,index) => this.renderOnePersonInfo(value,index,credentials[index])) : null}

           <View style={{backgroundColor: '#ffffff', paddingTop: 20, paddingBottom:20, alignItems:'center'}}>
             <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
           </View>
        </ScrollView>
        <TipModal show={this.state.showTip} {...this.state.tipParams} />
      </View>

    );
  }

  /** Private **/
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

  _convertAccidentTime(time){
    if(time) return time.substring(0, time.length - 3);
    return ''
  }

  _convertPhotoType(typeCode){
    let code = Number(typeCode);
    if(code < 50){
      return PhotoTypes[typeCode];
    }else{
      return '其他现场照' + String(code-50);
    }
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.ConfirmInformationView = connect()(ConfirmInformationView)

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

const testPhotoData = "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"

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

    this.accidentData = {
      basicInfo:{accidentTime:'2017年6月4日 17时8分',weather:'晴',accidentSite:'北京市朝 阳区'},
      accidentPhoto:[{'title': '侧前方',imageURL:''},{'title': '侧后方',imageURL:''},{'title': '碰撞部位',imageURL:''},{'title': '其它现场照片',imageURL:''}],
      partyInfo:[
        {title:'甲方',name:'XXX',phone:'13333333333',drivingLicense:'XXX',carNum:'XXX',carType:'XXX',insuranceCompany:'XXX',insuranceCertificateNum:'XXX',insuranceTime:'XXX',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]},
        {title:'乙方',name:'XXX',phone:'13333333333',drivingLicense:'XXX',carNum:'XXX',carType:'XXX',insuranceCompany:'XXX',insuranceCertificateNum:'XXX',insuranceTime:'XXX',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]}
      ]};
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async ()=>{
      // this.currentCaseInfo = await StorageHelper.getCurrentCaseInfo();
      let basic = { address: '北京市朝阳区百子湾南二路78号院-3', latitude:'39.902099', longitude:'116.474151 ', weather: '1', accidentTime: '2017-07-08 08:30:01'};
      let photo = [
        {photoData: testPhotoData, photoType: '0', photoDate:'2017-07-08 08:33:10'},
        {photoData: testPhotoData, photoType: '1', photoDate:'2017-07-08 08:33:10'},
        {photoData: testPhotoData, photoType: '2', photoDate:'2017-07-08 08:33:10'}
      ]
      let person = [
        {name:'路人甲',phone:'15811112222',driverNum:'111222121333636666',carInsureNumber:'223369',carType:'小型载客汽车',insureCompanyCode:'110000003003',insureCompanyName: '中国太平洋财产保险股份有限公司',licensePlateNum:'冀CWA356',carInsureDueDate:'2018-04-10',carDamagedPart: ''},
        {name:'路人乙',phone:'15833334444',driverNum:'111222121333636666',carInsureNumber:'223369',carType:'小型载客汽车',insureCompanyCode:'110000003003',insureCompanyName: '中国太平洋财产保险股份有限公司',licensePlateNum:'冀CWA356',carInsureDueDate:'2018-04-10',carDamagedPart: ''}
      ];
      let credentials = [
        {photoData: testPhotoData, photoType: '30', photoDate:'2017-07-08 08:33:10'},
        {photoData: testPhotoData, photoType: '31', photoDate:'2017-07-08 08:33:10'},
      ]
      this.currentCaseInfo = { basic, photo, person, credentials };
      this.setState({refresh: true})
    })
  }
  //下一步
  gotoNext(){
    console.log(' the currentImgaeIndex -->> ', this.currentCaseInfo);
    // if (!this.accidentData.basicInfo.accidentTime) {
    //   Toast.showShortCenter('事故时间不能为空')
    //   return
    // }
    // if (!this.accidentData.basicInfo.weather) {
    //   Toast.showShortCenter('天气不能为空')
    //   return
    // }
    // if (!this.accidentData.basicInfo.accidentSite) {
    //   Toast.showShortCenter('事故地点不能为空')
    //   return
    // }
    // let data = this.accidentData.partyInfo;
    // for (var i = 0; i < data.length; i++) {
    //   if (!this.checkPhone(data[i].phone)) {
    //     Toast.showShortCenter(`${data[i].title}手机号输入有误`)
    //     return
    //   }
    //   if (!data[i].name) {
    //     Toast.showShortCenter(`请输入${data[i].title}当事人姓名`)
    //     return
    //   }
    //   if (!data[i].drivingLicense) {
    //     Toast.showShortCenter(`请输入${data[i].title}驾驶证号`)
    //     return
    //   }
    //   if (!data[i].carNum) {
    //     Toast.showShortCenter(`请输入${data[i].title}车牌号`)
    //     return
    //   }
    //   if (!data[i].insuranceCompany) {
    //     Toast.showShortCenter(`请输入${data[i].title}保险公司`)
    //     return
    //   }
    //   if (!data[i].carType) {
    //     Toast.showShortCenter(`请输入${data[i].title}车辆类型`)
    //     return
    //   }
    //   if (!data[i].insuranceCertificateNum) {
    //     Toast.showShortCenter(`请输入${data[i].title}保险单号`)
    //     return
    //   }
    //   if (!data[i].insuranceTime) {
    //     Toast.showShortCenter(`请输入${data[i].title}保险到期日`)
    //     return
    //   }
    // }
    let self = this;
    self.setState({ showTip: true,
      tipParams:{
        content: '请确认信息是否完整无误，提交后无法修改。',
        left:{label: '返回修改', event: () => {
          self.setState({showTip: false});
        }},
        right:{label: '确认无误', event: async () => {
          await StorageHelper.saveStep5(this.currentCaseInfo)
          self.setState({showTip: false});
          self.props.navigation.navigate('AccidentFactAndResponsibilityView');

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

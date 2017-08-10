/**
* 交警当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,Alert,InteractionManager, Modal, TouchableWithoutFeedback } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule,commonText,getProvincialData,getNumberData } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton, ProgressView, TipModal, Input, InsurancePicker, CarTypePicker, SelectCarNum } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { StorageHelper, TextUtility, Utility } from '../../utility/index.js';

const ImageW = (W - 3 * 20) / 2;
const ImageH = (220 * ImageW)/340;
const BigImageH = H-200
const PhotoTypes = {'0':'侧前方','1':'侧后方','2':'碰撞部位','30':'甲方证件照','31':'乙方证件照','32':'丙方证件照'}
const ProvincialData = getProvincialData();
const NumberData = getNumberData();
const DocumentPath = Platform.select({ android: 'file://', ios: RNFS.DocumentDirectoryPath + '/images/' });
const photoOption = {
  title: '选择照片', //选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', //调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', //调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo',
  maxWidth: 750,
  maxHeight: 1000,
  quality: 0.5,
  storageOptions: { cameraRoll:true, skipBackup: true, path: 'images' }
}

class ConfirmInformationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showTip: false,
      tipParams: {},
      loading:false,
      showBigImage:false,
    }
    this.currentCaseInfo = {};
    this.partyVerData = [{name:'甲方当事人',ver:''},{name:'乙方当事人',ver:''},{name:'丙方当事人',ver:''}];
    this.carTypeData = getStore().getState().dictionary.carTypeList;
    this.insuranceData = getStore().getState().dictionary.insureList;
    this.currentImage = null;
    this.currentImgaeIndex = -1;
    this.modifyCredentials = false;
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async ()=>{
      this.setState({loading:true})
      this.currentCaseInfo = await StorageHelper.getCurrentCaseInfo();
      this.setState({loading:false})
    })
  }
  //下一步
  gotoNext(){
    this.setState({loading:true})
    let error = null;
    let data = this.currentCaseInfo.person;
    for (var i = 0; i < data.length; i++) {
      let title = this.partyVerData[i].name;

      if (this.checkName(data[i].name)) {
        error = `${title}当事人姓名输入有误`
        break;
      }
      if (!this.checkPhone(data[i].phone)) {
        error = `${title}手机号输入有误`
        break;
      }
      if (this.checkDriveNunm(data[i].driverNum)) {
        error = `${title}驾驶证号输入有误`
        break;
      }
      if (!TextUtility.checkLength(data[i].licensePlateNum, 9, 7)) {
        error = `${title}车牌号输入有误`
        break;
      }
      if (!data[i].insureCompanyName) {
        error = `请选择${title}保险公司`
        break;
      }
      if (!data[i].carType) {
        error = `请输入${title}车辆类型`
        break;
      }
      if (data[i].carInsureNumber && !TextUtility.checkLength(data[i].carInsureNumber, 40, 20)) {
        error = `请输入${title}保险单号`
        break;
      }
      // if (!data[i].carInsureDueDate) {
      //   error = `请输入${title}保险到期日`
      //   break;
      // }
    }

    if(error) {
      this.setState({loading:false});
      Toast.showShortCenter(error);
      return;
    }

    if(data.length === 2){
      if(data[0].phone === data[1].phone){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[1].name} 的手机号不能相同`;
      }else if(data[0].driverNum === data[1].driverNum){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[1].name} 的驾驶证号不能相同`;
      }else if(data[0].licensePlateNum === data[1].licensePlateNum){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[1].name} 的车牌号不能相同`;
      }
    }

    if(data.length === 3){
      if(data[0].phone === data[1].phone){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[1].name} 的手机号不能相同`;
      }else if(data[0].phone === data[2].phone){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[2].name} 的手机号不能相同`;
      }else if(data[1].phone === data[2].phone){
        error = `${this.partyVerData[1].name} 与 ${this.partyVerData[2].name} 的手机号不能相同`;
      }else if(data[0].driverNum === data[1].driverNum){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[1].name} 的驾驶证号不能相同`;
      }else if(data[0].driverNum === data[2].driverNum){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[2].name} 的驾驶证号不能相同`;
      }else if(data[1].driverNum === data[2].driverNum){
        error = `${this.partyVerData[1].name} 与 ${this.partyVerData[2].name} 的驾驶证号不能相同`;
      }else if(data[0].licensePlateNum === data[1].licensePlateNum){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[1].name} 的车牌号不能相同`;
      }else if(data[0].licensePlateNum === data[2].licensePlateNum){
        error = `${this.partyVerData[0].name} 与 ${this.partyVerData[2].name} 的车牌号不能相同`;
      }else if(data[1].licensePlateNum === data[2].licensePlateNum){
        error = `${this.partyVerData[1].name} 与 ${this.partyVerData[2].name} 的车牌号不能相同`;
      }
    }

    if(error){
      this.setState({loading:false});
      Toast.showShortCenter(error);
      return;
    }

    let self = this;
    self.setState({ showTip: true, loading:false,
      tipParams:{
        content: '请确认信息是否完整无误，提交后无法修改。',
        left:{label: '返回修改', event: () => {
          self.setState({showTip: false});
        }},
        right:{label: '确认无误', event: async () => {
          self.setState({loading:true})
          let success = await StorageHelper.saveStep5(this.currentCaseInfo)
          self.setState({showTip: false, loading:false});
          if(success) self.props.navigation.navigate('AccidentFactAndResponsibilityView');
        }}
    }});
  }
  //验证手机号
  checkPhone(phone){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!phone || phone.indexOf(1) !== 0 || phone.length !== 11 || !reg.test(phone)) ? false:true;
  }
  //验证驾驶证号
  checkDriveNunm(driverNum){
    return(!driverNum || driverNum.length < 6 || driverNum.length > 18)
  }
  //验证姓名
  checkName(name){
    return(!name || name.length < 2 || name.length > 10 || !TextUtility.checkHanZi(name))
  }

  renderOnePersonInfo(value,ind,credential){
    return (
      <View style={{backgroundColor:'#ffffff',marginTop:10}} key={ind}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:17,color:formLeftText,marginLeft:10}}>{`${this.partyVerData[ind].name}信息`}</Text>
        </View>
        <View style={{marginTop:10}}>
          {this.renderRowItem('姓名',value.name,ind,'Name',value)}
          {this.renderRowItem('联系方式',value.phone,ind,'Phone',value,11)}
          {this.renderRowItem('驾驶证号',value.driverNum,ind,'DrivingLicense',value,18)}
          <View style={{flexDirection:'row',marginLeft:20,paddingTop:5,paddingBottom:5, alignItems: 'center'}}>
            <SelectCarNum
              label={'车牌号'}
              plateNum={value.licensePlateNum}
              style={{flex:1,marginRight:15}}
              onChangeValue={(text)=> {
                value.licensePlateNum = text;
                this.setState({refresh:true})
              }}/>
          </View>
          <View style={{width:W, height:1, backgroundColor:backgroundGrey}} />
          <CarTypePicker
            data={this.carTypeData}
            label={'交通方式'}
            value={value.carType}
            onChange={(res) => {
              console.log(' ConfirmReportPartyInfoView carType -->> ', res);
              this.onChangeText(res,ind,'CarType',value)
            }}/>
          <View style={{flex:1,flexDirection:'row',marginLeft:20,height:40,marginRight:20,alignItems:'center'}}>
            <Text style={{fontSize:16,color:formLeftText}}>保险公司</Text>
            <TouchableHighlight onPress={() => {
                this.props.navigation.navigate('AccidentInsuranceCompanyView', {returnValue: (item) => {
                  this.onChangeText(item,ind,'InsuranceCompany',value)
                }})
              }} underlayColor='transparent' style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <Text style={{flex:1,fontSize:16,paddingLeft:10,color:commonText,marginLeft:10,marginRight:10}}>{value.insureCompanyName}</Text>
                <Image style={{width:7,height:12,resizeMode:'contain'}} source={require('./image/right_arrow.png')}/>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{width:W, height:1, backgroundColor:backgroundGrey}} />
          {this.renderRowItem('保险单号',value.carInsureNumber,ind,'InsuranceCertificateNum',value,40)}
          <View style={{flexDirection:'row',marginLeft:20,paddingTop:10}}>
            <Text style={{fontSize:16,color:formLeftText}}>保险到期日</Text>
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
            {
              !value.carInsureDueDate? null:
              <TouchableHighlight
                style={{alignItems:'center', justifyContent:'center', marginTop:-10, width:40}}
                onPress={()=>{
                  this.onChangeText('',ind,'InsuranceTime',value)
                }}>
                <Image style={{height: 15, width: 15, resizeMode:'contain'}} source={require('./image/icon-clear-text.png')}/>
              </TouchableHighlight>
            }
          </View>
        </View>

        <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
          this.currentImage = {uri: DocumentPath+credential.photoData, isStatic:true};
          this.currentImgaeIndex = ind;
          this.modifyCredentials = true;
          this.setState({showBigImage:true})
        }}>
          <View style={{alignItems:'center', marginTop:10, marginBottom:10}}>
            <Image style={{width: ImageW,height: ImageH}} source={{uri: DocumentPath+credential.photoData, isStatic:true}} />
            <Text style={{marginTop:10,color:formLeftText,fontSize:12}}>{this._convertPhotoType(credential.photoType)}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  onChangeText(text,index,type,item){
    switch (type) {
      case 'Name':
        // if(TextUtility.checkHanZi(text)){
          item.name = text;
        // }
        break;
      case 'Phone':
        if(TextUtility.checkNumber(text)){
          item.phone = text;
        }
        break;
      case 'DrivingLicense':
        if(TextUtility.checkNumberAndLetters(text)){
          item.driverNum = text;
        }
        break;
      // case 'CarNum':
      //   item.licensePlateNum = text;
      //   break;
      case 'CarType':
        item.carType = text;
        break;
      case 'InsuranceCompany':
        item.insureCompanyName = text.title;
        item.insureCompanyCode = text.code;
        break;
      case 'InsuranceCertificateNum':
        if(TextUtility.checkNumberAndLetters(text)){
          item.carInsureNumber = text;
        }
        break;
      case 'InsuranceTime':
        item.carInsureDueDate = text;
        break;
    }
    this.setState({refresh: true})
  }

  renderRowItem(title,value,index,type,item,maxLength){
    let keyboardType = (type === 'Phone')?'numeric':'default';
    let placeholder = `请输入${title}`;
    if(title == '保险单号') placeholder = '';
    return (
      <View style={{flex:1}}>
        <Input label={title} value={value} placeholder={placeholder} maxLength={maxLength} keyboardType={keyboardType} style={{flex:1, height: 40}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,type,item) }}/>
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
        <Text style={{width:80, fontSize: 16, color: '#666666'}}>{title}</Text>
        <Text style={{fontSize: 16, color: '#666666'}}>{v}</Text>
      </View>
    )
  }

  renderItem({item,index}) {
    let source = {uri: DocumentPath+item.photoData, isStatic:true}
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
        this.currentImage = source;
        this.currentImgaeIndex = index;
        this.modifyCredentials = false;
        this.setState({showBigImage:true})
      }}>
        <View style={{marginBottom:15, alignItems: 'center', paddingLeft: 10, paddingRight: 10}} underlayColor={'transparent'} >
          <Image source={source} style={{width: ImageW, height: ImageH, justifyContent:'center', alignItems: 'center'}} />
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{this._convertPhotoType(item.photoType)}</Text>
        </View>
      </TouchableHighlight>
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
               <Text style={{fontSize:17,color:formLeftText,marginLeft:10}}>基本信息</Text>
             </View>
             <View style={{marginTop:10,marginLeft:20}}>
               {this.renderBasicItem('事故时间', basic?basic.accidentTime:'', 'AccidentTime')}
               {this.renderBasicItem('天气', basic?basic.weather:'', 'Weather')}
               <View style={{flex: 1, flexDirection:'row', paddingBottom:5}}>
                 <Text style={{width:80, fontSize: 16, color: '#666666'}}>事故地点</Text>
                 <Text style={{flex:1, fontSize: 16, color: '#666666'}}>{ basic?basic.address :''}</Text>
               </View>
             </View>
           </View>

           <View style={{backgroundColor:'#ffffff',marginTop:10}}>
             <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
               <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
               <Text style={{fontSize:17,color:formLeftText,marginLeft:10}}>现场照片</Text>
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
        <ProgressView show={this.state.loading} hasTitleBar={true} />

        <View>
          <Modal animationType="fade" transparent={true} visible={this.state.showBigImage} onRequestClose={() => {}}>
            <TouchableWithoutFeedback onPress={() => this.setState({showBigImage:false})}>
              <View style={styles.modalContainer}>
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                  <Image source={this.currentImage} style={{width:W,height:BigImageH,resizeMode:'contain'}}/>
                </View>
                <View style={{height:100, flexDirection:'row', justifyContent: 'center', alignItems:'center'}}>
                  <XButton title={'重拍'} onPress={() => this._reTakePhoto()} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
                  <XButton title={'返回'} onPress={() => this.setState({showBigImage:false})} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}}/>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

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

  //重拍
  _reTakePhoto(){
    let self = this;
    ImagePicker.showImagePicker(photoOption, (response) => {
      this.setState({ showBigImage: false });
      if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
        // console.log(' the ImagePicker response -->> ', response);
        let photoData;
        if(Platform.OS === 'ios'){
          photoData = response.uri.substring(response.uri.lastIndexOf('/')+1);
        }else{
          photoData = response.path;
        }

        let photo;
        if(self.modifyCredentials){
          photo = this.currentCaseInfo.credentials[self.currentImgaeIndex];
        }else{
          photo = this.currentCaseInfo.photo[self.currentImgaeIndex];
        }
        photo.photoData = photoData;
        photo.photoDate = Utility.formatDate('yyyy-MM-dd hh:mm:ss');

        self.setState({refresh:true})
      }
    });
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});

module.exports.ConfirmInformationView = connect()(ConfirmInformationView)

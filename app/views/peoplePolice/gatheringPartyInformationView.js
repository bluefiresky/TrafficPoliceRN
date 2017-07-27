/**
* 交警当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule,getProvincialData,getNumberData } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, TipModal, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton, SelectCarNum } from '../../components/index.js';  /** 自定义组件 */
import Tool from '../../utility/Tool';
import { StorageHelper, Utility, TextUtility } from '../../utility/index.js';

class GatheringPartyInformationView extends Component {

  constructor(props){
    super(props);

    this.state = {
      refresh:false,
      carInsureDueDate: '',
      showOtherCarTextInput: false,
      loading:false,
    }
    this.partyName = '';
    this.partyPhone = '';
    this.partyDrivingLicense = '';
    this.partyInsuranceCertificateNum = '';
    //提交的内容
    this.jiafangInfo = {name:'',phone:'',driverNum:'',carInsureNumber:'',carType:'小型载客汽车',insureCompanyCode:'',insureCompanyName: '',licensePlateNum:global.personal.provinceShortName,carInsureDueDate:this.state.carInsureDueDate,carDamagedPart: ''};
    this.yifangInfo = {name:'',phone:'',driverNum:'',carInsureNumber:'',carType:'小型载客汽车',insureCompanyCode:'',insureCompanyName: '',licensePlateNum:global.personal.provinceShortName,carInsureDueDate:this.state.carInsureDueDate,carDamagedPart: ''};
    this.bingfangInfo = {name:'',phone:'',driverNum:'',carInsureNumber:'',carType:'小型载客汽车',insureCompanyCode:'',insureCompanyName: '',licensePlateNum:global.personal.provinceShortName,carInsureDueDate:this.state.carInsureDueDate,carDamagedPart: ''};
    this.carInfoData = [{title:'甲方',carNumArr:[getProvincialData(),getNumberData()]}];
    this.addOtherTitle = ['乙方','丙方'];
    this.addOtherInfo = [this.yifangInfo,this.bingfangInfo];
    this.submitDataArr = [this.jiafangInfo];
    this.handleWay = null;
  }

  componentDidMount(){
    this.setState({loading: true})
    InteractionManager.runAfterInteractions(async ()=>{
      let info = await StorageHelper.getCurrentCaseInfo();
      this.handleWay = info.handleWay;
      if(this.handleWay != '03'){
        this.carInfoData.push({title:'乙方',carNumArr:[getProvincialData(),getNumberData()]})
        this.submitDataArr.push(this.yifangInfo)
      }

      let dictionary = getStore().getState().dictionary;
      this.carTypeData = [];
      let carTypeList = dictionary.carTypeList.forEach((c) => {
        this.carTypeData.push(c.name);
      });
      this.insuranceCompanyData = dictionary.insureList;
      this.insuranceCompanyLabel = [];
      this.insuranceCompanyData.forEach((w) => {
        this.insuranceCompanyLabel.push(w.inscomname);
      })
      this.setState({loading: false})
    })
  }

  //下一步
  async gotoNext(){
    this.setState({loading:true})
    //检测必填项
    let error = null;
    for (var i = 0, max = this.submitDataArr.length; i < max; i++) {
      if (this.checkName(this.submitDataArr[i].name)){
        error = `请输入正确的${this.carInfoData[i].title}当事人姓名`
        break;
      }
      if (!this.checkPhone(this.submitDataArr[i].phone)) {
        error = `${this.carInfoData[i].title}手机号输入有误`
        break;
      }
      if (this.checkDriveNunm(this.submitDataArr[i].driverNum)) {
        error = `请输入正确的${this.carInfoData[i].title}驾驶证号`
        break;
      }
      if (!TextUtility.checkLength(this.submitDataArr[i].licensePlateNum, 9, 7)) {
        error = `请输入${this.carInfoData[i].title}车牌号`
        break;
      }
      if (!this.submitDataArr[i].carType) {
        error = `请输入${this.carInfoData[i].title}车辆类型`
        break;
      }
      if (!this.submitDataArr[i].insureCompanyName) {
        error = `请选择${this.carInfoData[i].title}保险公司`
        break;
      }
      if (this.submitDataArr[i].carInsureNumber && this.submitDataArr[i].carInsureNumber.length < 10) {
        error = `${this.carInfoData[i].title}的保单号输入不正确`
        break;
      }
    }

    if(this.submitDataArr.length === 2){
      if(this.submitDataArr[0].phone === this.submitDataArr[1].phone){
        error = `${this.carInfoData[0].title} 与 ${this.carInfoData[1].title} 的手机号不能相同`;
      }else if(this.submitDataArr[0].driverNum === this.submitDataArr[1].driverNum){
        error = `${this.carInfoData[0].title} 与 ${this.carInfoData[1].title} 的驾驶证号不能相同`;
      }
    }

    if(this.submitDataArr.length === 3){
      if(this.submitDataArr[0].phone === this.submitDataArr[1].phone){
        error = `${this.carInfoData[0].title} 与 ${this.carInfoData[1].title} 的手机号不能相同`;
      }else if(this.submitDataArr[0].phone === this.submitDataArr[2].phone){
        error = `${this.carInfoData[0].title} 与 ${this.carInfoData[2].title} 的手机号不能相同`;
      }else if(this.submitDataArr[1].phone === this.submitDataArr[2].phone){
        error = `${this.carInfoData[1].title} 与 ${this.carInfoData[2].title} 的手机号不能相同`;
      }else if(this.submitDataArr[0].driverNum === this.submitDataArr[1].driverNum){
        error = `${this.carInfoData[0].title} 与 ${this.carInfoData[1].title} 的驾驶证号不能相同`;
      }else if(this.submitDataArr[0].driverNum === this.submitDataArr[2].driverNum){
        error = `${this.carInfoData[0].title} 与 ${this.carInfoData[2].title} 的驾驶证号不能相同`;
      }else if(this.submitDataArr[1].driverNum === this.submitDataArr[2].driverNum){
        error = `${this.carInfoData[1].title} 与 ${this.carInfoData[2].title} 的驾驶证号不能相同`;
      }
    }

    if(error) {
      this.setState({loading:false});
      Toast.showShortCenter(error);
      return;
    }

     //提交信息
     let handleWay = (this.carInfoData.length) > 1?'02':'01';
     let success = await StorageHelper.saveStep2_3(handleWay, this.submitDataArr);
     this.setState({loading: false})
     //提交成功后跳转到下个页面
     if(success) this.props.navigation.navigate('GatheringCardPhotoView');
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
    return(!name || name.length < 2 || name.length > 10)
  }
  getNowTimeString(){
    let d = new Date();
    let year = d.getFullYear();
    let month = (d.getMonth()+1) > 10 ? (d.getMonth()+1) : '0'+(d.getMonth()+1);
    let day = d.getDate() > 10 ? d.getDate() : '0'+d.getDate();
    return year+"-"+month+"-"+day;
  }
  //增加其他车信息
  addOtherCarInfo(){
    if (this.carInfoData.length < 3) {
      this.carInfoData.splice(this.carInfoData.length,0,{title:this.addOtherTitle[this.carInfoData.length - 1],carNumArr:[getProvincialData(),getNumberData()]});
      this.setState({
        refresh:true
      })
      this.submitDataArr.push(this.addOtherInfo[this.carInfoData.length - 2])
    } else {
      Toast.showShortCenter('最多添加三个当事人');
    }
  }
  //删除其他车辆信息
  deleteItem(index){
    this.carInfoData.splice(index,1);
    this.submitDataArr.splice(index,1)
    this.setState({
      refresh:true
    })
  }
  onChangeText(text,index,type) {
    switch (type) {
      case 'Name':
        this.submitDataArr[index].name = text;
        break;
      case 'Phone':
        if(TextUtility.checkNumber(text)){
          this.submitDataArr[index].phone = text;
        }
        break;
      case 'DrivingLicense':
        if(TextUtility.checkNumber(text)){
          this.submitDataArr[index].driverNum = text;
        }
        break;
      case 'InsuranceCertificateNum':
        this.submitDataArr[index].carInsureNumber = text;
        break;
      case 'OtherCarType':
        this.submitDataArr[index].carType = text;
        break;
      default:
    }
    this.forceUpdate();
  }
  //下拉选择
  showTypePicker(typeData,index,type) {
      let self = this;
      Picker.init({
      pickerData: typeData,
      pickerConfirmBtnText:'确定',
      pickerCancelBtnText:'取消',
      pickerTitleText:'请选择',
      onPickerConfirm: data => {
        if (type == 'carTypeData') {
          if (data[0] == '其他') {
            self.setState({
              showOtherCarTextInput: true
            })
          } else {
            self.submitDataArr[index].carType = data[0];
            self.setState({
              showOtherCarTextInput: false
            })
          }
        } else if (type == 'insuranceCompanyData') {
          let w = self.insuranceCompanyData[self.insuranceCompanyLabel.indexOf(data[0])]
          self.submitDataArr[index].insureCompanyCode = w.inscomcode;
          self.submitDataArr[index].insureCompanyName = w.inscomname;
        }
        this.setState({
          refresh:true
        })
      }
     });
     Picker.show();
  }
  renderOnePersonInfo(value,index){
    return (
      <View style={{backgroundColor:'#ffffff'}} key={index}>
        <View style={{width:W, height:(index>0)?10:0, backgroundColor:backgroundGrey}} />
        <View style={{marginTop:10,flexDirection:'row',paddingTop:10,paddingBottom:10,justifyContent:'space-between'}}>
          <View style={{flexDirection:'row',marginLeft:15}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10,alignSelf:'center'}}>{`${value.title}当事人`}</Text>
          </View>
          {(index == this.carInfoData.length - 1 && index !== 0)?<TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={()=>this.deleteItem(index)} underlayColor='transparent'>
            <Image style={{width:20,height:20}} source={require('./image/delete.png')}/>
          </TouchableHighlight>:null}
        </View>

        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />
        <View style={{flexDirection: 'row', alignItems:'center', paddingLeft: 20}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Input label={'姓名: '} placeholder={'请输入当事人姓名'} style={{flex:1, height: 40, paddingLeft:5}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'Name') }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection: 'row', alignItems:'center', paddingLeft: 20}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Input label={'联系方式: '} placeholder={'请输入当事人联系方式'} value={this.submitDataArr[index].phone} maxLength={11} keyboardType={'numeric'} style={{flex:1, height: 40, paddingLeft:5}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'Phone') }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection: 'row', alignItems:'center', paddingLeft: 20}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Input label={'驾驶证号: '} placeholder={'请输入当事人驾驶证号'} value={this.submitDataArr[index].driverNum} maxLength={18} keyboardType={'numeric'} style={{flex:1, height: 40, paddingLeft:5}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'DrivingLicense') }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection:'row',marginLeft:20,paddingVertical:5, alignItems: 'center'}}>
          <SelectCarNum
            label={'车牌号: '}
            plateNum={this.submitDataArr[index].licensePlateNum}
            hasStar={true}
            style={{flex:1,marginRight:15}}
            onChangeValue={(text)=> {
              this.submitDataArr[index].licensePlateNum = text;
              this.setState({refresh:true})
            }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flex:1,paddingLeft:20}}>
          <View style={{flexDirection:'row',height:40,marginRight:15,alignItems:'center'}}>
            <Text style={{fontSize:12,color:'red'}}>*</Text>
            <Text style={{fontSize:14,color:formLeftText,marginLeft:5}}>车辆类型:</Text>
            <TouchableHighlight onPress={() => this.showTypePicker(this.carTypeData,index,'carTypeData')} underlayColor='transparent' style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontSize:14,paddingLeft:13,color:formLeftText,marginLeft:10,marginRight:10}} >{this.state.showOtherCarTextInput?'其他':this.submitDataArr[index].carType}</Text>
                <Image style={{width:7,height:12,resizeMode:'contain'}} source={require('./image/right_arrow.png')}/>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{width:W,height:this.state.showOtherCarTextInput?1:0,backgroundColor:backgroundGrey}} />
          {
            this.state.showOtherCarTextInput?
              <Input label={'其他类型'} placeholder={'请输入其他车辆类型'} maxLength={18} style={{flex:1, height: 40, paddingLeft:10}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'OtherCarType') }}/>
              :
              null
          }
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flex:1,flexDirection:'row',marginLeft:20,height:40,marginRight:15,alignItems:'center'}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:14,color:formLeftText,marginLeft:5}}>保险公司:</Text>
          <TouchableHighlight onPress={() => this.showTypePicker(this.insuranceCompanyLabel,index,'insuranceCompanyData')} underlayColor='transparent' style={{flex:1}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
              <Text style={{fontSize:14,paddingLeft:13,color:formLeftText,marginLeft:10,marginRight:10}}>{this.submitDataArr[index].insureCompanyName}</Text>
              <Image style={{width:7,height:12,resizeMode:'contain'}} source={require('./image/right_arrow.png')}/>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection: 'row', alignItems:'center', paddingLeft: 22}}>
          <Text style={{fontSize:12,color:'red'}}></Text>
          <Input label={'保单号: '} placeholder={'请输入交强险保单号'} keyboardType={'email-address'}  maxLength={40} style={{flex:1, height: 40, paddingLeft:10}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'InsuranceCertificateNum') }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10}}>
          <Text style={{fontSize:14,color:formLeftText,marginLeft:10}}>保险到期日:</Text>
          <DatePicker
            style={{marginTop:-12,flex:1}}
            date={this.submitDataArr[index].carInsureDueDate}
            mode="date"
            format="YYYY-MM-DD"
            confirmBtnText="确定"
            cancelBtnText="取消"
            iconSource={require('./image/right_arrow.png')}
            customStyles={{
              dateIcon: {
                width:7,
                height:12,
                marginRight:15
              },
              dateInput: {
                borderColor:'#ffffff',
                height:25,
                marginRight:5,
                alignItems:'flex-end'
              }
            }}
            onDateChange={(date) => {
              // console.log('#### date -->> ', date);
              this.submitDataArr[index].carInsureDueDate = date;
              this.setState({
                // date: Tool.handleTime(date,true,'date')
                carInsureDueDate: date
              })
            }}
          />
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />
      </View>
    )
  }
  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
           {this.carInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
           <View style={{marginLeft:15,marginTop:30,marginBottom:15,flexDirection:'row'}}>
             <XButton title={'+增加当事人'} onPress={() => this.addOtherCarInfo()} disabled={(this.submitDataArr.length == 3 || this.handleWay === '03')} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
             <XButton title={'继续采集信息'} onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}}/>
           </View>
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

module.exports.GatheringPartyInformationView = connect()(GatheringPartyInformationView)

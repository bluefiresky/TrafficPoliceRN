/**
* 协警当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform, InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule,getProvincialData,getLetterData,getNumberData } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, TipModal, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton, SelectCarNum } from '../../components/index.js';  /** 自定义组件 */
import Tool from '../../utility/Tool';
import { StorageHelper, Utility } from '../../utility/index.js';

class AGatheringPartyInformationView extends Component {

  constructor(props){
    super(props);

    this.state = {
      refresh:false,
      carInsureDueDate: Utility.formatDate('yyyy-MM-dd'),
      showOtherCarTextInput: false,
      loading: false,
    }
    this.partyName = '';
    this.partyPhone = '';
    this.partyDrivingLicense = '';
    this.partyInsuranceCertificateNum = '';
    //提交的内容
    this.jiafangInfo = {name:'',phone:'',driverNum:'',carInsureNumber:'',carType:'',insureCompanyCode:'',insureCompanyName: '',licensePlateNum:'',carInsureDueDate:this.state.carInsureDueDate,carDamagedPart: ''};
    this.yifangInfo = {name:'',phone:'',driverNum:'',carInsureNumber:'',carType:'',insureCompanyCode:'',insureCompanyName: '',licensePlateNum:'',carInsureDueDate:this.state.carInsureDueDate,carDamagedPart: ''};
    this.bingfangInfo = {name:'',phone:'',driverNum:'',carInsureNumber:'',carType:'',insureCompanyCode:'',insureCompanyName: '',licensePlateNum:'',carInsureDueDate:this.state.carInsureDueDate,carDamagedPart: ''};
    this.carInfoData = [{title:'甲方',carNumArr:[getProvincialData(),getNumberData()]}];
    this.addOtherTitle = ['乙方','丙方'];
    this.addOtherInfo = [this.yifangInfo,this.bingfangInfo];
    this.submitDataArr = [this.jiafangInfo];
    this.handleWay = null;
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async ()=>{
      this.setState({loading: true})
      let info = await StorageHelper.getCurrentCaseInfo();
      this.handleWay = info.handleWay;
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
       if (!this.submitDataArr[i].name){
         error = `请输入${this.carInfoData[i].title}当事人姓名`
         break;
       }
       if (!this.checkPhone(this.submitDataArr[i].phone)) {
         error = `${this.carInfoData[i].title}手机号输入有误`
         break;
       }
       if (!this.submitDataArr[i].driverNum) {
         error = `请输入${this.carInfoData[i].title}驾驶证号`
         break;
       }
       if (!this.submitDataArr[i].licensePlateNum) {
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
       if (!this.submitDataArr[i].carInsureNumber) {
         error = `请输入${this.carInfoData[i].title}保单号`
         break;
       }
     }
     if(error) {
       this.setState({loading:false});
       Toast.showShortCenter(error);
       return;
     }

     //提交信息
     let success = await StorageHelper.saveStep3(this.submitDataArr);

     this.setState({loading:false})
     //提交成功后跳转到下个页面
     if(success) this.props.navigation.navigate('AGatheringCardPhotoView');
  }
  //验证手机号
  checkPhone(phone){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!phone || phone.indexOf(1) !== 0 || phone.length !== 11 || !reg.test(phone)) ? false:true;
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
        this.submitDataArr[index].phone = text;
        break;
      case 'DrivingLicense':
        this.submitDataArr[index].driverNum = text;
        break;
      case 'InsuranceCertificateNum':
        this.submitDataArr[index].carInsureNumber = text;
        break;
      case 'OtherCarType':
        this.submitDataArr[index].carType = text;
        break;
      default:
    }
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
          <Input label={'联系方式: '} placeholder={'请输入当事人联系方式'} keyboardType={'numeric'} style={{flex:1, height: 40, paddingLeft:5}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'Phone') }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection: 'row', alignItems:'center', paddingLeft: 20}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Input label={'驾驶证号: '} placeholder={'请输入当事人驾驶证号'} keyboardType={'numeric'} style={{flex:1, height: 40, paddingLeft:5}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'DrivingLicense') }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection:'row',marginLeft:20, paddingVertical:5, alignItems: 'center'}}>
          <SelectCarNum label={'车牌号: '} hasStar={true} style={{flex:1,marginRight:15}} provincialData={value.carNumArr[0]} numberData={value.carNumArr[1]} onChangeValue={(text)=> { this.submitDataArr[index].licensePlateNum = text; }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flex:1,paddingLeft:20}}>
          <View style={{flexDirection:'row',height:40,marginRight:15,alignItems:'center'}}>
            <Text style={{fontSize:12,color:'red'}}>*</Text>
            <Text style={{fontSize:14,color:formLeftText,marginLeft:5}}>车辆类型:</Text>
            <TouchableHighlight onPress={() => this.showTypePicker(this.carTypeData,index,'carTypeData')} underlayColor='transparent' style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View style={{flex:1}}/>
                <Text style={{fontSize:14,color:formLeftText,marginLeft:10,marginRight:10}} >{this.state.showOtherCarTextInput?'其他':this.submitDataArr[index].carType}</Text>
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
              <View style={{flex:1}}></View>
              <Text style={{fontSize:14,color:formLeftText,marginLeft:10,marginRight:10}}>{this.submitDataArr[index].insureCompanyName}</Text>
              <Image style={{width:7,height:12,resizeMode:'center'}} source={require('./image/right_arrow.png')}/>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />

        <View style={{flexDirection: 'row', alignItems:'center', paddingLeft: 20}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Input label={'保单号: '} placeholder={'请输入交强险保单号'} maxLength={40} style={{flex:1, height: 40, paddingLeft:5}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'InsuranceCertificateNum') }}/>
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
              console.log('#### date -->> ', date);
              this.submitDataArr[index].carInsureDueDate = date;
              this.setState({
                refresh: true
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
        <ProgressView show={this.state.loading} hasTitleBar={true}/>
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

module.exports.AGatheringPartyInformationView = connect()(AGatheringPartyInformationView)

/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule,getProvincialData,getNumberData } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, TipModal } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton, SelectCarNum } from '../../components/index.js';  /** 自定义组件 */
import Tool from '../../utility/Tool';
import { StorageHelper } from '../../utility/index.js';

const personList = [
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

class GatheringPartyInformationView extends Component {

  constructor(props){
    super(props);
    this.carTypeData = ['大型载客汽车','中型载客汽车','小型载客汽车','微型载客汽车','重型载货汽车','中型载货汽车','轻型载货汽车','微型载货汽车','使馆汽车','领馆汽车','境外汽车','外籍汽车','香港入出境车','澳门入出境车','三轮汽车','低速货车','挂车','其他'];
    this.insuranceCompanyData = ['太平洋','平安','人保'];
    this.state = {
      refresh:false,
      date: Tool.handleTime(Tool.getTime("yyyy-MM-dd"),false,'date'),
      showOtherCarTextInput: false
    }
    this.partyName = '';
    this.partyPhone = '';
    this.partyDrivingLicense = '';
    this.partyInsuranceCertificateNum = '';
    //提交的内容
    this.jiafangInfo = {name:'',phone:'',drivingLicense:'',insuranceCertificateNum:'',carTypeData:'',insuranceCompanyData: '',carNum:'',date:this.getNowTimeString()};
    this.yifangInfo = {name:'',phone:'',drivingLicense:'',insuranceCertificateNum:'',carTypeData:'',insuranceCompanyData: '',carNum:'',date:this.getNowTimeString()};
    this.bingfangInfo = {name:'',phone:'',drivingLicense:'',insuranceCertificateNum:'',carTypeData:'',insuranceCompanyData: '',carNum:'',date:this.getNowTimeString()};
    this.carInfoData = [{title:'甲方',carNumArr:[getProvincialData(),getNumberData()]}];
    this.addOtherTitle = ['乙方','丙方'];
    this.addOtherInfo = [this.yifangInfo,this.bingfangInfo];
    this.submitDataArr = [this.jiafangInfo];
  }
  //下一步
  gotoNext(){
    //检测必填项
    //  for (var i = 0; i < this.submitDataArr.length; i++) {
    //    if (!this.submitDataArr[i].name) {
    //      Toast.showShortCenter(`请输入${this.carInfoData[i].title}当事人姓名`)
    //      return
    //    }
    //    if (!this.checkPhone(this.submitDataArr[i].phone)) {
    //      Toast.showShortCenter(`${this.carInfoData[i].title}手机号输入有误`)
    //      return
    //    }
    //    if (!this.submitDataArr[i].drivingLicense) {
    //      Toast.showShortCenter(`请输入${this.carInfoData[i].title}驾驶证号`)
    //      return
    //    }
    //    if (!this.submitDataArr[i].carNum) {
    //      Toast.showShortCenter(`请输入${this.carInfoData[i].title}车牌号`)
    //      return
    //    }
    //    if (!this.submitDataArr[i].insuranceCompanyData) {
    //      Toast.showShortCenter(`请输入${this.carInfoData[i].title}车辆类型`)
    //      return
    //    }
    //    if (!this.submitDataArr[i].insuranceCompanyData) {
    //      Toast.showShortCenter(`请输入${this.carInfoData[i].title}保险公司`)
    //      return
    //    }
    //  }
     //提交信息
     let handleWay = (this.carInfoData.length) > 1?'01':'02';
     StorageHelper.saveStep2_3(handleWay, personList);

     //提交成功后跳转到下个页面
     this.props.navigation.navigate('GatheringCardPhotoView');
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
        this.submitDataArr[index].drivingLicense = text;
        break;
      case 'InsuranceCertificateNum':
        this.submitDataArr[index].insuranceCertificateNum = text;
        break;
      case 'OtherCarType':
        this.submitDataArr[index].carTypeData = text;
        break;
      default:
    }
  }
  //下拉选择
  showTypePicker(typeData,index,type) {
      Picker.init({
      pickerData: typeData,
      pickerConfirmBtnText:'确定',
      pickerCancelBtnText:'取消',
      pickerTitleText:'请选择',
      onPickerConfirm: data => {
        if (type == 'carTypeData') {
          if (data[0] == '其他') {
            this.setState({
              showOtherCarTextInput: true
            })
          } else {
            this.submitDataArr[index].carTypeData = data[0];
            this.setState({
              showOtherCarTextInput: false
            })
          }
        } else if (type == 'insuranceCompanyData') {
          this.submitDataArr[index].insuranceCompanyData = data[0];
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
      <View style={{marginTop:10,backgroundColor:'#ffffff'}} key={index}>
        <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10,justifyContent:'space-between'}}>
          <View style={{flexDirection:'row',marginLeft:15}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10,alignSelf:'center'}}>{`${value.title}当事人`}</Text>
          </View>
          {(index == this.carInfoData.length - 1 && index !== 0)?<TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={()=>this.deleteItem(index)} underlayColor='transparent'>
            <Image style={{width:20,height:20}} source={require('./image/delete.png')}/>
          </TouchableHighlight>:null}
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:5}}>姓名：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'Name') } }
                     clearButtonMode={'while-editing'}
                     placeholder = {'请输入当事人姓名'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:5}}>联系方式：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'Phone') } }
                     clearButtonMode={'while-editing'}
                     keyboardType={'numeric'}
                     maxLength={11}
                     placeholder = {'请输入当事人联系方式'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:5}}>驾驶证号：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'DrivingLicense') } }
                     clearButtonMode={'while-editing'}
                     maxLength={18}
                     placeholder = {'请输入当事人驾驶证号'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red',alignSelf:'center'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:5,alignSelf:'center'}}>车牌号：</Text>
          <SelectCarNum style={{flex:1,marginRight:15}}
                        provincialData={value.carNumArr[0]}
                        numberData={value.carNumArr[1]}
                        onChangeValue={(text)=> {
                          this.submitDataArr[index].carNum = text;
                        }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flex:1}}>
          <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10,marginRight:15}}>
            <Text style={{fontSize:12,color:'red'}}>*</Text>
            <Text style={{fontSize:13,color:formLeftText,marginLeft:5}}>车辆类型：</Text>
            <TouchableHighlight onPress={() => this.showTypePicker(this.carTypeData,index,'carTypeData')} underlayColor='transparent' style={{flex:1}}>
              <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flex:1}}></View>
                <Text style={{fontSize:13,color:formLeftText,marginLeft:10,marginRight:30}} >{this.submitDataArr[index].carTypeData}</Text>
                <Image style={{width:7,height:12,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
              </View>
            </TouchableHighlight>
          </View>
          {this.state.showOtherCarTextInput ? <View style={{height:40}}>
            <TextInput style={{fontSize: 13,flex:1,height:35,textAlign:'right',marginRight:22}}
                       onChangeText={(text) => { this.onChangeText(text,index,'OtherCarType') } }
                       maxLength={18}
                       placeholder = {'请输入其他车辆类型'}/>
          </View>:null}
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flex:1,flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10,marginRight:15}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:5}}>保险公司：</Text>
          <TouchableHighlight onPress={() => this.showTypePicker(this.insuranceCompanyData,index,'insuranceCompanyData')} underlayColor='transparent' style={{flex:1}}>
            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flex:1}}></View>
              <Text style={{fontSize:13,color:formLeftText,marginLeft:10,marginRight:30}}>{this.submitDataArr[index].insuranceCompanyData}</Text>
              <Image style={{width:7,height:12,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:10}}>保单号：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'InsuranceCertificateNum') } }
                     clearButtonMode={'while-editing'}
                     maxLength={40}
                     placeholder = {'请输入交强险保单号'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10}}>
          <Text style={{fontSize:13,color:formLeftText,marginLeft:10}}>保险到期日：</Text>
          <DatePicker
            style={{marginTop:-12,flex:1}}
            date={this.state.date}
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
                marginRight:15,
                alignItems:'flex-end'
              }
            }}
            onDateChange={(date) => {
              this.submitDataArr[index].date = Tool.handleTime(date,true,'date')
              this.setState({
                date: Tool.handleTime(date,true,'date')
              })
            }}
          />
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         {this.carInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{marginLeft:15,marginTop:30,marginBottom:15,flexDirection:'row'}}>
           <XButton title={'+增加当事人'} onPress={() => this.addOtherCarInfo()} disabled={(this.submitDataArr.length == 3)} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
           <XButton title={'继续采集信息'} onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}}/>
         </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.GatheringPartyInformationView = connect()(GatheringPartyInformationView)

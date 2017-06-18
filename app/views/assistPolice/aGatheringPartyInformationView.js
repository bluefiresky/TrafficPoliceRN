/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule,getProvincialData,getLetterData,getNumberData } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton, SelectCarNum } from '../../components/index.js';  /** 自定义组件 */
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

class AGatheringPartyInformationView extends Component {

  constructor(props){
    super(props);
    this.carTypeData = ['小型轿车','大型货车','重型挂车','中型越野汽车','其它'];
    this.insuranceCompanyData = ['太平洋','平安','人保'];
    this.state = {
      refresh:false,
      date: new Date()
    }
    this.partyName = '';
    this.partyPhone = '';
    this.partyDrivingLicense = '';
    this.partyInsuranceCertificateNum = '';
    //提交的内容
    this.jiafangInfo = {name:'',phone:'',drivingLicense:'',insuranceCertificateNum:'',carTypeData:this.carTypeData[0],insuranceCompanyData: this.insuranceCompanyData[0],carNum:'',date:this.getNowTimeString()};
    this.yifangInfo = {name:'',phone:'',drivingLicense:'',insuranceCertificateNum:'',carTypeData:this.carTypeData[0],insuranceCompanyData: this.insuranceCompanyData[0],carNum:'',date:this.getNowTimeString()};
    this.bingfangInfo = {name:'',phone:'',drivingLicense:'',insuranceCertificateNum:'',carTypeData:this.carTypeData[0],insuranceCompanyData: this.insuranceCompanyData[0],carNum:'',date:this.getNowTimeString()};
    this.carInfoData = [{title:'甲方',carNumArr:[getProvincialData(),getLetterData(),getNumberData()]}];
    this.addOtherTitle = ['乙方','丙方'];
    this.addOtherInfo = [this.yifangInfo,this.bingfangInfo];
    this.submitDataArr = [this.jiafangInfo];
  }
  //下一步
  gotoNext(){
    //检测必填项
     for (var i = 0; i < this.submitDataArr.length; i++) {
       if (!this.checkPhone(this.submitDataArr[i].phone)) {
         Toast.showShortCenter(`${this.carInfoData[i].title}手机号输入有误`)
         return
       }
       if (!this.submitDataArr[i].name) {
         Toast.showShortCenter(`请输入${this.carInfoData[i].title}当事人姓名`)
         return
       }
       if (!this.submitDataArr[i].drivingLicense) {
         Toast.showShortCenter(`请输入${this.carInfoData[i].title}驾驶证号`)
         return
       }
       if (!this.submitDataArr[i].carNum) {
         Toast.showShortCenter(`请输入${this.carInfoData[i].title}车牌号`)
         return
       }
       if (!this.submitDataArr[i].insuranceCompanyData) {
         Toast.showShortCenter(`请输入${this.carInfoData[i].title}保险公司`)
         return
       }
     }
     //提交信息

     //提交成功后跳转到下个页面
     let { index } = this.props.navigation.state.params
     this.props.navigation.navigate('AGatheringCardPhotoView',{index:index});
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
      this.carInfoData.splice(this.carInfoData.length,0,{title:this.addOtherTitle[this.carInfoData.length - 1],carNumArr:[getProvincialData(),getLetterData(),getNumberData()]});
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
          this.carInfoData[index].carTypeData = data[0];
          this.submitDataArr[index].carTypeData = data[0];
        } else if (type == 'insuranceCompanyData') {
          this.carInfoData[index].insuranceCompanyData = data[0];
          this.submitDataArr[index].insuranceCompanyData = data[0];
        }
        this.setState({
          refresh:true
        })
      },
      onPickerSelect: data => {
        if (type == 'carTypeData') {
          this.carInfoData[index].carTypeData = data[0];
          this.submitDataArr[index].carTypeData = data[0];
        } else if (type == 'insuranceCompanyData') {
          this.carInfoData[index].insuranceCompanyData = data[0];
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
            <View style={{width:2,height:15,backgroundColor:'blue',alignSelf:'center'}}></View>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10,alignSelf:'center'}}>{`${value.title}当事人`}</Text>
          </View>
          {(index == this.carInfoData.length - 1 && index !== 0)?<TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={()=>this.deleteItem(index)} underlayColor='transparent'>
            <Image style={{width:25,height:25}} source={require('./image/delete.png')}/>
          </TouchableHighlight>:null}
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:5}}>姓名：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'Name') } }
                     clearButtonMode={'while-editing'}
                     placeholder = {'请输入当事人姓名'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:5}}>联系方式：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'Phone') } }
                     clearButtonMode={'while-editing'}
                     keyboardType={'numeric'}
                     placeholder = {'请输入当事人手机号'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:5}}>驾驶证号：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'DrivingLicense') } }
                     clearButtonMode={'while-editing'}
                     placeholder = {'请输入当事人驾驶证号'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red',alignSelf:'center'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:5,alignSelf:'center'}}>车牌号：</Text>
          <SelectCarNum style={{flex:1,marginRight:15}}
                        provincialData={value.carNumArr[0]}
                        letterData={value.carNumArr[1]}
                        numberData={value.carNumArr[2]}
                        onChangeValue={(text)=> {
                          this.submitDataArr[index].carNum = text;
                        }}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:10}}>交通方式：</Text>
          <Text style={{fontSize:13,color:formLeftText}}>驾驶：</Text>
          <TouchableHighlight onPress={() => this.showTypePicker(this.carTypeData,index,'carTypeData')} underlayColor='transparent'>
            <View style={{flex:1,flexDirection:'row'}}>
              <Text style={{fontSize:13,color:formLeftText,marginLeft:10}} >{this.submitDataArr[index].carTypeData}</Text>
              <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:12,color:'red'}}>*</Text>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:5}}>保险公司：</Text>
          <TouchableHighlight onPress={() => this.showTypePicker(this.insuranceCompanyData,index,'insuranceCompanyData')} underlayColor='transparent'>
            <View style={{flex:1,flexDirection:'row'}}>
              <Text style={{fontSize:13,color:formLeftText,marginLeft:10}}>{this.submitDataArr[index].insuranceCompanyData}</Text>
              <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:10}}>保险单号：</Text>
          <TextInput style={{fontSize: 13,flex:1}}
                     onChangeText={(text) => { this.onChangeText(text,index,'InsuranceCertificateNum') } }
                     clearButtonMode={'while-editing'}
                     placeholder = {'请输入交强险保单号'}/>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10}}>
          <Text style={{fontSize:13,color:formLeftText,width:85,marginLeft:10}}>保险到期日：</Text>
          <DatePicker
            style={{marginTop:-12,marginLeft:-10}}
            date={this.state.date}
            mode="date"
            format="YYYY-MM-DD"
            confirmBtnText="确定"
            cancelBtnText="取消"
            customStyles={{
              dateIcon: {
                height:0
              },
              dateInput: {
                borderColor:'#ffffff',
                height:25,
              }
            }}
            onDateChange={(date) => {
              this.submitDataArr[index].date = date
              this.setState({
                date: date
              })
            }}
          />
          <Image style={{width:15,height:10,marginLeft:-40,marginTop:2}} source={require('./image/down_arrow.png')}/>
        </View>
      </View>
    )
  }
  render(){
    let { index } = this.props.navigation.state.params
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         {this.carInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{marginTop:10,backgroundColor:'#ffffff'}}>
           <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
             <XButton title='增加当事人' onPress={() => this.addOtherCarInfo()} disabled={(index == 2)}/>
           </View>
           <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
             <XButton title='继续采集信息' onPress={() => this.gotoNext()}/>
           </View>
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

module.exports.AGatheringPartyInformationView = connect()(AGatheringPartyInformationView)

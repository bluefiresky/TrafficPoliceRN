/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

class ConfirmInformationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
    }
    this.rowNum = 2;
    this.rowMargin = 15;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
    this.partyVerData = [{name:'甲方当事人',ver:''},{name:'乙方当事人',ver:''},{name:'丙方当事人',ver:''}];

    this.accidentData = {basicInfo:{accidentTime:'2017年6月4日 17时8分',weather:'晴',accidentSite:'北京市朝 阳区'}, accidentPhoto:[{'title': '侧前方',imageURL:''},{'title': '侧后方',imageURL:''},{'title': '碰撞部位',imageURL:''},{'title': '其它现场照片',imageURL:''}],
    partyInfo:[{title:'甲方',name:'XXX',phone:'13333333333',drivingLicense:'XXX',carNum:'XXX',carType:'XXX',insuranceCompany:'XXX',insuranceCertificateNum:'XXX',insuranceTime:'XXX'},{title:'乙方',name:'XXX',phone:'13333333333',drivingLicense:'XXX',carNum:'XXX',carType:'XXX',
    insuranceCompany:'XXX',insuranceCertificateNum:'XXX',insuranceTime:'XXX'}],signData:{}};
  }
  //下一步
  gotoNext(){
    if (!this.accidentData.basicInfo.accidentTime) {
      Toast.showShortCenter('事故时间不能为空')
      return
    }
    if (!this.accidentData.basicInfo.weather) {
      Toast.showShortCenter('天气不能为空')
      return
    }
    if (!this.accidentData.basicInfo.accidentSite) {
      Toast.showShortCenter('事故地点不能为空')
      return
    }
    let data = this.accidentData.partyInfo;
    for (var i = 0; i < data.length; i++) {
      if (!this.checkPhone(data[i].phone)) {
        Toast.showShortCenter(`${data[i].title}手机号输入有误`)
        return
      }
      if (!data[i].name) {
        Toast.showShortCenter(`请输入${data[i].title}当事人姓名`)
        return
      }
      if (!data[i].drivingLicense) {
        Toast.showShortCenter(`请输入${data[i].title}驾驶证号`)
        return
      }
      if (!data[i].carNum) {
        Toast.showShortCenter(`请输入${data[i].title}车牌号`)
        return
      }
      if (!data[i].insuranceCompany) {
        Toast.showShortCenter(`请输入${data[i].title}保险公司`)
        return
      }
      if (!data[i].carType) {
        Toast.showShortCenter(`请输入${data[i].title}车辆类型`)
        return
      }
      if (!data[i].insuranceCertificateNum) {
        Toast.showShortCenter(`请输入${data[i].title}保险单号`)
        return
      }
      if (!data[i].insuranceTime) {
        Toast.showShortCenter(`请输入${data[i].title}保险到期日`)
        return
      }
    }
    this.props.navigation.navigate('AccidentFactAndResponsibilityView');
  }
  //验证手机号
  checkPhone(phone){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!phone || phone.indexOf(1) !== 0 || phone.length !== 11 || !reg.test(phone)) ? false:true;
  }
  renderOnePersonInfo(value,index){
    return (
      <View style={{backgroundColor:'#ffffff'}} key={index}>
        <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`${value.title}当事人`}</Text>
        </View>
        {this.renderRowItem('姓名',value.name,index,'Name')}
        {this.renderRowItem('联系方式',value.phone,index,'Phone')}
        {this.renderRowItem('驾驶证号',value.drivingLicense,index,'DrivingLicense')}
        {this.renderRowItem('车牌号',value.carNum,index,'CarNum')}
        {this.renderRowItem('交通方式',value.carType,index,'CarType')}
        {this.renderRowItem('保险公司',value.insuranceCompany,index,'InsuranceCompany')}
        {this.renderRowItem('保险单号',value.insuranceCertificateNum,index,'InsuranceCertificateNum')}
        {this.renderRowItem('保险到期日',value.insuranceTime,index,'InsuranceTime')}
      </View>
    )
  }
  onChangeText(text,index,type){
    switch (type) {
      case 'AccidentTime':
        this.accidentData.basicInfo.accidentTime = text;
        break;
      case 'Weather':
        this.accidentData.basicInfo.weather = text;
        break;
      case 'AccidentSite':
        this.accidentData.basicInfo.accidentSite = text;
        break;
      case 'Name':
        this.accidentData.partyInfo[index].name = text;
        break;
      case 'Phone':
        this.accidentData.partyInfo[index].phone = text;
        break;
      case 'DrivingLicense':
        this.accidentData.partyInfo[index].drivingLicense = text;
        break;
      case 'CarNum':
        this.accidentData.partyInfo[index].carNum = text;
        break;
      case 'CarType':
        this.accidentData.partyInfo[index].carType = text;
        break;
      case 'InsuranceCompany':
        this.accidentData.partyInfo[index].insuranceCompany = text;
        break;
      case 'InsuranceCertificateNum':
        this.accidentData.partyInfo[index].insuranceCertificateNum = text;
        break;
      case 'InsuranceTime':
        this.accidentData.partyInfo[index].insuranceTime = text;
        break;
      default:
    }
  }
  renderRowItem(title,value,index,type){
    return (
      <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
        <Text style={{fontSize:13,color:formLeftText,alignSelf:'center'}}>{`${title}：`}</Text>
        <View style={{flex:1}}>
          <TextInput style={{fontSize: 13,flex:1,height:20}}
                     onChangeText={(text) => { this.onChangeText(text,index,type) } }
                     clearButtonMode={'while-editing'}
                     placeholder = {`请输入${title}`}
                     defaultValue={value}/>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginTop:5}}></View>
        </View>
      </View>
    )
  }
  renderItem({item,index}) {
    return (
      <TouchableHighlight style={{marginLeft:this.rowMargin,marginBottom:15}} underlayColor={'transparent'} onPress={() => this.takePhoto(index)}>
        <View style={{flex:1}}>
          <Image style={{width: this.rowWH,height: this.rowWH*0.7,backgroundColor:'green',justifyContent:'center'}}
                 source={item.imageURL ? item.imageURL:null}>
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  renderOneParty(value,index) {
    return (
      <View style={{marginTop:20,backgroundColor:'#ffffff',flexDirection:'row'}} key={index}>
        <Text style={{marginLeft:15,color:formLeftText,fontSize:13,alignSelf:'center'}}>{`${value.title}当事人：`}</Text>
        <View style={{marginLeft:20,width:150,height:75,backgroundColor:'#D4D4D4'}}>
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>基本信息</Text>
         </View>
         <View style={{backgroundColor:'#ffffff'}}>
           {this.renderRowItem('事故时间','2017年6月4日 17时8分',null,'AccidentTime')}
           {this.renderRowItem('天气','晴',null,'Weather')}
           {this.renderRowItem('事故地点','北京市朝阳区',null,'AccidentSite')}
         </View>
         <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故现场照片</Text>
         </View>
         <View style={{flex:1,marginTop:15,backgroundColor:'#ffffff',marginRight:this.rowMargin}}>
           <FlatList
             keyExtractor={(data,index) => {return index}}
             showsVerticalScrollIndicator={false}
             data={this.accidentData.accidentPhoto}
             numColumns={this.rowNum}
             renderItem={this.renderItem.bind(this)}
           />
         </View>
         {this.accidentData.partyInfo.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>如以上信息无误，请当事人签字确认。</Text>
         </View>
         {this.accidentData.partyInfo.map((value,index) => this.renderOneParty(value,index))}
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='下一步' onPress={() => this.gotoNext()}/>
         </View>
      </ScrollView>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.ConfirmInformationView = connect()(ConfirmInformationView)

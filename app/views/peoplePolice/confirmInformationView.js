/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,Alert } from "react-native";
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
    partyInfo:[{title:'甲方',name:'XXX',phone:'13333333333',drivingLicense:'XXX',carNum:'XXX',carType:'XXX',insuranceCompany:'XXX',insuranceCertificateNum:'XXX',insuranceTime:'XXX',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]},
    {title:'乙方',name:'XXX',phone:'13333333333',drivingLicense:'XXX',carNum:'XXX',carType:'XXX',
    insuranceCompany:'XXX',insuranceCertificateNum:'XXX',insuranceTime:'XXX',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]}],signData:{}};
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
    let that = this;
    Alert.alert('提示', '请确认信息是否完整无误，提交后无法修改。' ,[{
            text : "返回修改",
            onPress : () => {}
          },{
            text : "确认无误",
            onPress : () => {
              that.props.navigation.navigate('AccidentFactAndResponsibilityView');
            }
          }])
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
  renderOnePersonInfo(value,ind){
    return (
      <View style={{backgroundColor:'#ffffff',marginTop:10}} key={ind}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`${value.title}当事人信息`}</Text>
        </View>
        <View style={{marginTop:10}}>
          {this.renderRowItem('姓名',value.name,ind,'Name')}
          {this.renderRowItem('联系方式',value.phone,ind,'Phone')}
          {this.renderRowItem('驾驶证号',value.drivingLicense,ind,'DrivingLicense')}
          {this.renderRowItem('车牌号',value.carNum,ind,'CarNum')}
          {this.renderRowItem('交通方式',value.carType,ind,'CarType')}
          {this.renderRowItem('保险公司',value.insuranceCompany,ind,'InsuranceCompany')}
          {this.renderRowItem('保险单号',value.insuranceCertificateNum,ind,'InsuranceCertificateNum')}
          {this.renderRowItem('保险到期日',value.insuranceTime,ind,'InsuranceTime')}
        </View>
        <View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}>
          {value.data.map((value,index) => this.renderImgaeItem(value,index,ind))}
        </View>
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
    let disabled = (type == 'AccidentTime' || type == 'Weather' || type == 'AccidentSite')
    return (
      <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
        <Text style={{fontSize:14,color:formLeftText,alignSelf:'center'}}>{`${title}：`}</Text>
        <View style={{flex:1}}>
          <TextInput style={{fontSize: 14,flex:1,height:20,marginTop:5}}
                     onChangeText={(text) => { this.onChangeText(text,index,type) } }
                     clearButtonMode={'while-editing'}
                     placeholder = {`请输入${title}`}
                     editable={!disabled}
                     defaultValue={value}/>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginTop:5}}></View>
        </View>
      </View>
    )
  }
  renderItem({item,index}) {
    return (
      <View style={{marginLeft:this.rowMargin,marginBottom:15}}>
        <Image style={{width: this.rowWH,height: this.rowWH*0.7,backgroundColor:'green',justifyContent:'center'}}
               source={item.imageURL ? item.imageURL:null}>
        </Image>
        <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
      </View>
    )
  }
  renderOneParty(value,index) {
    return (
      <View style={{backgroundColor:'#ffffff'}} key={index}>
        <Text style={{marginLeft:15,color:formLeftText,fontSize:15,marginTop:10}}>{`${value.title}当事人：`}</Text>
        <View style={{marginLeft:15,width:W-30,height:75,backgroundColor:'#D4D4D4',marginTop:10}}>
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{backgroundColor:'#ffffff',marginTop:10}}>
           <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
             <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
             <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>基本信息</Text>
           </View>
           <View style={{marginTop:10}}>
             {this.renderRowItem('事故时间','2017年6月4日 17时8分',null,'AccidentTime')}
             {this.renderRowItem('天气','晴',null,'Weather')}
             {this.renderRowItem('事故地点','北京市朝阳区',null,'AccidentSite')}
           </View>
         </View>
         <View style={{backgroundColor:'#ffffff',marginTop:10}}>
           <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
             <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
             <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>现场照片</Text>
           </View>
           <View style={{flex:1,marginTop:15,marginRight:this.rowMargin}}>
             <FlatList
               keyExtractor={(data,index) => {return index}}
               showsVerticalScrollIndicator={false}
               data={this.accidentData.accidentPhoto}
               numColumns={this.rowNum}
               renderItem={this.renderItem.bind(this)}
             />
           </View>
         </View>
         {this.accidentData.partyInfo.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10,backgroundColor:'#ffffff',marginTop:10}}>
           <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>如以上信息无误，请当事人签字</Text>
         </View>
         {this.accidentData.partyInfo.map((value,index) => this.renderOneParty(value,index))}
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
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

module.exports.ConfirmInformationView = connect()(ConfirmInformationView)

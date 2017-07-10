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
import { ScrollerSegment } from '../../components/index';

class ConfirmReportPartyInfoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false
    }
    this.selDataArr = [{title:'行驶证及驾驶证的有效性及真实性存在可疑',isSel:false},
                       {title:'驾驶座及周围发现血迹而驾驶员没有受伤',isSel:false},
                       {title:'驾驶员的年龄、性别、身份、职业与驾驶车型不适配',isSel:false},
                       {title:'现场发现驾驶员有饮酒迹象',isSel:false},
                       {title:'当事车辆有改变使用性质情况',isSel:false},
                       {title:'当事车辆有超长、超宽、超高、超重情况',isSel:false}];
    this.partyData = [{carNum:'冀F12332',name:'123',drivingLicence:'13217788765456556',engineNumber:'12321321',frameNumber:'3213123',responsibilityType:'全部责任',insuranceCompany:'太平洋',drivingLicenceValidte:true,drivingPermitValidte:false,isMatching:true,selDataArr:['行驶证及驾驶证的有效性及真实性存在可疑','驾驶座及周围发现血迹而驾驶员没有受伤'],
    photoArr:[{'title': '45度车辆前景照片',imageURL:''},{'title': '当事人和车辆合影',imageURL:''},{'title': '当事车辆车架号',imageURL:''}]},
    {carNum:'京F12332',name:'988',drivingLicence:'13217788765456556',engineNumber:'12313',
    frameNumber:'321321',
    responsibilityType:'全部责任',insuranceCompany:'太平洋',
    drivingLicenceValidte:true,drivingPermitValidte:true,isMatching:false,selDataArr:[],photoArr:[]}];
    this.segDatas = ['甲方当事人', '乙方当事人','丙方当事人']
    this.segArrays = [];
    this.contentArrs = [];
    this.rowNum = 2;
    this.rowMargin = 20;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
  }
  //下一步
  gotoNext(){
    this.props.navigation.navigate('InsuranceReportSuccessView',{isHaveLookJurisdiction:true,isNeedLook:false,waitForLook:false});
  }
  renderRowItem(title,value){
    return (
      <View style={{marginTop:15}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{marginLeft:15,color:formLeftText}}>{title}</Text>
          <Text style={{marginLeft:20,color:formLeftText}}>{value}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
      </View>
    )
  }
  renderPhotoItem(value,index) {
    return (
      <View style={{marginLeft:this.rowMargin,marginBottom:15}} key={index}>
          <Image style={{width: this.rowWH,height: this.rowWH * 0.5,justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}
                 source={value.imageURL ? value.imageURL:null}>
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{value.title}</Text>
      </View>
    )
  }
  renderOneParty(value) {
    return (
      <View style={{backgroundColor:'#ffffff',marginBottom:10}}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.carNum}】`}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10}}></View>
        {this.renderRowItem('当事人姓名：',value.name)}
        {this.renderRowItem('驾驶证号：',value.drivingLicence)}
        {this.renderRowItem('当事人车牌号：',value.carNum)}
        {this.renderRowItem('当事人责任类型：',value.responsibilityType)}
        {this.renderRowItem('保险公司：',value.insuranceCompany)}
        {this.renderRowItem('发动机号：',value.engineNumber)}
        {this.renderRowItem('车架号：',value.frameNumber)}
        {this.renderRowItem('驾驶证有效期是否正常：',value.drivingLicenceValidte ? '正常':'不正常')}
        {this.renderRowItem('行驶证有效期是否正常：',value.drivingPermitValidte ? '正常':'不正常')}
        {this.renderRowItem('准驾车型与车辆类型是否匹配：',value.isMatching ? '匹配' : '不匹配')}
        {value.selDataArr.length > 0 ? <View style={{marginTop:20,marginLeft:15}}>
          <Text style={{fontSize:16,color:formLeftText}}>现场情况：</Text>
          {value.selDataArr.map((value,index) => this.renderOtherTypeView(value,index))}
        </View>:null}
        {value.photoArr.length > 0 ? <View style={{flexDirection:'row',marginTop:15,flexWrap:'wrap'}}>
          {value.photoArr.map((value,index) => this.renderPhotoItem(value,index))}
        </View>:null}
      </View>
    )
  }
  renderOtherTypeView(value,index){
    return (
      <Text style={{marginTop:10,lineHeight:18,fontSize:14,color:formLeftText}} key={index}>
        {value}
      </Text>
    )
  }
  renderOneItem(index,itemData){
    return (
      <ScrollView style={{flex:1,marginBottom:64,backgroundColor:backgroundGrey}}
                   showsVerticalScrollIndicator={false} key={index}>
         <View style={{paddingVertical:10}}>
           <Text style={{fontSize:13,color:'#717171',marginLeft:15}}>
             请确认保险信息
           </Text>
         </View>
         <View style={{flex:1}}>
           {this.renderOneParty(itemData)}
         </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
         </View>
      </ScrollView>
    )
  }
  render(){
    for (var i = 0; i < this.partyData.length; i++) {
      this.segArrays.push(this.segDatas[i])
      this.contentArrs.push(this.renderOneItem(i,this.partyData[i]));
    }
    return(
      <View style={styles.container}>
        <ScrollerSegment segDatas = {this.segArrays} contentDatas={this.contentArrs} />
       </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.ConfirmReportPartyInfoView = connect()(ConfirmReportPartyInfoView)

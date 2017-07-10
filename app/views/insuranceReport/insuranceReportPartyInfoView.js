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

class InsuranceReportPartyInfoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false
    }
    this.partyData = [{carNum:'冀F12332',name:'123',responsibilityType:'全部责任',insuranceCompany:'',isReport:true},{carNum:'京F12332',name:'988',responsibilityType:'次要责任',insuranceCompany:'',isReport:false}];
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
  renderOneParty(value,index) {
    let selImage = value.isReport ? require('./image/selected.png') : require('./image/unselected.png')
    return (
      <View style={{backgroundColor:'#ffffff',marginBottom:10}} key={index}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.carNum}】`}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10}}></View>
        {this.renderRowItem('当事人姓名',value.name)}
        {this.renderRowItem('当事人车牌号',value.carNum)}
        {this.renderRowItem('当事人责任类型',value.responsibilityType)}
        {value.isReport ? <View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
            <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>保险公司</Text>
              <TouchableHighlight style={{marginRight:15}} underlayColor='transparent' onPress={()=>{console.log('1');}}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={{marginLeft:20,color:(value.insuranceCompany ? formLeftText : formRightText),marginRight:10}}>{value.insuranceCompany ? value.insuranceCompany : '请选择当事人报案保险公司'}</Text>
                  <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,alignSelf:'center'}}/>
                </View>
              </TouchableHighlight>
            </View>
          <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        </View>:null}
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15,marginBottom:15}}>
          <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>是否保险报案</Text>
          <TouchableHighlight style={{marginRight:15}} underlayColor={'transparent'} onPress={()=>{
            value.isReport = !value.isReport
            this.setState({
              refresh: true
            })
          }}>
            <Image source={selImage} style={{width:19,height:19,alignSelf:'center'}}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{paddingVertical:10}}>
           <Text style={{fontSize:13,color:'#717171',marginLeft:15}}>
             请确认保险报案当事人信息
           </Text>
         </View>
         <View style={{flex:1}}>
           {this.partyData.map((value,index) => this.renderOneParty(value,index))}
         </View>
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

module.exports.InsuranceReportPartyInfoView = connect()(InsuranceReportPartyInfoView)

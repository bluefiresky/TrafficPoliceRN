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
import Tool from '../../utility/Tool'
class InsuranceReportPartyInfoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh: false,
      loading: false
    }
    this.partyData = [];
  }
  componentDidMount(){
    let { taskno } = this.props.navigation.state.params
    this.setState({
      loading:true
    })
    this.props.dispatch( create_service(Contract.POST_ACCIDENT_PERSON, {taskNum: taskno}))
      .then( res => {
        if (res && res.personList.length > 0) {
          this.partyData = res.personList
          for (var i = 0; i < this.partyData.length; i++) {
            //1代表无责
            this.partyData[i].isReport = (this.partyData[i].dutyCode != '1')
          }
        }
        this.setState({
          loading:false
        })
    })
  }
  //下一步
  gotoNext(){
    let data = [];
    for (var i = 0; i < this.partyData.length; i++) {
      if (this.partyData[i].isReport && !this.partyData[i].insuranceCompany) {
        Toast.showShortCenter(`请选择${this.partyData[i].name}的保险报案公司`);
        return
      } else if (this.partyData[i].isReport && this.partyData[i].insuranceCompany) {
        data.push({licenseno:this.partyData[i].licensePlateNum,insurecode:this.partyData[i].insurecode,citycode:this.partyData[i].citycode})
      }
    }
    let { taskno } = this.props.navigation.state.params
    if (data.length > 0) {
      this.setState({
        loading: true
      })
      this.props.dispatch( create_service(Contract.POST_INSURE_INFO, {taskno:taskno,data:JSON.stringify(data)}))
        .then( res => {
          this.setState({
            loading: false
          })
          if (res) {
            this.props.navigation.navigate('InsuranceReportSuccessView',{openflag:res.data.openflag,taskno:taskno,needTimer:true});
          }
      })
    } else {
      Toast.showShortCenter('请选择要保险报案的当事人');
    }
  }
  renderRowItem(title,value){
    return (
      <View style={{marginTop:15}}>
        <View style={{flexDirection:'row',width:W-15}}>
          <Text style={{marginLeft:15,color:formLeftText}}>{title}</Text>
          <Text style={{marginLeft:20,color:formLeftText,flex:1}}>{value}</Text>
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
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.licensePlateNum}】`}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10}}></View>
        {this.renderRowItem('当事人姓名',value.name)}
        {this.renderRowItem('当事人车牌号',value.licensePlateNum)}
        {this.renderRowItem('当事人责任类型',value.dutyName)}
        {value.isReport ? <View style={{flex:1}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
              <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>保险公司</Text>
              <TouchableHighlight style={{marginRight:15}} underlayColor='transparent' onPress={()=>{this.props.navigation.navigate('SelectInInsuranceCompanyView',{selData:(selData)=>{
                value.insuranceCompany = selData.showData;
                value.insurecode = selData.insurecode;
                value.citycode = selData.citycode
                this.setState({
                  refresh: true
                })
              }})}}>
                <View style={{flex:1,flexDirection:'row',width:W-110,justifyContent:'space-between'}}>
                  <Text style={{marginLeft:20,color:(value.insuranceCompany ? formLeftText : formRightText),marginRight:10}}>{value.insuranceCompany ? value.insuranceCompany : '请选择当事人报案保险公司'}</Text>
                  <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,alignSelf:'center'}}/>
                </View>
              </TouchableHighlight>
            </View>
          <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        </View>:null}
        <TouchableHighlight style={{marginTop:15,marginBottom:15}} underlayColor={'transparent'} onPress={()=>{
          if (value.dutyCode != '1') {
            value.isReport = !value.isReport
            this.setState({
              refresh: true
            })
          } else {
            Toast.showShortCenter('无责方无需保险报案')
          }
        }}>
          <View style={{flexDirection:'row',justifyContent:'space-between',flex:1}}>
            <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>是否保险报案</Text>
            <Image source={selImage} style={{width:19,height:19,alignSelf:'center',marginRight:15}}/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  render(){
    let content = null;
    if (this.partyData && this.partyData.length > 0) {
      content = <ScrollView style={styles.container}
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
    } else {
      // content = <TouchableHighlight style={{flex:1,backgroundColor: backgroundGrey,justifyContent:'center'}} underlayColor={backgroundGrey}>
      //           <Text style={{}}>点击重试</Text>
      //           </TouchableHighlight>
    }
    return(
      <View style={styles.container}>
        {content}
        <ProgressView show={this.state.loading}/>
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

module.exports.InsuranceReportPartyInfoView = connect()(InsuranceReportPartyInfoView)

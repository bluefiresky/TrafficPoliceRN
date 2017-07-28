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
      refresh:false,
      loading:false
    }
    this.segDatas = ['当事人甲方', '当事人乙方','当事人丙方','当事人丁方']
    this.rowNum = 2;
    this.rowMargin = 20;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
    this.partyData = [];
  }
  componentDidMount(){
    this.setState({
      loading:true
    })
    let { taskno } = this.props.navigation.state.params
    this.props.dispatch( create_service(Contract.POST_SURVEY_DETAIL, {taskno:taskno}))
      .then( res => {
        if (res) {
          this.partyData = res.data.surveylist
        }
        this.setState({
          loading:false
        })
    })
  }
  //下一步
  gotoNext(){
    this.setState({
      loading:true
    })
    let { surveyno } = this.props.navigation.state.params
    this.props.dispatch( create_service(Contract.POST_SURVEY_FINISH, {surveyno:surveyno}))
      .then( res => {
        if (res) {
          this.props.navigation.navigate('ExploreSuccessView');
        }
        this.setState({
          loading:false
        })
    })
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
                 source={{uri: value.url}}>
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{value.phototypename}</Text>
      </View>
    )
  }
  renderOneParty(value) {
    return (
      <View style={{backgroundColor:'#ffffff',marginBottom:10}}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.licenseno}】`}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10}}></View>
        {this.renderRowItem('当事人姓名：',value.person)}
        {this.renderRowItem('驾驶证号：',value.driverlicenseno)}
        {this.renderRowItem('当事人车牌号：',value.licenseno)}
        {this.renderRowItem('当事人责任类型：',value.dutyname)}
        {this.renderRowItem('保险公司：',value.insurename)}
        {/* {this.renderRowItem('发动机号：',value.engineno)}
        {this.renderRowItem('车架号：',value.vinno)} */}
        {this.renderRowItem('驾驶证有效期是否正常：',value.driverflag ? '正常':'不正常')}
        {this.renderRowItem('行驶证有效期是否正常：',value.drivingflag ? '正常':'不正常')}
        {this.renderRowItem('准驾车型与车辆类型是否匹配：',value.matchingflag ? '匹配' : '不匹配')}
        {(value.scenelist && value.scenelist.length > 0) ? <View style={{marginTop:20,marginLeft:15,marginBottom:15}}>
          <Text style={{fontSize:16,color:formLeftText}}>现场情况：</Text>
          {value.scenelist.map((value,index) => this.renderOtherTypeView(value,index))}
        </View>:null}
        {(value.photolist && value.photolist.length > 0) ? <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:15}}>
          {value.photolist.map((value,index) => this.renderPhotoItem(value,index))}
        </View>:null}
      </View>
    )
  }
  renderOtherTypeView(value,index){
    return (
      <Text style={{marginTop:10,lineHeight:18,fontSize:14,color:formLeftText}} key={index}>
        {value.scenename}
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
    this.segArrays = [];
    this.contentArrs = [];
    let content = null;
    if (this.partyData && this.partyData.length > 0) {
      for (var i = 0; i < this.partyData.length; i++) {
        this.segArrays.push(this.segDatas[i])
        this.contentArrs.push(this.renderOneItem(i,this.partyData[i]));
      }
      content = <ScrollerSegment segDatas = {this.segArrays} contentDatas={this.contentArrs} />
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

module.exports.ConfirmReportPartyInfoView = connect()(ConfirmReportPartyInfoView)

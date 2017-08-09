/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager,DeviceEventEmitter } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import Tool from '../../utility/Tool';
import { NavigationActions } from 'react-navigation'

class InsuranceReportSuccessView extends Component {

  static navigationOptions = {
    header:null
  }

  constructor(props){
    super(props);
    this.state = {
      loading: false
    }
    this.waitForLook = true
  }
  next(buttonText){
    let { taskno } = this.props.navigation.state.params
    let routeName = global.personal.policeType === 2 ? 'PpHomePageView':'ApHomePageView';
    switch (buttonText) {
      case '返回首页':
        this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}))
        DeviceEventEmitter.emit('InitHome');
        break;
      case '需要查勘，点击继续':
        this.timer && clearInterval(this.timer);
        this.props.navigation.navigate('PerfectInformantInfoView',{taskno:taskno});
        break;
      case '无需查勘，返回首页':
        this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}))
        DeviceEventEmitter.emit('InitHome');
        break;
      case '请等待保险公司审核结果':
        break;
      default:
    }
  }
  componentWillUnmount(){
    this.timer && clearInterval(this.timer);
    let routeName = global.personal.policeType === 2 ? 'PpHomePageView':'ApHomePageView';
    this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}))
    DeviceEventEmitter.emit('InitHome');
  }
  componentDidMount(){
    let { openflag,taskno,needTimer } = this.props.navigation.state.params;
    if (openflag && needTimer) {
      let self = this;
      this.props.dispatch( create_service(Contract.POST_SURVEY_FLAG,{taskno: taskno})).then(res => {
        if (res && res.code == '200') {
          self.waitForLook = false
          self.surveyflag = res.data.surveyflag
          self.setState({
            loading:false
          })
        } else {
          this.startFetchRemoteRes();
        }
      })
    }
  }
  startFetchRemoteRes(){
    let self = this;
    let { taskno } = this.props.navigation.state.params
    this.timer = setInterval(() => {
      this.props.dispatch( create_service(Contract.POST_SURVEY_FLAG,{taskno: taskno})).then(res => {
        if(res && res.code == '200'){
          self.waitForLook = false
          self.surveyflag = res.data.surveyflag
          self.setState({
            loading:false
          })
        }
      })
    }, 5000);
  }

  render(){
    let tipMsg;
    let detailMsg;
    let buttonText;
    let defaultColor;
    let showImage;
    let { openflag,needTimer } = this.props.navigation.state.params;
    if (openflag) {
      if (this.waitForLook && needTimer) {
        tipMsg = '您的保险报案已成功'
        detailMsg = '事故信息已传至保险公司，请等待保险公司确认是否需要现场查勘操作，最多3分钟，请耐心等待'
        buttonText = '请等待保险公司审核结果'
        defaultColor = formRightText
        showImage = require('./image/export_success.png')
      } else {
        if (this.surveyflag) {
          tipMsg = '您的保险报案已成功'
          detailMsg = '事故信息已传至保险公司，请等待保险公司确认是否需要现场查勘操作，最多3分钟，请耐心等待'
          buttonText = '需要查勘，点击继续'
          defaultColor = '#267BD8'
          showImage = require('./image/export_success.png')
        } else {
          tipMsg = '您的保险报案已成功'
          detailMsg = '事故信息已传至保险公司，请等待保险公司确认是否需要现场查勘操作，最多3分钟，请耐心等待'
          buttonText = '无需查勘，返回首页'
          defaultColor = '#267BD8'
          showImage = require('./image/export_success.png')
        }
      }
    } else {
      tipMsg = '保险报案成功！'
      detailMsg = '此案件已保险报案成功，相关事故信息已传至保险公司，请告知当事人注意接听保险公司电话！'
      buttonText = '返回首页'
      defaultColor = '#267BD8'
      showImage = require('./image/report_success.png')
    }
    return(
      <View style={{flex:1}}>
        <ScrollView style={styles.container}
          showsVerticalScrollIndicator={false}>
          <Image source={showImage} style={{width:100,height:100,marginTop:(Platform.OS === 'ios') ? 94 : 74,alignSelf:'center'}}/>
          <View style={{marginTop:20,marginLeft:15,width:W-30}}>
            <Text style={{alignSelf:'center',fontSize:16,color:formLeftText}}>
              {tipMsg}
            </Text>
            <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center',marginTop:50}}>
              {detailMsg}
            </Text>
          </View>
           <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
             <XButton title={buttonText} onPress={() => this.next(buttonText)} style={{backgroundColor:'#ffffff',borderRadius:20,borderColor:defaultColor,borderWidth:1}} textStyle={{color:defaultColor}}/>
           </View>
           <ProgressView show={this.state.loading}/>
        </ScrollView>
        <View style={styles.navStyle}>
           <TouchableHighlight onPress={()=> {
             let routeName = global.personal.policeType === 2 ? 'PpHomePageView':'ApHomePageView';
             this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}))
             DeviceEventEmitter.emit('InitHome');
           }} underlayColor={'transparent'} style={{width:24,height:40,marginLeft:5,marginTop:(Platform.OS === 'ios') ? 20:0,justifyContent:'center'}}>
             <Image source={require('./image/back.png')} style={{width:12,height:20,alignSelf:'center'}}/>
           </TouchableHighlight>
           <View style={{flex:1,justifyContent:'center',marginTop:(Platform.OS === 'ios') ? 20:0}}>
             <Text style={{alignSelf:'center',color:'#ffffff',fontSize:18,marginLeft:-24}}>完成</Text>
           </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  navStyle: {
      width: W,
      height: (Platform.OS === 'ios') ? 64:44,
      position: 'absolute',
      top: 0,
      backgroundColor: '#1C79D9',
      flexDirection:'row'
  }
});

module.exports.InsuranceReportSuccessView = connect()(InsuranceReportSuccessView)

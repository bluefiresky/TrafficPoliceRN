/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'
import * as Progress from 'react-native-progress';

import { W, H, backgroundGrey,formLeftText,mainBule,formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton, TipModal } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, Utility } from '../../utility/index.js';

const SuccessIcon = require('./image/login.png');
const ButtonW = (W - 60)/2
const ContentW = 0.8 * W;

class UploadSuccessView extends Component {

  constructor(props){
    super(props);
    this.state = {
      content:'交通事故认定书稍后将以短信形式发送至当事人手机'
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
    })
  }

  componentWillUnmount(){
  }

  render(){
    return(
      <View style={styles.container}>
        <Image source={SuccessIcon} style={{width:100, height:100, resizeMode:'contain', marginTop:44}}/>
        <Text style={{fontSize:18, color:formLeftText, marginTop:10}}>案件上传成功</Text>
        <Text style={{fontSize:16, color:formRightText, marginTop:44, width:ContentW}}>{this.state.content}</Text>
        <View style={{flexDirection:'row', marginTop:30}}>
          <XButton title={'处理完成'} onPress={this._onPress.bind(1)} borderRadius={20} style={{backgroundColor:'#ffffff',width:ButtonW,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
          <XButton title={'保险报案'} onPress={this._onPress.bind(2)} borderRadius={20} style={{backgroundColor:'#267BD8',width:ButtonW}} textStyle={{color:'#ffffff',fontSize:14}}/>
        </View>
      </View>
    );
  }

  /** Private **/
  _onPress(type){
    if(type === 1) {
      let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
      this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}) )
    }else{
      Toast.showShortCenter('该功能暂未开通')
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

const ExportView = connect()(UploadSuccessView);
ExportView.navigationOptions = ({ navigation }) => {
  return {}
}

module.exports.UploadSuccessView = ExportView;

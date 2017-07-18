/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'

import { W, H, backgroundGrey,formLeftText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

const ButtonW = (W - 60)/2

class CertificateView extends Component {

  constructor(props){
    super(props);
    this.state = {}
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize: 33}}>
            {this.props.navigation.state.params.handleWay === '04'?'离线协议书':'离线认定书'}
          </Text>
        </View>
        <View style={{flexDirection:'row', marginTop:30, marginBottom:30}}>
          <XButton title={'保存为图片'} onPress={this._onPress.bind(this, 1)} borderRadius={20} style={{backgroundColor:'#ffffff',width:ButtonW,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
          <XButton title={'返回首页'} onPress={this._onPress.bind(this, 2)} borderRadius={20} style={{backgroundColor:'#267BD8',width:ButtonW}} textStyle={{color:'#ffffff',fontSize:14}}/>
        </View>
      </View>
    );
  }

  /**  Private  */
  _onPress(type){
    if(type === 1){
      Toast.showShortCenter('开发中')
    }else{
      let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
      this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}) )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7',
    alignItems:'center',
    justifyContent:'center'
  }
});

const ExportView = connect()(CertificateView);
ExportView.navigationOptions = ({ navigation }) => {
  return {
    headerLeft:null,
    title: navigation.state.params.handleWay === '04'?'离线协议书':'离线认定书',
  }
}

module.exports.CertificateView = ExportView;

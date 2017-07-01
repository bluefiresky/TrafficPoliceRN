/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class SettingView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }
  //使用帮助
  useHelp(){

  }
  //意见反馈
  feedback(){
    this.props.navigation.navigate('FeedBackView');
  }
  //退出登录
  exitLogin(){
    //检测是否存在未完结及未上传案件，如果存在则提示。如果不存在或者继续退出，则退出到登录页，清空APP缓存及未完结、未上传案件
  }
  render(){
    return(
      <ScrollView style={styles.container}
                  showsVerticalScrollIndicator ={false}>
        <TouchableHighlight style={{marginTop:50,marginLeft:15,width:W-30}} underlayColor='#B4B4B4' onPress={() => this.useHelp()}>
          <View style={{flex:1,flexDirection:'row',backgroundColor:'#B4B4B4',padding:10}}>
            <View style={{width:8,height:8,borderRadius:4,backgroundColor:'black',alignSelf:'center'}}></View>
            <Text style={{fontSize:15,marginLeft:5,color:formLeftText}}>
              使用帮助
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop:50,marginLeft:15,width:W-30}} underlayColor='#B4B4B4' onPress={() => this.feedback()}>
          <View style={{flex:1,flexDirection:'row',backgroundColor:'#B4B4B4',padding:10}}>
            <View style={{width:8,height:8,borderRadius:4,backgroundColor:'black',alignSelf:'center'}}></View>
            <Text style={{fontSize:15,marginLeft:5,color:formLeftText}}>
              意见反馈
            </Text>
          </View>
        </TouchableHighlight>
        <View style={{marginLeft:15, marginTop:100}}>
          <XButton title='退出登录' onPress={() => {this.exitLogin()}}/>
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

module.exports.SettingView = connect()(SettingView)
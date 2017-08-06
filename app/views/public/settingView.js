/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'

import { W, H, backgroundGrey,formLeftText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class SettingView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading:false,
    }
  }
  //使用帮助
  useHelp(){
    this.props.navigation.navigate('CommonWebView', {title:'使用帮助', url:'https://testx.zhongchebaolian.com/police_usehelp'});
  }
  //意见反馈
  feedback(){
    this.props.navigation.navigate('FeedBackView');
  }
  //退出登录
  exitLogin(){
    //检测是否存在未完结及未上传案件，如果存在则提示。如果不存在或者继续退出，则退出到登录页，清空APP缓存及未完结、未上传案件
    //退出登录要清空路由栈
    this.setState({loading:true})
    if(this.state.loading) return;

    this.props.dispatch( create_service(Contract.POST_USER_LOGOUT, {}))
      .then( res => {
        console.log(' SettingView execute exitLogin and the res -->> ', res);
        this.setState({loading:false})
        // if(res){
          this.props.dispatch({ type : 'CLEAR_USER_INFO' })
          this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName: 'LoginView'}) ]}) )
        // }
      })
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:1}}>
          <TouchableHighlight style={{marginTop:44,height:44, width:W}} underlayColor='#B4B4B4' onPress={() => this.useHelp()}>
            <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff',alignItems:'center',paddingLeft:20}}>
              <View style={{width:6,height:6,borderRadius:3,backgroundColor:'#1C79D9'}} />
              <Text style={{fontSize:16,marginLeft:10,color:formLeftText}}>使用帮助</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{marginTop:10,height:44,width:W}} underlayColor='#B4B4B4' onPress={() => this.feedback()}>
            <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff',alignItems:'center',paddingLeft:20}}>
              <View style={{width:6,height:6,borderRadius:3,backgroundColor:'#1C79D9',alignSelf:'center'}} />
              <Text style={{fontSize:16,marginLeft:10,color:formLeftText}}>意见反馈</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={{marginTop:10,height:44,width:W}} underlayColor='#B4B4B4' disabled={true}>
            <View style={{flex:1,flexDirection:'row',backgroundColor:'#ffffff',alignItems:'center',paddingLeft:20}}>
              <View style={{width:6,height:6,borderRadius:3,backgroundColor:'#1C79D9',alignSelf:'center'}} />
              <Text style={{fontSize:16,marginLeft:10,color:formLeftText}}>版本号1.0</Text>
            </View>
          </TouchableHighlight>
        </View>

        <XButton title='退出登录' onPress={() => {this.exitLogin()}} style={{alignSelf:'center', marginBottom:100,backgroundColor:'#ffffff',borderRadius:20}} textStyle={{color:'#FC0042'}}/>
        <ProgressView show={this.state.loading} hasTitleBar={true} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7'
  }
});

module.exports.SettingView = connect()(SettingView)

/**
* 登录页面
*/
'use strict'
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H,formLeftText,mainBule,formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

const MarginTop = Platform.OS === 'ios'? 64:44;

class LoginView extends Component {

  static navigationOptions = {
    header: null
  }
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      codeText: '发送验证码',
      codeSecondsLeft: 60,
      codeColor:'#4F4F4F',
      showSpeekCode:false
    }
    this.phoneNum = '';
    this.verificationCode = '';
  }

  componentWillMount(){
    if(global.auth.isLogin){
      // this.props.navigation.dispatch({ type: 'replace', routeName: 'PpHomePageView', key: 'PpHomePageView', params: {}})
      if(global.personal.policeType == 2) this.props.navigation.dispatch({ type: 'replace', routeName: 'PpHomePageView', key: 'PpHomePageView', params: {}})
      else if(global.personal.policeType == 3) this.props.navigation.dispatch({ type: 'replace', routeName: 'ApHomePageView', key: 'ApHomePageView', params: {}})
    }
  }

  componentDidMount(){

  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer);
  }

  //输入框文字变化
  onChangeText(text, type) {
    switch (type) {
      case 'phoneNum':
        this.phoneNum = text;
        break;
      case 'verificationCode':
        this.verificationCode = text;
        break;
      default:
    }
  }
  //验证手机号
  checkPhone(phone){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!phone || phone.indexOf(1) !== 0 || phone.length !== 11 || !reg.test(phone)) ? false:true;
  }
  //验证验证码
  checkCode(code){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!code || code.length !== 6 || !reg.test(code)) ? false:true;
  }
  //获取验证码
  async sendVerificationCode(smsType){
    if (!this.checkPhone(this.phoneNum)) {
      Toast.showShortCenter('手机号输入有误');
      return;
    }
    
    let codeData = await this.props.dispatch( create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE, {mobile: this.phoneNum, smsType}) );
    if(!codeData) return;

    if (this.state.codeSecondsLeft === 60) {
      this.timer = setInterval(() => {
        let t = this.state.codeSecondsLeft - 1;
        if (t === 0) {
          this.timer && clearInterval(this.timer);
          this.setState({codeText: '重新获取', codeSecondsLeft: 60, codeColor: '#4F4F4F'})
        } else{
          this.setState({codeText: `${t}s`, codeSecondsLeft: t, codeColor: formRightText});
          if (t === 30) {
            this.setState({
              showSpeekCode: true
            })
          }
        }
      }, 1000);
      // 不管成功与否，开始倒计时
    }
  }

  loginBtnClick(){
    // this.props.navigation.navigate('ApHomePageView');
    // return
    if (!this.checkPhone(this.phoneNum)) {
      Toast.showShortCenter('请输入手机号');
      return;
    }
    if (!this.checkCode(this.verificationCode)) {
      Toast.showShortCenter('验证码必须是6位');
      return;
    }
    this.setState({loading: true})
    let self = this;
    this.props.dispatch( create_service(Contract.POST_USER_LOGIN_PHONE, {mobile: this.phoneNum, smsCode: this.verificationCode}))
      .then( res => {
        console.log(' LoginView post user login res -->> ', res);
        if(res) {
          self.props.dispatch( create_service(Contract.GET_USER_INFO, {}))
            .then( res => {
              if(res){
                this.setState({loading: false})
                // this.props.navigation.dispatch({ type: 'replace', routeName: 'PpHomePageView', key: 'PpHomePageView', params: {}})

                if(res.policeType === 2) self.props.navigation.dispatch({ type: 'replace', routeName: 'PpHomePageView', key: 'PpHomePageView', params: {}})
                else if(res.policeType === 3) this.props.navigation.dispatch({ type: 'replace', routeName: 'ApHomePageView', key: 'ApHomePageView', params: {}})
              }else{
                self.setState({loading: false})
              }
          })
        }else{
          this.setState({loading: false})
        }
    })
  }

  render(){
    let { loading,codeText,codeColor,codeSecondsLeft } = this.state;
    return(
      <View style={styles.container}>

          <View style={{flex:1,marginTop:MarginTop}}>
            <Image source={require('./image/login.png')} style={{width:90,height:90,alignSelf:'center'}}/>
            <Text style={{marginTop:10,alignSelf:'center',fontSize:16,color:'#1174D9',fontWeight:'bold'}}>
              警用事故处理
            </Text>
            <View style={{marginTop:30,flexDirection:'row',width:W-30,marginLeft:15,backgroundColor:'#EFF2F7',borderRadius:10}}>
              <Image source={require('./image/phone.png')} style={{width:11,height:16,alignSelf:'center',marginLeft:15}}/>
              <TextInput style={{height:45,flex:1,fontSize:13,paddingLeft:41,marginLeft:-26}}
                onChangeText={(text) => this.onChangeText(text,'phoneNum')}
                placeholder={'请输入手机号码'}
                clearButtonMode={'while-editing'}
                keyboardType={'numeric'}
                maxLength={11}
                placeholderTextColor={'#1174D9'}
                underlineColorAndroid = {'transparent'}
              />
            </View>
            <View style={{marginTop:20,flexDirection:'row',width:W-30,marginLeft:15,backgroundColor:'#EFF2F7',borderRadius:10}}>
              <Image source={require('./image/verification_code.png')} style={{width:13,height:15,alignSelf:'center',marginLeft:15}}/>
              <TextInput style={{height:45,width:W-30,fontSize:13,paddingLeft:43,borderRadius:5,marginLeft:-28}}
                onChangeText={(text) => this.onChangeText(text,'verificationCode')}
                placeholder={'请输入验证码'}
                placeholderTextColor={'#1174D9'}
                clearButtonMode={'while-editing'}
                keyboardType={'numeric'}
                maxLength={6}
                underlineColorAndroid = {'transparent'}
              />
              <TouchableHighlight style={{width:100,padding:5,backgroundColor:'#ffffff',marginLeft:-110,justifyContent:'center',marginTop:5,marginBottom:5,borderRadius:5}} onPress={() => {this.sendVerificationCode(1)}} underlayColor={'transparent'} disabled={(codeColor !== '#4F4F4F')}>
                <Text style={{color:codeColor,fontSize:13,alignSelf:'center'}}>{codeText}</Text>
              </TouchableHighlight>
            </View>
            {this.state.showSpeekCode ? <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:15}}>
              <Text style={{marginRight:15}}>
                收不到验证码？试试
                <Text style={{color:'#267BD8'}} onPress={() => {
                  this.props.dispatch( create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE, {mobile: this.phoneNum, smsType:2}) )
                    .then(res => {
                      this.setState({showSpeekCode: false})
                      if(res){
                        Toast.showShortCenter('请注意接听电话');
                      }
                  })
                }}>语音验证码</Text>
              </Text>
            </View>:null}
            <View style={{marginLeft:15, marginTop:50}}>
              <XButton title='登录' onPress={() => this.loginBtnClick()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
            </View>
            <ProgressView show={loading}/>
          </View>

          <Image source={require('./image/login_bg.png')} style={{width:W,height:W / 5.28}} resizeMode="contain"/>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.LoginView = connect()(LoginView)

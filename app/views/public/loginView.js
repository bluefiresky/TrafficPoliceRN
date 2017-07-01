/**
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Alert } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H,formLeftText,mainBule,formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class LoginView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      codeText: '获取验证码',
      codeSecondsLeft: 60,
      codeSecondsLeftSp:60,
      codeColor:mainBule
    }
    this.phoneNum = '';
    this.verificationCode = '';
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
  //获取验证码
  sendVerificationCode(){
    if (!this.checkPhone(this.phoneNum)) {
      Toast.showShortCenter('手机号输入有误');
      return;
    }

    if (this.state.codeSecondsLeft === 60) {
      this.timer = setInterval(() => {
        let t = this.state.codeSecondsLeft - 1;
        if (t === 0) {
          this.timer && clearInterval(this.timer);
          this.setState({codeText: '重新获取', codeSecondsLeft: 60, codeColor: mainBule})
        } else{
          this.setState({codeText: `(${t})秒后再次获取`, codeSecondsLeft: t, codeColor: formRightText});
          if (t === 30) {
            let that = this;
            Toast.showShortCenter('收不到验证码？试试语音验证码');
          }
        }
      }, 1000);
      // 不管成功与否，开始倒计时
      this.props.dispatch( create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE, {mobile: this.phoneNum, smsType:1}) );
    }
  }

  loginBtnClick(){
    if (!this.checkPhone(this.phoneNum)) {
      Toast.showShortCenter('请输入正确手机号');
      return;
    }
    if (!this.verificationCode) {
      Toast.showShortCenter('验证码不能为空');
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
                if(res.policeType === 2) self.props.navigation.navigate('PpHomePageView');
                else if(res.policeType === 3) self.props.navigation.navigate('ApHomePageView');
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
      <ScrollView style={styles.container}
                  showsVerticalScrollIndicator ={false}>
        <View style={{marginTop:50,backgroundColor:'#ffffff'}}>
          <Image source={{}} style={{width:100,height:80,backgroundColor:'green',alignSelf:'center'}}/>
          <View style={{marginTop:30}}>
            <Text style={{marginLeft:15,color:formLeftText,fontSize:15}}>手机号码</Text>
            <TextInput style={{height:40,width:W-30,fontSize:13,marginLeft:15,borderColor:'#F0F0F0',borderWidth:1,padding:5,marginTop:15}}
              onChangeText={(text) => this.onChangeText(text,'phoneNum')}
              placeholder={'请输入手机号码'}
              clearButtonMode={'while-editing'}
              keyboardType={'numeric'}
              underlineColorAndroid = {'transparent'}
            />
          </View>
          <View style={{marginTop:20}}>
            <Text style={{marginLeft:15,color:formLeftText,fontSize:15}}>验证码</Text>
            <View style={{flexDirection:'row',marginLeft:15,marginTop:15,justifyContent:'space-between'}}>
              <TextInput style={{height:40,width:180,fontSize:13,padding:5,borderColor:'#F0F0F0',borderWidth:1}}
                onChangeText={(text) => this.onChangeText(text,'verificationCode')}
                placeholder={'请输入验证码'}
                clearButtonMode={'while-editing'}
                keyboardType={'numeric'}
                underlineColorAndroid = {'transparent'}
              />
              <TouchableHighlight style={{alignSelf:'center',marginLeft:20,marginRight:20}} onPress={() => {this.sendVerificationCode()}} underlayColor={'transparent'} disabled={(codeColor !== mainBule)}>
                <Text style={{color:codeColor,fontSize:14}}>{codeText}</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{marginLeft:15, marginTop:30}}>
            <XButton title='登录' onPress={() => this.loginBtnClick()}/>
          </View>
          <ProgressView show={loading}/>
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

module.exports.LoginView = connect()(LoginView)

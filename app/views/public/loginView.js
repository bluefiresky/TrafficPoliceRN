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
      showRoles:false,
      codeText: '获取验证码',
      codeSecondsLeft: 60,
      codeSecondsLeftSp:60,
      codeColor:mainBule
    }
    this.phoneNum = '';
    this.verificationCode = '';
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
            Alert.alert(
                '提醒',
                '收不到验证码？试试语音验证码',
                [{text: '取消', onPress: () =>{}},
                {text: '语音验证码', onPress: () =>{
                    that.timer && clearInterval(that.timer);
                    //获取语音验证码
                    that.timer1 = setInterval(() => {
                      let st = that.state.codeSecondsLeftSp - 1;
                      if (st === 0) {
                        that.timer1 && clearInterval(that.timer1);
                        that.setState({codeText: '重新获取', codeSecondsLeftSp: 60, codeColor: mainBule,codeSecondsLeft:60})
                      } else {
                        that.setState({codeText: `(${st})秒后再次获取`, codeSecondsLeftSp: st, codeColor: formRightText});
                      }
                    },1000)
                  },}]
              )
          }
        }
      }, 1000);

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
    this.setState({
      showRoles: !this.state.showRoles
    })
  }
  selectRoles(type){
    this.setState({
      showRoles: false
    })
    switch (type) {
      case 'AssistPolice':
      //协警
      this.props.navigation.navigate('ApHomePageView');
      break;
      case 'PeoplePolice':
      //民警
      this.props.navigation.navigate('PpHomePageView');
      break;
      default:
    }
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
            {this.state.showRoles?<View style={{width:100,backgroundColor:'#ffffff',marginTop:-20,marginLeft:W/2,borderColor:'#F0F0F0',borderWidth:1}}>
              <TouchableHighlight style={{marginTop:10,marginLeft:5,width:90,backgroundColor:'#C8C8C8'}} underlayColor='#C8C8C8' onPress={() => this.selectRoles('AssistPolice')}>
                <Text style={{fontSize:14,alignSelf:'center',padding:5}}>
                  协警角色
                </Text>
              </TouchableHighlight>
              <TouchableHighlight style={{marginTop:15,marginLeft:5,marginBottom:10, width:90,backgroundColor:'#C8C8C8'}} underlayColor='#C8C8C8' onPress={() => this.selectRoles('PeoplePolice')}>
                <Text style={{fontSize:14,alignSelf:'center',padding:5}}>
                  民警角色
                </Text>
              </TouchableHighlight>
            </View>:null}
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

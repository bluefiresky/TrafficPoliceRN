/**
* Created by wuran on 17/04/21.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */, borderColor, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */

const BgH = (W * 890)/750;
const WXBW = W - 50;
const QQBW = (WXBW - 10)/2;

class LoginView extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props);
    this.state = {
      loading: false
    }

    console.log('the LoginView props -->> ', props);
  }

  componentDidMount(){
  }

  componentWillUnmount(){
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <Image source={require('./image/login_bg.png')} style={{width: W, height: BgH, resizeMode: 'contain'}}/>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {this._renderThirdLoginButton(this._onPress.bind(this, 'wx'), '微信登录', 'white', WXBW, mainBule)}
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {this._renderThirdLoginButton(this._onPress.bind(this, 'qq'), 'QQ', 'black', QQBW)}
            <View style={{width: 10}}/>
            {this._renderThirdLoginButton(this._onPress.bind(this, 'wb'), '微博', 'black', QQBW)}
          </View>
        </View>
        <View style={{flexDirection: 'row', height: 50, alignItems: 'center'}}>
          <Text onPress={this._onPress.bind(this, 'account')} style={{padding: 10, marginLeft: 15, color: mainBule, fontSize: 16}}>账号登录</Text>
          <View style={{flex: 1}}/>
          <Text onPress={this._onPress.bind(this, 'register')}  style={{padding: 10, marginRight: 15, color: mainBule, fontSize: 16}}>注册</Text>
        </View>
        {this._renderCloseButton(this._onPress.bind(this, 'close'))}
        <ProgressView show={loading} tip={'登录...'}　/>
      </View>
    );
  }

  /** Private Method **/
  _onPress(type){
    // let { navigation, dispatch } = this.props;
    switch (type) {
      case 'wx':
        Toast.showShortCenter('111');
        break;
      case 'qq':
        Toast.showShortCenter('222');
        break;
      case 'wb':
        Toast.showShortCenter('333');
        break;
      case 'account':
        this.props.navigation.navigate('LoginAccountView');
        break;
      case 'register':
        this.props.navigation.navigate('RegisterView');
        break;
      case 'close':
        this.props.navigation.goBack(null);
        break;
    }
    // dispatch( create_service(Contract.POST_USER_LOGIN, {phoneNumber: '12345', password: 'abcde'}))
  }

  _renderThirdLoginButton(pressEvent, text, textColor, width, bgColor){
    let style = bgColor? { backgroundColor: bgColor } : { borderColor: '#dfdfdf', borderWidth: 0.5 }
    return(
      <TouchableOpacity onPress={pressEvent} style={[{ width, alignItems: 'center', justifyContent: 'center', padding: 10 }, style]}  activeOpacity={0.8}>
        <Text style={{ color: textColor, fontSize: 16 }}>{text}</Text>
      </TouchableOpacity>
    )
  }

  _renderCloseButton(pressEvent){
    return(
      <TouchableWithoutFeedback onPress={pressEvent}>
        <Image source={require('./image/login_cancel.png')} style={{width: 25, height: 25, resizeMode: 'contain', position: 'absolute', top: 30, left: 20}}/>
      </TouchableWithoutFeedback>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  }
});

module.exports.LoginView = connect()(LoginView)

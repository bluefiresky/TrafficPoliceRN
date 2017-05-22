/**
* Created by wuran on 17/04/21.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */, mainBule, borderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton, form_connector, ValidateMethods, InputPlaceholder, ProtocolModal } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */

const CodeButtonW = (W - 30)/3;
const ComponentW = W - 30;

class RegisterView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      submiting: false,
      showProtocol: false,
      codeText: '获取验证码',
      codeSecondsLeft: 60,
    }

    this._onPress = this._onPress.bind(this);
    this._onGetVerifyCode = this._onGetVerifyCode.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount(){
  }

  componentWillUnmount(){
  }

  render(){
    let { loading, codeText, showProtocol, submiting } = this.state;
    let { phoneNumber, password, code } = this.props.fields;

    return(
      <View style={styles.container}>
        <InputPlaceholder placeholder={'手机号'} {...phoneNumber}  noBorder={true} hasClearButton={true} style={{width: ComponentW, marginLeft: 15, marginRight: 15, borderRadius: 5, marginTop: 20, height: 35}}/>
        <InputPlaceholder placeholder={'密码'} {...password} noBorder={true} hasClearButton={true} style={{width: ComponentW, marginLeft: 15, marginRight: 15, borderRadius: 5, marginTop: 10, height: 35}}/>
        <View style={{flexDirection: 'row'}}>
          <InputPlaceholder  placeholder={'验证码'} {...code} noBorder={true} hasClearButton={true} style={{width: ComponentW, marginLeft: 15, marginRight: -5, borderRadius: 5, marginTop: 10, height: 35, flex: 1}}/>
          {this._renderGetCodeButton(codeText, this._onGetVerifyCode)}
        </View>

        <XButton onPress={this._onSubmit} title={'注册'} loading={submiting} style={{width: ComponentW, marginTop: 20}} />

        <View style={{width: ComponentW, flexDirection: 'row', marginTop: 10}}>
          <Text style={{color: '#999', fontSize: 14}}>阅读并同意型用户</Text>
          <Text style={{color: mainBule, fontSize: 14}} onPress={this._onPress.bind(this, 'protocol')}>《注册协议》</Text>
        </View>

        <ProtocolModal show={showProtocol} closeEvent={() => { this.setState({showProtocol: false})}} content={'aaa'}/>
      </View>
    );
  }

  _renderGetCodeButton(content, callback){
    return(
      <TouchableOpacity onPress={callback} activeOpacity={0.8}>
        <View style={{width: CodeButtonW, height: 35, backgroundColor: '#eb426b', marginTop: 10, alignItems: 'center', justifyContent: 'center', borderTopRightRadius: 5, borderBottomRightRadius: 5, marginRight: 15}}>
          <Text style={{fontSize: 14, color: 'white'}}>{content}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /** Private Method **/
  _onPress(type){
    switch (type) {
      case 'protocol':
        // this.props.navigation.navigate('RegisterProtocolModal');
        this.setState({showProtocol: true})
        break;
      default:

    }
    // dispatch( create_service(Contract.POST_USER_LOGIN, {phoneNumber: '12345', password: 'abcde'}))
  }

  _onGetVerifyCode(){
    if(this.state.codeText != '获取验证码') return;
    let phoneNumber = this.props.fields.phoneNumber.value;
    if(phoneNumber && phoneNumber.length === 11){
      if (this.state.codeSecondsLeft === 60) {
        this.timer = setInterval(() => {
          let t = this.state.codeSecondsLeft - 1;
          if (t === 0) {
            this.timer && clearInterval(this.timer);
            this.setState({codeText: '获取验证码', codeSecondsLeft: 60})
          }else{
            this.setState({codeText: '再次获取(' + t + ')', codeSecondsLeft: t});
          }
        }, 1000);
        this.props.dispatch( create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE, {mobile: phoneNumber, action: '0'}) )
      }
    }else{
      Toast.showShortCenter('请输入正确手机号');
    }
  }

  _onSubmit(){
    if (!this.props.form.validate()) {
      Toast.showShortCenter(this.props.form.getErrors()[0]);
    }else {
      this.setState({submiting: true});
      const data = this.props.form.getData();
      let post = {code: data.code, password: data.password, mobile: data.phoneNumber, /** Umeng_channel 暂无法获得*/userSource: ''};
      this.props.dispatch( create_service(Contract.POST_USER_REGISTER, post) )
        .then( res => {
          this.setState({submiting: false});
          console.log('RegisterView submit and the res -->> ', res);
        })
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: backgroundGrey,
    alignItems: 'center'
  }
});

const fields = ['phoneNumber', 'code', 'password']

const validate = (assert, fields) => {
  assert("phoneNumber", ValidateMethods.required(), '请输入手机号')
  assert("phoneNumber", ValidateMethods.min_length(11), '请输入正确手机号')
  assert("phoneNumber", ValidateMethods.max_length(11), '请输入正确手机号')
  assert("code", ValidateMethods.required(), '请输入验证码')
  assert("password", ValidateMethods.required(), '请输入密码')
  assert("password", ValidateMethods.min_length(6), '密码必须在6到24位')
  assert("password", ValidateMethods.max_length(24), '密码必须在6到24位')
}

module.exports.RegisterView = connect()(form_connector(RegisterView, fields, validate));

/**
* Created by wuran on 17/04/21.
* 重置密码
*/
import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, ScrollView } from "react-native";
import { XButton } from '../../components/index';
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */ ,formRightText,mainBule} from '../../configs/index.js';/** 自定义配置参数 */
import { BaseView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { normalize } from '../../utility/index.js';
class ResetView extends Component {

  static navigationOptions = {
    title: '重置密码',
  }

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      codeText:'1',
      phoneNumber:'',
      codeSecondsLeft:60,

    }

    this._onPress = this._onPress.bind(this);
    console.log('the ResetView props -->> ', props);
  }

  componentDidMount(){
    console.log('ResetView -> componentDidMount execute');
    this.setState({ loading: true })
    this.timer1 = setTimeout( (() => {
      this.setState({ loading : false })
      Toast.showShortCenter('载入完毕')
    }).bind(this), 3000)
  }

  componentWillUnmount(){
    console.log('ResetView -> componentWillUnmount execute');
    this.timer1 && clearTimeout(this.timer1);
    this.timer && clearInterval(this.timer);
  }

  _onSubmit(routeName){
    // if (!this.props.form.validate()) {
    //   Toast.showShortCenter(this.props.form.getErrors()[0]);
    // }


    let { navigation, dispatch } = this.props;
    if(routeName != null){
      navigation.navigate(routeName);
    }
  }

  render(){
    let { loading } = this.state;

    return(


       <View style={styles.container}>
         <ScrollView>
        <View style={{marginTop:20,borderWidth:0}}>
          <Text style={{height:normalize(24),padding:normalize(10),width:0.8*W,textAlign:'left',color:'#666666'}} >
          密码修改验证码将会发送到您的手机
          </Text>
          <TextInput style={{width:W*0.95,height:normalize(26),borderWidth:0.5,marginTop: 15,padding:normalize(10),alignSelf:'center',marginTop: 15,fontSize: 16, color: 'black'}} maxLength = {20} placeholder="请输入您的手机号码"
          onChangeText={(phoneNumber) => {
            this.setState({phoneNumber});
          }}
          >
          </TextInput>
          <View style={{marginTop:20,borderWidth:0,alignItems:'center'}}>
            <XButton title='发送'    onPress={this._onSubmit.bind(this, 'ResetPostView')}/>
          </View>
        </View>
        <View style={styles.container}>

        </View>
        </ScrollView>
      </View>
    );
  }

  /** Private Method **/
  _onPress(routeName){
    let { navigation, dispatch } = this.props;
    if(routeName != null){
      navigation.navigate(routeName);
    }else{
      navigation.goBack(null);
    }
    // dispatch( create_service(Contract.POST_USER_LOGIN, {phoneNumber: '12345', password: 'abcde'}))
  }

}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey,

  }
});

module.exports.ResetView = connect()(ResetView)

/**
* 意见反馈页面
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

class FeedBackView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
    this.feedBackText = '';
    this.phoneNum = '';
  }
  onChangeText(text,type){
    if (type == 'FeedBack') {
      this.feedBackText = text;
    } else if(type == 'Phone'){
      this.phoneNum = text;
    }
  }
  //验证手机号
  checkPhone(phone){
    let reg = /^[0-9]+.?[0-9]*$/;
    return (!phone || phone.indexOf(1) !== 0 || phone.length !== 11 || !reg.test(phone)) ? false:true;
  }
  submitFeedBack(){
    if (!this.checkPhone(this.phoneNum)) {
      Toast.showShortCenter('手机号输入有误');
      return;
    }
  }
  render(){
    return(
      <ScrollView style={styles.container}
                  showsVerticalScrollIndicator ={false}>
        <View style={{flex:1,marginLeft:15}}>
          <Text style={{fontSize:14,color:formLeftText,marginTop:30}}>反馈内容：</Text>
          <TextInput style={{height:180,width:W-30,borderWidth:1,textAlignVertical:"top",borderColor:'#F0F0F0',marginTop:15,fontSize:12,padding:5}} placeholder="请输入您的建议" multiline={true} onChangeText={(text) => this.onChangeText(text,'FeedBack')} maxLength={200}/>
          <Text style={{fontSize:14,color:formLeftText,marginTop:50}}>联系方式：</Text>
          <TextInput style={{height:40,width:W-30,borderWidth:1,borderColor:'#F0F0F0',marginTop:15,fontSize:12,padding:5}} placeholder="请输入您的手机号" onChangeText={(text) => this.onChangeText(text,'Phone')}/>
          <View style={{marginLeft:15, marginTop:50}}>
            <XButton title='提交意见' onPress={() => {this.submitFeedBack()}}/>
          </View>
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

module.exports.FeedBackView = connect()(FeedBackView)

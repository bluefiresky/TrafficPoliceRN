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
      loading: false
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
    if(this.feedBackText != null && this.feedBackText.length >0 ){
      let self = this;
      this.setState({loading: true})
      this.props.dispatch( create_service(Contract.POST_ADVICE_ADD, {adviceContent: this.feedBackText, contactMobile:this.phoneNum}))
        .then( res => {
          if(res){
            self.props.navigation.goBack(null);
          }else{
            this.setState({loading: false})
          }
      })
    }else{
      Toast.showShortCenter('意见内容不能为空')
    }
  }
  render(){
    return(
      <ScrollView style={styles.container}
                  showsVerticalScrollIndicator ={false}>
        <View style={{flex:1,marginLeft:15}}>
          <Text style={{fontSize:14,color:formLeftText,marginTop:30}}>反馈内容：</Text>
          <TextInput
            style={{height:180,width:W-30,borderWidth:1,textAlignVertical:"top",borderColor:'#F0F0F0',marginTop:15,fontSize:12,padding:5,backgroundColor:'#FBFBFE'}}
            multiline={true}
            onChangeText={(text) => this.onChangeText(text,'FeedBack')}
            maxLength={200}
            underlineColorAndroid={'transparent'}
          />
          <Text style={{fontSize:14,color:formLeftText,marginTop:50}}>联系方式：</Text>
          <TextInput
            style={{height:40,width:W-30,borderWidth:1,borderColor:'#F0F0F0',marginTop:15,fontSize:12,padding:5,backgroundColor:'#FBFBFE'}}
            keyboardType={'numeric'}
            underlineColorAndroid={'transparent'}
            onChangeText={(text) => this.onChangeText(text,'Phone')}/>
          <View style={{marginTop:50}}>
            <XButton title='提交意见' onPress={() => this.submitFeedBack()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
          </View>

          <ProgressView show={this.state.loading}/>
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

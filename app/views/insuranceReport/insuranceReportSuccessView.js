/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import Tool from '../../utility/Tool';

class InsuranceReportSuccessView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }
  //取消远程定责
  cancleWait(){

  }
  render(){
    let tipMsg;
    let detailMsg;
    let buttonText;
    let defaultColor;
    let { isHaveLookJurisdiction,isNeedLook,waitForLook } = this.props.navigation.state.params;
    if (isHaveLookJurisdiction) {
      if (waitForLook) {
        tipMsg = '您的保险报案已成功'
        detailMsg = '事故信息已传至保险公司，请等待保险公司确认是否需要现场查勘操作，最多3分钟，请耐心等待'
        buttonText = '请等待保险公司审核结果'
        defaultColor = formRightText
      } else {
        if (isNeedLook) {
          tipMsg = '您的保险报案已成功'
          detailMsg = '事故信息已传至保险公司，请等待保险公司确认是否需要现场查勘操作，最多3分钟，请耐心等待'
          buttonText = '无需查勘，返回首页'
          defaultColor = '#267BD8'
        } else {
          tipMsg = '您的保险报案已成功'
          detailMsg = '事故信息已传至保险公司，请等待保险公司确认是否需要现场查勘操作，最多3分钟，请耐心等待'
          buttonText = '需要查勘，点击继续'
          defaultColor = '#267BD8'
        }
      }
    } else {
      tipMsg = '保险报案成功！'
      detailMsg = '此案件已保险报案成功，相关事故信息已传至保险公司，请告知当事人注意接听保险公司电话！'
      buttonText = '返回首页'
      defaultColor = '#267BD8'
    }
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        <Image source={require('./image/confirm_response.png')} style={{width:100,height:100,marginTop:30,alignSelf:'center'}}/>
        <View style={{marginTop:20,marginLeft:15,width:W-30}}>
          <Text style={{alignSelf:'center',fontSize:16,color:formLeftText}}>
            {tipMsg}
          </Text>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center',marginTop:50}}>
            {detailMsg}
          </Text>
        </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
           <XButton title={buttonText} onPress={() => this.cancleWait()} style={{backgroundColor:'#ffffff',borderRadius:20,borderColor:defaultColor,borderWidth:1}} textStyle={{color:defaultColor}}/>
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

module.exports.InsuranceReportSuccessView = connect()(InsuranceReportSuccessView)

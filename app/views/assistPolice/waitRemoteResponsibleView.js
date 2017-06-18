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
class WaitRemoteResponsibleView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }
  //取消远程定责
  cancleWait(){
    let { index } = this.props.navigation.state.params
    this.props.navigation.navigate('ResponsibleResultView', {index:index});
    // this.props.navigation.goBack()
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        <Image source={{}} style={{width:100,height:80,marginTop:50,backgroundColor:'green',alignSelf:'center'}}/>
        <View style={{marginTop:20,marginLeft:15,width:W-30}}>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText}}>
            远程交警正在定责，请稍后！
          </Text>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center'}}>
            您可点击【
            <Text style={{color:mainBule}}>稍后查看</Text>
            】，待远程交警定责完成后，进入【历史案件】--【未完结】中查看并处理该案件
          </Text>
        </View>
        <View style={{marginTop:20,marginLeft:15,width:W-30}}>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20}}>
            若较长时间未接收到后台民警的定责结果，请拨打以下电话咨询：
          </Text>
          <Text style={{alignSelf:'center',fontSize:14,color:mainBule}} onPress={()=>{Tool.callPhoneNum('110110110',true)}}>
            110110110
          </Text>
        </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
           <XButton title='取消远程定责' onPress={() => this.cancleWait()}/>
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

module.exports.WaitRemoteResponsibleView = connect()(WaitRemoteResponsibleView)

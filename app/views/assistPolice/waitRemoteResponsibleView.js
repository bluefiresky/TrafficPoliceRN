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
        <Image source={require('./image/confirm_response.png')} style={{width:100,height:100,marginTop:50,alignSelf:'center'}}/>
        <View style={{marginTop:20,marginLeft:15,width:W-30}}>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText}}>
            远程交警正在定责，请等待！
          </Text>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center'}}>
            远程交警定责完成后，将有短信提醒定责完成，可进入【历史案件】-【未完成】中查看并继续处理该案件。
          </Text>
        </View>
        <View style={{marginTop:20,marginLeft:15,width:W-30}}>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20}}>
            若较长时间未接收到后台民警的定责结果，请拨打以下电话咨询：
            <Text style={{color:mainBule}} onPress={()=>{Tool.callPhoneNum('110110110',true)}}>
              110110110
            </Text>
          </Text>
        </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
           <XButton title='返回首页' onPress={() => this.cancleWait()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
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

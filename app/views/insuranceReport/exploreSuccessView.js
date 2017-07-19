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
import SignatureCapture from 'react-native-signature-capture'

class ExploreSuccessView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }
  //取消远程定责
  cancleWait(){

  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        <Image source={require('./image/export_success.png')} style={{width:100,height:100,marginTop:30,alignSelf:'center'}}/>
        <View style={{marginTop:20,marginLeft:15,width:W-30}}>
          <Text style={{alignSelf:'center',fontSize:16,color:formLeftText}}>
            现场查勘完成！
          </Text>
          <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center',marginTop:50}}>
            此案件已现场查勘成功，相关事故及查勘信息已传至保险公司，请告知当事人注意接听保险公司电话！
          </Text>
        </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
           <XButton title='返回首页' onPress={() => this.cancleWait()} style={{backgroundColor:'#ffffff',borderRadius:20,borderColor:'#267BD8',borderWidth:1}} textStyle={{color:'#267BD8'}}/>
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

module.exports.ExploreSuccessView = connect()(ExploreSuccessView)

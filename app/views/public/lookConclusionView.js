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

class LookConclusionView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }
  goBackToList(){
    //直接回到列表
  }
  render(){
    return(
      <ScrollView style={styles.container}
                  showsVerticalScrollIndicator ={false}>
          <Text style={{marginTop:20,marginLeft:15,color:formLeftText}}>
            查看交通事故认定书
          </Text>
          <Image source={{}} style={{marginLeft:15,width:W-30,height:400,backgroundColor:'green',marginTop:20}}/>
          <View style={{marginLeft:15, marginTop:50,marginBottom:20}}>
            <XButton title='返回历史案件列表' onPress={() => {this.goBackToList()}}/>
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

module.exports.LookConclusionView = connect()(LookConclusionView)

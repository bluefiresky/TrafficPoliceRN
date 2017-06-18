/**
* 登录页面
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

class SelectHandleTypeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      showRoles:false
    }
  }
  commit(index){
    //点击之前，先判断网络情况，无网情况，提示无网络，无法处理
    this.props.navigation.navigate('AGatheringPartyInformationView',{index:index});
  }
  render(){
    return(
      <ScrollView style={styles.container}
                  showsVerticalScrollIndicator ={false}>
        <View style={{marginLeft:15,marginBottom:10,marginTop:50}}>
          <XButton title={'多车事故|自行协商'} onPress={() => this.commit(0)}/>
        </View>
        <View style={{marginLeft:15,marginBottom:10,marginTop:50}}>
          <XButton title={'多车事故|需远程定则'} onPress={() => this.commit(1)}/>
        </View>
        <View style={{marginLeft:15,marginBottom:10,marginTop:50}}>
          <XButton title={'单车事故'} onPress={() => this.commit(2)}/>
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

module.exports.SelectHandleTypeView = connect()(SelectHandleTypeView)

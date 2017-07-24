/**
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText,formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, NetUtility } from '../../utility/index.js';

const HandleWayArray = ['04','05','03'];

class SelectHandleTypeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      showRoles:false
    }
  }
  async commit(index){
    this.setState({loading:true});
    //点击之前，先判断网络情况，无网情况，提示无网络，无法处理
    if(index != 0){
      let netInfo = await NetUtility.getCurrentNetInfo();
      if(netInfo && netInfo != 'none'){
        let success = await StorageHelper.saveStep2(HandleWayArray[index]);
        this.setState({loading:false});
        if(success) this.props.navigation.navigate('AGatheringPartyInformationView',{index:index});
      }else{
        this.setState({loading:false});
        Toast.showShortCenter('当前无网络，无法处理');
      }
    }else{
      let success = await StorageHelper.saveStep2(HandleWayArray[index]);
      this.setState({loading:false});
      if(success) this.props.navigation.navigate('AGatheringPartyInformationView',{index:index});
    }

  }
  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator ={false}>
            <View style={{marginTop:50}}>
              <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
                <XButton title={'多车事故|自行协商'} onPress={() => this.commit(0)} style={{backgroundColor:'#2DB3E7',borderRadius:20}}/>
              </View>
              <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
                <XButton title={'多车事故|需远程定责'} onPress={() => this.commit(1)} style={{backgroundColor:'#FEB35A',borderRadius:20}}/>
              </View>
              <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
                <XButton title={'单车事故'} onPress={() => this.commit(2)} style={{backgroundColor:'#36BC99',borderRadius:20}}/>
              </View>
            </View>
            <View style={{marginTop:50}}>
              <Text style={{marginLeft:15,color:formRightText}}>
                注：
              </Text>
              <View style={{flexDirection:'row',marginLeft:15,flex:1,marginTop:10,marginRight:15}}>
                <Text style={{color:formRightText}}>
                  1、
                </Text>
                <Text style={{color:formRightText,lineHeight:20,marginRight:15,marginTop:-2}}>
                  多车事故丨需远程定责，适用于当事人对事故事实及成因有争议，责任划分不明确的事故。事故信息将上传后台，由后台值守民警进行定责，并生成交通事故认定书。
                </Text>
              </View>
              <View style={{flexDirection:'row',marginLeft:15,flex:1,marginTop:10}}>
                <Text style={{color:formRightText}}>
                  2、
                </Text>
                <Text style={{color:formRightText,lineHeight:20,marginRight:15,marginTop:-2}}>
                  单车事故，均需提交后台，由后台值守民警远程定责，并生成交通事故认定书
                </Text>
              </View>
            </View>
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true}/>
      </View>
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

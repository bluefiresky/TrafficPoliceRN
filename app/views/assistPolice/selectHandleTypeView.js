/**
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight, NetInfo } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText,formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, NetUtility } from '../../utility/index.js';

const Icon04 = require('./image/duoche_2.png');
const Icon03 = require('./image/danche.png');
const Icon05 = require('./image/duoche_1.png');
const IconW = 100;
const IconH = (216 * IconW)/441;
const HandleWayArray = ['04','05','03'];

class SelectHandleTypeView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      showRoles:false
    }
  }

  componentWillMount(){
    NetInfo.isConnected.addEventListener('change', (isConnected) => {
      console.log('NetUtility -->> the isConnected is -->> ', isConnected);
    });
  }

  async commit(index){
    this.setState({loading:true});
    //点击之前，先判断网络情况，无网情况，提示无网络，无法处理
    if(index != 0){
      let isConnected = await NetUtility.getCurrentNetIsConnect();
      if(isConnected){
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
            <View style={{height:10, backgroundColor:backgroundGrey}} />
            {this._renderTypeItem('多车事故|自行协商', '#08ae8d', '生成自行协商协议书', Icon04, 0)}
            <View style={{height:10, backgroundColor:backgroundGrey}} />
            {this._renderTypeItem('多车事故|需远程定责', '#ff7007', '生成交通事故认定书', Icon05, 1)}
            <View style={{height:10, backgroundColor:backgroundGrey}} />
            {this._renderTypeItem('单车事故', '#0086f3', '生成交通事故认定书', Icon03, 2)}

            <View style={{marginTop:50, marginBottom:50}}>
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
              <View style={{flexDirection:'row',marginLeft:15,flex:1,marginTop:10, marginRight:15}}>
                <Text style={{color:formRightText}}>
                  2、
                </Text>
                <Text style={{color:formRightText,lineHeight:20,marginRight:15, marginTop:-2}}>
                  单车事故，均需提交后台，由后台值守民警远程定责，并生成交通事故认定书
                </Text>
              </View>
            </View>
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true}/>
      </View>
    );
  }

  _renderTypeItem(text, textColor, subtext, typeIcon, commitType){
    return(
      <TouchableHighlight style={{height:100}} onPress={this.commit.bind(this, commitType)} underlayColor={'transparent'}>
        <View style={{flex:1, backgroundColor:'white', flexDirection:'row', alignItems:'center', paddingHorizontal:15}}>
          <Text style={{flex:1, fontSize:17, color:textColor, lineHeight:20}}>{text+'\n'}<Text style={{fontSize:15, color:'#666666',paddingTop:5}}>{subtext}</Text></Text>
          <Image style={{width:IconW, height:IconH, resizeMode:'contain'}} source={typeIcon}/>
          <Image style={{width:15, height:15, resizeMode:'contain'}} source={require('./image/right_arrow.png')} />
        </View>
      </TouchableHighlight>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.SelectHandleTypeView = connect()(SelectHandleTypeView)

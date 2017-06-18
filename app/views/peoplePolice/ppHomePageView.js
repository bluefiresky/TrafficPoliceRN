/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class PpHomePageView extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Text style={{fontSize:15,color:'#ffffff',marginRight:15}} onPress={() => {navigation.navigate('SettingView')}}>设置</Text>
      )
    }
  }
  constructor(props){
    super(props);
    this.state = {
    }
  }
  //处理案件
  handleCase(){
    this.props.navigation.navigate('AccidentBasicInformationView');
  }
  //历史案件
  historyCase(){
    this.props.navigation.navigate('HistoricalCaseView',{title:'日历选择'});
  }
  renderRowItem(title,value){
    return (
      <View style={{flexDirection:'row',marginLeft:15,marginTop:10,marginBottom:10}}>
        <Text style={{fontSize:13,color:formLeftText}}>{title}</Text>
        <Text style={{fontSize:13,color:formLeftText}}>{value}</Text>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        <View style={{marginTop:40}}>
          {this.renderRowItem('姓名：','XXX')}
          {this.renderRowItem('手机号：','XXX')}
          {this.renderRowItem('警员编号：','XXX')}
          {this.renderRowItem('勘察帐号：','XXX')}
          {this.renderRowItem('所属大队：','XXX大队')}
          <View style={{flexDirection:'row',marginTop:15}}>
            <Image style={{marginLeft:25,width:100,height:100,borderRadius:50,borderColor:'#D4D4D4',borderWidth:1,justifyContent:'center'}}>
              <Text style={{fontSize:12,color:formLeftText,alignSelf:'center'}}>
                大队章
              </Text>
            </Image>
            <Image style={{marginLeft:15,width:100,height:50,borderColor:'#D4D4D4',borderWidth:1,justifyContent:'center',alignSelf:'center'}}>
              <Text style={{fontSize:12,color:formLeftText,alignSelf:'center'}}>
                勘察章
              </Text>
            </Image>
          </View>
        </View>
        <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
          <XButton title='处理案件' onPress={() => this.handleCase()}/>
        </View>
        <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
          <XButton title='历史案件' onPress={() => this.historyCase()}/>
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

module.exports.PpHomePageView = connect()(PpHomePageView)

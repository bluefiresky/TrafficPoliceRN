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
import AlphabetListView from 'react-native-alphabetlistview';

class SelectInInsuranceCompanyView extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: {
        A: ['中国平安','中国人寿','太平洋'],
        B: ['some','entries','are here'],
        C: ['some','entries','are here'],
        D: ['some','entries','are here'],
        E: ['some','entries','are here'],
        F: ['some','entries','are here'],
        G: ['some','entries','are here'],
        H: ['some','entries','are here'],
        I: ['some','entries','are here'],
        J: ['some','entries','are here'],
        K: ['some','entries','are here'],
        L: ['some','entries','are here'],
        M: ['some','entries','are here'],
        N: ['some','entries','are here'],
        O: ['some','entries','are here'],
        P: ['some','entries','are here'],
        Q: ['some','entries','are here'],
        R: ['some','entries','are here'],
        S: ['some','entries','are here'],
        T: ['some','entries','are here'],
        U: ['some','entries','are here'],
        V: ['some','entries','are here'],
        W: ['some','entries','are here'],
        X: ['some','entries','are here'],
        Y: ['some','entries','are here'],
        Z: ['some','entries','are here'],
      }
    }
    global.stackKeys.SelectInInsuranceCompanyView = props.navigation.state.key;
  }
  renderCell(value){
    return (
      <TouchableHighlight style={{backgroundColor:'#EFF2F7'}} underlayColor={'transparent'} onPress={()=>{this.props.navigation.navigate('SelectCityView',{selData:this.props.navigation.state.params.selData,selCompany:value.item})}}>
        <View style={{flex:1}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',marginRight:30,backgroundColor:'#ffffff',paddingVertical:10}}>
            <Text style={{marginLeft:15}}>{value.item}</Text>
            <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,alignSelf:'center',marginRight:15}}/>
          </View>
          <View style={{backgroundColor:backgroundGrey,height:1}}></View>
        </View>
      </TouchableHighlight>
    );
  }
  renderSectionItem(value){
    return (
      <View style={{backgroundColor:'#EFF2F7'}}>
        <Text style={{color:'#7D7D7F'}}>{value.title}</Text>
      </View>
    );
  }
  renderSectionHeader(value){
    return (
      <View style={{backgroundColor:'#EFF2F7',paddingVertical:10}}>
        <Text style={{color:'#7D7D7F',marginLeft:15}}>{value.title}</Text>
      </View>
    );
  }
  render(){
    return(
      <AlphabetListView
        data={this.state.data}
        cell={this.renderCell.bind(this)}
        cellHeight={40}
        sectionListItem={this.renderSectionItem.bind(this)}
        sectionHeader={this.renderSectionHeader.bind(this)}
        sectionHeaderHeight={40}
        updateScrollState={true}
      />
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.SelectInInsuranceCompanyView = connect()(SelectInInsuranceCompanyView)

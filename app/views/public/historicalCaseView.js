/**
* 历史案件页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,Platform,Alert } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import HistoricalCaseCellView from './historicalCaseCellView'

class HistoricalCaseView extends Component {

  static navigationOptions = ({ navigation }) => {
    let { title } = navigation.state.params;
    return {
      title: title
    }
  }
  componentWillUnmount() {
  }
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0
    }
    this.data = [1,2,3,4];
  }
  renderItem({item,index}) {
    return (
      <HistoricalCaseCellView rowData={item} key={index} navigation={this.props.navigation}/>
    )
  }
  render(){
    return(
      <View style={{flex:1}}>
        <FlatList style={{backgroundColor:backgroundGrey}}
                  keyExtractor={(data,index) => {return index}}
                  data={this.data}
                  renderItem={this.renderItem.bind(this)}
                  showsVerticalScrollIndicator={false}
                  getItemLayout={(data, index) => ({length: 120, offset: 90 * index, index})}
                  ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:backgroundGrey,width:W,height:0.5}}></View>)}}
                />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.HistoricalCaseView = connect()(HistoricalCaseView)

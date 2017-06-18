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
import { ScrollerSegment } from '../../components/index';
import HistoricalCaseCellView from './historicalCaseCellView'
import { SettingView } from './settingView'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

class HistoricalCaseView extends Component {

  static navigationOptions = ({ navigation }) => {
    let { title } = navigation.state.params;
    this.listener = RCTDeviceEventEmitter.addListener('ChangeRightTitle', (index) => {
      if (index == 0) {
        navigation.setParams({title: '日历选择'})
      } else if (index == 1) {
        navigation.setParams({title:'全部上传'})
      } else {
        navigation.setParams({title:''})
      }
    });
    return {
      headerRight: (
        <Text style={{fontSize:15,color:'#ffffff',marginRight:15}} onPress={()=>{
          if (title == '日历选择') {

          } else if (title == '全部上传') {
            Alert.alert(
                '提醒',
                '是否将所有待上传案件全部上传？',
                [{text: '取消', onPress: () =>{}},
                {text: '全部上传', onPress: () =>{
                  //上传案件
                }}]
              )
          }
        }}>{title}</Text>
      )
    }
  }
  componentWillUnmount() {
  }
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0
    }
    this.segArrays = ['已完结', '待上传','未完结'];
    this.data = [1,2,3,4];
    this.contentArrs = Array();
  }
  renderContent(i){
    return (
      <HistoricalCase  navigation={this.props.navigation} key={i} currentIndex={i}/>
    )
  }
  render(){
    this.contentArrs = [];
    for (var i = 0; i < 3; i++) {
      this.contentArrs.push(this.renderContent(i));
    }
    return(
      <View style={styles.container}>
        <ScrollerSegment segDatas = {this.segArrays} contentDatas={this.contentArrs} onPress={(index) => {
          RCTDeviceEventEmitter.emit('ChangeRightTitle',index);
          this.setState({currentIndex: index});
        }}/>
       </View>
    );
  }

}
class HistoricalCase extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.data = [1,2,3,4];
  }
  renderItem({item,index}) {
    return (
      <HistoricalCaseCellView rowData={item} key={index} navigation={this.props.navigation}/>
    )
  }
  render(){
    console.log(this.props.currentIndex);
    return(
      <View style={{flex:1,marginBottom:64}}>
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

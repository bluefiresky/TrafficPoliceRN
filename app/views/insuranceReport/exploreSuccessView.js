/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,DeviceEventEmitter } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { NavigationActions } from 'react-navigation'

class ExploreSuccessView extends Component {

  static navigationOptions = {
    header:null
  }
  constructor(props){
    super(props);
    this.state = {
    }
  }
  goBack(){
    let routeName = global.personal.policeType === 2 ? 'PpHomePageView':'ApHomePageView';
    this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}))
    DeviceEventEmitter.emit('InitHome');
  }
  render(){
    return(
      <View style={{flex:1}}>
        <ScrollView style={styles.container}
                     showsVerticalScrollIndicator={false}>
          <Image source={require('./image/export_success.png')} style={{width:100,height:100,marginTop:(Platform.OS === 'ios') ? 94 : 74,alignSelf:'center'}}/>
          <View style={{marginTop:20,marginLeft:15,width:W-30}}>
            <Text style={{alignSelf:'center',fontSize:16,color:formLeftText,lineHeight:20,textAlign:'center'}}>
              查勘完成请等待工作人员审核！
            </Text>
            <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center',marginTop:30}}>
              最多5分钟，审核结果会以短信的形式告知您。
            </Text>
          </View>
           <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
             <XButton title='返回首页' onPress={() => this.goBack()} style={{backgroundColor:'#ffffff',borderRadius:20,borderColor:'#267BD8',borderWidth:1}} textStyle={{color:'#267BD8'}}/>
           </View>
        </ScrollView>
        <View style={styles.navStyle}>
           <TouchableHighlight onPress={()=> {
             let routeName = global.personal.policeType === 2 ? 'PpHomePageView':'ApHomePageView';
             this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}))
             DeviceEventEmitter.emit('InitHome');
           }} underlayColor={'transparent'} style={{width:24,height:40,marginLeft:5,marginTop:(Platform.OS === 'ios') ? 20:0,justifyContent:'center'}}>
             <Image source={require('./image/back.png')} style={{width:12,height:20,alignSelf:'center'}}/>
           </TouchableHighlight>
           <View style={{flex:1,justifyContent:'center',marginTop:(Platform.OS === 'ios') ? 20:0}}>
             <Text style={{alignSelf:'center',color:'#ffffff',fontSize:18,marginLeft:-24}}>完成</Text>
           </View>
        </View>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  navStyle: {
      width: W,
      height: (Platform.OS === 'ios') ? 64:44,
      position: 'absolute',
      top: 0,
      backgroundColor: '#1C79D9',
      flexDirection:'row'
  }
});

module.exports.ExploreSuccessView = connect()(ExploreSuccessView)

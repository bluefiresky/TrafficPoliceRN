/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,WebView,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'

import { W, H, backgroundGrey,formLeftText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView,XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

class CommonWebView extends Component {

  static navigationOptions = ({ navigation }) => {
    let title = navigation.state.params?(navigation.state.params.title?navigation.state.params.title:''):'';
    return{
      title
    }
  }

  constructor(props){
    super(props);
    this.state = {
      loading:false,
      url:props.navigation.state.params.url
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this.setState({url: this.props.navigation.state.params.url});
    })
  }

  render(){
    let { url } = this.state;

    return(
      <View style={styles.container}>
        <WebView
          scalesPageToFit = {true}
          javaScriptEnabled={true}
          source={{uri:url}}
          style={{flex: 1}}
          onNavigationStateChange={this._onNavigationStateChange}
          startInLoadingState={true}/>

        <ProgressView showProgress={this.state.loading} hasTitleBar={true}/>
      </View>
    );
  }

  /** Private Method **/
  _onNavigationStateChange(navState){
    console.log('ApplyContract onNavigationStateChange -->> navState: ', navState);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7'
  }
});

module.exports.CommonWebView = connect()(CommonWebView)

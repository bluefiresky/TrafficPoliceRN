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

// const Headers = {
//   Host: 'api.accidentx.zhongchebaolian.com',
//   Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
//   'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G9008W Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36'
// }
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
      // this.setState({url: this.props.navigation.state.params.url});
    })
  }

  render(){
    let { url } = this.state;

    return(
      <View style={styles.container}>
        <WebView
          scalesPageToFit = {true}
          javaScriptEnabled={true}
          source={{uri:url, headers:Headers}}
          style={{flex: 1}}
          onNavigationStateChange={this._onNavigationStateChange}
          userAgent={'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4'}
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

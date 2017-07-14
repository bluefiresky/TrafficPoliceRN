/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'
import SignatureCapture from 'react-native-signature-capture';

import { W, H, backgroundGrey,formLeftText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

const TitlebarHeight = Platform.select({ android: 44, ios: 64 });

class SignatureView extends Component {

  constructor(props){
    super(props);
    this.signData = null;
    this._onSaveEvent = this._onSaveEvent.bind(this);
    this.state = {
      viewMode: 'landscape',
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{height:TitlebarHeight, flexDirection: 'row', paddingLeft:20, paddingTop:10 }}>
          <TouchableHighlight style={styles.buttonStyle} onPress={() => { this._goBack() }} underlayColor={'transparent'}>
            <Text style={{color:mainBule, fontSize: 14}}>返回</Text>
          </TouchableHighlight>
          <View style={{width: 20}} />
          <TouchableHighlight style={styles.buttonStyle} onPress={() => { this._saveSign() }} underlayColor={'transparent'}>
            <Text style={{color:mainBule, fontSize: 14}}>保存</Text>
          </TouchableHighlight>
          <View style={{width: 20}} />
          <TouchableHighlight style={styles.buttonStyle} onPress={() => { this._resetSign() }} underlayColor={'transparent'}>
            <Text style={{color:mainBule, fontSize: 14}}>重置</Text>
          </TouchableHighlight>
        </View>

        <SignatureCapture
          style={{flex: 1, backgroundColor:'white'}}
          ref={(ref)=>{ this.ref = ref }}
          onSaveEvent={this._onSaveEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={this.state.viewMode}/>

      </View>
    );
  }

  /** Private **/
  _saveSign() {
    this.ref.saveImage();
  }

  _resetSign() {
    if(!this.signData) return;
    this.ref.resetImage();
  }

  _goBack() {
    this.setState({viewMode:'portrait'})
    this.props.navigation.goBack();
  }

  _onSaveEvent(result){
    if(this.signData) return;
    console.log('SignatureView and the result -->> ', result);

    if(result && result.encoded) {
      this.signData = result.encoded;
      this.setState({viewMode: 'portrait'})
      if(this.props.navigation.state.params.returnValue) this.props.navigation.state.params.returnValue(this.signData);
      this.props.navigation.goBack();
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonStyle:{
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: mainBule,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const ExportView = connect()(SignatureView);
ExportView.navigationOptions = ({ navigation }) => {
  return {
    header: null
  }
}

module.exports.SignatureView = ExportView

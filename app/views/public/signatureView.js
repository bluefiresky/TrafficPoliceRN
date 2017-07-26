/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'
import SignatureCapture from 'react-native-signature-capture';
import Orientation from 'react-native-orientation';

import { W, H, backgroundGrey,formLeftText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

const MarginTitle = Platform.select({ android: 0, ios: 22 });
const IsIos = Platform.OS === 'ios';
const ButtonW = (W - 60)/3

class SignatureView extends Component {

  constructor(props){
    super(props);
    this.signData = null;
    this._onSaveEvent = this._onSaveEvent.bind(this);
    this._orientationDidChange = this._orientationDidChange.bind(this);
    this._onBackEvent = this._onBackEvent.bind(this);
    this.state = {
      viewMode: 'landscape',
      show:false,
    }
  }

  componentWillMount(){
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      Orientation.lockToLandscapeRight();
    })
    // Orientation.getOrientation((err, orientation) => {
    //   console.log(' SignatureView get the orientation -->> ', orientation);
    //   if(orientation === 'PORTRAIT'){
    //     // Orientation.lockToLandscapeRight();
    //   }else if(orientation === 'LANDSCAPE'){
    //     this.setState({show:true})
    //   }
    // });

  }

  componentWillUnmount(){
    this._onBackEvent();
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={{flexDirection: 'row', paddingHorizontal:15, paddingVertical:10, marginTop:MarginTitle}}>
          <TouchableHighlight style={styles.buttonStyle} onPress={() => { this._goBack() }} underlayColor={'transparent'}>
            <Text style={{color:mainBule, fontSize: 14}}>返回</Text>
          </TouchableHighlight>
          <View style={{width: 15}} />
          <TouchableHighlight style={styles.buttonStyle} onPress={() => { this._resetSign() }} underlayColor={'transparent'}>
            <Text style={{color:mainBule, fontSize: 14}}>重置</Text>
          </TouchableHighlight>
          <View style={{flex:1}} />
          <TouchableHighlight style={styles.buttonStyle} onPress={() => { this._saveSign() }} underlayColor={'transparent'}>
            <Text style={{color:mainBule, fontSize: 14}}>保存</Text>
          </TouchableHighlight>
        </View>

        {
          !this.state.show? <View style={{flex:1, backgroundColor:backgroundGrey}} /> :
          <SignatureCapture
            style={{flex: 1}}
            ref={(ref)=>{ this.ref = ref }}
            onSaveEvent={this._onSaveEvent}
            saveImageFileInExtStorage={true}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'landscape'}/>
        }

      </View>
    );
  }

  /** Private **/
  _orientationDidChange(orientation){
    // console.log('execute _orientationDidChange and the orientation -->> ', orientation);
    if (orientation === 'LANDSCAPE') {
      this.setState({show:true})
    }
  }

  _saveSign() {
    this.ref.saveImage();
  }

  _resetSign() {
    this.ref.resetImage();
  }

  _goBack() {
    this.props.navigation.goBack();
  }

  _onSaveEvent(result){
    if(this.signData) return;
    console.log('SignatureView and the result -->> ', result);

    if(result && result.encoded) {
      // this.signData = result.encoded;
      this.signData = result.pathName;
      if(this.props.navigation.state.params.returnValue) this.props.navigation.state.params.returnValue(this.signData);

      this.props.navigation.goBack();
    }
  }

  _onBackEvent(){
    Orientation.removeOrientationListener(this._orientationDidChange)
    Orientation.lockToPortrait();
    console.log(' SignatureView execute _onBackEvent and has lockToPortrait');
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonStyle:{
    height: 40,
    width: ButtonW,
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

/**
 *
 * wuran on 17/1/3.
 */

import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';
import { InputH, W, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';

const IconRightSize = Platform.select({ android: 0, ios: 15 });
const TextInputStyle = Platform.select({
  android: {includeFontPadding:false,textAlignVertical:'center'},
  ios: {textAlign:'justify', paddingBottom:4}
});

export class InputWithIcon extends Component {


  static defaultProps = {
    type : 'text'
  }

  constructor(props){
    super()

    if(props.form && !props.readonly) {
      props.form.regRefer(props.name, this)
    }

    this.state = {
      focus: 0
    }

    this._onChangeText = this._onChangeText.bind(this);
    this._clear = this._clear.bind(this);
    this._filterText = this._filterText.bind(this);
  }


  // _tap() {
  //   if(!this.props.readonly)
  //     this.refs.ipt.focus()
  //
  // }

  // _focus(e){
  //   this.setState({
  //     focus: 1
  //   })
  //   if(this.props.onFocus) {
  //     this.props.onFocus()
  //   }
  // }

  /*
   getPosition() {
   return getPosition(this.refs.holder)
   }
   */

  // _change(e){
  //
  //   if(this.props.onChange) {
  //     this.props.onChange(e.target.value)
  //   }
  // }

  // _blur(e){
  //   this.setState({
  //     focus: 0
  //   })
  //   if(this.props.onBlur) {
  //     this.props.onBlur()
  //   }
  // }

  // _keypress(e){
  //   if(e.which === 13) {
  //     if(this.props.onEnter) {
  //       this.props.onEnter()
  //     }
  //
  //     if(this.props.onSubmit) {
  //       this.props.onSubmit()
  //     }
  //
  //   }
  // }

  // focus(){
  //
  //   if(!this.props.readonly)
  //     this.refs.ipt.focus()
  // }
  //
  // blur(){
  //   if(!this.props.readonly)
  //     this.refs.ipt.blur()
  // }

  /**
   *  this.props.onChange 为fields的属性
   *  用于更新fields的value值，导致{ value } = this.props；得到变更，render()可以进行渲染
   */
  _onChangeText(text) {
    // let result = this._filterText(text);
    // console.log(' InputWithIcon verify the result -->> ', result );

    if (this.props.onChange) {
      this.props.onChange(text.trim());
    }
  }

  _clear(e) {
    console.log('doing input withd icon clear');
    if(this.props.onChange) {
      this.props.onChange('')
    }
  }

  _filterText(text){
    let { secure, keyboardType } = this.props;
    let result;
    if(secure) {
      if(text.match(/^[A-Za-z0-9_]+$/g)) result = text;
      else result = text.substring(0, (text.length - 1));
    }
    console.log('------------ text: ' + text + ' ---------- result: '+result );

    return result;
  }

  render() {
    let { style, icon, labelWidth, noBorder, hasClearButton,/* TextInput properties */ type, autoFocus, editable, keyboardType, placeholder, selectTextOnFocus, secure, maxLength, multiline,/* fields properties */ value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };
    const ClearButton = this.renderClearButton(hasClearButton, value);

    return(
      <View style={ [{paddingLeft: 20, flexDirection: 'row', height: InputH, backgroundColor: 'white'}, border, style && style] }>
        <View style={{width: labelWidth? labelWidth : 60, justifyContent: 'center', alignItems:'center'}}>
          <Image style={{height: 20, width: 20, resizeMode:'contain'}} source={icon}/>
        </View>
        {/** 兼容ios，ios在多行情况下垂直居中，而android默认填充整个view **/}
        <View style={{flex:1, justifyContent:'center'}}>
          <TextInput
            style={[{fontSize:16, color:commonText, paddingLeft:10}, TextInputStyle]}
            onChangeText={ (text) => { this._onChangeText(text) } }
            value={value}
            autoFocus={autoFocus}
            editable={editable === false? false : true}
            keyboardType={keyboardType? keyboardType : 'default'}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            selectTextOnFocus={selectTextOnFocus}
            secureTextEntry={secure}
            underlineColorAndroid={'transparent'}
            maxLength={maxLength}
            multiline={multiline}
          />
        </View>
        {ClearButton}
      </View>
    );
  }

  renderClearButton(hasClearButton, value){
    if (hasClearButton === false) {
      return null;
    }else{
      if (value && value != '') {
        const _Component = this.renderTouchComponent();
        return (
          <View style={{width: InputH, paddingRight: 15, justifyContent: 'center', alignItems: 'center'}}>
            <_Component onPress={this._clear}>
              <Image style={{height: 15, width: 15}} source={require('./image/icon-clear-text.png')} resizeMode='contain'/>
            </_Component>
          </View>
        )
      }
    }
  }

  renderTouchComponent(){
    let _Component;
    if (Platform.OS === 'ios') {
      _Component = TouchableHighlight
    }else if (Platform.OS === 'android') {
      _Component = TouchableNativeFeedback
    }

    return _Component;
  }

}

const styles = {
  container : {

  },

  input : {


  },

  close: {

  }
}

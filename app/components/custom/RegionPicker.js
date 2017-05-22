/**
 * wuran on 17/1/3.
 * 底部弹出picker选择框
 */

import React, { Component } from 'react';

import _Picker from 'react-native-picker';
import ChinaRegionWheelPicker from 'rn-wheel-picker-china-region';

import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, Platform, Image  } from 'react-native';
import { W, borderColor, formLeftText, formRightText, commonText, placeholderColor, mainBule,backgroundGrey } from '../../configs/index.js';

export class RegionPicker extends Component {

  // static propTypes = {
  //   data: React.PropTypes.array.isRequired,
  // }

  constructor(props) {
    super(props);

    this.state = {
      show: false
    }

    this._onPress = this._onPress.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this._cancel = this._cancel.bind(this);
    // this.data = this.props.data;
    // this.labelArray = [];
  }

  // componentDidMount(){
  //   this.data.forEach( (entry) => {
  //     this.labelArray.push(entry.label)
  //   })
  // }

  _onPress(){
    if(this.props.enable === false) return;
    this.setState({show: true})
  }

  _cancel(){
    this.setState({show: false})
  }

  // _getValueByLabel(array, label){
  //   let res;
  //   for(let i = 0; i < array.length; i++){
  //     let entry = array[i];
  //     if(entry.label === label) {
  //       res = entry;
  //       break;
  //     }
  //   }
  //
  //   return res;
  // }

  _onChangeText(params) {
    // console.log('doing onjectPicker _onChangeText and the params -->> ', params);
    if (this.props.onChange) {
      this.props.onChange(params);
    }
    this.setState({show: false})
  }

  render(){
    let { show } = this.state;
    let { label, labelWidth, placeholder, noBorder, style, enable,value } = this.props;
    let border = noBorder? null : { borderBottomColor: backgroundGrey, borderBottomWidth: 1};
    let back = enable === false? 'transparent' : 'white';

    return(
      <View style={ [{paddingLeft: 15, height:45,flexDirection: 'row', backgroundColor: back}, border, style] }>
        <View style={{justifyContent: 'center'}}>
          <Text style={{ color: formRightText, fontSize: 13 }}>{ label }</Text>
        </View>
        <TouchableWithoutFeedback onPress={this._onPress}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center',marginLeft:10}}>
              {
                value && value != ''?
                <Text style={{fontSize: 13, color: commonText}} numberOfLines={2} >{`${value.province}  ${value.city}  ${value.area}`}</Text>
                :
                <Text style={{fontSize: 13, color: placeholderColor}}>{placeholder}</Text>
              }
            </View>
            <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{height: 12, width: 12, resizeMode: 'contain'}} source={require('./image/icon-arrow-down-blue.png')}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {
          show?
            <ChinaRegionWheelPicker
              isVisible={show}
              navBtnColor={mainBule}
              transparent
              animationType={'fade'}
              onSubmit={this._onChangeText}
              onCancel={this._cancel}
              androidPickerHeight={100}
            />
          :
            null
        }

      </View>
    )
  }
}

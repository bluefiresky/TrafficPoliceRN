/**
 * wuran on 17/1/3.
 * 底部弹出picker选择框
 */

import React, { Component } from 'react';

import _Picker from 'react-native-picker';

import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, Platform, Image  } from 'react-native';
import { W, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';

const DutyTypeList = [{label:'全责',code:'0'},{label:'无责',code:'1'},{label:'同等责任',code:'2'},{label:'主责',code:'3'},{label:'次责',code:'4'}];

export class DutyTypePicker extends Component {

  static propTypes = {
    // data: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this.data = DutyTypeList;
    this.labelArray = [];
  }

  componentDidMount(){
    this.data.forEach( (entry) => {
      this.labelArray.push(entry.label)
    })
  }

  _onPress(){
    let self = this;
    _Picker.init({
        pickerData: this.labelArray,
        pickerConfirmBtnText: '确认',
        pickerCancelBtnText: '取消',
        pickerTitleText: '',
        onPickerConfirm: label => {
          let entry = self._getValueByLabel(self.data, label[0]);
          self._onChangeText(entry)
        }
    });
    _Picker.show();
  }

  _getValueByLabel(array, label){
    let res;
    for(let i = 0; i < array.length; i++){
      let entry = array[i];
      if(entry.label === label) {
        res = entry;
        break;
      }
    }

    return res;
  }

  _onChangeText(entry) {
    // console.log('doing onjectPicker _onChangeText and the entry -->> ', entry);
    if (this.props.onChange) {
      this.props.onChange(entry);
    }
  }

  render(){
    let { label, labelWidth, placeholder, noBorder, /** fields */value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };

    return(
      <View style={ [{flexDirection: 'row', height: 40, backgroundColor: 'white'}, border] }>
        <View style={{flex:1, justifyContent: 'center'}}>
          <Text style={{ color: formLeftText, fontSize: 14 }}>{ label }</Text>
        </View>
        <TouchableWithoutFeedback onPress={this._onPress}>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center'}}>
              {
                value && value != ''?
                <Text style={{fontSize: 14, color: commonText}} numberOfLines={2} >{value}</Text>
                :
                <Text style={{fontSize: 14, color: placeholderColor}}>{placeholder}</Text>
              }
            </View>
            <View style={{width: 30, marginRight:5, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{height: 12, width: 12, resizeMode: 'contain'}} source={require('./image/right_arrow.png')}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

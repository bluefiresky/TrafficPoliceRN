/**
 * wuran on 17/1/3.
 * 底部弹出picker选择框
 */

import React, { Component } from 'react';

import _Picker from 'react-native-picker';

import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, Platform, Image  } from 'react-native';
import { W, borderColor, formLeftText, formRightText, commonText, placeholderColor, backgroundGrey } from '../../configs/index.js';
import { Input } from '../index.js';  /** 自定义组件 */

export class CarTypePicker extends Component {

  static propTypes = {
    data: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this.data = this.props.data;
    this.labelArray = [];
    this.inputType = 0; // 0:正常 -- 1:其他
  }

  componentDidMount(){
    this.data.forEach( (entry) => {
      this.labelArray.push(entry.name)
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
          self._onChangeText(label[0])
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

  _onChangeText(entry, input) {
    // console.log('doing onjectPicker _onChangeText and the entry -->> ', entry);
    if(input){
      if (this.props.onChange) {
        this.props.onChange(entry);
      }
      this.inputType = 1;
    }else{
      if(entry.indexOf('其他') != -1){
        this.inputType = 1;
        if (this.props.onChange) {
          this.props.onChange('');
        }
      }else{
        this.inputType = 0;
        if (this.props.onChange) {
          this.props.onChange(entry);
        }
      }
    }

  }

  render(){
    let { label, labelWidth, placeholder, noBorder, /** fields */value } = this.props;
    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };

    return(
      <View style={[{paddingLeft:20}, border]}>
        <View style={ [{flexDirection: 'row', height: 40, backgroundColor: 'white'}] }>
          <View style={{width: labelWidth? labelWidth : 80, justifyContent: 'center'}}>
            <Text style={{ color: formLeftText, fontSize: 14 }}>{ label }</Text>
          </View>
          <TouchableWithoutFeedback onPress={this._onPress}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, justifyContent: 'center'}}>
                {
                  value && value != ''?
                  <Text style={{fontSize: 14, color: commonText}} numberOfLines={2} >{this.inputType === 1? '其他':value}</Text>
                  :
                  <Text style={{fontSize: 14, color: placeholderColor}}>{this.inputType === 1?'其他':placeholder}</Text>
                }
              </View>
              <View style={{width: 50, alignItems: 'center', justifyContent: 'center'}}>
                <Image style={{height: 12, width: 12, resizeMode: 'contain'}} source={require('./image/right_arrow.png')}/>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {
          this.inputType === 1?
            <View>
              <View style={{width:W,height:1,backgroundColor:backgroundGrey}} />
              <Input label={'其他类型'} placeholder={'请输入其他车辆类型'} value={value} maxLength={18} style={{flex:1, height: 40, paddingLeft:0}} noBorder={true} onChange={(text) => { this._onChangeText(text, true) }}/>
            </View>
            :
            null
        }
      </View>

    )
  }
}

/**
 * wuran on 17/1/3.
 * 底部弹出picker选择框
 */

import React, { Component } from 'react';

import _Picker from 'react-native-picker';

import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableHighlight, Platform, Image, Modal, TouchableOpacity  } from 'react-native';
import { W, H, borderColor, formLeftText, formRightText, commonText, placeholderColor, mainBule } from '../../configs/index.js';

const ModalW = W - 60;
const ModalH = H - 100;

export class SituationPicker extends Component {

  static propTypes = {
    data: React.PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      show:false,
    }

    this._onPress = this._onPress.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
    this.data = this.props.data;
    this.labelArray = [];
  }

  // componentDidMount(){
  //   this.data.forEach( (entry) => {
  //     this.labelArray.push(entry.name)
  //   })
  // }

  _onPress(){
    this.setState({show:true})
    // let self = this;
    // _Picker.init({
    //     pickerData: this.labelArray,
    //     pickerConfirmBtnText: '确认',
    //     pickerCancelBtnText: '取消',
    //     pickerTitleText: '',
    //     onPickerConfirm: label => {
    //       let entry = self._getValueByLabel(this.data, label[0]);
    //       self._onChangeText(entry)
    //     }
    // });
    // _Picker.show();
  }

  _getValueByLabel(array, label){
    let res;
    for(let i = 0; i < array.length; i++){
      let entry = array[i];
      if(entry.name === label) {
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
    let { show } = this.state;

    const border = noBorder? null : { borderBottomColor :  borderColor, borderBottomWidth: 0.5 };

    return(
      <View style={ [{paddingLeft: 20, flexDirection: 'row', height: 40, backgroundColor: 'white'}, border] }>
        <View style={{width: labelWidth? labelWidth : 100, justifyContent: 'center'}}>
          <Text style={{ color: formLeftText, fontSize: 14 }}>{ label }</Text>
        </View>
        <TouchableWithoutFeedback onPress={this._onPress}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems:'flex-end'}}>
              {
                value && value != ''?
                <Text style={{fontSize: 14, color: commonText}} numberOfLines={2} >{value.name}</Text>
                :
                <Text style={{fontSize: 14, color: placeholderColor}}>{placeholder}</Text>
              }
            </View>
            <View style={{paddingHorizontal:10, alignItems: 'center', justifyContent: 'center'}}>
              <Image style={{height: 12, width: 12, resizeMode: 'contain'}} source={require('./image/right_arrow.png')}/>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {this.renderModal(show, value)}
      </View>
    )
  }

  renderModal(show, select){
    return(
      <View>
        <Modal animationType="slide" transparent={true} visible={show} onRequestClose={() => {}}>
          <TouchableOpacity onPress={() => this.setState({show:false})} style={styles.modalContainer} activeOpacity={1}>
            <View style={{width:ModalW, borderRadius:10, backgroundColor:'white', flexDirection:'row', flexWrap:'wrap', padding:5}}>
              {this.data.map((value, index) => {
                let show = (select && (select.code == value.code))? {back:mainBule, border:mainBule, text:'white'} : {back:'white', border:formRightText, text:formRightText};
                return(
                  <TouchableOpacity
                    key={index} activeOpacity={0.8} style={{margin:5, backgroundColor:show.back, borderColor:show.border, borderWidth:1, borderRadius:5, paddingVertical:3, paddingHorizontal:5}}
                    onPress={()=>{
                      this._onChangeText(value);
                      this.setState({show:false})
                    }} >
                    <Text style={{fontSize:16, color:show.text, includeFontPadding:false, textAlignVertical:'center'}}>{value.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});

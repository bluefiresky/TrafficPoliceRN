/**
 * renhanyi
 * 选择车牌
 */

import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { W, formLeftText, formRightText,backgroundGrey } from '../../configs/index.js';

export class SelectCarNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showData:null,
    }
    this.currSeleIndex = 0;
    this.viewWidth = 0;
    this.returnText = '';
    this.selectPro = '';
    this.selectLet = '';
    this.selectNum = ''
  }
  showData(type,data){
    this.setState({
      showData:data,
      show:true
    })
    if (type == 'provincialData') {
      this.currSeleIndex = 0
    } else if (type == 'letterData') {
      this.currSeleIndex = 1
    } else {
      this.currSeleIndex = 2
    }
  }
  clickItem(value,index){
    let { style, provincialData, letterData, numberData } = this.props;
    if (this.currSeleIndex == 0) {
      this.setState({
        showData:letterData
      })
      this.selectPro = value;
      this.currSeleIndex = 1;
      for (var i = 0; i < provincialData.length; i++) {
         provincialData[i].isSelcted = (i == index ? true : false)
      }
      this.selectNum = '';
      this.returnValue()
    } else if (this.currSeleIndex == 1) {
      this.setState({
        showData:numberData
      })
      this.selectLet = value;
      this.currSeleIndex = 2;
      for (var i = 0; i < letterData.length; i++) {
        letterData[i].isSelcted = (i == index ? true : false)
      }
      this.returnValue()
    } else {
      if (this.selectNum.length == 5) {
        this.setState({
          show: false,
        })
        return;
      }
      this.setState({
        showData:numberData
      })
      this.selectNum = this.selectNum + value;
      this.returnValue()
      for (var i = 0; i < numberData.length; i++) {
        numberData[i].isSelcted = (i == index ? true : false)
      }
      if (this.selectNum.length == 5) {
        this.setState({
          show: false,
        })
        for (var i = 0; i < numberData.length; i++) {
          numberData[i].isSelcted = false
        }
      }
    }
  }
  //删除
  deleteClick() {
    if (this.selectNum.length > 0) {
      this.setState({
        show:true
      })
    }
    this.selectNum = this.selectNum.substring(0,this.selectNum.length-1);
    this.returnValue()
  }
  //确定
  confirmClick(){
    this.setState({
      show: false,
    })
    this.returnValue()
  }
  //返回值
  returnValue(){
    this.returnText = this.selectPro+this.selectLet+this.selectNum
    this.props.onChangeValue(this.returnText);
  }
  renderOneItem(value,index){
    let width = (this.viewWidth - 60) / 5;
    return (
      <TouchableHighlight style={{width:width, height: width,alignItems:'center',justifyContent: 'center',marginLeft:10,borderColor:'#D4D4D4',borderWidth:1,marginTop:10,backgroundColor:(value.isSelcted ? 'orange':'white')}} key={index} onPress={() => this.clickItem(value.title,index)} underlayColor={'transparent'}>
        <Text style={{fontSize:14}}>
          {value.title}
        </Text>
      </TouchableHighlight>
    )
  }
  render(){
    let { show, selectNum } = this.state;
    let { style, provincialData, letterData, numberData } = this.props;
    return(
      <View style={[{},style]}>
        <View style={{flexDirection:'row'}}
              onLayout={(e) => {
                this.viewWidth = e.nativeEvent.layout.width;
              }}>
          <Text style={{backgroundColor:'#D4D4D4',fontWeight:'bold',fontSize:16,width:30,height:30,padding:5,textAlign:'center'}} onPress={() => this.showData('provincialData',provincialData)}>
            {this.selectPro}
          </Text>
          <Text style={{backgroundColor:'#D4D4D4',fontWeight:'bold',fontSize:16,width:30,height:30,padding:5,marginLeft:10,textAlign:'center'}} onPress={() => this.showData('letterData',letterData)}>
            {this.selectLet}
          </Text>
          <Text style={{flex:1,backgroundColor:'#D4D4D4',fontSize:14,height:30,marginLeft:10,textAlign:'center',paddingTop:7}} onPress={() => this.showData('numberData',numberData)}>
            {this.selectNum}
          </Text>
        </View>
        {this.state.show?<View style={{marginTop:10}}>
          <View style={{borderColor:'#D4D4D4',borderWidth:1}}>
            <View style={{marginBottom:10,flexDirection:'row',flexWrap:'wrap',}}>
              {this.state.showData.map((value,index) => this.renderOneItem(value,index))}
            </View>
            {this.currSeleIndex == 2 ? <View style={{flexDirection:'row',justifyContent: 'center',flex:1,marginBottom:10}}>
              <TouchableHighlight style={{borderColor:'#D4D4D4',borderWidth:1,alignSelf:'center',padding:10}} onPress={() => this.deleteClick()} underlayColor='transparent'>
                <Text style={{textAlign:'center',fontSize:14}}>
                  删除
                </Text>
              </TouchableHighlight>
              <TouchableHighlight style={{justifyContent: 'center',borderColor:'#D4D4D4',borderWidth:1,marginLeft:10,alignSelf:'center',padding:10}}>
                <Text style={{textAlign:'center',fontSize:14}} onPress={() => this.confirmClick()} underlayColor='transparent'>
                  确定
                </Text>
              </TouchableHighlight>
            </View>:null}
          </View>
        </View>:null}
      </View>
    )
  }
}

/**
 * renhanyi
 * 选择车牌
 */

import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { W, formLeftText, formRightText,backgroundGrey, mainBule } from '../../configs/index.js';

export class SelectCarNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showData:null,
    }
    this.currSeleIndex = -1;
    this.viewWidth = 0;
    this.returnText = '';
    this.selectPro = '';
    this.selectNum = ''
  }
  showData(type,data){
    if(this.currSeleIndex == -1){
      if(type === 'provincialData') this.currSeleIndex = 0;
      if(type === 'numberData') this.currSeleIndex = 1;
      this.setState({showData: data, show:true})
    }else{
      let show;
      if (type == 'provincialData') {
        show = (this.currSeleIndex === 0)?false:true;
        this.currSeleIndex = show?0:-1;
      } else if (type == 'numberData') {
        show = (this.currSeleIndex === 1)?false:true;
        this.currSeleIndex = show?1:-1;
      }
      this.setState({ showData:data, show })
    }


  }
  clickItem(value,index){
    let { style, provincialData, numberData } = this.props;
    if (this.currSeleIndex == 0) {
      this.setState({
        showData:numberData
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
      this.selectNum = this.selectNum + value;
      this.returnValue()
      for (var i = 0; i < numberData.length; i++) {
        numberData[i].isSelcted = (i == index)
      }
      if (this.selectNum.length == 8) {
        this.setState({
          show:false
        })
      }
    }
  }
  //删除
  deleteClick() {
    let { numberData } = this.props;
    if (this.selectNum.length > 0) {
      this.selectNum = this.selectNum.substring(0,this.selectNum.length-1);
      this.returnValue()
      for (var i = 0; i < numberData.length; i++) {
        let lastStr = this.selectNum.substr(this.selectNum.length-1,1)
        numberData[i].isSelcted = (lastStr == numberData[i].title)
      }
      this.setState({
        show:true
      })
    }
  }
  //确定
  confirmClick(){
    this.currSeleIndex = -1;
    this.setState({ show: false })
    this.returnValue()
  }
  //返回值
  returnValue(){
    this.returnText = this.selectPro+this.selectNum
    this.props.onChangeValue(this.returnText);
  }
  renderOneItem(value,index){
    let width = (this.viewWidth - 60) / 5;
    return (
      <TouchableHighlight
        style={{width:width, height: width,alignItems:'center',justifyContent: 'center',marginLeft:10,borderColor:'#D4D4D4',borderWidth:1,marginTop:10,backgroundColor:(value.isSelcted ? 'orange':'white')}}
        key={index}
        onPress={this.clickItem.bind(this,value.title,index)}
        underlayColor={'transparent'}>
        <Text style={{fontSize:14}}>{value.title}</Text>
      </TouchableHighlight>
    )
  }
  render(){
    let { show, selectNum } = this.state;
    let { style, provincialData, letterData, numberData, label, hasStar, plateNum } = this.props;
    if(plateNum && !this.selectPro && !this.selectNum){
      this.selectPro = plateNum.substring(0,1);
      this.selectNum = plateNum.substring(1,plateNum.length);
    }
    return(
      <View style={[{},style]}>
        <View style={{flexDirection:'row'}}
              onLayout={(e) => {
                this.viewWidth = e.nativeEvent.layout.width * 0.7;
              }}>
          {
            hasStar? <Text style={{fontSize:12,color:'red',alignSelf:'center'}}>*</Text> : null
          }
          <Text style={{fontSize: 14, color: formLeftText, width: 80, alignSelf:'center',marginLeft:5}}>{label}</Text>
          <Text style={{borderColor:mainBule,borderWidth:1,fontWeight:'bold',fontSize:16,width:30,height:30,padding:5,textAlign:'center'}} onPress={() => this.showData('provincialData',provincialData)}>
            {this.selectPro}
          </Text>
          <Text style={{flex:1,borderColor:mainBule,borderWidth:1,fontSize:14,height:30,marginLeft:10,textAlign:'center',paddingTop:7}} onPress={() => this.showData('numberData',numberData)}>
            {this.selectNum}
          </Text>
        </View>
        {this.state.show?<View style={{borderColor:'#D4D4D4',borderWidth:1,marginTop:10}}>
            <View style={{marginBottom:10,flexDirection:'row',flexWrap:'wrap',}}>
              {this.state.showData.map((value,index) => this.renderOneItem(value,index))}
            </View>
            {this.currSeleIndex == 1 ? <View style={{flexDirection:'row',justifyContent: 'center',flex:1,marginBottom:10}}>
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
          </View>:null}
      </View>
    )
  }
}

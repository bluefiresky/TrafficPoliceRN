/**
 * renhanyi
 * 选择车牌
 */

import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableHighlight } from 'react-native';
import { W, formLeftText, formRightText,backgroundGrey, mainBule } from '../../configs/index.js';
import { getProvincialData, getNumberData } from '../../configs/index.js';

const provincialData = getProvincialData();
const numberData = getNumberData();

export class SelectCarNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showData:null,
    }
    this.currSeleIndex = 1;
    this.viewWidth = 0;
    this.returnText = '';
  }
  showData(type){
    if(!type){
      if(!this.state.show){
        let { plateNum } = this.props;
        if(!plateNum){
          this.currSeleIndex = 0;
          this.setState({showData: provincialData, show:true});
        }else{
          if(this.currSeleIndex == 0) this.setState({showData: provincialData, show:true});
          if(this.currSeleIndex == 1) this.setState({showData: numberData, show:true})
        }
      }else{
        this.setState({show:false})
      }
      return;
    }

    // 当前以显示的切换装填
    if(type === 'province') {
      this.currSeleIndex = 0;
      this.setState({showData: provincialData, show:true})
    }
    if(type === 'number'){
      this.currSeleIndex = 1;
      this.setState({showData: numberData, show:true})
    }
  }

  //删除
  deleteClick() {
    let { plateNum, onChangeValue } = this.props;
    if(plateNum){
      let len = plateNum.length;
      plateNum = plateNum.substring(0, len-1);
      onChangeValue(plateNum);
    }
  }
  //确定
  confirmClick(){
    this.setState({ show: false })
  }
  //返回值
  itemClick(value, index){
    let { plateNum } = this.props;
    // console.log(' itemClick and the value -->> ', value);
    // console.log(' itemClick and the plateNum -->> ', plateNum);
    if(plateNum){
      if(plateNum.length >= 9) this.props.onChangeValue(plateNum);
      else this.props.onChangeValue(plateNum + value);
    }else{
      this.props.onChangeValue(value);
      this.showData('number')
    }
  }

  renderOneItem(value,index){
    let width = (this.viewWidth - 60) / 5;
    return (
      <TouchableHighlight
        style={{width:width, height: width,alignItems:'center',justifyContent: 'center',marginLeft:10,borderColor:'#D4D4D4',borderWidth:1,marginTop:10,backgroundColor:'white'}}
        key={index}
        onPress={this.itemClick.bind(this,value.title,index)}
        underlayColor={'transparent'}>
        <Text style={{fontSize:14}}>{value.title}</Text>
      </TouchableHighlight>
    )
  }
  render(){
    let { show } = this.state;
    let { style, label, hasStar, plateNum } = this.props;

    return(
      <View style={[{},style]}>
        <View
          style={{flexDirection:'row'}}
          onLayout={(e) => { this.viewWidth = e.nativeEvent.layout.width * 0.7; }}>
          {
            hasStar? <Text style={{fontSize:12,color:'red',alignSelf:'center'}}>*</Text> : null
          }
          <Text style={{fontSize: 14, color: formLeftText, width: 80, alignSelf:'center',marginLeft:5}}>{label}</Text>
          <TouchableHighlight style={{flex:1, height:30, alignItems:'center', justifyContent:'center', borderColor:mainBule, borderWidth:1}} underlayColor={'transparent'} onPress={this.showData.bind(this, null)}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>{plateNum}</Text>
          </TouchableHighlight>
        </View>
        {
          this.state.show?
            <View style={{borderColor:'#D4D4D4',borderWidth:1,marginTop:10}}>
              <View style={{flexDirection:'row',height:30}}>
                <TouchableHighlight onPress={this.showData.bind(this, 'province')} underlayColor='transparent' style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:14}}>省</Text>
                </TouchableHighlight>
                <View style={{width:1, backgroundColor:'#D4D4D4'}} />
                <TouchableHighlight onPress={this.showData.bind(this, 'number')} underlayColor='transparent' style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:14}}>数字</Text>
                </TouchableHighlight>
              </View>
              <View style={{height:1, backgroundColor:'#D4D4D4'}} />

              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                {this.state.showData.map((value,index) => this.renderOneItem(value,index))}
              </View>

              <View style={{height:1, backgroundColor:'#D4D4D4', marginTop:10}} />
              <View style={{flexDirection:'row',justifyContent: 'center',height:30}}>
                <TouchableHighlight onPress={() => this.deleteClick()} underlayColor='transparent' style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:14}}>删除</Text>
                </TouchableHighlight>
                <View style={{width:1, backgroundColor:'#D4D4D4'}} />
                <TouchableHighlight onPress={() => this.confirmClick()} underlayColor='transparent' style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{fontSize:14}}>确定</Text>
                </TouchableHighlight>
              </View>
            </View>
          :
            null
        }
      </View>
    )
  }
}

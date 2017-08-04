/**
 * renhanyi
 * 选择车牌
 */

import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableHighlight, FlatList, Image } from 'react-native';
import { W, formLeftText, formRightText,backgroundGrey, mainBule } from '../../configs/index.js';
import { getProvincialData, getNumberData } from '../../configs/index.js';

const provincialData = getProvincialData();
const numberData = getNumberData();

const ItemWidth = (W - (20 + 15 + (7*10))) / 6;
const DeleteIcon = require('./image/icon-delete.png');

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
      else {
        this.props.onChangeValue(plateNum + value);
        if(this.currSeleIndex == 0){
          this.showData('number')
        }
      }
    }else{
      this.props.onChangeValue(value);
      this.showData('number')
    }
  }

  renderOneItem({item, index}){
    return (
      <TouchableHighlight
        style={{width:ItemWidth, height:ItemWidth, marginTop:10, marginLeft:10, alignItems:'center',justifyContent: 'center',borderColor:'#D4D4D4',borderWidth:1,backgroundColor:'white'}}
        onPress={this.itemClick.bind(this,item.title, index)}
        underlayColor={mainBule}>
        <Text style={{fontSize:14, color:formLeftText}}>{item.title}</Text>
      </TouchableHighlight>
    )
  }
  render(){
    let { show } = this.state;
    let { style, label, hasStar, plateNum } = this.props;
    // {this.state.showData.map((value,index) => this.renderOneItem(value,index))}

    return(
      <View style={[{},style]}>
        <View style={{flexDirection:'row'}}>
          {
            hasStar? <Text style={{fontSize:12,color:'red',alignSelf:'center'}}>*</Text> : null
          }
          <Text style={{fontSize: 16, color: formLeftText, width: 80, alignSelf:'center',marginLeft:5}}>{label}</Text>
          <TouchableHighlight style={{flex:1, height:30, alignItems:'center', justifyContent:'center', borderColor:mainBule, borderWidth:1}} underlayColor={'transparent'} onPress={this.showData.bind(this, null)}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>{plateNum}</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{width:50, alignItems:'flex-end'}} underlayColor={'transparent'} onPress={() => this.deleteClick()}>
            <Image style={{height: 30, width: 30, resizeMode:'contain'}} source={DeleteIcon}/>
          </TouchableHighlight>
        </View>
        {
          this.state.show?
            <View style={{borderColor:'#D4D4D4',borderWidth:1,marginTop:10,paddingBottom:10}}>
              <View style={{flexDirection:'row',height:40}}>
                <TouchableHighlight onPress={this.showData.bind(this, 'province')} underlayColor='transparent' style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:(this.currSeleIndex == 0?'white':'lightgray')}}>
                  <Text style={{fontSize:14, color:formLeftText}}>省</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={this.showData.bind(this, 'number')} underlayColor='transparent' style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:(this.currSeleIndex == 1?'white':'lightgray')}}>
                  <Text style={{fontSize:14, color:formLeftText}}>数字</Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this.confirmClick()} underlayColor='transparent' style={{width:50, alignItems:'center', justifyContent:'center', backgroundColor:mainBule}}>
                  <Text style={{fontSize:14, color:'white'}}>确定</Text>
                </TouchableHighlight>
              </View>

              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
              <FlatList
                keyExtractor={(item, index) => index}
                data={this.state.showData}
                numColumns={6}
                extraData={this.state}
                renderItem={this.renderOneItem.bind(this)}
              />
              </View>
            </View>
          :
            null
        }
      </View>
    )
  }
}

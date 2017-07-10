/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

class AccidentConfirmResponView extends Component {

  constructor(props){
    super(props);
    this.responsibilityData=['全部责任','无责任','主要责任','次要责任','有责任'];
    this.partyData = [{name:'甲方当事人：张三',carNum:'京A12345','responsibility':''},
                      {name:'已方当事人：李四',carNum:'京A12345','responsibility':''},
                      {name:'丙方当事人：王五',carNum:'京A12345','responsibility':''}];
   this.submitData = {accidentTime:'2017年6月4日 17时8分',weather:'晴',accidentSite:'北京市朝阳区',accidentForm:'追尾碰撞',accidentCondition:'未按规定让行',partyData:this.partyData};
    this.state = {
      refresh:false,
    }
  }
  gotoNext(){
    for (var i = 0; i < this.submitData.partyData.length; i++) {
      if (!this.submitData.partyData[i].responsibility) {
        Toast.showShortCenter(`请选择${this.submitData.partyData[i].name}的责任类型`)
        return
      }
    }
    let { index } = this.props.navigation.state.params
    this.props.navigation.navigate('ASignatureConfirmationView', {index:index});
  }
  //车辆类型
  showTypePicker(index) {
      Picker.init({
      pickerData: this.responsibilityData,
      pickerConfirmBtnText:'确定',
      pickerCancelBtnText:'取消',
      pickerTitleText:'请选择',
      onPickerConfirm: data => {
        this.submitData.partyData[index].responsibility = data[0];
        this.setState({
          refresh: true
        })
      }
     });
     Picker.show();
  }
  renderOneParty(value,index){
    return (
      <View style={{marginTop:15, marginLeft:15}} key={index}>
        <View style={{flexDirection:'row'}}>
          <View style={{alignSelf:'center'}}>
            <Text style={{color:formLeftText,fontSize:13,alignSelf:'center'}}>{value.name}</Text>
            <Text style={{color:formLeftText,fontSize:13,marginTop:5,alignSelf:'center'}}>{value.carNum}</Text>
          </View>
          <TouchableHighlight style={{marginLeft:20}} onPress={() => this.showTypePicker(index)} underlayColor='transparent'>
            <View style={{flex:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:14,color:formLeftText,marginLeft:10}}>{value.responsibility}</Text>
                <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
              </View>
              <View style={{marginTop:5,height:1,backgroundColor:'#D4D4D4'}}></View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  renderRowItem(title,value){
    return (
      <View style={{flexDirection:'row',marginLeft:15,marginTop:10,marginBottom:10}}>
        <Text style={{fontSize:13,color:formLeftText}}>{title}</Text>
        <Text style={{fontSize:13,color:formLeftText}}>{value}</Text>
      </View>
    )
  }
  renderOneParty(value,index){
    return (
      <View style={{marginTop:15, marginLeft:15}} key={index}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{fontSize:13,alignSelf:'center'}}>{`${value.name}（${value.carNum}）`}</Text>
          <TouchableHighlight style={{marginRight:15}} onPress={() => this.showTypePicker(index)} underlayColor='transparent'>
            <View style={{flex:1}}>
              <View style={{flexDirection:'row',flex:1}}>
                <Text style={{fontSize:13,color:formLeftText,marginLeft:10,alignSelf:'center'}}>{value.responsibility}
                  {!value.responsibility ? <Text style={{color:formRightText}}>
                    请选择责任类型
                  </Text>:null}
                </Text>
                <Image style={{width:7,height:12,marginLeft:10,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{height:1,backgroundColor:backgroundGrey,marginTop:10,marginRight:15}}></View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{backgroundColor:'#ffffff',marginTop:10}}>
           <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
             <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
             <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>基本信息</Text>
           </View>
           <View style={{backgroundColor:'#ffffff',marginTop:10}}>
             {this.renderRowItem('事故时间：',this.submitData.accidentTime)}
             {this.renderRowItem('天气：',this.submitData.weather)}
             {this.renderRowItem('事故地点：',this.submitData.accidentSite)}
             {this.renderRowItem('事故形态：',this.submitData.accidentForm)}
             {this.renderRowItem('事故情形：',this.submitData.accidentCondition)}
           </View>
         </View>
         <View style={{backgroundColor:'#ffffff',marginTop:10}}>
           <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
             <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
             <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>责任认定</Text>
           </View>
           <View style={{flex:1}}>
             {this.submitData.partyData.map((value,index) => this.renderOneParty(value,index))}
           </View>
         </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
         </View>
      </ScrollView>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.AccidentConfirmResponView = connect()(AccidentConfirmResponView)

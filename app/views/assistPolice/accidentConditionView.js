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

class AccidentConditionView extends Component {

  constructor(props){
    super(props);
    this.accidentFormData = ['追尾碰撞','正面碰撞','侧面碰撞（同向）','侧面碰撞（对向）','侧面碰撞（直角）','侧面碰撞（角度不确定）','同向刮擦','对象刮擦','其它'];
    this.carDamageData = ['车头','左前角','右前脚','车尾','左前角','右前脚','车身左侧','车身右侧'];
    this.accidentCondition = ['停车','倒车','逆行','溜车','开关车门','违法交通信号灯','变更车道与其他车辆刮擦','未保持安全车距与前车追尾','未按规定让行','其他'];
    this.partyData = [{name:'甲方当事人：张三',carNum:'京A12345','carDamageData':this.carDamageData[0]},
                      {name:'已方当事人：李四',carNum:'京B12345','carDamageData':this.carDamageData[0]},
                      {name:'丙方当事人：王五',carNum:'京C12345','carDamageData':this.carDamageData[0]}];
    this.submitData = {accidentFormData:this.accidentFormData[0],accidentCondition:this.accidentCondition[0],partyData:this.partyData};
    this.state = {
      refresh:false
    }
  }
  gotoNext() {
    let { index } = this.props.navigation.state.params
    this.props.navigation.navigate('AccidentConfirmResponView',{index:index});
  }
  //车辆类型
  showTypePicker(typeData,stateData,index) {
      Picker.init({
      pickerData: typeData,
      pickerConfirmBtnText:'确定',
      pickerCancelBtnText:'取消',
      pickerTitleText:'请选择',
      onPickerConfirm: data => {
        if (stateData == 'accidentFormData') {
          this.submitData.accidentFormData = data[0]
        } else if (stateData == 'accidentCondition') {
          this.submitData.accidentCondition = data[0]
        } else if (stateData == 'carDamageData') {
          this.submitData.partyData[index].carDamageData = data[0];
        }
        this.setState({
          refresh: true
        })
      },
      onPickerSelect: data => {
        if (stateData == 'accidentFormData') {
          this.submitData.accidentFormData = data[0]
        } else if (stateData == 'accidentCondition') {
          this.submitData.accidentCondition = data[0]
        } else if (stateData == 'carDamageData') {
          this.submitData.partyData[index].carDamageData = data[0];
        }
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
          <TouchableHighlight style={{marginLeft:20}} onPress={() => this.showTypePicker(this.carDamageData,'carDamageData',index)} underlayColor='transparent'>
            <View style={{flex:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:14,color:formLeftText,marginLeft:10}}>{value.carDamageData}</Text>
                <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
              </View>
              <View style={{marginTop:5,height:1,backgroundColor:'#D4D4D4'}}></View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>本次事故形态</Text>
         </View>
         <TouchableHighlight style={{alignSelf:'center',marginTop:20,marginBottom:15}} onPress={() => this.showTypePicker(this.accidentFormData,'accidentFormData')} underlayColor='transparent'>
           <View style={{}}>
             <View style={{flexDirection:'row'}}>
               <Text style={{fontSize:14,color:formLeftText,marginLeft:10}}>{this.submitData.accidentFormData}</Text>
               <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
             </View>
             <View style={{marginTop:5,height:1,backgroundColor:'#D4D4D4'}}></View>
           </View>
         </TouchableHighlight>
         <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>请选择车损部位</Text>
         </View>
         <View style={{marginBottom:15}}>
           {this.partyData.map((value,index) => this.renderOneParty(value,index))}
         </View>
         <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
           <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>请选择事故情形</Text>
         </View>
         <TouchableHighlight style={{alignSelf:'center',marginTop:20,marginBottom:15}} onPress={() => this.showTypePicker(this.accidentCondition,'accidentCondition')} underlayColor='transparent'>
           <View style={{}}>
             <View style={{flexDirection:'row'}}>
               <Text style={{fontSize:14,color:formLeftText,marginLeft:10}}>{this.submitData.accidentCondition}</Text>
               <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
             </View>
             <View style={{marginTop:5,height:1,backgroundColor:'#D4D4D4'}}></View>
           </View>
         </TouchableHighlight>
         <View style={{marginTop:10,backgroundColor:'#ffffff'}}>
           <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
             <XButton title='下一步' onPress={() => this.gotoNext()}/>
           </View>
         </View>
      </ScrollView>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.AccidentConditionView = connect()(AccidentConditionView)

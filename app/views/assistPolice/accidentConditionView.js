/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,Modal } from "react-native";
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
    this.carDamageData = [{name:'车头',isSel:false},{name:'左前角',isSel:false},{name:'右前脚',isSel:false},{name:'车尾',isSel:false},{name:'左后角',isSel:false},{name:'右后脚',isSel:false},{name:'车身左侧',isSel:false},{name:'车身右侧',isSel:false}];
    this.accidentCondition = ['停车','倒车','逆行','溜车','开关车门','违法交通信号灯','变更车道与其他车辆刮擦','未保持安全车距与前车追尾','未按规定让行','其他'];
    this.partyData = [{name:'甲方当事人：张三',carNum:'京A12345','carDamageData':[]},
                      {name:'已方当事人：李四',carNum:'京B12345','carDamageData':[]},
                      {name:'丙方当事人：王五',carNum:'京C12345','carDamageData':[]}];
    this.submitData = {accidentFormData:'',accidentCondition:'',partyData:this.partyData};
    this.state = {
      refresh:false,
      showModalView: false,
      currentDamageIndex: -1
    }
  }
  gotoNext() {
    if (!this.submitData.accidentFormData) {
       Toast.showShortCenter(`请选择事故形态`)
       return
    }
    if (!this.submitData.accidentCondition) {
      Toast.showShortCenter(`请选择事故情形`)
      return
    }
    for (var i = 0; i < this.submitData.partyData.length; i++) {
      if (this.submitData.partyData[i].carDamageData.length == 0) {
        Toast.showShortCenter(`请选择${this.submitData.partyData[i].name}车损部位`)
        return
      }
    }
    let { index } = this.props.navigation.state.params
    this.props.navigation.navigate('AccidentConfirmResponView',{index:index});
  }
  //车辆类型
  showTypePicker(typeData,stateData) {
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
        }
        this.setState({
          refresh: true
        })
      }
     });
     Picker.show();
  }
  showDamageDataModal(index){
    if (this.state.currentDamageIndex != index) {
      for (var i = 0; i < this.carDamageData.length; i++) {
        this.carDamageData[i].isSel = false
      }
    }
    this.setState({
      showModalView: true,
      currentDamageIndex: index
    })
  }
  renderDamageSeleteView(value,index){
    let selBorderColor = value.isSel ? mainBule : backgroundGrey
    let selFontColor = value.isSel ? mainBule : formRightText
    let selCount = 0
    return (
      <TouchableHighlight style={{borderColor:selBorderColor, borderWidth:1,borderRadius:5,paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:5,marginTop:15,marginLeft:10}} key={index} onPress={() => {
        for (var i = 0; i < this.carDamageData.length; i++) {
          if (this.carDamageData[i].isSel) {
            selCount++
          }
        }
        if (selCount < 3) {
          value.isSel = !value.isSel
          this.setState({
            refresh:true
          })
        }
      }} underlayColor='transparent'>
          <Text style={{fontSize:16,color:selFontColor}}>{value.name}</Text>
      </TouchableHighlight>
    )
  }
  renderDamageView(value,index){
    return (
      <View style={{borderColor:mainBule, borderWidth:1,borderRadius:10,paddingTop:5,paddingBottom:5,paddingLeft:15,paddingRight:15,marginTop:15,marginLeft:10}} key={index}>
          <Text style={{fontSize:14,color:mainBule}}>{value}</Text>
      </View>
    )
  }
  renderOneParty(value,index){
    return (
      <View style={{marginTop:15, marginLeft:15}} key={index}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{fontSize:13,alignSelf:'center'}}>{`当事人${value.name}（${value.carNum}）`}</Text>
          <TouchableHighlight style={{marginRight:15}} onPress={() => this.showDamageDataModal(index)} underlayColor='transparent'>
            <Text style={{fontSize:13,color:mainBule,alignSelf:'center'}}>
              选择受损部位
            </Text>
          </TouchableHighlight>
        </View>
        {value.carDamageData.length > 0 ? <View style={{flexDirection:'row',flexWrap:'wrap',marginRight:15,}}>
          {value.carDamageData.map((value,index) => this.renderDamageView(value,index))}
        </View>:null}
        <View style={{height:1,backgroundColor:backgroundGrey,marginTop:10,marginRight:15}}></View>
      </View>
    )
  }

  //判断数组是否包含某一选项
  isArrContainer(value){
    Array.prototype.contains = function(item){
      return RegExp(item).test(this);
    };
    return this.submitData.partyData[this.state.currentDamageIndex].carDamageData.contains(value);
  }
  renderModalView(){
    return (
      <View>
        <Modal animationType="none" transparent={true} visible={this.state.showModalView} onRequestClose={() => {}}>
          <TouchableHighlight onPress={() => this.setState({showModalView:false})} style={styles.modalContainer} underlayColor='transparent'>
            <View style={{backgroundColor:'#ffffff',alignSelf:'center',marginLeft:60,marginRight:60,borderRadius:10}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',padding:20}}>
                 {this.carDamageData.map((value,index) => this.renderDamageSeleteView(value,index))}
              </View>
              <View style={{height:1,backgroundColor:backgroundGrey}}></View>
              <TouchableHighlight style={{paddingVertical:10,justifyContent:'center'}} underlayColor='transparent' onPress={()=>{
                this.submitData.partyData[this.state.currentDamageIndex].carDamageData = []
                for (var i = 0; i < this.carDamageData.length; i++) {
                  if (this.carDamageData[i].isSel && !this.isArrContainer(this.carDamageData[i].name)) {
                    this.submitData.partyData[this.state.currentDamageIndex].carDamageData.push(this.carDamageData[i].name)
                  }
                }
                this.setState({
                  showModalView: false
                })
              }}>
                <Text style={{color:mainBule,fontSize:15,alignSelf:'center'}}>选好了</Text>
              </TouchableHighlight>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
           <View style={{backgroundColor:'#ffffff',marginTop:15,paddingVertical:10}}>
             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
               <Text style={{marginLeft:15,fontSize:15,color:formLeftText,alignSelf:'center'}}>本次事故形态</Text>
               <TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={() => this.showTypePicker(this.accidentFormData,'accidentFormData')} underlayColor='transparent'>
                 <View style={{flexDirection:'row'}}>
                   <Text style={{alignSelf:'center',color: (this.submitData.accidentFormData ? formLeftText : formRightText)}}>
                     {this.submitData.accidentFormData ? this.submitData.accidentFormData: '请选择事故形态'}
                   </Text>
                   <Image style={{width:7,height:12,marginLeft:30,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
                 </View>
               </TouchableHighlight>
             </View>
          </View>
          <View style={{backgroundColor:'#ffffff',marginTop:15,paddingVertical:10}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{marginLeft:15,fontSize:15,color:formLeftText,alignSelf:'center'}}>本次事故情形</Text>
              <TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={() => this.showTypePicker(this.accidentCondition,'accidentCondition')} underlayColor='transparent'>
                <View style={{flexDirection:'row'}}>
                  <Text style={{alignSelf:'center',color: (this.submitData.accidentCondition ? formLeftText : formRightText)}}>
                    {this.submitData.accidentCondition ? this.submitData.accidentCondition: '请选择事故情形'}
                  </Text>
                  <Image style={{width:7,height:12,marginLeft:30,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
                </View>
              </TouchableHighlight>
            </View>
         </View>
         <View style={{marginTop:10,backgroundColor:'#ffffff'}}>
           <View style={{flexDirection:'row',backgroundColor:'#ffffff',marginTop:10}}>
             <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
             <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>车辆受损部位</Text>
           </View>
           <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10,marginLeft:15}}></View>
           {this.submitData.partyData.map((value,index) => this.renderOneParty(value,index))}
         </View>
         <View style={{marginLeft:15, marginTop:30,marginBottom:15}}>
           <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
         </View>
         {this.renderModalView()}
      </ScrollView>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  }
});

module.exports.AccidentConditionView = connect()(AccidentConditionView)

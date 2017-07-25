/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, DutyTypePicker } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { StorageHelper } from '../../utility/index.js';

class AccidentConfirmResponView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      loading:false,
      basic:null,
      localDutyList:[],
      taskModal:null,
      accidentDes:null,
    }

    this.dutyDataList = null;
  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(async () => {
      let info = await StorageHelper.getCurrentCaseInfo();
      let ldl = [];
      for(let i = 0; i<info.person.length; i++){
        let p = info.person[i];
        ldl.push({name: p.name, phone:p.phone, licensePlateNum: p.licensePlateNum, dutyName: '', dutyType: ''})
      }
      if(info.handleWay === '04'){
        this.dutyDataList = [{label:'全责',code:'0'},{label:'无责',code:'1'},{label:'同等责任',code:'2'}];
      }
      this.setState({
        loading:false,
        basic:info.basic,
        localDutyList:ldl,
        taskModal:this._convertCodeToEntry(info.taskModal, getStore().getState().dictionary.formList),
        accidentDes:this._convertCodeToEntry(info.accidentDes, getStore().getState().dictionary.situationList)
      })
    })
  }

  async gotoNext(){
    this.setState({loading:true})
    if(this.state.loading) return;

    let { localDutyList } = this.state;
    for (var i = 0, max = localDutyList.length; i < max; i++) {
      if (!localDutyList[i].dutyType) {
        Toast.showShortCenter(`请选择${localDutyList[i].name}的责任类型`)
        this.setState({loading: false});
        return
      }
    }

    let success = await StorageHelper.saveStep6({supplementary:'', conciliation:'', localDutyList})
    this.setState({loading:false});
    if(success) this.props.navigation.navigate('ASignatureConfirmationView');
  }

  renderRowItem(title,value){
    return (
      <View style={{flexDirection:'row',marginLeft:22,marginTop:5,marginBottom:5}}>
        <Text style={{fontSize:14,color:formRightText,width:80}}>{title}</Text>
        <Text style={{fontSize:14,color:formRightText}}>{value}</Text>
      </View>
    )
  }

  renderOneParty(value,index){
    return (
      <View style={{marginLeft:15}} key={index}>
        <DutyTypePicker label={`当事人${value.name}(${value.licensePlateNum})`} placeholder={'请选择责任类型'} value={value.dutyName}
          data={this.dutyDataList}
          onChange={(res)=>{
            let { localDutyList } = this.state;
            let d = localDutyList[index];
            d.dutyName = res.label;
            d.dutyType = res.code;
            this.setState({localDutyList})
          }}
          noBorder={true}/>
        <View style={{height:1,backgroundColor:backgroundGrey,marginRight:15}} />
      </View>
    )
  }

  render(){
    let { basic, taskModal, accidentDes, localDutyList } = this.state;
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
           <View style={{backgroundColor:'#ffffff',marginTop:10}}>
             <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
               <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
               <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>基本信息</Text>
             </View>
             <View style={{backgroundColor:'#ffffff',marginTop:10}}>
               {this.renderRowItem('事故时间：', basic?this._convertAccidentTime(basic.accidentTime):'')}
               {this.renderRowItem('天气：', basic?this._convertWeather(basic.weather):'')}
               {this.renderRowItem('事故地点：', basic?basic.address:'')}
               {this.renderRowItem('事故形态：', taskModal?taskModal.name:'')}
               {this.renderRowItem('事故情形：', accidentDes?accidentDes.name:'')}
             </View>
           </View>
           <View style={{backgroundColor:'#ffffff',marginTop:10}}>
             <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
               <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
               <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>责任认定</Text>
             </View>
             <View style={{flex:1}}>
               {localDutyList.map((value,index) => this.renderOneParty(value,index))}
             </View>
           </View>

          <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20,alignSelf:'center', marginVertical:50}}/>
        </ScrollView>
      </View>
    );
  }

  /** Private */
  _convertCodeToEntry(code, array){
    let entry = null;
    for(let i=0,max=array.length; i<max; i++){
      let v = array[i];
      if(v.code == code){
        entry = v;
        break;
      }
    }
    return entry;
  }

  _convertWeather(code){
    let weatherList = getStore().getState().dictionary.weatherList;
    let name = null;
    for(let i = 0; i < weatherList.length; i++){
      let w = weatherList[i];
      if(w.code == code){
        name = w.name;
        break;
      }
    }
    return name;
  }

  _convertAccidentTime(time){
    if(time) return time.substring(0, time.length - 3);
    return ''
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

module.exports.AccidentConfirmResponView = connect()(AccidentConfirmResponView)

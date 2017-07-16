/**
* 事故事实及责任（单车）页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableHighlight,InteractionManager} from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton, DutyTypePicker } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper } from '../../utility/index.js';

class AccidentFactAndResponsibilityView extends Component {

  constructor(props){
    super(props);
    this.applyText = '';
    this.state = {
      refresh:false,
      supplementary:null,
      conciliation:'经各方当事人共同申请调解，自愿达成协议如下：\n由当事人自行协商解决。此事故一次结清，签字生效。',
      localDutyList:[]
    }
    this.info = {};
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async () => {
      this.info = await StorageHelper.getCurrentCaseInfo();
      let { basic, person, localDutyList, supplementary, conciliation } = this.info;
      let ldl = [];
      for(let i=0; i < person.length; i++){
        let p = person[i];
        ldl.push({name: p.name, phone:p.phone, licensePlateNum: p.licensePlateNum, dutyName: '', dutyType: ''})
      }
      this.setState({localDutyList: ldl});
    })
  }

  //完成
  async gotoNext(){
    let { supplementary, conciliation, localDutyList } = this.state;
    for (let i = 0, max = localDutyList.length; i < max; i++) {
      if (!localDutyList[i].dutyType) {
        Toast.showShortCenter(`请选择${localDutyList[i].name}的责任类型`)
        return
      }
    }

    let success = await StorageHelper.saveStep6({supplementary, conciliation, localDutyList})
    if(success) this.props.navigation.navigate('SignatureConfirmationView');
  }
  //输入框文字变化
  onChangeText(text,type,index){
    if (type == 'Supply') {
      this.setState({supplementary: text});
    } else if (type == 'Result') {
      this.setState({conciliation: text})
    } else if(type == 'DutyList'){
      let { localDutyList } = this.state;
      let d = localDutyList[index];
      d.dutyName = text.label;
      d.dutyType = text.code;
      this.setState({localDutyList})
    }
  }

  renderOneParty(value,index){
    return (
      <View style={{marginLeft:15}} key={index}>
        <DutyTypePicker label={`当事人${value.name}(${value.licensePlateNum})`} placeholder={'请选择责任类型'} value={value.dutyName} onChange={(res)=>{ this.onChangeText(res, 'DutyList', index) }} noBorder={true}/>
        <View style={{height:1,backgroundColor:backgroundGrey,marginRight:15}} />
      </View>
    )
  }

  render(){
    let { basic, person } = this.info;
    let { supplementary, conciliation, localDutyList } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{width:W, height:15, backgroundColor:backgroundGrey}} />
          <View style={{flexDirection:'row',paddingTop:10,backgroundColor:'#ffffff',marginTop:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
          </View>
          <View style={{backgroundColor:'#ffffff'}}>
            <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formRightText,fontSize:13,lineHeight:20}}>{this._convertInfoToAccidentContent(basic, person)}
            </Text>
            <AutoGrowingTextInput
              style={{height:100,marginLeft:15,width:W-30,fontSize:13,padding:5,borderWidth:1,borderColor:'#D4D4D4',marginTop:15,backgroundColor:'#FBFBFE'}}
              value={supplementary}
              underlineColorAndroid={'transparent'}
              placeholder={'补充事故事实（可不填）'}
              placeholderTextColor={'#C8C8C8'}
              maxLength={200}
              onChangeText={(text) => this.onChangeText(text,'Supply')}
            />
            <View style={{height:10}} />
            {localDutyList.map((value,index) => this.renderOneParty(value,index))}
          </View>

          <View style={{flex:1,backgroundColor:'#ffffff'}}>
            <View style={{width:W, height:15, backgroundColor:backgroundGrey}} />
            <View style={{flexDirection:'row',backgroundColor:'#ffffff',marginTop:15}}>
              <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
              <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果（可自行修改）</Text>
            </View>
            <TextInput
              style={{height:100, fontSize: 14, marginLeft:15,marginTop:10, width: W - 30,borderWidth:1,borderColor:'#D4D4D4',backgroundColor:'#FBFBFE',padding:5}}
              value={conciliation}
              underlineColorAndroid={'transparent'}
              onChangeText={(text) => { this.onChangeText(text,'Result') } }
              multiline = {true}
              maxLength={200}
              />
              
             <View style={{alignSelf:'center',marginBottom:50,marginTop:50}}>
               <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
             </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  /** Private **/
  _convertInfoToAccidentContent(basic, person){
    if(!basic) return '';

    let num = person.length;
    let content = '';
    if(num === 1){
      let p = person[0];
      content = `    ${basic.accidentTime}, ${p.name}(驾驶证号:${p.driverNum})驾驶车牌号为${p.licensePlateNum}的${p.carType}, 在${basic.address}发生交通事故。`
    }else if(num === 2){
      let p1 = person[0];
      let p2 = person[1];
      content = `    ${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}，与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}发生交通事故。`
    }else if(num === 3){
      let p1 = person[0];
      let p2 = person[1];
      let p3 = person[2];
      content = `    ${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}，及${p3.name}(驾驶证号:${p3.driverNum})驾驶车牌号为${p3.licensePlateNum}的${p3.carType}发生交通事故。`
    }

    return content;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

module.exports.AccidentFactAndResponsibilityView = connect()(AccidentFactAndResponsibilityView)

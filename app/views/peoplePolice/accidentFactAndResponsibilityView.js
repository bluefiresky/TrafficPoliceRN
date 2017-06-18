/**
* 事故事实及责任（单车）页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableHighlight} from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Picker from 'react-native-picker';

class AccidentFactAndResponsibilityView extends Component {

  constructor(props){
    super(props);
    this.applyText = '';
    this.responsibilityData=['全部责任','无责任','主要责任','次要责任','有责任'];
    this.partyResponsibility = [{name:'张三',carNum:'京A123212','responsibility':this.responsibilityData[0]},
                                {name:'李四',carNum:'京B123212','responsibility':this.responsibilityData[0]},
                                {name:'王五',carNum:'京C123212','responsibility':this.responsibilityData[0]}];
    this.submitData = {supplyText:'',resultText:'',partyResponsibility:this.partyResponsibility};
    this.state = {
      refresh:false
    }
  }
  //完成
  gotoNext(){
    this.props.navigation.navigate('SignatureConfirmationView');
  }
  //输入框文字变化
  onChangeText(text,type){
    if (type == 'Supply') {
      this.submitData.supplyText = text;
    } else if (type == 'Result') {
      this.submitData.resultText = text;
    }
  }
  renderHeader(title){
    return(
      <View style={{backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
          <View style={{marginLeft:15,width:2,height:15,backgroundColor:'blue'}}></View>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10,width:W-30,alignSelf:'center'}}>{title}</Text>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}}></View>
      </View>
    )
  }
  textChange(text){
    this.applyText = text;
  }
  showResponsibilityPicker(index) {
      Picker.init({
      pickerData: this.responsibilityData,
      pickerConfirmBtnText:'确定',
      pickerCancelBtnText:'取消',
      pickerTitleText:'请选择',
      onPickerConfirm: data => {
        this.submitData.partyResponsibility[index].responsibility = data[0];
        this.setState({
          refresh:true
        })
      },
      onPickerSelect: data => {
        this.submitData.partyResponsibility[index].responsibility = data[0];
        this.setState({
          refresh:true
        })
      }
     });
     Picker.show();
  }
  renderOneParty(value,index){
    return (
      <View style={{marginTop:15, marginLeft:15}} key={index}>
        <View style={{flexDirection:'row'}}>
          <View>
            <Text style={{fontSize:14,alignSelf:'center'}}>{`当事人${value.name}负`}</Text>
            <Text style={{fontSize:13,alignSelf:'center'}}>{`(${value.carNum})`}</Text>
          </View>
          <TouchableHighlight style={{marginLeft:20}} onPress={() => this.showResponsibilityPicker(index)} underlayColor='transparent'>
            <View style={{flex:1}}>
              <View style={{flexDirection:'row',flex:1}}>
                <Text style={{fontSize:14,color:formLeftText,marginLeft:10,alignSelf:'center'}}>{value.responsibility}</Text>
                <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
              </View>
              <View style={{height:1,backgroundColor:'#D4D4D4'}}></View>
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
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
        </View>
        <View style={{backgroundColor:'#ffffff',marginBottom:10}}>
          <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formLeftText,fontSize:13}}>
            2017-09-08 12:35:27，测试驾驶车牌号为京A12537行驶至北京朝阳区百子湾南二路78号院88号时，的卡萨和大咖电话开始的骄傲和圣诞节啊，段时间打开；量较大开始点击啊。当事人测试负全责。
          </Text>
          <AutoGrowingTextInput style={{marginLeft:15,width:W-30,height:30,fontSize:12,padding:5,borderWidth:1,borderColor:'#D4D4D4',marginTop:15}}
                                    placeholder={'补充事故事实（可不填）'}
                                    placeholderTextColor={'#C8C8C8'}
                                    onChangeText={(text) => this.onChangeText(text,'Supply')}
                                    />
        </View>
        {this.submitData.partyResponsibility.map((value,index) => this.renderOneParty(value,index))}
        <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4',marginTop:15}}>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果（可自行修改）</Text>
        </View>
        <TextInput style={{height:100, fontSize: 14, marginLeft:15,marginTop:10, width: W - 30,borderWidth:1,borderColor:'#D4D4D4'}}
                   onChangeText={(text) => { this.onChangeText(text,'Result') } }
                   multiline = {true}
                   defaultValue={'经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。'}/>
        <View style={{marginLeft:15,marginBottom:10,marginTop:50}}>
          <XButton title='下一步' onPress={() => this.gotoNext()}/>
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

module.exports.AccidentFactAndResponsibilityView = connect()(AccidentFactAndResponsibilityView)

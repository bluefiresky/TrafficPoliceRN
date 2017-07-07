/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class SignatureConfirmationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false
    }
    this.submitPartyData = [{title:'甲方',phone:'13637337373',verCode:'',carNum:'京A38457',respons:'全责',isRefuseSign:false},
                      {title:'已方',phone:'13637337373',verCode:'',carNum:'京A38457',respons:'无责',isRefuseSign:false}];
  }
  //下一步
  gotoNext(){
    Toast.showShortCenter('以下流程开中')
    console.log(this.submitPartyData);
  }
  //获取验证码
  getVerCode(phone,index){

  }
  onChangeText(text,index){
    this.submitPartyData[index].verCode = text;
  }
  renderOnePersonInfo(value,index){
    let seleImage = this.submitPartyData[index].isRefuseSign ? require('./image/selected.png') :require('./image/unselected.png')
    return (
      <View style={{backgroundColor:'#ffffff'}} key={index}>
        <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`${value.title}签字确认`}</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:15,marginLeft:15,justifyContent:'space-between'}}>
          <Text style={{fontSize:14,color:formLeftText}}>
            手机号：
            <Text>{value.phone}</Text>
          </Text>
          <Text style={{fontSize:14,color:mainBule,marginRight:20}} onPress={()=>this.getVerCode(value.phone,index)}>获取验证码</Text>
        </View>
        <View style={{marginTop:15,marginLeft:15}}>
          <Text style={{fontSize:14,color:formLeftText}}>
            车牌号：
            <Text>{value.carNum}</Text>
          </Text>
        </View>
        <View style={{marginTop:15,marginLeft:15}}>
          <Text style={{fontSize:14,color:formLeftText}}>
            责任类型：
            <Text style={{color:mainBule}}>{value.respons}</Text>
          </Text>
        </View>
        <View style={{flexDirection:'row',marginTop:15,marginLeft:15}}>
          <Text style={{fontSize:14,color:formLeftText,alignSelf:'center'}}>
            验证码：
          </Text>
          <TextInput style={{height:40,width:150,fontSize:13,padding:5,borderColor:'#F0F0F0',borderWidth:1}}
            onChangeText={(text) => this.onChangeText(text,index)}
            placeholder={'请输入验证码'}
            clearButtonMode={'while-editing'}
            keyboardType={'numeric'}
            underlineColorAndroid = {'transparent'}
          />
        </View>
        <View style={{flexDirection:'row',marginLeft:15,marginBottom:20,marginTop:20,justifyContent:'space-between'}}>
          <View style={{width:100,height:50,backgroundColor:'#D4D4D4',borderWidth:1,borderColor:'#D4D4D4',justifyContent:'center'}}>
            <View style={{alignSelf:'center'}}>
              <Text style={{}}>请签名</Text>
            </View>
          </View>
          <View style={{marginRight:15,flexDirection:'row'}}>
            <TouchableHighlight style={{alignSelf:'center'}} onPress={()=>{
              this.submitPartyData[index].isRefuseSign = !this.submitPartyData[index].isRefuseSign;
              this.setState({
                refresh:true
              })
            }} underlayColor='transparent'>
              <Image source={seleImage} style={{width:18,height:18,alignSelf:'center'}}/>
            </TouchableHighlight>
            <Text style={{marginLeft:5,fontSize:14,alignSelf:'center'}}>当事人拒签</Text>
          </View>
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         {this.submitPartyData.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='提交生成交通事故认定书' onPress={() => this.gotoNext()}/>
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

module.exports.SignatureConfirmationView = connect()(SignatureConfirmationView)

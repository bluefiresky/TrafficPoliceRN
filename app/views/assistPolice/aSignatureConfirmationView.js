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

class ASignatureConfirmationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showSpeekCode: false,
      codeSecondsLeft: 60
    }
    this.submitPartyData = [{title:'甲方',phone:'13637337373',verCode:'',carNum:'京A38457',respons:'全责',isRefuseSign:false,codeText:'发送验证码'},
                      {title:'乙方',phone:'13637337373',verCode:'',carNum:'京A38457',respons:'无责',isRefuseSign:false,codeText:'发送验证码'}];
  }
  //下一步
  gotoNext(){
    console.log(this.submitPartyData);
  }
  render(){
    let { index } = this.props.navigation.state.params;
    let buttonText = (index == 0) ? '提交生成自行协商协议书' : '提交生成交通事故认定书'
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         {this.submitPartyData.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title={buttonText} onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
         </View>
      </ScrollView>
    );
  }
  //获取验证码
  getVerCode(phone,index){
    if (this.state.codeSecondsLeft === 60) {
      this.timer = setInterval(() => {
        let t = this.state.codeSecondsLeft - 1;
        if (t === 0) {
          this.timer && clearInterval(this.timer);
          this.submitPartyData[index].codeText = '重新获取'
          this.setState({codeSecondsLeft: 60, codeColor: '#4F4F4F'})
        } else{
          this.submitPartyData[index].codeText = `${t}s`
          this.setState({codeSecondsLeft: t, codeColor: formRightText});
          if (t === 30) {
            this.setState({
              showSpeekCode: true
            })
          }
        }
      }, 1000);
    }
  }
  onChangeText(text,index,type){
    if (type == 'Code') {
      this.submitPartyData[index].verCode = text;
    } else {
      this.submitPartyData[index].phone = text;
    }
  }
  renderOnePersonInfo(value,index){
    let seleImage = this.submitPartyData[index].isRefuseSign ? require('./image/selected.png') :require('./image/unselected.png')
    return (
      <View style={{backgroundColor:'#ffffff',marginTop:10}} key={index}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`${value.title}签字确认`}</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:15,marginLeft:15,justifyContent:'space-between'}}>
          <Text style={{fontSize:14,color:formLeftText,alignSelf:'center'}}>
            手机号：
          </Text>
          <TextInput style={{fontSize: 14,flex:1,height:20}}
                     onChangeText={(text) => { this.onChangeText(text,index,'Phone') } }
                     placeholder = '请输入手机号'
                     keyboardType={'numeric'}
                     defaultValue={value.phone}/>
          <TouchableHighlight style={{marginRight:20}} underlayColor={'transparent'} onPress={()=>this.getVerCode(value.phone,index)} disabled={this.submitPartyData[index].isRefuseSign}>
            <Text style={{fontSize:14,color:mainBule}}>{this.submitPartyData[index].codeText }</Text>
          </TouchableHighlight>
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
        <View style={{flexDirection:'row',marginTop:25,marginLeft:15}}>
          <Text style={{fontSize:14,color:formLeftText}}>
            验证码：
          </Text>
          <View style={{marginTop:-10}}>
            <TextInput style={{height:30,width:150,fontSize:13,padding:5,borderColor:'#F0F0F0',borderWidth:1}}
              onChangeText={(text) => this.onChangeText(text,index,'Code')}
              placeholder={'请输入验证码'}
              keyboardType={'numeric'}
              underlineColorAndroid = {'transparent'}
            />
            {this.state.showSpeekCode ? <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:15}}>
              <Text style={{marginRight:15}}>
                收不到验证码？试试
                <Text style={{color:'#267BD8'}} onPress={() => {
                  Toast.showShortCenter('请注意接听电话');
                  this.setState({
                    showSpeekCode: false
                  })
                }}>语音验证码</Text>
              </Text>
            </View>:null}
          </View>
        </View>
        <View style={{marginBottom:20,marginTop:20}}>
          <View style={{width:W-30,height:50,backgroundColor:'#D4D4D4',justifyContent:'center',marginLeft:15}}>
            <View style={{alignSelf:'center'}}>
              <Text style={{}}>请签名</Text>
            </View>
          </View>
          <View style={{marginLeft:15,flexDirection:'row',marginTop:15}}>
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


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.ASignatureConfirmationView = connect()(ASignatureConfirmationView)

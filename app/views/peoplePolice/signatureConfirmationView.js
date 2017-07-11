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
import { StorageHelper } from '../../utility/StorageHelper.js';

const dutyList = [
    {
        "licensePlateNum": "冀CWA356",
        "dutyType": "0",
        "signData": "iVBORw0KGgoAAAANSUhEUgAAARgAAAH0CAYAAADmCDJ1AAAQiklEQVR4Xu3Ysevv4x/GcSYGyWQlKauymYxGViuz8hf4AyRllMGibEyyYbEpswWDMigWZVDcn/oqw0G+XKfrc3mod7/w+77OfT9e93mmc+89/iJAgEBI4N7QXGMJECBwj8B4BAQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAuMNECAQExCYGK3BBAgIjDdAgEBMQGBitAYTICAw3gABAjEBgYnRGkyAgMB4AwQIxAQEJkZrMAECAnN9b+CHc+SvzvfO+d68vuM78f9JQGCua9uXuDz0F0f+8fy7V4Xnupa6fFqBua7tvn2O++K/PPKv5+d/Od9r53vrfN/8y3l+nMCfCgjMdT6OR86xPzjfk6Hj/3zmvnu+l0Lzr3Xsy+fgz5/vsfM9ePNfk34P/cU24VzrU7/zud8///i5u3Sl724i997530/v0q/5X/8yvwfjiTP4p/M9fstfwO+jP4EDc8sXdSU/dvnzmo+D/6XzTxgufz70xfleufmhy99//U8G/OH/e7nX0zd/f4nC5b8qLm/52/O9cMuZt/2xS1yfue0Pr/+cwKxv+M73++T846fO98D/8/p3vPXlz6Yuvx8u4Xv9fA+f76Pzfcjo9gICc3u75Z/8u3fxxrn8s+d79Hz3FUFc/uzo/vN9f77Pz/fl+T67CcUlHP66ywJ/95Du8nH8cgQILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZgMCULcRxCCwJCMzSNt2FQJmAwJQtxHEILAkIzNI23YVAmYDAlC3EcQgsCQjM0jbdhUCZwG+T8yr1AzqtpgAAAABJRU5ErkJggg==",
        "signTime": "2017-07-08 08:39:20",
        "refuseFlag": "01"
    }
]

class SignatureConfirmationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showSpeekCode: false,
      codeSecondsLeft: 60
    }
    this.submitPartyData = [{title:'甲方',phone:'13637337373',verCode:'',carNum:'京A38457',respons:'全责',isRefuseSign:false,codeText:'发送验证码'},
                      {title:'已方',phone:'13637337373',verCode:'',carNum:'京A38457',respons:'无责',isRefuseSign:false,codeText: '发送验证码'}];
  }
  //下一步
  gotoNext(){
    StorageHelper.saveStep6(dutyList);
    Toast.showShortCenter('以下流程开中')
    StorageHelper.getCurrentCaseInfo((info) => {
      console.log(' SignatureConfirmationView gotoNext and this.info -->> ', info);
    });
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
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         {this.submitPartyData.map((value,index) => this.renderOnePersonInfo(value,index))}
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='提交生成交通事故认定书' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
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

module.exports.SignatureConfirmationView = connect()(SignatureConfirmationView)

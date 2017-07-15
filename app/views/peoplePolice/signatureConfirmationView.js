/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, Utility } from '../../utility/index.js';

const PersonalTitles = ['甲方', '乙方', '丙方'];
const SignW = (W - 40);
const SignH = (SignW * W)/H;

class SignatureConfirmationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading:false,
      refresh:false,
      showSpeekCode: false,
      codeSecondsLeft: 60
    }

    this.dutyList = [];
    this.getVerCode = this.getVerCode.bind(this);
    this.getVerCodeVoice = this.getVerCodeVoice.bind(this);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async () => {
      let info = await StorageHelper.getCurrentCaseInfo();
      let { localDutyList } = info;
      for(let i=0; i<localDutyList.length; i++){
        let l = localDutyList[i];
        this.dutyList.push({title:PersonalTitles[i], phone:l.phone, code:'', signData:'', signTime:'', refuseFlag:'01', licensePlateNum:l.licensePlateNum, dutyName:l.dutyName, dutyType:l.dutyType, codeText:'获取验证码'})
      }
      this.forceUpdate();
    })
  }

  //下一步
  async gotoNext(){
    let mobileCodeMap = {};
    for(let i=0; i<this.dutyList.length; i++){
      let d = this.dutyList[i];
      if(!d.phone){
        Toast.showShortCenter(`请输入${d.title}的手机号`);
        return;
      }
      if(!d.code){
        Toast.showShortCenter(`${d.title}的验证码不正确`);
        return;
      }
      mobileCodeMap[d.phone] = d.code;
    }

    this.setState({loading: true})
    let checkCodeRes = await this.props.dispatch( create_service(Contract.POST_SMS_CODES_CHECK, {mobileCodeMap:JSON.stringify(mobileCodeMap)}));
    if(!checkCodeRes){
      this.setState({loading: false});
      return;
    }

    for(let i=0; i<this.dutyList.length; i++){
      let d = this.dutyList[i];
      delete d.title;
      delete d.phone;
      delete d.code;
      delete d.dutyName;
      delete d.codeText;
      this.dutyList[i] = d;
    }

    let success = await StorageHelper.saveStep7(this.dutyList);
    this.setState({loading: false})
    if(success) this.props.navigation.navigate('UploadProgressView');
  }
  //获取验证码
  async getVerCode(phone,index){
    if (this.state.codeSecondsLeft === 60) {
      this.setState({loading: true});
      let checkCodeRes = await this.props.dispatch(create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE_SESSION, {mobile:phone, smsType:1}))
      this.setState({loading: false});
      if(!checkCodeRes) return;

      this.timer = setInterval(() => {
        let t = this.state.codeSecondsLeft - 1;
        if (t === 0) {
          this.timer && clearInterval(this.timer);
          this.dutyList[index].codeText = '重新获取'
          this.setState({codeSecondsLeft: 60, codeColor: '#4F4F4F'})
        } else{
          this.dutyList[index].codeText = `${t}s`
          this.setState({codeSecondsLeft: t, codeColor: formRightText});
          if (t === 30) {
            this.setState({showSpeekCode: true})
          }
        }
      }, 1000);
    }
  }

  async getVerCodeVoice(phone){
    this.setState({loading: true});
    await this.props.dispatch(create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE_SESSION, {mobile:phone, smsType:2}))
    this.setState({loading: false, showSpeekCode: false})

  }

  onChangeText(text,index,type){
    if (type == 'Code') {
      this.dutyList[index].code = text;
    } else {
      this.dutyList[index].phone = text;
    }
    this.forceUpdate();
  }

  renderOnePersonInfo(value,index){
    let seleImage = (value.refuseFlag === '02') ? require('./image/selected.png') :require('./image/unselected.png');

    return (
      <View style={{backgroundColor:'#ffffff',marginTop:10}} key={index}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`${value.title}签字确认`}</Text>
        </View>

        <View style={{flexDirection:'row',marginTop:15,marginLeft:20,alignItems:'center'}}>
          <Input label={'手机号:'} value={value.phone} keyboardType={'numeric'} style={{flex:1, height: 35, paddingLeft:0}} hasClearButton={false} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'Phone') }}/>
          <TouchableHighlight style={{marginRight:20}} underlayColor={'transparent'} onPress={()=>this.getVerCode(value.phone,index)} disabled={value.refuseFlag === '02'}>
            <Text style={{fontSize:14,color:mainBule}}>{value.codeText }</Text>
          </TouchableHighlight>
        </View>

        <View style={{flexDirection:'row', height:30, marginLeft:20, alignItems:'center'}}>
          <Text style={{fontSize:14,color:formLeftText,width:80}}>车牌号:</Text>
          <Text>{value.licensePlateNum}</Text>
        </View>

        <View style={{flexDirection:'row', height:30 ,marginLeft:20, alignItems:'center'}}>
          <Text style={{fontSize:14,color:formLeftText,width:80}}>责任类型:</Text>
          <Text style={{color:mainBule}}>{value.dutyName}</Text>
        </View>

        <View style={{flexDirection:'row',marginLeft:20}}>
          <Input label={'验证码:'} placeholder={'请输入验证码'} value={value.code} keyboardType={'numeric'} hasClearButton={false} style={{flex:1, height: 35, paddingLeft:0}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'Code') }}/>
          {this.state.showSpeekCode ?
            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:15}}>
              <Text style={{marginRight:15}}>
                收不到验证码？试试
                <Text style={{color:'#267BD8'}} onPress={() => {
                  Toast.showShortCenter('请注意接听电话');
                  this.getVerCodeVoice(value.phone);
                }}>语音验证码</Text>
              </Text>
            </View>
            :
            null
          }
        </View>

        <View style={{marginBottom:20,marginTop:20}}>
          <TouchableHighlight underlayColor={'transparent'}
            onPress={()=>{
              this.props.navigation.navigate('SignatureView', {returnValue: (result)=>{
                value.signData = result;
                value.signTime = Utility.formatDate('yyyy-MM-dd hh:mm:ss')
                this.setState({refresh: true})
              }})
            }}>
            {
              value.signData? <Image source={{uri:'data:image/png;base64,'+value.signData}} style={{width:SignW, height:SignH, alignSelf: 'center', resizeMode:'contain'}} />
              :
              <View style={{width:W-30,height:50,backgroundColor:'#D4D4D4',justifyContent:'center',alignItems:'center',marginLeft:15}}>
                <Text style={{fontSize:16, color:formLeftText}}>请签名</Text>
              </View>
            }
          </TouchableHighlight>
          <TouchableHighlight style={{marginLeft:10, width:W/2}} underlayColor='transparent'
            onPress={()=>{
              if(value.refuseFlag === '02') value.refuseFlag = '01';
              else value.refuseFlag = '02';
              this.setState({refresh:true})
            }}>
            <View style={{flexDirection:'row', alignItems:'center', padding:5}}>
              <Image source={seleImage} style={{width:18,height:18}}/>
              <Text style={{marginLeft:5,fontSize:14}}>当事人拒签</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
           {this.dutyList.map((value,index) => this.renderOnePersonInfo(value,index))}
           <View style={{paddingBottom:50,paddingTop:50,backgroundColor:'white',alignItems:'center'}}>
             <XButton title='提交生成交通事故认定书' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
           </View>
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true}/>
      </View>

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

/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { takeSnapshot } from "react-native-view-shot";

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, Input } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { StorageHelper, Utility } from '../../utility/index.js';

const PersonalTitles = ['甲方', '乙方', '丙方'];
const SignW = (W - 40);
const SignH = (SignW * W)/H;

class ASignatureConfirmationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading:false,
      refresh:false,
      submitText:''
    }

    this.dutyList = [];
    this.personList;
    this.handleWay = null;
    this.taskNo = null;
    this.getVerCode = this.getVerCode.bind(this);
    this.getVerCodeVoice = this.getVerCodeVoice.bind(this);
    this.timerArray = [{timer: null}, {timer: null}, {timer: null}];
  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(async () => {
      let info = await StorageHelper.getCurrentCaseInfo();
      this.personList = info.person;
      this.taskNo = info.taskNo;
      this.handleWay = info.handleWay;
      let submitText = this.handleWay === '04'? '生成自行协商协议书':'生成交通事故认定书'

      if(this.props.navigation.state.params && this.props.navigation.state.params.dutyList){
        let dl = this.props.navigation.state.params.dutyList;
        for(let i=0; i<dl.length; i++){
          let d = dl[i];
          this.dutyList.push({title:PersonalTitles[i], phone:d.phone, code: '', signData:'', signTime:'', refuseFlag:'01', licensePlateNum:d.licensePlateNum, dutyName:d.dutyName, dutyType:'', codeText:'获取验证码',codeSecondsLeft: 60,showSpeekCode: false, codeColor:''})
        }
      }else{
        let { localDutyList, dutyList, person } = info;
        for(let i=0; i<localDutyList.length; i++){
          let l = localDutyList[i];
          this.dutyList.push({title:PersonalTitles[i], phone:l.phone, code:'', signData:'', signTime:'', refuseFlag:'01', licensePlateNum:l.licensePlateNum, dutyName:l.dutyName, dutyType:l.dutyType, codeText:'获取验证码',codeSecondsLeft: 60,showSpeekCode: false, codeColor:''})
        }
      }
      console.log(' the dutyList -->> ', this.dutyList);
      console.log(' the submitText -->> ', submitText);
      this.setState({loading:false, submitText})
    })
  }

  //下一步
  async gotoNext(){
    let mobileCodeMap = {};
    for(let i=0; i<this.dutyList.length; i++){
      let d = this.dutyList[i];
      if(!(d.refuseFlag === '02')){
        if(!d.phone){
          Toast.showShortCenter(`请输入${d.title}的手机号`);
          return;
        }
        if(!d.code){
          Toast.showShortCenter(`${d.title}的验证码不正确`);
          return;
        }
        if(!d.signData){
          Toast.showShortCenter(`${d.title}的签名信息不正确`);
          return;
        }
        mobileCodeMap[d.phone] = d.code;
      }

    }

    this.setState({loading: true})
    let keysArray = Object.keys(mobileCodeMap);
    if(keysArray.length > 0){
      let checkCodeRes = await this.props.dispatch( create_service(Contract.POST_SMS_CODES_CHECK, {mobileCodeMap:JSON.stringify(mobileCodeMap)}));
      if(!checkCodeRes){
        this.setState({loading: false});
        return;
      }
    }

    let saveDutyList = [];
    if(this.handleWay === '04'){
      for(let i=0; i<this.dutyList.length; i++){
        let d = this.dutyList[i];
        saveDutyList.push({dutyType:d.dutyType,licensePlateNum:d.licensePlateNum,refuseFlag:d.refuseFlag,signData:d.signData,signTime:d.signTime});
      }
      let success = await StorageHelper.saveStep7(this.dutyList);
      this.setState({loading: false})
      if(success) this.props.navigation.navigate('UploadProgressView', {content:''});
    }else if(this.handleWay === '03' || this.handleWay === '05'){
      let signatureList = [];
      for(let i = 0; i<this.dutyList.length; i++){
        let d = this.dutyList[i];
        signatureList.push({licensePlateNum:d.licensePlateNum, signContent:d.signData, refuseFlag:d.refuseFlag})
      }
      this.res = this.props.dispatch( create_service(Contract.POST_GENERATE_DUTYCONFIRMATION, {taskNo: this.taskNo, signatureList}))
      if(res) this.props.navigation.navigate('UploadSuccessView', {content:'案件信息上传成功，交通事故认定书稍后将以短信形式发送至当事人手机。'});
    }

  }
  //获取验证码
  async getVerCode(value,index){
    if(this.state.loading) return;

    if (value.codeSecondsLeft === 60) {
      this.setState({loading: true});
      let checkCodeRes = await this.props.dispatch(create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE_SESSION, {mobile:value.phone, smsType:1}))
      this.setState({loading: false});
      if(!checkCodeRes) return;

      this.timerArray[index] = setInterval(() => {
        let t = value.codeSecondsLeft - 1;
        if (t === 0) {
          this.timerArray[index] && clearInterval(this.timerArray[index]);
          value.codeText = '重新获取';
          value.codeSecondsLeft = 60;
          value.codeColor = '#4F4F4F';
          this.setState({refresh: true})
        } else{
          value.codeText = `${t}s`
          value.codeSecondsLeft = t;
          value.codeColor = formRightText;
          if (t === 30) {
            value.showSpeekCode = true;
          }
          this.setState({refresh: true});
        }
      }, 1000);
    }
  }

  async getVerCodeVoice(value){
    this.setState({loading: true});
    await this.props.dispatch(create_service(Contract.POST_SEND_DYNAMIC_CHECK_CODE_SESSION, {mobile:value.phone, smsType:2}))
    value.showSpeekCode = false
    this.setState({loading: false})

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
          {
            value.refuseFlag === '02'?null:
            <TouchableHighlight style={{marginRight:20}} underlayColor={'transparent'} onPress={()=>this.getVerCode(value,index)} disabled={value.refuseFlag === '02'}>
              <Text style={{fontSize:14,color:mainBule}}>{value.codeText }</Text>
            </TouchableHighlight>
          }
        </View>

        <View style={{flexDirection:'row', height:30, marginLeft:20, alignItems:'center'}}>
          <Text style={{fontSize:14,color:formLeftText,width:80}}>车牌号:</Text>
          <Text>{value.licensePlateNum}</Text>
        </View>

        <View style={{flexDirection:'row', height:30 ,marginLeft:20, alignItems:'center'}}>
          <Text style={{fontSize:14,color:formLeftText,width:80}}>责任类型:</Text>
          <Text style={{color:mainBule}}>{value.dutyName}</Text>
        </View>

        <View style={{marginLeft:20}}>
          {
            value.refuseFlag === '02'?null:
            <Input label={'验证码:'} placeholder={'请输入验证码'} value={value.code} keyboardType={'numeric'} hasClearButton={false} style={{flex:1, height: 35, paddingLeft:0}} noBorder={true} onChange={(text) => { this.onChangeText(text,index,'Code') }}/>
          }

          {
            value.showSpeekCode ?
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <Text style={{marginRight:15}}>
                  收不到验证码？试试
                  <Text style={{color:'#267BD8'}} onPress={() => {
                    Toast.showShortCenter('请注意接听电话');
                    this.getVerCodeVoice(value);
                  }}>语音验证码</Text>
                </Text>
              </View>
            :
              null
          }
        </View>

        <View style={{marginBottom:20,marginTop:20}}>
          {
            value.refuseFlag === '02'? null :
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
          }

          {
            this.handleWay && this.handleWay != '04'? null :
            <TouchableHighlight style={{marginLeft:10, width:W/2}} underlayColor='transparent'
              onPress={()=>{
                if(value.refuseFlag === '02') value.refuseFlag = '01';
                else {
                  value.refuseFlag = '02'
                  let self = this;

                  let tmp;
                  if(index === 0) {
                    tmp = this.refs.refuse0;
                  }else if(index === 1){
                    tmp = this.refs.refuse1;
                  }else if(index === 2){
                    tmp = this.refs.refuse2;
                  }
                  takeSnapshot(tmp, {format: "jpeg",quality: 0.8,result:'base64'})
                    .then(uri => {
                      value.signData = uri;
                      self.setState({refresh:true})
                    });
                }
              }}>
              <View style={{flexDirection:'row', alignItems:'center', padding:5}}>
                <Image source={seleImage} style={{width:18,height:18}}/>
                <Text style={{marginLeft:5,fontSize:14}}>当事人拒签</Text>
              </View>
            </TouchableHighlight>
          }
        </View>
      </View>
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {this.dutyList.map((value,index) => this.renderOnePersonInfo(value,index))}
          </View>
          <View style={{paddingBottom:50,paddingTop:50,backgroundColor:'white',alignItems:'center'}}>
            <XButton title={this.state.submitText} onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
          </View>
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true}/>

        <View collapsable={false} ref="refuse0" style={{backgroundColor:'white', top:-100, position:'absolute', padding:20, justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold'}}>{this.personList?this.personList[0].name+'拒签':''}</Text>
        </View>
        <View collapsable={false} ref="refuse1" style={{backgroundColor:'white', top:-100, position:'absolute', padding:20, justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold'}}>{this.personList?(this.personList[1]?this.personList[1].name+'拒签':''):''}</Text>
        </View>
        <View collapsable={false} ref="refuse2" style={{backgroundColor:'white', top:-100, position:'absolute', padding:20, justifyContent:'center', alignItems:'center'}}>
          <Text style={{fontSize:22, fontWeight:'bold'}}>{this.personList?(this.personList[2]?this.personList[2].name+'拒签':''):''}</Text>
        </View>
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

module.exports.ASignatureConfirmationView = connect()(ASignatureConfirmationView)

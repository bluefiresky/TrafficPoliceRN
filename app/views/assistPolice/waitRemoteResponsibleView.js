/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,InteractionManager,DeviceEventEmitter } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton, TipModal } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import Tool from '../../utility/Tool';
import { StorageHelper, Utility } from '../../utility/index.js';


class WaitRemoteResponsibleView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading:false,
      showTip:false,
      tipParams:{}
    }
    this.timer = null;
    this._turnToLocal = this._turnToLocal.bind(this);
    this._startFetchRemoteRes = this._startFetchRemoteRes.bind(this);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(async () => {
      let info = await StorageHelper.getCurrentCaseInfo();
      let taskNo = info.taskNo;
      if(!taskNo) return;

      this.props.dispatch( create_service(Contract.GET_REMOTE_FIXDUTY_RESULT, {taskNo}))
        .then( res => {
          if(res){
            if(res.status == '21'){
              this.props.navigation.dispatch({ type: 'replace', routeName: 'ResponsibleResultView', key: 'ResponsibleResultView', params: {remoteRes: res}});
            }else if(res.status == '22'){
              this._turnToLocal();
            }else if(res.status == '20'){
              this._caseHasCompleted();
            }else{
              this._startFetchRemoteRes(taskNo);
            }
          }
      })
    })
  }

  componentWillUnMount(){
    this.timer && clearInterval(this.timer)
  }

  //取消远程定责
  cancleWait(){
    this.timer && clearInterval(this.timer);
    let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
    this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({routeName}) ]}) )
    DeviceEventEmitter.emit('InitHome');
  }

  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={require('./image/confirm_response.png')} style={{width:100,height:100,marginTop:50,alignSelf:'center'}}/>
          <View style={{marginTop:20,marginLeft:15,width:W-30}}>
            <Text style={{alignSelf:'center',fontSize:14,color:formLeftText}}>
              远程交警正在定责，请稍等！
            </Text>
            <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20,marginTop:5,textAlign:'center'}}>
              远程交警定责完成后，将有短信提醒定责完成，可从首页【未完结案件】中查看并继续处理该案件。
            </Text>
          </View>
          <View style={{marginTop:20,marginLeft:15,width:W-30}}>
            <Text style={{alignSelf:'center',fontSize:14,color:formLeftText,lineHeight:20}}>
              若较长时间未接收到后台民警的定责结果，请拨打一下电话咨询：
              <Text style={{color:mainBule}} onPress={()=>{Tool.callPhoneNum(global.personal.depTelephone,true)}}>
                {global.personal.depTelephone}
              </Text>
            </Text>
          </View>
           <View style={{marginLeft:15,marginBottom:10,marginTop:30}}>
             <XButton title='返回首页' onPress={() => this.cancleWait()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
           </View>
        </ScrollView>

        <TipModal show={this.state.showTip} {...this.state.tipParams} />
      </View>
    );
  }

  /** Provate */
  _startFetchRemoteRes(taskNo){
    console.log(' _startFetchRemoteRes');
    let self = this;
    this.timer = setInterval(() => {
      console.log(' _startFetchRemoteRes setInterval and the taskNo -->> ', taskNo);
      self.props.dispatch( create_service(Contract.GET_REMOTE_FIXDUTY_RESULT, {taskNo}))
        .then( res => {
          if(res){
            if(res.status == '21'){
              self.timer && clearInterval(self.timer)
              self.props.navigation.dispatch({ type: 'replace', routeName: 'ResponsibleResultView', key: 'ResponsibleResultView', params: {remoteRes: res}});
            }else if(res.status == '22'){
              self.timer && clearInterval(self.timer)
              self._turnToLocal();
            }
          }else{
            self.timer && clearInterval(self.timer);
          }
      })
    }, 5000);
  }

  _turnToLocal(){
    let self = this;
    this.setState({ showTip: true,
      tipParams:{
        content: '该案件需由现场民警处理，请联系所属大队派遣民警处理。',
        left:{label: '我知道了', event: async () => {
          self.setState({loading:true});
          if(self.state.loading) return;

          await StorageHelper.removeItem(global.personal.mobile+'unuploaded', global.currentCaseId)
          await StorageHelper.removeItem(global.personal.mobile+'uncompleted', global.currentCaseId);
          await Utility.deleteFileByName(global.currentCaseId)

          let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
          self.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({routeName}) ]}) )
          DeviceEventEmitter.emit('InitHome');
        }}
    }});
  }

  async _caseHasCompleted(){
    await StorageHelper.removeItem(global.personal.mobile+'uncompleted', global.currentCaseId);
    let deleteRes = Utility.deleteFileByName(global.currentCaseId)
    let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
    this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}) )
    DeviceEventEmitter.emit('InitHome');
  }

}
const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: '#ffffff'
  }
});

const ExportView = connect()(WaitRemoteResponsibleView);
ExportView.navigationOptions = ({ navigation }) => {
  return {
    headerLeft:null,
  }
}

module.exports.WaitRemoteResponsibleView = ExportView

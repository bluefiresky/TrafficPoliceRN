/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager,BackHandler,DeviceEventEmitter } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { NavigationActions } from 'react-navigation'
import * as Progress from 'react-native-progress';

import { W, H, backgroundGrey,formLeftText,mainBule,formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { XButton, TipModal } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, Utility } from '../../utility/index.js';

const TitlebarHeight = Platform.select({ android: 44, ios: 64 });
const ProgressBarW = 0.6 * W;
const ContentW = 0.8 * W;
const AppSource = Platform.select({android: 1, ios:2})

class UploadProgressView extends Component {

  constructor(props){
    super(props);
    this._done = this._done.bind(this);
    this._startUpload = this._startUpload.bind(this);

    let content = '', caseType = 2; // caseType===1:未上传，caseType===2:未完成
    if(props.navigation.state.params){
      let p = props.navigation.state.params;
      content = p.content?p.content:'';
      caseType = p.caseType?p.caseType:2;
    }
    this.state = {
      loading:false,
      progress: 0,
      progressTip: '本次事故信息正在上传...',
      content,
      success: false,
      fail: false,
      tipParams: {},
      showTip: false,
      handleWay:null,
      taskNo:null,
      caseType
    }

    this.info = null;
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this._startUpload();
    })
  }

  componentWillMount(){
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', () => { return true; });
    }
  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer)
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <Progress.Bar progress={this.state.progress} width={ProgressBarW} height={8} borderRadius={6} style={{marginTop: 100}} color={mainBule} animated={false}/>
        <Text style={{color:formLeftText, fontSize: 16, marginTop:20}}>{this.state.progressTip}</Text>
        <View style={{width:ContentW, marginTop:50}}><Text style={{color:formRightText, fontSize:14}}>{this.state.content}</Text></View>
        <TipModal show={this.state.showTip} {...this.state.tipParams} />
      </View>
    );
  }

  /** Private **/
  async _startUpload(){
    let caseKey = (this.state.caseType == 1)? 'unuploaded':'uncompleted';
    this.info = await StorageHelper.getCurrentCaseInfo(caseKey);
    if(!this.info) return;

    this._animate(this.info.handleWay);
    let fileRes = await Utility.convertObjtoFile(this.info, this.info.id);
    console.log(' the filedRes -->> ', fileRes);
    if(fileRes){
      let base64Str = await Utility.zipFileByName(this.info.id);
      let res = await this.props.dispatch( create_service(Contract.POST_UPLOAD_ACCIDENT_FILE, {appSource:AppSource, fileName:this.info.id, file:'zip@'+base64Str}));
      if(res) this.setState({success: true, handleWay:this.info.handleWay, taskNo:res.taskNo});
      else this.setState({fail: true, handleWay:this.info.handleWay})
    }else{
      this.setState({fail:true, handleWay:this.info.handleWay})
    }
  }

  async _done(title, content, success){
    this.timer && clearInterval(this.timer);

    let self = this;
    let left = null;
    let right = null;
    let done;
    let handleWay = this.state.handleWay;
    if(success){
      if(handleWay === '03' || handleWay === '05'){
        let success = await StorageHelper.saveStep6_7_1(this.state.taskNo)
        if(success) this.props.navigation.dispatch({ type: 'replace', routeName: 'WaitRemoteResponsibleView', key: 'WaitRemoteResponsibleView', params: {}});
      }else{
        let content = (handleWay === '04')? '事故自行协商协议书稍后将以短信形式发送至当事人手机。':'交通事故认定书稍后将以短信形式发送至当事人手机';
        this.props.navigation.dispatch({
          type: 'replace',
          routeName: 'UploadSuccessView',
          key: 'UploadSuccessView',
          params: {content, taskNo:thi.setState.taskNo}
        });
      }
      return;
    }else{
      left = {label: '重试', event:() => {
        self.setState({progress: 0, showTip: false, success: false, fail: false})
        self._startUpload();
      }};
      let label = (handleWay === '01' || handleWay === '02')?'查看离线认定书':(handleWay === '04'? '查看离线协议书':'返回首页');
      right = {label, event: async () => {
        self.setState({loading:true});
        if(self.state.loading) return;

        if( handleWay === '03' || handleWay === '05'){
          let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
          self.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}) )
          DeviceEventEmitter.emit('InitHome');
        }else{
          if(this.state.caseType == 1){
            self.props.navigation.navigate('CertificateView', {handleWay})
          }else{
            self.info.taskNo = self.state.taskNo;
            let saveToUnUploadRes = await StorageHelper.saveAsUnUploaded(self.info);
            if(!saveToUnUploadRes) return;
            self.props.navigation.navigate('CertificateView', {handleWay})
          }
        }
        self.setState({showTip:false})
      }};
      this.setState({ showTip: true, tipParams:{title, content, left, right}})
    }
  }

  _animate(handleWay) {
    this.timer = setInterval(() => {
      let { success, fail, progress } = this.state;
      if(success){
        this.setState({ progress:1 });
        this._done('上传案件成功', '.....', true)
      }else{
        if(fail){
          let errorTip = '';
          if(handleWay === '04'){
            errorTip = '案件信息已存储在手机中，并已离线生成《道路交通事故自行协商协议书》。请告知当事人待网络信号良好时，案件信息将上传后台，然后当事人可收到包含本次事故认定书的短信。'
          }else if(handleWay === '01' || handleWay === '02'){
            errorTip = '案件信息已存储在手机中，并已离线生成《道路交通事故认定书（简易程序）》。请告知当事人待网络信号良好时，案件信息将上传后台，然后当事人可收到包含本次事故认定书的短信。'
          }else{
            errorTip = '当前网络差，案件信息上传失败，请寻找网络良好的位置点击重试！';
          }
          this._done('上传案件失败', errorTip, false);
        }else{
          progress += Math.random() / 30;
          if(progress > 0.9) progress = 0.9;
          this.setState({ progress });
        }
      }
    }, 1000);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  }
});

const ExportView = connect()(UploadProgressView);
ExportView.navigationOptions = ({ navigation }) => {
  return {
    headerLeft: null
  }
}

module.exports.UploadProgressView = ExportView;

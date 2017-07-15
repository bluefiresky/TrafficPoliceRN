/**
* 设置页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,InteractionManager } from "react-native";
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

class UploadProgressView extends Component {

  constructor(props){
    super(props);
    this._done = this._done.bind(this);
    this._startUpload = this._startUpload.bind(this);
    this.state = {
      progress: 0,
      progressTip: '本次事故信息正在上传...',
      content:'上传完成后《道路交通事故认定书（简易程序）》将发送至当事人手机',
      success: false,
      fail: false,
      tipParams: {},
      showTip: false,
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{
      this._animate();
      this._startUpload();
    })
  }

  componentWillUnmount(){
    this.timer && clearInterval(this.timer)
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
    let info = await StorageHelper.getCurrentCaseInfo();
    if(info){
      this.fileRes = await Utility.convertObjtoFile(info, info.id);
      let base64Str = await Utility.zipFileByName(info.id);
      this.res = await this.props.dispatch( create_service(Contract.POST_UPLOAD_ACCIDENT_FILE, {appSource:1, fileName:info.id, file:'zip@'+base64Str}));
      if(this.res) this.setState({success: true});
      else this.setState({fail: true})
    }
  }

  _done(title, content, success){
    let self = this;
    let left = null;
    let right = null;
    let done;
    if(success){
      left = {label: '返回首页', event:() => {
        let routeName = global.personal.policeType === 2?'PpHomePageView':'ApHomePageView';
        this.props.navigation.dispatch( NavigationActions.reset({index: 0, actions: [ NavigationActions.navigate({ routeName}) ]}) )
      }};
    }else{
      left = {label: '重试', event:() => {
        self.setState({progress: 0, showTip: false, success: false, fail: false})
        self._startUpload();
      }};
      right = {label: '查看离线认定书', event:() => { Toast.showShortCenter('待开发')}};
    }
    this.setState({ showTip: true, tipParams:{title, content, left, right}})
  }

  _animate() {
    this.timer = setInterval(() => {
      let { success, fail, progress } = this.state;
      if(success){
        this.setState({ progress:1 });
        this._done('上传案件成功', '.....', true)
      }else{
        if(fail){
          this._done('上传案件失败', '.....', false);
        }else{
          progress += Math.random() / 10;
          if(progress > 0.9) progress = 0.9;
          this.setState({ progress });
        }
      }
    }, 500);
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
    header: null
  }
}

module.exports.UploadProgressView = ExportView;

/**
* Created by wuran on 16/12/21.
* 页面容器，页面提供导航等页面基础配置
*/
'use strict'
import React, {Component} from 'react';
import {View, StatusBar, StyleSheet, Platform, Text, TouchableOpacity, ScrollView } from 'react-native';

import {connect} from 'react-redux';
import { StackNavigator } from 'react-navigation';

/** 自定义 */
import { backgroundGrey, mainBule, W } from './configs/index.js';

import {
  /** public */ LoginView,SettingView,FeedBackView,HistoricalCaseView,CaseDetailsView,LookConclusionView,LookBigImageView,SignatureView,UploadProgressView,UploadSuccessView,CertificateView,CommonWebView,
  /** peoplePolice */ PpHomePageView,AccidentBasicInformationView,PhotoEvidenceVeiw,GatheringPartyInformationView,GatheringCardPhotoView,ConfirmInformationView,AccidentFactAndResponsibilityView,SignatureConfirmationView,
  /** assistPolice */ ApHomePageView,AAccidentBasicInformationView,APhotoEvidenceVeiw,SelectHandleTypeView,AGatheringPartyInformationView,AGatheringCardPhotoView,AConfirmInformationView,AccidentConditionView,AccidentConfirmResponView,ASignatureConfirmationView,AAccidentFactAndResponsibilityView,WaitRemoteResponsibleView,ResponsibleResultView,
  /** insuranceReport */
  InsuranceReportPartyInfoView,InsuranceReportSuccessView,PerfectInformantInfoView,ExploreTakePhotoView,ConfirmReportPartyInfoView,ExploreSuccessView,SelectInInsuranceCompanyView,SelectCityView,InsuranceReportDetailView
 } from './views/index.js';

const isIos = Platform.OS === 'ios';
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: '#1C79D9'
  },
  headerTitleStyle: {
    color: 'white',
    fontSize: 16
  }
});

const publicNavigationOptions = {
  headerStyle:styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle,
  headerTintColor: 'white',
  headerBackTitle: ' '
}

/** App-public栈 */
const PublicNavigator = StackNavigator({
  //公共
  LoginView: { screen: LoginView, navigationOptions: { title: '登录'} },
  SettingView: { screen: SettingView, navigationOptions: { title: '设置'} },
  FeedBackView: { screen: FeedBackView, navigationOptions: { title: '意见反馈'} },
  HistoricalCaseView: { screen: HistoricalCaseView},
  CaseDetailsView: { screen: CaseDetailsView, navigationOptions: { title: '案件详情'} },
  LookBigImageView: { screen: LookBigImageView, navigationOptions: { title: '查看大图'} },
  LookConclusionView: { screen: LookConclusionView, navigationOptions: { title: '案件详情'} },
  SignatureView: {screen: SignatureView, navigationOptions: {title: '签名'} },
  UploadProgressView: {screen: UploadProgressView, navigationOptions: {title: '上传进度'}},
  UploadSuccessView: {screen: UploadSuccessView, navigationOptions: {title: '上传成功'}},
  CertificateView: {screen: CertificateView },
  CommonWebView: {screen: CommonWebView },

  //协警
  ApHomePageView: { screen: ApHomePageView, navigationOptions: { title: '首页'} },
  AAccidentBasicInformationView: { screen: AAccidentBasicInformationView, navigationOptions: { title: '基本信息'} },
  APhotoEvidenceVeiw: { screen: APhotoEvidenceVeiw, navigationOptions: { title: '拍照取证'} },
  SelectHandleTypeView: { screen: SelectHandleTypeView, navigationOptions: { title: '选择处理方式'} },
  AGatheringPartyInformationView: { screen: AGatheringPartyInformationView, navigationOptions: { title: '采集当事人信息'} },
  AGatheringCardPhotoView: { screen: AGatheringCardPhotoView, navigationOptions: { title: '采集证件信息'} },
  AConfirmInformationView: { screen: AConfirmInformationView, navigationOptions: { title: '确认信息'} },
  AAccidentFactAndResponsibilityView: { screen: AAccidentFactAndResponsibilityView, navigationOptions: { title: '事故事实'} },
  AccidentConditionView: { screen: AccidentConditionView, navigationOptions: { title: '事故形态及情形'} },
  WaitRemoteResponsibleView: { screen: WaitRemoteResponsibleView, navigationOptions: { title: '等待远程定责'} },
  ResponsibleResultView: { screen: ResponsibleResultView },
  AccidentConfirmResponView: { screen: AccidentConfirmResponView, navigationOptions: { title: '事故定责'} },
  ASignatureConfirmationView: { screen: ASignatureConfirmationView, navigationOptions: { title: '签字确认'} },

  //民警
  PpHomePageView: { screen: PpHomePageView, navigationOptions: { title: '首页'} },
  AccidentBasicInformationView: { screen: AccidentBasicInformationView, navigationOptions: { title: '事故基本信息'} },
  PhotoEvidenceVeiw: { screen: PhotoEvidenceVeiw, navigationOptions: { title: '拍照取证'} },
  GatheringPartyInformationView: { screen: GatheringPartyInformationView, navigationOptions: { title: '采集当事人信息'} },
  GatheringCardPhotoView: { screen: GatheringCardPhotoView, navigationOptions: { title: '采集证件照片'} },
  ConfirmInformationView: { screen: ConfirmInformationView, navigationOptions: { title: '确认信息'} },
  AccidentFactAndResponsibilityView: { screen: AccidentFactAndResponsibilityView, navigationOptions: { title: '事故事实及责任'} },
  SignatureConfirmationView: { screen: SignatureConfirmationView, navigationOptions: { title: '签字确认'} },

  //保险报案
  InsuranceReportPartyInfoView: { screen: InsuranceReportPartyInfoView, navigationOptions: { title: '保险报案'} },
  SelectInInsuranceCompanyView: { screen: SelectInInsuranceCompanyView, navigationOptions: { title: '保险报案'} },
  SelectCityView: { screen: SelectCityView, navigationOptions: { title: '保险报案'} },
  InsuranceReportSuccessView: { screen: InsuranceReportSuccessView, navigationOptions: { title: '完成'} },
  PerfectInformantInfoView: { screen: PerfectInformantInfoView, navigationOptions: { title: '完善报案人信息'} },
  ExploreTakePhotoView: { screen: ExploreTakePhotoView, navigationOptions: { title: '查勘拍照'} },
  ConfirmReportPartyInfoView: { screen: ConfirmReportPartyInfoView, navigationOptions: { title: '确认信息'} },
  ExploreSuccessView: { screen: ExploreSuccessView, navigationOptions: { title: '完成'} },
  InsuranceReportDetailView: { screen: InsuranceReportDetailView, navigationOptions: { title: '案件详情'} },

},{
  headerMode: 'screen',
  navigationOptions: () => (publicNavigationOptions)
})

const prevMain = PublicNavigator.router.getStateForAction;
PublicNavigator.router = {
  ...PublicNavigator.router,
  getStateForAction(action, state){
    if(state && action.type === 'replace'){
      const routes = state.routes.slice(0, state.routes.length -1);
      routes.push(action);
      return { ...state, routes, index: routes.length - 1 };
    }
    return prevMain(action, state);
  }
};

/** App-基础栈 */
const AppNavigator = StackNavigator({
  Public: { screen: PublicNavigator },
}, {
  initialRouteName: 'Public',
  headerMode: 'none',
  mode: 'modal',
});

class RootView extends Component {

  constructor(props){
    super(props);
    this.state={
      statusBackColor: isIos? 'transparent' : '#1C79D9'
    };
    // global.currentCaseId = '1500390583744';
  }

  render(){
    let { statusBackColor } = this.state;
    let { guide, navigation } = this.props;
    return(
      <View style={styles.container}>
        <StatusBar backgroundColor={statusBackColor} />
        <AppNavigator />
      </View>
    );
  }
}

export default RootView;

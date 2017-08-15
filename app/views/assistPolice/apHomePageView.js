/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList,Platform,TouchableHighlight,InteractionManager,RefreshControl,DeviceEventEmitter } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule, Version } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, UpdateModal } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, Utility } from '../../utility/index.js';

const AppType = Platform.OS === 'ios'?2:1;
// const HomeBgH = (W * 749)/1125;
const HomeBgH = (W * 749)/1200;
const InfoH = Platform.OS === 'ios'?(HomeBgH-30-20):(HomeBgH-15-20)

class ApHomePageView extends Component {

  static navigationOptions = {
    header: null
  }
  constructor(props){
    super(props);
    this.state = {
      showWaitUpload: true,
      showNoComplete: true,
      showHistoryCase: true,
      loading: false,
      isRefreshing: false,
      showForceUpdate: false, // 强制更新提示出现判断
      forceUpdateParams: null,   // 强制更新所需参数<appDownloadUrl, upgradeReason>
    }

    this.forceUpdate = null;
    this.dictionary = null;
    this.unCompleteSum = 0;
    this.unUploadedSum = 0;
    this._getData = this._getData.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    //1、载入页面，加载账户信息、大队章、勘察章、字典表（保险公司、天气、车辆类型等）信息，加载过程显示loading，信息缓存到本地。2、每次启动APP，请求后台字典数据是否有更新，如果有更新，后台返回新的字典数据，客户端缓存最新字典数据；如果没有更新，不需重新缓存数据。若无网络，弹框提示“未检测到网络，是否离线处理？”点击继续。
    let self = this;
    DeviceEventEmitter.addListener('InitHome',() =>{
      console.log(' ApHomePageView receive the InitHome message ');
      self._getData();
    })
    InteractionManager.runAfterInteractions(() => {
      this._getData();
    });
  }
  //历史案件
  gotoHistoryCase(type){
    switch (type) {
      case 'WaitUpload':
        this.props.navigation.navigate('HistoricalCaseView',{title:'待上传案件', type: 1});
        break;
      case 'NoComplete':
        this.props.navigation.navigate('HistoricalCaseView',{title:'未完结案件', type: 2});
        break;
      case 'HistoryCase':
        this.props.navigation.navigate('HistoricalCaseView',{title:'已完结案件', type: 3});
        break;
      default:

    }
  }
  //处理案件
  handleCase(){
    this.props.navigation.navigate('AAccidentBasicInformationView');
  }

  renderRowItem(title,value,marginTop){
    return (
      <View style={{flexDirection:'row',marginTop,alignItems:'center'}}>
        <Text style={{fontSize:16,color:formRightText}}>{title}</Text>
        <Text style={{fontSize:16,color:formRightText, flex:1}}>{value}</Text>
      </View>
    )
  }

  render(){
    return(
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            tintColor="#1174D9"
            title="刷新中..."
            titleColor={formLeftText}
            colors={['#1174D9', '#1174D9', '#1174D9']}
            progressBackgroundColor="white"
          />
        }
        showsVerticalScrollIndicator={false}>
        <Image source={require('./image/home_bg.png')} style={{position:'absolute', top:0, width:W, height:HomeBgH}} />
        <Text style={{color:'#ffffff',fontSize:18,alignSelf:'center',marginTop:(Platform.OS === 'ios') ? 30 : 15,backgroundColor:'transparent'}}>首页</Text>
        <TouchableHighlight style={{top:Platform.OS === 'ios'? 22 : 10,right:0,position:'absolute',width:50, height:40, paddingRight:15, paddingTop:8}} onPress={()=>{this.props.navigation.navigate('SettingView')}} underlayColor={'transparent'}>
          <Image source={require('./image/setting.png')} style={{width:20,height:20,alignSelf:'flex-end'}}/>
        </TouchableHighlight>
        <View style={{flex:1, justifyContent:'center',marginTop:15,marginLeft:15,width:W-30,minHeight:InfoH, backgroundColor:'#ffffff',borderRadius:10, paddingVertical:15}}>
           <View style={{flexDirection:'row',marginLeft:20}}>
             <Text style={{fontSize:22,color:formLeftText,fontWeight:'bold'}}>{global.personal.policeName}</Text>
           </View>
           <View style={{marginTop:20,marginLeft:20,justifyContent:'space-between', backgroundColor:'white'}}>
             {this.renderRowItem('手机号：', global.personal.mobile, 5)}
             {/*this.renderRowItem('警员编号：', global.personal.policeNumber, 10)*/}
             {this.renderRowItem('所属城市：', global.personal.cityName, 20)}
             {this.renderRowItem('所属大队：', global.personal.depName, 20)}
           </View>
        </View>

       {this.state.showWaitUpload ? <TouchableHighlight style={{marginLeft:15,width:W-30,borderRadius:10,backgroundColor:'#ffffff',paddingVertical:10,marginTop:50}} underlayColor={'transparent'} onPress={()=>this.gotoHistoryCase('WaitUpload')}>
         <View style={{flexDirection:'row'}}>
           <Image source={require('./image/wait_for_upload.png')} style={{width:40,height:40,alignSelf:'center',marginLeft:15}}/>
           <View style={{flex:1,marginLeft:10}}>
             <Text style={{fontSize:15,color:formLeftText}}>
               待上传案件
             </Text>
             <Text style={{fontSize:13,color:formRightText,marginTop:10}}>您有
               <Text style={{color:'red'}}>{this.unUploadedSum}</Text>
               起案件未上传，请及时上传
             </Text>
           </View>
           <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,marginRight:15,alignSelf:'center'}}/>
         </View>
       </TouchableHighlight>:null}
       {this.state.showNoComplete ? <TouchableHighlight style={{marginLeft:15,width:W-30,borderRadius:10,backgroundColor:'#ffffff',paddingVertical:10,marginTop:10}} underlayColor={'transparent'} onPress={()=>this.gotoHistoryCase('NoComplete')}>
         <View style={{flexDirection:'row'}}>
           <Image source={require('./image/no_complete_case.png')} style={{width:40,height:40,alignSelf:'center',marginLeft:15}}/>
           <View style={{flex:1,marginLeft:10}}>
             <Text style={{fontSize:15,color:formLeftText}}>
               未完结案件
             </Text>
             <Text style={{fontSize:13,color:formRightText,marginTop:10}}>您有
               <Text style={{color:'red'}}>{this.unCompleteSum}</Text>
               起案件未处理完，请及时处理
             </Text>
           </View>
           <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,marginRight:15,alignSelf:'center'}}/>
         </View>
       </TouchableHighlight>:null}
       {this.state.showHistoryCase ? <TouchableHighlight style={{marginLeft:15,width:W-30,borderRadius:10,backgroundColor:'#ffffff',paddingVertical:10,marginTop:10}} underlayColor={'transparent'} onPress={()=>this.gotoHistoryCase('HistoryCase')}>
         <View style={{flexDirection:'row'}}>
           <Image source={require('./image/history_case.png')} style={{width:40,height:40,alignSelf:'center',marginLeft:15}}/>
           <Text style={{flex:1,marginLeft:10,fontSize:15,color:formLeftText,alignSelf:'center'}}>
             历史案件
           </Text>
           <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,marginRight:15,alignSelf:'center'}}/>
         </View>
       </TouchableHighlight>:null}
       <TouchableHighlight onPress={()=> this.handleCase()} underlayColor={'transparent'}>
         <Image source={require('./image/handle_case.png')} style={{marginTop:20,alignSelf:'center',width:120,height:120}}>
          <Text style={{fontSize:14,color:'#ffffff',marginTop:72,backgroundColor:'transparent',alignSelf:'center'}}>
            处理案件
          </Text>
         </Image>
       </TouchableHighlight>

        <ProgressView show={this.state.loading}/>
        <UpdateModal show={this.state.showForceUpdate} content={this.state.forceUpdateParams}/>
      </ScrollView>

    );
  }

  /** Private **/
  async _getData(refresh){
    if(refresh) this.setState({isRefreshing: true});
    else this.setState({loading: true});

    // 查看信分期的强制更新跳转，逻辑：isUpgrade -> [isAllUpgrade -> depCodes]
    this.forceUpdate = await this.props.dispatch( create_service(Contract.POST_FORCE_UPDATE, {appType: AppType, appVersion: Version}));
    // console.log('PpHomePageView execute _getData this.forceUpdate -->> ', this.forceUpdate);
    if(this._checkUpdate(this.forceUpdate)) return;

    // 字典需要上传本地的版本
    let v = getStore().getState().dictionary.version;
    this.dictionary = await this.props.dispatch( create_service(Contract.POST_ACHIEVE_DICTIONARY,{v}))
    // console.log('PpHomePageView execute _getData this.dictionary -->> ', this.dictionary);

    // 获取保险报案字典
    // this.props.dispatch( create_service(Contract.POST_INSURE_DICTIONARY, {}));

    this.unCompleteSum = await StorageHelper.getUnCompletedCaseSum();
    this.unUploadedSum = await StorageHelper.getUnUploadedCaseSum();

    if(refresh) this.setState({isRefreshing: false});
    else this.setState({loading: false});
  }

  _checkUpdate(data){
    if(!data) return false;
    let { isUpgrade, isAllUpgrade, depCodes, appDownloadUrl, upgradeReason } = data;
    if(isUpgrade === 2){
      if(isAllUpgrade === 2){
        this.setState({showForceUpdate: true, forceUpdateParams:{appDownloadUrl, upgradeReason}})
        return true;
      }else if(isAllUpgrade === 1){
        let tmp = depCodes.split(',');
        if(tmp.indexOf(global.personal.depCode) != -1){
          this.setState({showForceUpdate: true, forceUpdateParams:{appDownloadUrl, upgradeReason}})
          return true;
        }
      }
    }
    return false;
  }

  _onRefresh(){
    this._getData(true);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.ApHomePageView = connect()(ApHomePageView)

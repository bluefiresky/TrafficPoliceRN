/**
* 民警首页
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image,Platform,TouchableHighlight } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class PpHomePageView extends Component {

  static navigationOptions = {
    header: null
  }
  constructor(props){
    super(props);
    this.state = {
      showWaitUpload: true,
      showNoComplete: true,
      showHistoryCase: true,
      loading: false
    }
  }
  componentDidMount() {
    //1、载入页面，加载账户信息、大队章、勘察章、字典表（保险公司、天气、车辆类型等）信息，加载过程显示loading，信息缓存到本地。2、每次启动APP，请求后台字典数据是否有更新，如果有更新，后台返回新的字典数据，客户端缓存最新字典数据；如果没有更新，不需重新缓存数据。若无网络，弹框提示“未检测到网络，是否离线处理？”点击继续。
  }
  //处理案件
  handleCase(){
    this.props.navigation.navigate('AccidentBasicInformationView');
  }
  //历史案件
  gotoHistoryCase(type){
    switch (type) {
      case 'WaitUpload':
        this.props.navigation.navigate('HistoricalCaseView',{title:'已完结案件'});
        break;
      case 'NoComplete':
        this.props.navigation.navigate('HistoricalCaseView',{title:'待上传案件'});
        break;
      case 'HistoryCase':
        this.props.navigation.navigate('HistoricalCaseView',{title:'未完结案件'});
        break;
      default:

    }
  }
  renderRowItem(title,value){
    return (
      <View style={{flexDirection:'row',marginTop:10}}>
        <Text style={{fontSize:13,color:formLeftText}}>{title}</Text>
        <Text style={{fontSize:13,color:formLeftText}}>{value}</Text>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        <Image source={require('./image/home_bg.png')} style={{width:W, height:W / 1.5,overflow:'visible'}} resizeMode="contain">
          <Text style={{color:'#ffffff',fontSize:18,alignSelf:'center',marginTop:(Platform.OS === 'ios') ? 30 : 10,backgroundColor:'transparent'}}>首页</Text>
          <View style={{marginTop:15,marginLeft:15,width:W-30,backgroundColor:'#ffffff',borderRadius:10}}>
             <View style={{flexDirection:'row',marginLeft:20,marginTop:20}}>
               <Text style={{fontSize:22,color:formLeftText,fontWeight:'bold'}}>
                 张扬
               </Text>
               <Image style={{marginLeft:15,backgroundColor:'red',width:80,height:20}}/>
             </View>
             <View style={{flexDirection:'row',marginTop:20,marginLeft:20,marginBottom:20,justifyContent:'space-between'}}>
               <View style={{backgroundColor:'#ffffff'}}>
                 {this.renderRowItem('手机号：','13318767654')}
                 {this.renderRowItem('警员编号：','00000000')}
                 {this.renderRowItem('勘察章号：','0000000000')}
                 {this.renderRowItem('所属城市：','河北')}
                 {this.renderRowItem('所属大队：','某某某大队')}
               </View>
               <Image style={{marginRight:15,width:100,height:100,borderRadius:50,borderColor:'#D4D4D4',borderWidth:1,alignSelf:'center'}}>
               </Image>
             </View>
          </View>
       </Image>
       {this.state.showWaitUpload ? <TouchableHighlight style={{marginLeft:15,width:W-30,borderRadius:10,backgroundColor:'#ffffff',paddingVertical:10,marginTop:50}} underlayColor={'transparent'} onPress={()=>this.gotoHistoryCase('WaitUpload')}>
         <View style={{flexDirection:'row'}}>
           <Image source={require('./image/wait_for_upload.png')} style={{width:40,height:40,alignSelf:'center',marginLeft:15}}/>
           <View style={{flex:1,marginLeft:10}}>
             <Text style={{fontSize:15,color:formLeftText}}>
               待上传案件
             </Text>
             <Text style={{fontSize:13,color:formRightText,marginTop:10}}>
               您有xx起案件未上传，请及时上传
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
             <Text style={{fontSize:13,color:formRightText,marginTop:10}}>
               您有xx起案件未处理完，请及时处理
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
         <Image source={require('./image/handle_case.png')} style={{marginTop:20,alignSelf:'center',width:150,height:150}}>
          <Text style={{fontSize:14,color:'#ffffff',marginTop:95,backgroundColor:'transparent',alignSelf:'center'}}>
            处理案件
          </Text>
         </Image>
       </TouchableHighlight>
        <TouchableHighlight style={{top:Platform.OS === 'ios'? 30 : 10,right:15,position:'absolute'}} onPress={()=>{this.props.navigation.navigate('SettingView')}} underlayColor={'transparent'}>
          <Image source={require('./image/setting.png')} style={{width:20,height:20}}/>
        </TouchableHighlight>
        <ProgressView show={this.state.loading}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7'
  }
});

module.exports.PpHomePageView = connect()(PpHomePageView)

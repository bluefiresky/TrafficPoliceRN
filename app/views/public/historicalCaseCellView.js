/**
 * 历史案件Cell页面
 */
'use strict';
import React, {Component} from 'react';
import { StyleSheet, Image, Text, View, TouchableHighlight } from 'react-native';

import {W, formLeftText, formRightText, mainBule} from '../../configs/index.js';

const PStepToView = {
  '0':'PhotoEvidenceVeiw',
  '1':'GatheringPartyInformationView',
  '2_3':'GatheringCardPhotoView',
  '4':'ConfirmInformationView',
  '5':'AccidentFactAndResponsibilityView',
  '6':'SignatureConfirmationView',
  '7':'SignatureConfirmationView',
}

const AStepToView = {
  '0':'APhotoEvidenceVeiw',
  '1':'SelectHandleTypeView',
  '2':'AGatheringPartyInformationView',
  '3':'AGatheringCardPhotoView',
  '4':'AConfirmInformationView',

  '5':(handleWay) => { return handleWay != '04'? 'AAccidentFactAndResponsibilityView': 'AccidentConditionView'},
  '6':(handleWay) => { return handleWay != '04'? 'AAccidentFactAndResponsibilityView' : 'ASignatureConfirmationView'},

  '6_7_1':'WaitRemoteResponsibleView',

  '5_6_1':'AccidentConfirmResponView',
  '7':'ASignatureConfirmationView'
}

// 03 -> 0,1,2,3,4,5,      6(提交远程定责),6_7_1(上传成功),WaitRemoteResponsibleView,ResponsibleResultView,ASignatureConfirmationView,UploadSuccessView
// 05 -> 0,1,2,3,4,5,      6(提交远程定责),6_7_1(上传成功),WaitRemoteResponsibleView,ResponsibleResultView,ASignatureConfirmationView,UploadSuccessView
// 04 -> 0,1,2,3,4,5,5_6_1,6,7
export default class HistoricalCaseCellView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  historyCellClick(taskNo) {
    this.props.navigation.navigate('CaseDetailsView', {taskNo})
  }

  caseCellClick(step, handleWay, currentCaseId, caseType, rowData){
    if(caseType === 1){
      this.props.navigation.navigate('CaseDetailsView', {info:rowData});
      return;
    }

    let routeName = null;
    if(global.personal.policeType === 2){
      routeName = PStepToView[step];
    }else if(global.personal.policeType === 3){
      let tmp = AStepToView[step];
      if('string' === typeof tmp){
        routeName = tmp;
      }else{
        routeName = tmp(handleWay);
      }
    }
    if(routeName) {
      global.currentCaseId = currentCaseId;
      // type === 1:未上传，type === 2:未完成
      this.props.navigation.navigate(routeName, {caseType});
    }
  }

  render() {
    let { type } = this.props;
    return(
      <View>
        {type === 3? this._renderHistoryCell(this.props.rowData) : this._renderLocalCell(this.props.rowData, type)}
      </View>
    )
  }

  _renderHistoryCell(rowData){
    let { accidentAddress, accidentTime, taskNo, cars, status } = rowData;
    return (
      <TouchableHighlight style={styles.content} underlayColor={'#ffffff'} onPress={() => this.historyCellClick(taskNo)}>
        <View style={{flex: 1, flexDirection:'row'}}>
          <View style={styles.left}>
            <View style={{flexDirection:'row',marginTop:15,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故时间：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{accidentTime}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-start'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故地点：</Text>
              <Text style={{color:formLeftText,fontSize:14, flex:1}}>{accidentAddress}</Text>
            </View>
          </View>
          {(status == '2' || status == '3' || status == '10') ? this._renderButton(status,taskNo):null}
        </View>
      </TouchableHighlight>
    )
  }

  _renderButton(status,taskNo){
    let secondButton;
    let thirdButton;
    secondButton = <TouchableHighlight
                     style={{borderColor:'#267BD8',borderWidth:1,width:(W-82)/3,paddingVertical:8,borderRadius:50,marginLeft:15,backgroundColor:(status == '2' ? '#267BD8':'#ffffff')}} underlayColor={(status == '2' ? '#267BD8':'transparent')} onPress={()=>{
                       if (status == '2') {
                         this.props.navigation.navigate('InsuranceReportPartyInfoView',{taskno:taskNo})
                       } else {
                         //保险报案详情
                         this.props.navigation.navigate('InsuranceReportDetailView',{taskno:taskNo})
                       }
                     }}>
                       <Text style={{color:(status == '2' ? '#ffffff':'#267BD8'),alignSelf:'center'}}>{status == '2' ? '保险报案' : '保险报案详情'}</Text>
                   </TouchableHighlight>
      if (status != '2') {
        if (status == '3') {
          thirdButton = <TouchableHighlight style={{borderColor:'#267BD8',borderWidth:1,width:(W-82)/3,paddingVertical:8,borderRadius:50,marginLeft:15,backgroundColor:'#267BD8'}} underlayColor='#267BD8' onPress={()=>{
            this.props.navigation.navigate('InsuranceReportSuccessView',{taskno:taskNo})
          }}>
            <Text style={{color:'#ffffff',alignSelf:'center'}}>去查勘</Text>
          </TouchableHighlight>
        } else if (status == '10') {
          thirdButton = <TouchableHighlight style={{borderColor:'#267BD8',borderWidth:1,width:(W-82)/3,paddingVertical:8,borderRadius:50,marginLeft:15,backgroundColor:'#267BD8'}} underlayColor='#267BD8' onPress={()=>{
            this.props.navigation.navigate('ExploreTakePhotoView',{taskno:taskNo,surveyno:''})
          }}>
            <Text style={{color:'#ffffff',alignSelf:'center'}}>补拍照片</Text>
          </TouchableHighlight>
        }
      }
      return (
        <View style={{flexDirection:'row',marginBottom:10,marginLeft:15,marginRight:15}}>
          <TouchableHighlight style={{borderColor:'#267BD8',borderWidth:1,width:(W-82)/3,paddingVertical:8,borderRadius:50}} underlayColor='transparent' onPress={()=>{
            this.props.navigation.navigate('CaseDetailsView', {taskNo})
          }}>
            <Text style={{color:'#267BD8',alignSelf:'center'}}>事故详情</Text>
          </TouchableHighlight>
          {secondButton}
          {thirdButton}
        </View>
      )
  }
  _renderLocalCell(rowData, type){
    let { basic, person, step, handleWay, id } = rowData;
    return (
      <TouchableHighlight style={styles.content} underlayColor={'#ffffff'} onPress={() => this.caseCellClick(step, handleWay, id, type, rowData)}>
        <View style={{flex: 1, flexDirection:'row'}}>
          <View style={styles.left}>
            <View style={{flexDirection:'row',marginTop:15,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故时间：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{basic.accidentTime}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故地点：</Text>
              <Text style={{color:formLeftText,fontSize:14, flex:1}}>{basic.address}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-start',marginBottom:10}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>当事人：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>
                {person?person.map(p => p.name + ' (' + p.licensePlateNum + ')\n'):'\n'}
              </Text>
            </View>
          </View>
          <View style={styles.right}>
            <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,resizeMode:'contain'}}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}
const styles = StyleSheet.create({
    content: {
        flex:1,
        backgroundColor: '#ffffff'
    },
    left:{
      flex:1,
      marginLeft:15,
      marginRight:10,
    },
    right:{
      width: 10,
      alignItems: 'center',
      justifyContent:'center',
      marginRight:15,
    }
});

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
  '7':'UploadProgressView',
}

const AStepToView = {
  '0':'APhotoEvidenceVeiw',
  '1':'SelectHandleTypeView',
  '2':'AGatheringPartyInformationView',
  '3':'AGatheringCardPhotoView',
  '4':'AConfirmInformationView',
  '5':(handleWay) => { return handleWay != '04'? 'AAccidentFactAndResponsibilityView': 'AccidentConditionView'},
  '5_6_1':'AccidentConfirmResponView',
  '6':(handleWay) => { return handleWay != '04'? 'UploadProgressView' : 'ASignatureConfirmationView'},
  '6_7_1':'WaitRemoteResponsibleView',
  '7':'UploadProgressView'
}

export default class HistoricalCaseCellView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }

  historyCellClick(taskNo) {
    this.props.navigation.navigate('CaseDetailsView', {taskNo})
  }

  caseCellClick(step, handleWay){
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
    if(routeName) this.props.navigation.navigate(routeName);
  }

  render() {
    let { type } = this.props;
    return(
      <View>
        {type === 3? this._renderHistoryCell(this.props.rowData) : this._renderLocalCell(this.props.rowData)}
      </View>
    )
  }

  _renderHistoryCell(rowData){
    let { accidentAddress, accidentTime, taskNo, cars } = rowData;
    return (
      <TouchableHighlight style={styles.content} underlayColor={'#ffffff'} onPress={() => this.historyCellClick(taskNo)}>
        <View style={{flex: 1, flexDirection:'row',justifyContent:'space-between'}}>
          <View style={styles.left}>
            <View style={{flexDirection:'row',marginTop:15,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故时间：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{accidentTime}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故地点：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{accidentAddress}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-start',marginBottom:10}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>当事人：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{cars.map(car => car.ownerName + ' (' + car.licenseNo + ')\n')}</Text>
            </View>
          </View>
          <View style={styles.right}>
            <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,resizeMode:'contain'}}/>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _renderLocalCell(rowData){
    let { basic, person, step, handleWay } = rowData;
    return (
      <TouchableHighlight style={styles.content} underlayColor={'#ffffff'} onPress={() => this.caseCellClick(step, handleWay)}>
        <View style={{flex: 1, flexDirection:'row',justifyContent:'space-between'}}>
          <View style={styles.left}>
            <View style={{flexDirection:'row',marginTop:15,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故时间：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{basic.accidentTime}</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
              <Text style={{color:formLeftText,fontSize:15, width: 80}}>事故地点：</Text>
              <Text style={{color:formLeftText,fontSize:14}}>{basic.address}</Text>
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
      marginLeft:15
    },
    right:{
      width: 10,
      alignItems: 'center',
      justifyContent:'center',
      marginRight:15,
    }
});

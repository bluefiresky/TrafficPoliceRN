/**
 * 历史案件Cell页面
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableHighlight
} from 'react-native';

import {W, formLeftText, formRightText, mainBule} from '../../configs/index.js';
export default class HistoricalCaseCellView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }
  cellClick(taskNo) {
    this.props.navigation.navigate('CaseDetailsView', {taskNo})
  }
  render() {
    let { accidentAddress, accidentTime, taskNo, cars } = this.props.rowData;
    return (
      <TouchableHighlight style={styles.content} underlayColor={'#ffffff'} onPress={() => this.cellClick(taskNo)}>
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
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-start'}}>
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

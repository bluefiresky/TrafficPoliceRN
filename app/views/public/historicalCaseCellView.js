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
  cellClick() {
    this.props.navigation.navigate('CaseDetailsView')
  }
  render() {
      return (
        <TouchableHighlight style={styles.content} underlayColor={'#ffffff'} onPress={() => this.cellClick()}>
          <View style={{flexDirection:'row',marginBottom:15,justifyContent:'space-between'}}>
            <View style={styles.left}>
              <View style={{flexDirection:'row',marginTop:15}}>
                <Text style={{color:formLeftText,fontSize:13}}>事故时间：</Text>
                <Text style={{color:formLeftText,fontSize:13}}>2017-05-20 10:55</Text>
              </View>
              <View style={{flexDirection:'row',marginTop:10}}>
                <Text style={{color:formLeftText,fontSize:13}}>事故地点：</Text>
                <Text style={{color:formLeftText,fontSize:13}}>北京市朝阳区</Text>
              </View>
              <View style={{flexDirection:'row',marginTop:10}}>
                <Text style={{color:formLeftText,fontSize:13}}>当事人：</Text>
                <Text style={{color:formLeftText,fontSize:13,width:W-100}}>张三（京543216）张三（京543216）张三（京543216）张三（京543216）张三（京543216）张三（京543216）张三（京543216）张三（京543216）张三（京543216）</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,alignSelf:'center'}}/>
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
      justifyContent:'center',
      marginRight:15
    }
});

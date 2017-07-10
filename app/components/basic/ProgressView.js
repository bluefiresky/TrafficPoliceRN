/**
* Created by wuran on 17/1/19.
* 1. 提供progressBar效果
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, TouchableWithoutFeedback, Image, ScrollView, ActivityIndicator } from "react-native";

import { H, W, backgroundGrey, mainBule, borderColor, formLeftText, formRightText, commonText, placeholderColor } from '../../configs/index.js';

const IndicatorColor = Platform.OS === 'ios'? 'white':null;

class ProgressView extends Component {

  constructor(props){
    super(props);
  }

  render(){
    let { show, tip, hasTitleBar } = this.props;
    let marginBottom = (hasTitleBar === true)? 44 : 0
    if(show){
      return (
        <View style={[styles.progress, {marginBottom}]}>
          <View style={{alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.8)', paddingTop: 20, paddingLeft: 20, paddingRight: 18, paddingBottom: 18}}>
            <ActivityIndicator animating={true} size={'large'} color={IndicatorColor}/>
            {
              tip?
              <Text style={{fontSize: 14, color: 'white', marginTop: 10}}>{tip}</Text>
              :
              null
            }
          </View>
        </View>
      )
    }else{
      return null;
    }
  }

}

const styles = StyleSheet.create({
  progress: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
// backgroundColor: 'rgba(100,100,100,0.1)',

module.exports.ProgressView = ProgressView

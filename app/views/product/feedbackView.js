/**
* creat by renhanyi on 17/04/27.
* 用户反馈页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey } from '../../configs/index.js';/** 自定义配置参数 */
import { BaseView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */

class FeedbackView extends Component {

  static navigationOptions = {
    title: '用户反馈'
  }

  constructor(props){
    super(props);
    this.state = {
      loading: false
    }
  }
  render(){
    return(
      <BaseView showProgress={this.stateloading}>
        <View style={styles.container}>
        </View>
      </BaseView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.FeedbackView = connect()(FeedbackView)

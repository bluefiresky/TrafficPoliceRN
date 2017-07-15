/**
* Created by wuran on 16/12/29.
* Button 公共自定义组件
* params:
*   1. loading: 按钮上的圆形loadding图标控制属性，默认< false >, 为true时，出现图标，文字消失，不可点击
*   2. disabled: 控制按钮是否可点击，默认< false >, 为true时，按钮为灰色且不可点击
*   3. title: 按钮标题文字
*/

import React, { Component } from 'react'
import { View, Text, StyleSheet, ViewPropTypes, TouchableHighlight } from "react-native";
import { Button } from 'react-native-elements';

import { W, mainBule } from '../../configs/index.js';

export class XButton extends Component {

  static propTypes = {
    style: ViewPropTypes.style,
    textStyle: Text.propTypes.style
  }

  constructor(props){
    super(props);
  }

  render(){
    let { disabled, loading, title, onPress, style, textStyle, borderRadius } = this.props;
    let d = loading? true : (disabled? true : false);
    let t = loading? '' : title;
    return(
      <Button
        backgroundColor={mainBule}
        buttonStyle={[styles.button, style]}
        textStyle={[styles.text, textStyle]}
        activityIndicatorStyle={styles.indicator}
        color={mainBule}
        large={false}
        borderRadius={borderRadius?borderRadius:5}
        disabled={d}
        loading={loading}
        title={t}
        onPress={onPress}
        Component={TouchableHighlight}/>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: W - 60,
    height: 40
  },
  text: {
    color: 'white', /** Button的color控制indicator和font颜色，所以font颜色设置 */
    fontSize: 16
  },
  indicator: {
  }
});

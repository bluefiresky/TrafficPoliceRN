/**
* Created by wuran on 17/04/21.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableHighlight, ScrollView } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */ } from '../../configs/index.js';/** 自定义配置参数 */
import { BaseView, ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */

class AboutUsView extends Component {

  static navigationOptions = {
    title: '关于我们'
  }

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      tel: "400-010-6810",
      version: "v6.1.0",
    }

    this._onPress = this._onPress.bind(this);
    console.log('the AboutUsView props -->> ', props);
  }

  componentDidMount(){
    console.log('AboutUsView -> componentDidMount execute');
    this.setState({ loading: true })
    this.timer1 = setTimeout( (() => {
      this.setState({ loading : false })
      Toast.showShortCenter('载入完毕')
    }).bind(this), 3000)
  }

  componentWillUnmount(){
    console.log('AboutUsView -> componentWillUnmount execute');
    this.timer1 && clearTimeout(this.timer1);
  }

  render(){
    let { loading, tel, version } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView style={{flex:1,}}>
          <View style={styles.content}>
            <View style={styles.logo}>
              <Image source={require("./image/ic_launcher.png")} style={styles.logoImg} />
            </View>
            <View style={styles.introduction}>
              <Text style={styles.msgText}>
                众筹网是中国专业的一站式综合众筹融资服务平台，是网信集团旗下的众筹模式网站，为大众提供筹资、投资、孵化、运营一站式综合众筹服务。我们支持一切好玩有趣的个性创意和故事，电影、音乐、公益、旅行、艺术、非遗、科研......只要他们都是有趣的、有意义的，你都可以发起呦。在过去的一年里，我们为将近1万个故事筹款超过1亿元。想要生活变的不一样，从众筹开始～
              </Text>
            </View>
            <View style={styles.tel}>
              <TouchableHighlight
                onPress={this._onPress}
                style={styles.touchables}
              >
                <Text style={styles.telText} >客服电话：{tel}</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>众筹网 {version}</Text>
          </View>
        </ScrollView>
        <ProgressView show={loading} tip="加载中..." />
      </View>
    );
  }

  /** Private Method **/
  _onPress(){
    let { navigation, dispatch, buttonColor } = this.props;
    alert("拨打电话");
    //navigation.goBack(null);
    // dispatch( create_service(Contract.POST_USER_LOGIN, {phoneNumber: '12345', password: 'abcde'}))
  }


}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS == 'ios'?20:0,
    flex: 1,
  },
  content: {
    minHeight: Platform.OS == 'ios'?H-80:H-60,
  },
  logo: {
    marginTop: 25,
    alignItems: "center",
  },
  logoImg: {
    width: 76,
    height: 76,
  },
  introduction: {
    marginTop: 15,
    marginLeft: 25,
    marginRight: 25,
  },
  msgText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 24,
  },
  tel: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 60,
    shadowColor:'#000',
    shadowOffset:{h:0,w:0},
    shadowRadius:3,
    shadowOpacity:0.2,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation:10,
  },
  touchables: {
    borderRadius: 10,
    overflow: "hidden",
  },
  telText: {
    color: "#61acc9",
    fontSize: 15,
    textAlign: "center",
    width: "100%",
    paddingTop: 13,
    paddingBottom: 13,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  footerText: {
    color: "#999",
    fontSize: 13,
    lineHeight: 30,
  },
});

module.exports.AboutUsView = connect()(AboutUsView)

/**
* Created by wuran on 17/04/21.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableHighlight, ScrollView } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */ } from '../../configs/index.js';/** 自定义配置参数 */
import { BaseView, ProgressView} from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */

class CommonProblemsView extends Component {

  static navigationOptions = {
    title: '常见问题'
  }

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      problemList: [
        {
          title: "发起者常见问题"
        },
        {
          title: "支持者常见问题"
        },
        {
          title: "注册登录问题"
        }
      ]
    }

    this._onPress = this._onPress.bind(this);
    console.log('the CommonProblemsView props -->> ', props);
  }

  componentDidMount(){
    console.log('CommonProblemsView -> componentDidMount execute');
    this.setState({ loading: true })
    this.timer1 = setTimeout( (() => {
      this.setState({ loading : false })
      Toast.showShortCenter('载入完毕')
    }).bind(this), 3000)
  }

  componentWillUnmount(){
    console.log('CommonProblemsView -> componentWillUnmount execute');
    this.timer1 && clearTimeout(this.timer1);
  }


  render(){
    let { loading, problemList } = this.state;

    return(
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.lists}>
              {
                problemList.map((item,key)=>{
                  return (
                    <TouchableHighlight onPress={this._onPress} style={styles.flexBox}  key={key}>
                      <View style={key==0?[styles.listsItem,styles.noTopBorder]:styles.listsItem} >
                        <Text style={styles.itemText}>{item.title}</Text>
                        <Image source={require("./image/right_arrow.png")} style={styles.jiantou} />
                      </View>
                    </TouchableHighlight>
                  )

                })
              }
            </View>
          </View>
        </ScrollView>
        <ProgressView show={loading} tip="加载中..." />
      </View>
    );
  }

  /** Private Method **/
  _onPress(){
    let { navigation, dispatch } = this.props;
    Toast.showShortCenter('载入完毕')
    //navigation.goBack(null);
    // dispatch( create_service(Contract.POST_USER_LOGIN, {phoneNumber: '12345', password: 'abcde'}))
  }

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: Platform.OS == "ios" ?20:0,
  },
  lists: {
      width: "100%",
      borderTopWidth: .5,
      borderTopColor: "#e5e5e5",
      borderBottomWidth: .5,
      borderBottomColor: "#e5e5e5",
      borderStyle: "solid",
      marginTop: 20,
      paddingLeft: 15,
      backgroundColor: "#fff"
  },
  listsItem: {
      borderTopWidth: .5,
      borderTopColor: "#e5e5e5",
      borderStyle: "solid",
      paddingRight: 15,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
  },
  noTopBorder: {
      borderTopWidth: 0,
  },
  flexBox: {
      flex: 1,  
  },
  itemText: {
      paddingTop: 22,
      paddingBottom: 22,
      lineHeight: 16,
      fontSize: 16,
      flex: 1,
  },
  jiantou: {
      width: 8,
      height: 13,
  }
});

module.exports.CommonProblemsView = connect()(CommonProblemsView)

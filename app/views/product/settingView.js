/**
* Created by wuran on 17/04/21.
* 登录页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableHighlight, Alert, Image} from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */,formLeftText, formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { XButton } from '../../components/index';
import { BaseView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */

class SettingView extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: false
    }

    this._onPress = this._onPress.bind(this);
    console.log('the SettingView props -->> ', props);
  }

  componentDidMount(){
    console.log('SettingView -> componentDidMount execute');
    this.setState({ loading: true })
    this.timer1 = setTimeout( (() => {
      this.setState({ loading : false })
      Toast.showShortCenter('载入完毕')
    }).bind(this), 3000)
  }

  componentWillUnmount(){
    console.log('SettingView -> componentWillUnmount execute');
    this.timer1 && clearTimeout(this.timer1);
  }

  cellClick(){
    Alert.alert('哈喽');
  }

  render(){
    let { loading } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView style={{flex:1,}}>
        <TouchableHighlight onPress={() => this.cellClick()} style={{marginTop:15}}>
        <View style = {styles.content}>
          <View style={styles.viewContent}>
            <View style={styles.viewContentFirst}>
              <Text style={{fontSize:16,color:formRightText,lineHeight:20,flex:1}}>意见反馈</Text>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height: 12,marginLeft:-5,alignSelf:'flex-end'}} />
            </View>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.cellClick()}>
        <View style = {styles.content}>
          <View style={styles.viewContent}>
            <View style={styles.viewContentFirst}>
              <Text style={{fontSize:16,color:formRightText,lineHeight:20,flex:1}}>检查更新</Text>
                <Text style={{fontSize:16,color:formLeftText,lineHeight:20,flex:1}}>当前版本v6.1.0</Text>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height: 12,marginLeft:-5,alignSelf:'flex-end'}} />

            </View>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.cellClick()}>
        <View style = {styles.content}>
          <View style={styles.viewContent}>
            <View style={styles.viewContentFirst}>
              <Text style={{fontSize:16,color:formRightText,lineHeight:20,flex:1}}>清除缓存</Text>
              <Text style={{fontSize:16,color:formLeftText,lineHeight:20,flex:1}}>缓存大小1828.11k</Text>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height: 12,marginLeft:-5,alignSelf:'flex-end'}} />
            </View>
          </View>
        </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={() => this.cellClick()} style={{marginTop:15}}>
        <View style = {styles.content}>
          <View style={styles.viewContent}>
            <View style={styles.viewContentFirst}>
              <Text style={{fontSize:16,color:formRightText,lineHeight:20,flex:1}}>邀请朋友</Text>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height: 12,marginLeft:-5,alignSelf:'flex-end'}} />

            </View>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.cellClick()}>
        <View style = {styles.content}>
          <View style={styles.viewContent}>
            <View style={styles.viewContentFirst}>
              <Text style={{fontSize:16,color:formRightText,lineHeight:20,flex:1}}>客服电话</Text>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height: 12,marginLeft:-5,alignSelf:'flex-end'}} />
            </View>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.cellClick()}>
        <View style = {styles.content}>
          <View style={styles.viewContent}>
            <View style={styles.viewContentFirst}>
              <Text style={{fontSize:16,color:formRightText,lineHeight:20,flex:1}}>关于我们</Text>
              <Image source={require('./image/right_arrow.png')} style={{width:7,height: 12,marginLeft:-5,alignSelf:'flex-end'}} />

            </View>
          </View>
        </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this.cellClick()}>
        <View  style={{borderWidth:0,flexDirection:'column',backgroundColor: 'white',alignItems:'center',justifyContent:'center',marginTop:20,height:35} }>
            <Text style={{fontSize:16,color:formRightText}}>退出登录</Text>
        </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }

  /** Private Method **/
  _onPress(){
    let { navigation, dispatch } = this.props;
    navigation.goBack(null);
    // dispatch( create_service(Contract.POST_USER_LOGIN, {phoneNumber: '12345', password: 'abcde'}))
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
      flexDirection: 'row',
      backgroundColor: 'white',
      height:40,
      width:W
  },
  viewContent:{
    marginLeft:15,
    borderBottomWidth:1,
    backgroundColor: 'white',
    borderBottomColor:backgroundGrey,
    borderWidth:0
  },
  viewContentFirst:{
    marginTop:10,
    width:W-40,
    justifyContent:'center',
    flexDirection: 'row',
  }
});

module.exports.SettingView = connect()(SettingView)

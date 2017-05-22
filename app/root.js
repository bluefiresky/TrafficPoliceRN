/**
* Created by wuran on 16/12/21.
* 页面容器，页面提供导航等页面基础配置
*/
import React, {Component} from 'react';
import {View, StatusBar, StyleSheet, Platform, Text, TouchableOpacity, ScrollView } from 'react-native';

import {connect} from 'react-redux';
import { StackNavigator } from 'react-navigation';

/** 自定义 */
import { backgroundGrey, mainBule, W } from './configs/index.js';

import {
  /** auth */     LoginView, RegisterView, ResetView,
  /** product */  CommonProblemsView, FeedbackView, AboutUsView, SettingView
 } from './views/index.js';

const isIos = Platform.OS === 'ios';
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: mainBule
  },
  headerTitleStyle: {
    color: 'white',
    fontSize: 16
  }
});

const publicNavigationOptions = {
  headerStyle:styles.headerStyle,
  headerTitleStyle: styles.headerTitleStyle,
  headerTintColor: 'white',
  headerBackTitle: '返回'
}

/** App-主栈 */
const MainNavigator = StackNavigator({
  SettingView: { screen: SettingView, navigationOptions: { title: '设置'} },
  CommonProblemsView: { screen: CommonProblemsView, navigationOptions: { title: '常见问题'} },
  FeedbackView: { screen: FeedbackView, navigationOptions: { title: '意见反馈'} },
  AboutUsView: { screen: AboutUsView, navigationOptions: { title: '关于我们'} },
},{
  headerMode: 'screen',
  navigationOptions: () => (publicNavigationOptions)
})

/** App-Auth栈 */
const AuthNavigator = StackNavigator({
  LoginView: { screen: LoginView },
  RegisterView: { screen: RegisterView, navigationOptions: { title: '注册'} },
  ResetView: { screen: ResetView, navigationOptions: { title: '找回密码'} }
},{
  headerMode: 'screen',
  navigationOptions: () => (publicNavigationOptions)
})

/** App-基础栈 */
const AppNavigator = StackNavigator({
  Main: { screen: MainNavigator },
  Auth: { screen: AuthNavigator },
}, {
  initialRouteName: 'Auth',
  headerMode: 'none',
  mode: 'modal',
});

class RootView extends Component {

  constructor(props){
    super(props);
    this.state={
      statusBackColor: isIos? 'transparent' : mainBule
    };
  }

  render(){
    let { statusBackColor } = this.state;
    let { guide, navigation } = this.props;

    return(
      <View style={styles.container}>
        <StatusBar backgroundColor={statusBackColor} />
        <AppNavigator />
      </View>
    );
  }
}

export default RootView;

/**
* Created by wuran on 16/12/15.
* 程序入口，为整个应用提供基础层配置
*/
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { View, StyleSheet, AppState, AsyncStorage, ActivityIndicator, Text, Platform } from 'react-native';
import Storage from 'react-native-storage';

import { configureStore, getStore } from './redux/index.js';
import RootView from './root.js';

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated.']
const storage = new Storage({ size: 10000, storageBackend: AsyncStorage, defaultExpires: null, enableCache: false })

const IndicatorColor = Platform.OS === 'ios'? 'white':'#1174D9';
export default class TrafficPoliceRN extends Component {

  constructor(props){
    super(props);
    this.state = {
      store: null,
      guide: 'done'
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    // redux 的store配置完成后再刷新页面
    // 同时确认引导页是否已经加载过
    configureStore( () => {
      const store = getStore();
      const state = store.getState();
      console.log('Index configureStore state -->> ', state);
      global.auth = state.auth;
      global.stackKeys = {};
      global.personal = state.personal;
      global.storage = storage;
      AsyncStorage.getItem("has_open_app")
        .then((data) => {
          this.setState({store: store, guide: data})
        })
    })
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange(currentAppState) {

  }

  render() {
    const { store, guide } = this.state;
    if (!store) return this._renderView('progressView');
    return this._renderView(null, store, guide);
  }

  /*
   * create view
   */
  _renderView(name, store, guide){
    switch (name) {
      case 'progressView':
        return(
          <View style={styles.container}>
            <ActivityIndicator animating={true} size={'large'} />
          </View>
        );
      default:
        return(
          <Provider store={store}>
            <RootView guide={guide}/>
          </Provider>
        );
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

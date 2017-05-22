/**
* Created by wuran on 17/5/16.
* 页面容器，用于覆盖当前页面的modal
*/
import React, { Component } from 'react';
import { StyleSheet, Modal, Text, View, Platform, ScrollView, TouchableOpacity } from 'react-native';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */, mainBule, borderColor } from '../../configs/index.js';/** 自定义配置参数 */

const ComponentW = W - 60;
const ComponentH = H - (Platform.OS === 'ios'? 140 : 100);

export class ProtocolModal extends Component {

  constructor(props){
    super(props);
  }

  render(){
    let { show, closeEvent, content } = this.props;
    return(
      <View>
        <Modal animationType="slide"  transparent={true} visible={show} onRequestClose={()=>{}}>
          <View style={styles.container}>
            <View style={{width: ComponentW, height: ComponentH, backgroundColor: 'white'}}>
              <View style={{flex: 1}}>
                <ScrollView style={{padding: 5}}><Text>{content}</Text></ScrollView>
              </View>
              <TouchableOpacity onPress={closeEvent} activeOpacity={0.8}>
                <View style={{width: ComponentW, height: 35, backgroundColor: mainBule, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: 'white', fontSize: 16}}>确定</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

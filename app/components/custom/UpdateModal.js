/**
* Created by wuran on 17/5/16.
* 页面容器，用于覆盖当前页面的modal
*/
import React, { Component } from 'react';
import { StyleSheet, Modal, Text, View, Platform, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Toast from '@remobile/react-native-toast';

import { W/** 屏宽*/, H/** 屏高*/, backgroundGrey/** 背景灰 */, mainBule, borderColor, formLeftText } from '../../configs/index.js';/** 自定义配置参数 */

const ComponentW = W - 80;
const ComponentH = (3*ComponentW)/5

export class UpdateModal extends Component {

  constructor(props){
    super(props);
  }

  render(){
    let { show, closeEvent, content } = this.props;
    return(
      <View>
        <Modal animationType="slide"  transparent={true} visible={show} onRequestClose={()=>{}}>
          <View style={styles.container}>
            <View style={{width: ComponentW, height: ComponentH, backgroundColor: 'white', borderRadius: 10}}>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
                <Text>{content? content.upgradeReason : null }</Text>
              </View>
              <View style={{height: 1, backgroundColor: borderColor}} />
              <TouchableOpacity onPress={()=>{ Linking.openURL(content.appDownloadUrl) }} activeOpacity={0.8}>
                <View style={{width: ComponentW, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: '#1174D9', fontSize: 16}}>确定</Text>
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

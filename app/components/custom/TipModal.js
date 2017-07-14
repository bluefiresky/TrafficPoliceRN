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

export class TipModal extends Component {

  constructor(props){
    super(props);
  }

  render(){
    let { show, content, left, right, title } = this.props;
    return(
      <View>
        <Modal animationType="slide"  transparent={true} visible={show} onRequestClose={()=>{}}>
          <View style={styles.container}>
            <View style={{width: ComponentW, height: ComponentH, backgroundColor: 'white', borderRadius: 10}}>
              <View style={{flex: 1, paddingVertical:10, paddingHorizontal:15}}>
                {title? <Text style={{marginBottom:10, fontWeight:'bold', fontSize:16, alignSelf:'center'}}>{title}</Text> : null}
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                  <Text style={{color:formLeftText, fontSize:14}}>{content}</Text>
                </View>
              </View>
              <View style={{height: 1, backgroundColor: (!left && !right)? 'transparent' : borderColor}} />
              {
                (left && right)? this._renderTowButton(left, right) : (left? this._renderOneButton(left) : null)
              }
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  _renderOneButton(left){
    return(
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={()=>{ left.event() }} activeOpacity={0.8}>
          <View style={{width: ComponentW, height: 40, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#1174D9', fontSize: 16}}>{left.label}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderTowButton(left, right){
    return(
      <View style={{flexDirection: 'row', height: 40, width: ComponentW}}>
        <TouchableOpacity onPress={()=>{ left.event() }} activeOpacity={0.8} style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <View>
            <Text style={{color: '#1174D9', fontSize: 16}}>{left.label}</Text>
          </View>
        </TouchableOpacity>
        <View style={{backgroundColor: borderColor, width:1}} />
        <TouchableOpacity onPress={()=>{ right.event() }} activeOpacity={0.8} style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
          <View>
            <Text style={{color: '#1174D9', fontSize: 16}}>{right.label}</Text>
          </View>
        </TouchableOpacity>
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

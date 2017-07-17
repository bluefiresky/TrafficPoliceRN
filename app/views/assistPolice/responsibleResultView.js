/**
* 事故事实及责任（单车）页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableHighlight} from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Picker from 'react-native-picker';

class ResponsibleResultView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '事故事实及责任'
    }
  }

  constructor(props){
    super(props);
    this.state = {
      refresh:false
    }

    this.remoteRes = this.props.navigation.state.params.remoteRes;
  }

  //完成
  gotoNext(){
    this.props.navigation.navigate('ASignatureConfirmationView', {dutyList: this.remoteRes.list});
  }
  renderOneParty(value,index){
    return (
      <View key={index} style={{flexDirection:'row', height:40, alignItems: 'center'}}>
        <Text style={{flex:1, fontSize:14, color:formLeftText}}>{`当事人${value.name}（${value.licensePlateNum}）`}</Text>
        <Text style={{fontSize:14, color:formLeftText}}>{value.dutyName}</Text>
      </View>
    )
  }
  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection:'row',paddingTop:10,backgroundColor:'#ffffff',marginTop:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
          </View>

          <View style={{backgroundColor:'#ffffff'}}>
            <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formRightText,fontSize:13,lineHeight:20}}>
              {this.remoteRes.fact + '\n\n' + this.remoteRes.supplementFact}
            </Text>
          </View>

          <View style={{backgroundColor: 'white', marginTop:20, paddingHorizontal:15}}>
            {this.remoteRes.list?this.remoteRes.list.map((value,index) => this.renderOneParty(value,index)):null}
          </View>

          {
            (this.remoteRes.list && this.remoteRes.list.length) === 1? null :
            <View style={{backgroundColor:'#ffffff',paddingBottom:20}}>
              <View style={{backgroundColor:backgroundGrey, height:20}} />
              <View style={{flexDirection:'row',paddingTop:10,marginTop:10}}>
                <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
                <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果</Text>
              </View>
              <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formRightText,fontSize:13,lineHeight:20}}>
                {this.remoteRes.mediateResult}
              </Text>
            </View>
          }

          <View style={{marginBottom:50,marginTop:50,alignItems:'center'}}>
            <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
          </View>

        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

module.exports.ResponsibleResultView = connect()(ResponsibleResultView)

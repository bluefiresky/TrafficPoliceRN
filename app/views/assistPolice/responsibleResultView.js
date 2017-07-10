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
    let { index } = navigation.state.params
    return {
      title: (index == 2) ? '事故事实及责任' : '当事人责任'
    }
  }
  constructor(props){
    super(props);
    this.applyText = '';
    this.partyResponsibility = [{name:'张三',carNum:'京A123212','responsibility':'全部责任'},
                                {name:'李四',carNum:'京B123212','responsibility':'全部责任'},
                                {name:'王五',carNum:'京C123212','responsibility':'全部责任'}];
    this.state = {
      refresh:false
    }
  }
  //完成
  gotoNext(){
    let { index } = this.props.navigation.state.params
    this.props.navigation.navigate('ASignatureConfirmationView', {index:index});
  }
  renderOneParty(value,index){
    return (
      <View style={{marginTop:15, marginLeft:15}} key={index}>
        <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:14}}>{`当事人${value.name}（${value.carNum}）`}</Text>
            <Text style={{fontSize:14,marginLeft:30}}>{value.responsibility}</Text>
        </View>
      </View>
    )
  }
  //输入框文字变化
  render(){
    let { index } = this.props.navigation.state.params
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row',paddingTop:10,backgroundColor:'#ffffff',marginTop:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
        </View>
        <View style={{backgroundColor:'#ffffff'}}>
          <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formLeftText,fontSize:13,lineHeight:20}}>
            2017-09-08 12:35:27，测试驾驶车牌号为京A12537行驶至北京朝阳区百子湾南二路78号院88号时，的卡萨和大咖电话开始的骄傲和圣诞节啊，段时间打开；量较大开始点击啊。当事人测试负全责。
          </Text>
        </View>
        <View style={{backgroundColor:'#ffffff',paddingBottom:15}}>
          {this.partyResponsibility.map((value,index) => this.renderOneParty(value,index))}
        </View>
        {(index != 2)?<View style={{backgroundColor:'#ffffff',paddingBottom:20}}>
          <View style={{flexDirection:'row',paddingTop:10,marginTop:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果</Text>
          </View>
          <TextInput style={{height:100, fontSize: 14, marginLeft:15,marginTop:10, width: W - 30,borderWidth:1,borderColor:'#D4D4D4',backgroundColor:'#FBFBFE',padding:5}}
                     multiline = {true}
                     editable={false}
                     defaultValue={'经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。'}/>
        </View>:null}
        <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
          <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.ResponsibleResultView = connect()(ResponsibleResultView)

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
    this.partyResponsData = [{name:'张三',responsibility:'全部责任'}];
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
            <Text style={{fontSize:14}}>{`当事人${value.name}负`}</Text>
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
        <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
        </View>
        <View style={{backgroundColor:'#ffffff',marginBottom:10}}>
          <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formLeftText,fontSize:13}}>
            2017-09-08 12:35:27，测试驾驶车牌号为京A12537行驶至北京朝阳区百子湾南二路78号院88号时，的卡萨和大咖电话开始的骄傲和圣诞节啊，段时间打开；量较大开始点击啊。当事人测试负全责。
          </Text>
        </View>
        {this.partyResponsData.map((value,index) => this.renderOneParty(value,index))}
        {(index !== 2)?<View style={{marginTop:15}}>
          <View style={{paddingTop:10,paddingBottom:10,backgroundColor:'#D4D4D4'}}>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果</Text>
          </View>
          <TextInput style={{height:100, fontSize: 14, marginLeft:15,marginTop:10, width: W - 30,borderWidth:1,borderColor:'#D4D4D4'}}
                     multiline = {true}
                     editable={false}
                     defaultValue={'经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。'}/>
        </View>:null}
        <View style={{marginLeft:15,marginBottom:10,marginTop:50}}>
          <XButton title='下一步' onPress={() => this.gotoNext()}/>
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.ResponsibleResultView = connect()(ResponsibleResultView)

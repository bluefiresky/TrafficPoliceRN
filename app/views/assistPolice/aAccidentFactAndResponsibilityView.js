/**
* 事故事实及责任（单车）页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableHighlight,InteractionManager} from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import Picker from 'react-native-picker';
import { StorageHelper } from '../../utility/index.js';

class AAccidentFactAndResponsibilityView extends Component {

  constructor(props){
    super(props);
    this.applyText = '';
    this.submitData = {supplyText:'',resultText:''};
    this.state = {
      refresh:false
    }
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(()=>{

    })
  }
  //完成
  gotoNext(){
    let { index } = this.props.navigation.state.params
    this.props.navigation.navigate('WaitRemoteResponsibleView', {index:index});
  }
  //输入框文字变化
  onChangeText(text,type){
    if (type == 'Supply') {
      this.submitData.supplyText = text;
    } else if (type == 'Result') {
      this.submitData.resultText = text;
    }
  }
  renderHeader(title){
    return(
      <View style={{backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10}}>
          <View style={{marginLeft:15,width:2,height:15,backgroundColor:'blue'}}></View>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10,width:W-30,alignSelf:'center'}}>{title}</Text>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}}></View>
      </View>
    )
  }
  render(){
    // let { index } = this.props.navigation.state.params
    let index = 2;
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
          <AutoGrowingTextInput style={{marginLeft:15,width:W-30,fontSize:13,padding:5,borderWidth:1,borderColor:'#D4D4D4',marginTop:15,backgroundColor:'#FBFBFE',marginBottom:10}}
                                    placeholder={'补充事故事实（可不填）'}
                                    placeholderTextColor={'#C8C8C8'}
                                    maxLength={200}
                                    onChangeText={(text) => this.onChangeText(text,'Supply')}
                                    />
        </View>
        {(index !== 2)?<View style={{marginTop:10,backgroundColor:'#ffffff'}}>
          <View style={{flexDirection:'row',marginTop:15}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果（可自行修改）</Text>
          </View>
          <TextInput style={{height:100, fontSize: 14, marginLeft:15,marginTop:10, width: W - 30,borderWidth:1,borderColor:'#D4D4D4',backgroundColor:'#FBFBFE',padding:5,marginBottom:10}}
                     onChangeText={(text) => { this.onChangeText(text,'Result') } }
                     multiline = {true}
                     maxLength={200}
                     defaultValue={'经各方当事人共同申请调解，自愿达成协议如下：由当事人自行协商解决。此事故一次结清，签字生效。'}/>
        </View>:null}
        <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
          <XButton title='提交远程定责' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
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

module.exports.AAccidentFactAndResponsibilityView = connect()(AAccidentFactAndResponsibilityView)

/**
* 事故事实及责任（单车）页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput,TouchableHighlight,InteractionManager} from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { ProgressView, XButton, TipModal } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper } from '../../utility/index.js';

class AAccidentFactAndResponsibilityView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      supplementaryE:null,
      supplementary:null,
      conciliation:'经各方当事人共同申请调解，自愿达成协议如下：\n由当事人自行协商解决。此事故一次结清，签字生效。',
      handleWay:'03',
      showTip:false,
      tipParams:{},
    }
  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(async ()=>{
      let info = await StorageHelper.getCurrentCaseInfo();
      let { basic, person, supplementary, conciliation, handleWay } = info;
      this.setState({
        loading:false,
        supplementaryE: this._convertInfoToAccidentContent(basic, person),
        handleWay
      });
    })
  }
  //完成
  gotoNext(){
    this.setState({loading:true})
    if(this.state.loading) return;

    InteractionManager.runAfterInteractions(() => {
      let { supplementary, conciliation, } = this.state;
      let self = this;
      self.setState({ showTip: true, loading:false,
        tipParams:{
          content: '该案件将提交远程交警进行责任认定，案件提交后无法撤回，请确认是否继续提交？',
          left:{label: '暂不提交', event: () => {
            self.setState({showTip: false});
          }},
          right:{label: '继续提交', event: async () => {
            self.setState({loading:true});
            if(self.state.loading) return;

            let success = await StorageHelper.saveStep6({supplementary, conciliation, localDutyList:[]})
            self.setState({showTip: false, loading:false});
            if(success) self.props.navigation.navigate('UploadProgressView');
          }}
      }});
    })
  }
  //输入框文字变化
  onChangeText(text,type){
    if (type == 'Supply') {
      this.setState({supplementary: text});
    } else if (type == 'Result') {
      this.setState({conciliation: text})
    }
  }

  render(){
    let { supplementary, conciliation, supplementaryE, handleWay } = this.state;

    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{width:W, height:15, backgroundColor:backgroundGrey}} />
          <View style={{flexDirection:'row',paddingTop:10,backgroundColor:'#ffffff',marginTop:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
            <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
          </View>
          <View style={{backgroundColor:'#ffffff'}}>
            <Text style={{marginLeft:15,marginRight:15,marginTop:15,color:formRightText,fontSize:13,lineHeight:20}}>{supplementaryE}
            </Text>
            <AutoGrowingTextInput
              style={{height:100,marginLeft:15,width:W-30,fontSize:13,padding:5,borderWidth:1,borderColor:'#D4D4D4',marginTop:15,backgroundColor:'#FBFBFE'}}
              value={supplementary}
              underlineColorAndroid={'transparent'}
              placeholder={'补充事故事实（可不填）'}
              placeholderTextColor={'#C8C8C8'}
              maxLength={200}
              onChangeText={(text) => this.onChangeText(text,'Supply')}
            />
            <View style={{height:10}} />
          </View>

          {
            handleWay === '03'? null :
            <View style={{flex:1,backgroundColor:'#ffffff'}}>
              <View style={{width:W, height:15, backgroundColor:backgroundGrey}} />
              <View style={{flexDirection:'row',backgroundColor:'#ffffff',marginTop:15}}>
                <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
                <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果（可自行修改）</Text>
              </View>
              <TextInput
                style={{height:100, fontSize: 14, marginLeft:15,marginTop:10, marginBottom:10, width: W - 30,borderWidth:1,borderColor:'#D4D4D4',backgroundColor:'#FBFBFE',padding:5}}
                value={conciliation}
                underlineColorAndroid={'transparent'}
                onChangeText={(text) => { this.onChangeText(text,'Result') } }
                multiline = {true}
                maxLength={200}
                />
            </View>
          }

          <View style={{alignSelf:'center',marginBottom:50,marginTop:50}}>
            <XButton title='提交远程定责' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
          </View>
        </ScrollView>

        <TipModal show={this.state.showTip} {...this.state.tipParams} />
        <ProgressView show={this.state.loading} hasTitleBar={true} />
      </View>
    );
  }
  /** Private */
  _convertInfoToAccidentContent(basic, person){
    if(!basic) return '';

    let num = person.length;
    let content = '';
    if(num === 1){
      let p = person[0];
      content = `\t${this._convertAccidentTime(basic.accidentTime)}, ${p.name}(驾驶证号:${p.driverNum})驾驶车牌号为${p.licensePlateNum}的${p.carType}, 在${basic.address}发生交通事故。`
    }else if(num === 2){
      let p1 = person[0];
      let p2 = person[1];
      content = `\t${this._convertAccidentTime(basic.accidentTime)}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}，与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}发生交通事故。`
    }else if(num === 3){
      let p1 = person[0];
      let p2 = person[1];
      let p3 = person[2];
      content = `\t${this._convertAccidentTime(basic.accidentTime)}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}，及${p3.name}(驾驶证号:${p3.driverNum})驾驶车牌号为${p3.licensePlateNum}的${p3.carType}发生交通事故。`
    }

    return content;
  }

  _convertAccidentTime(time){
    if(time) return time.substring(0, time.length - 3);
    return ''
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.AAccidentFactAndResponsibilityView = connect()(AAccidentFactAndResponsibilityView)

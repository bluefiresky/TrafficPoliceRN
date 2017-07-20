/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList,Alert } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import Picker from 'react-native-picker';

class PerfectInformantInfoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false
    }
    this.selDataArr = [{title:'行驶证及驾驶证的有效性及真实性存在可疑',isSel:false},
                       {title:'驾驶座及周围发现血迹而驾驶员没有受伤',isSel:false},
                       {title:'驾驶员的年龄、性别、身份、职业与驾驶车型不适配',isSel:false},
                       {title:'现场发现驾驶员有饮酒迹象',isSel:false},
                       {title:'当事车辆有改变使用性质情况',isSel:false},
                       {title:'当事车辆有超长、超宽、超高、超重情况',isSel:false}];
    // this.partyData = [{carNum:'冀F12332',name:'123',drivingLicence:'13217788765456556',engineNumber:'',frameNumber:'',drivingLicenceValidte:true,drivingPermitValidte:true,isMatching:true,selDataArr:this.selDataArr},{carNum:'京F12332',name:'988',drivingLicence:'13217788765456556',engineNumber:'',frameNumber:'',drivingLicenceValidte:true,drivingPermitValidte:true,isMatching:true,selDataArr:this.selDataArr}];
    this.partyData = null
  }
  //下一步
  gotoNext(){

  }
  onChangeText(text,index,type){
    switch (type) {
      case 'EngineNumber':
        this.partyData[index].engineno = text;
        break;
      case 'FrameNumber':
        this.partyData[index].vinno = text;
        break;
      default:

    }
  }
  componentDidMount(){
    let { surveyno } = this.props.navigation.state.params
    this.setState({
      loading: true
    })
    this.props.dispatch( create_service(Contract.POST_SURVEYCHO_INFO, {surveyno:surveyno}))
      .then( res => {
        this.setState({
          loading: false
        })
        if (res && res.data) {
          this.partyData = res.data
        } else {
          //获取本地存储的数据

        }
    })
  }
  renderRowItem(title,value){
    return (
      <View style={{marginTop:10}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{marginLeft:15,color:formLeftText}}>{title}</Text>
          <Text style={{marginLeft:20,color:formLeftText}}>{value}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10,marginLeft:15}}></View>
      </View>
    )
  }
  renderOneParty(value,index) {
    let { scenelist } = getStore().getState().insuranceDictionary
    let selImage1 = value.driverflag ? require('./image/selected.png') : require('./image/unselected.png')
    let selImage2 = value.drivingflag ? require('./image/selected.png') : require('./image/unselected.png')
    let selImage3 = value.matchingflag ? require('./image/selected.png') : require('./image/unselected.png')
    return (
      <View style={{backgroundColor:'#ffffff',marginBottom:10}} key={index}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.licenseno}】`}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10}}></View>
        {this.renderRowItem('当事人姓名',value.person)}
        {this.renderRowItem('当事人车牌号',value.licenseno)}
        {this.renderRowItem('驾驶证号',value.driverlicenseno)}
        <View style={{flexDirection:'row',marginLeft:15,marginTop:10}}>
          <Text style={{color:formLeftText}}>发动机号</Text>
          <TextInput style={{flex:1,fontSize:14,marginLeft:10}}
                     onChangeText={(text) => { this.onChangeText(text,index,'EngineNumber') } }
                     clearButtonMode={'while-editing'}
                     defaultValue={value.engineno}
                     placeholder = {'请输入报案人车辆发动机号'}/>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,marginTop:10}}>
          <Text style={{color:formLeftText}}>车架号</Text>
          <TextInput style={{flex:1,fontSize:14,marginLeft:10}}
                     onChangeText={(text) => { this.onChangeText(text,index,'FrameNumber') } }
                     clearButtonMode={'while-editing'}
                     defaultValue={value.vinno}
                     placeholder = {'请输入报案人车辆车架号'}/>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
          <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>驾驶证有效期是否正常</Text>
          <TouchableHighlight style={{marginRight:15}} underlayColor={'transparent'} onPress={()=>{
            value.driverflag = !value.driverflag
            this.setState({
              refresh: true
            })
          }}>
            <Image source={selImage1} style={{width:19,height:19,alignSelf:'center'}}/>
          </TouchableHighlight>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
          <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>行驶证有效期是否正常</Text>
          <TouchableHighlight style={{marginRight:15}} underlayColor={'transparent'} onPress={()=>{
            value.drivingflag = !value.drivingflag
            this.setState({
              refresh: true
            })
          }}>
            <Image source={selImage2} style={{width:19,height:19,alignSelf:'center'}}/>
          </TouchableHighlight>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
          <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>准驾车型与车辆类型是否匹配</Text>
          <TouchableHighlight style={{marginRight:15}} underlayColor={'transparent'} onPress={()=>{
            value.matchingflag = !value.matchingflag
            this.setState({
              refresh: true
            })
          }}>
            <Image source={selImage3} style={{width:19,height:19,alignSelf:'center'}}/>
          </TouchableHighlight>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        <View style={{marginTop:10,marginLeft:15}}>
          <Text style={{color:formLeftText}}>
            请确认现场是否存在以下情况：
          </Text>
          <View style={{marginTop:15}}>
            {scenelist.map((value,index) => this.renderSeleteRow(value,index))}
          </View>
        </View>
      </View>
    )
  }
  renderSeleteRow(value,index){
    let selImage = value.isSel ? require('./image/selected.png') : require('./image/unselected.png')
    return (
      <TouchableHighlight underlayColor='transparent' key={index} onPress={()=>{
        value.isSel = !value.isSel
        this.setState({
          refresh: true
        })
      }}>
        <View style={{flexDirection:'row',marginBottom:15}}>
          <Image source={selImage} style={{width:19,height:19,alignSelf:'center'}}/>
          <Text style={{marginLeft:10,width:W-60,lineHeight:20}}>
            {value.name}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{paddingVertical:10}}>
           <Text style={{fontSize:13,color:'#717171',marginLeft:15}}>
             请完善当事人及现场情况信息：
           </Text>
         </View>
         {this.partyData ? <View style={{flex:1}}>
           {this.partyData.surveylist.map((value,index) => this.renderOneParty(value,index))}
         </View>:null}
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
         </View>
         <ProgressView show={this.state.loading}/>
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

module.exports.PerfectInformantInfoView = connect()(PerfectInformantInfoView)

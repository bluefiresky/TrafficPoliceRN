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
import Tool from '../../utility/Tool'

class PerfectInformantInfoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      loading: false
    }
    this.partyData = null;
    this.data = [];
    this.photolistData = []
  }
  componentWillMount(){
    let { taskno } = this.props.navigation.state.params
    let surveytime = Tool.getTime('yyyy-MM-dd hh:mm:ss')
    let groupname = global.personal.depName
    let policetypen = global.personal.policeType
    let policename = global.personal.policeName
    let policephone = global.personal.mobile
    this.submitData = {taskno:taskno,surveytime:surveytime,groupname:groupname,policetypen:policetypen,policename:policename,policephone:policephone}
  }
  //下一步
  gotoNext(){
    for (var i = 0; i < this.data.length; i++) {
      // if (!this.data[i].engineno) {
      //   Toast.showShortCenter(`请填写${this.data[i].person}的发动机号`)
      //   return
      // }
      // if (!this.data[i].vinno) {
      //   Toast.showShortCenter(`请填写${this.data[i].person}的车架号`)
      //   return
      // }
      // if (this.data[i].scenelist.length == 0) {
      //   Toast.showShortCenter(`请选择${this.data[i].person}的现场情况`)
      //   return
      // }
    }
    this.setState({
      loading: true
    })
    let { taskno } = this.props.navigation.state.params
    this.submitData.data = JSON.stringify(this.data)
    this.props.dispatch( create_service(Contract.POST_SURVEY_INFO, this.submitData))
      .then( res => {
        if (res && res.code == 200) {
          this.props.navigation.navigate('ExploreTakePhotoView',{surveyno:res.data.surveyno,personData:this.data,taskno:taskno,photolist:this.photolistData,needRequestPhoto:false})
        }
        this.setState({
          loading:false
        })
    })
  }
  onChangeText(text,index,type){
    switch (type) {
      case 'EngineNumber':
        this.data[index].engineno = text;
        break;
      case 'FrameNumber':
        this.data[index].vinno = text;
        break;
      default:

    }
  }
  componentDidMount(){
    this.setState({
      loading: true
    })
    let { scenelist } = getStore().getState().insuranceDictionary
    let { taskno } = this.props.navigation.state.params
    this.props.dispatch( create_service(Contract.POST_SURVEYCHO_INFO, {taskno:taskno}))
      .then( res => {
        if (res && res.data) {
          this.partyData = res.data.surveylist
          for (var i = 0; i < res.data.surveylist.length; i++) {
            let onePerson = res.data.surveylist[i]
            this.photolistData.push(onePerson.photolist);
            this.data.push({person:onePerson.person,licenseno:onePerson.licenseno,driverlicenseno:onePerson.driverlicenseno,engineno:onePerson.engineno,vinno:onePerson.vinno,driverflag:onePerson.driverflag,drivingflag:onePerson.drivingflag,matchingflag:onePerson.matchingflag,scenelist:[]})
            this.partyData[i].scenelistShow = []
          }
        }
        for (var i = 0; i < scenelist.length; i++) {
          for (var j = 0; j < this.partyData.length; j++) {
            this.partyData[j].scenelistShow.push({name:scenelist[i].name,code:scenelist[i].code,isSel:false})
          }
        }
        for (var i = 0; i < this.partyData.length; i++) {
          if (this.partyData[i].scenelist && this.partyData[i].scenelist.length > 0) {
            for (var j = 0; j < this.partyData[i].scenelist.length; j++) {
              for (var k = 0; k < this.partyData[i].scenelistShow.length; k++) {
                if (this.partyData[i].scenelist[j].scenecode == this.partyData[i].scenelistShow[k].code) {
                  this.partyData[i].scenelistShow[k].isSel = true
                }
              }
            }
          }
        }
        this.setState({
          loading: false
        })
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
  renderOneParty(value,ind) {
    let selImage1 = value.driverflag ? require('./image/selected.png') : require('./image/unselected.png')
    let selImage2 = value.drivingflag ? require('./image/selected.png') : require('./image/unselected.png')
    let selImage3 = value.matchingflag ? require('./image/selected.png') : require('./image/unselected.png')
    return (
      <View style={{backgroundColor:'#ffffff',marginBottom:10}} key={ind}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.licenseno}】`}</Text>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10}}></View>
        {this.renderRowItem('当事人姓名',value.person)}
        {this.renderRowItem('当事人车牌号',value.licenseno)}
        {this.renderRowItem('驾驶证号',value.driverlicenseno)}
        {/* <View style={{flexDirection:'row',marginLeft:15,marginTop:10}}>
          <Text style={{color:formLeftText}}>发动机号</Text>
          <TextInput style={{flex:1,fontSize:14,marginLeft:10}}
                     onChangeText={(text) => { this.onChangeText(text,ind,'EngineNumber') } }
                     clearButtonMode={'while-editing'}
                     defaultValue={value.engineno}
                     placeholder = {'请输入报案人车辆发动机号'}/>
        </View>
        <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View>
        <View style={{flexDirection:'row',marginLeft:15,marginTop:10}}>
          <Text style={{color:formLeftText}}>车架号</Text>
          <TextInput style={{flex:1,fontSize:14,marginLeft:10}}
                     onChangeText={(text) => { this.onChangeText(text,ind,'FrameNumber') } }
                     clearButtonMode={'while-editing'}
                     defaultValue={value.vinno}
                     placeholder = {'请输入报案人车辆车架号'}/>
        </View> */}
        {/* <View style={{backgroundColor:backgroundGrey,height:1,marginTop:15,marginLeft:15}}></View> */}
        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
          <Text style={{marginLeft:15,color:formLeftText,alignSelf:'center'}}>驾驶证有效期是否正常</Text>
          <TouchableHighlight style={{marginRight:15}} underlayColor={'transparent'} onPress={()=>{
            value.driverflag = !value.driverflag
            this.data[ind].driverflag = (value.driverflag ? 1 : 0)
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
            this.data[ind].drivingflag = (value.drivingflag ? 1 : 0)
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
            this.data[ind].matchingflag = (value.matchingflag ? 1 : 0)
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
            {value.scenelistShow.map((value,index) => this.renderSeleteRow(value,index,ind))}
          </View>
        </View>
      </View>
    )
  }
  //删除数组中某个元素
  removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
      if(arr[i].scenecode == val.scenecode) {
        arr.splice(i, 1);
        break;
      }
    }
  }
  renderSeleteRow(value,index,ind){
    let selImage = value.isSel ? require('./image/selected.png') : require('./image/unselected.png')
    return (
      <TouchableHighlight underlayColor='transparent' key={index} onPress={()=>{
        value.isSel = !value.isSel
        if (value.isSel) {
          this.data[ind].scenelist.push({scenecode:value.code})
        } else {
          this.removeByValue(this.data[ind].scenelist,{scenecode:value.code})
        }
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
      <View style={{flex:1}}>
        <ScrollView style={styles.container}
                     showsVerticalScrollIndicator={false}>
           <View style={{paddingVertical:10}}>
             <Text style={{fontSize:13,color:'#717171',marginLeft:15}}>
               请完善当事人及现场情况信息：
             </Text>
           </View>
           {this.partyData ? <View style={{flex:1}}>
             {this.partyData.map((value,index) => this.renderOneParty(value,index))}
           </View>:null}
           <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
             <XButton title='下一步' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
           </View>
        </ScrollView>
        <ProgressView show={this.state.loading}/>
      </View>
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

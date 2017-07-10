/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableHighlight,TextInput,Image, NativeModules, InteractionManager } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';
import Tool from '../../utility/Tool';

class AAccidentBasicInformationView extends Component {

  constructor(props){
    super(props);
    this.weatherData = ['晴','阴','小雨','大雨','小雪','大雪'];
    this.state = {
      date: Tool.handleTime(Tool.getTime("yyyy-MM-dd hh:mm a"),false,'time'),
      weatherData: '',
      accidentSite:'北京市',
      loading: false
    }
  }
  componentDidMount(){
    //首先进来需要先定位
    //定位完成设置位置信息
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: true})
      // -100 停止定位 -99 坐标转换地址失败 -98 地图管理器启动失败
      NativeModules.BaiduMapModule.location().then((result) => {
        console.log('AAccidentBasicInformationView execute componentDidMount location and the result -->> ', result);
        if(result && !result.errorCode) this.setState({accidentSite: result.address, loading: false})
        else if(result && result.errorCode && result.errorCode != -100) {
          this.setState({ loading: false});
          Alert.alert('提示', '无法获取当前位置，请重试' ,[{
                  text : "返回首页",
                  onPress : () => {
                    console.log('11');
                  }
                },{
                  text : "重试",
                  onPress : () => {
                    console.log('22');
                  }
                }])
        }else{
          this.setState({loading: false})
        }
      })
    });
  }
  onChangeText(text){
    //如果定位失败需要 手动设置位置信息
    this.setState({
      accidentSite:text
    })
  }
  showWeatherPicker() {
      Picker.init({
      pickerData: this.weatherData,
      pickerConfirmBtnText:'确定',
      pickerCancelBtnText:'取消',
      pickerTitleText:'请选择',
      onPickerConfirm: data => {
          this.setState({
            weatherData:data[0]
          })
      }
     });
     Picker.show();
  }
  //去取证
  gotoTakePhoto(){
    this.props.navigation.navigate('APhotoEvidenceVeiw');
  }
  render(){
    let { loading } = this.state;
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{backgroundColor:'#ffffff',marginTop:15}}>
           <View style={{flexDirection:'row',justifyContent:'space-between'}}>
             <Text style={{marginLeft:15,fontSize:15,color:formLeftText,alignSelf:'center'}}>事故时间</Text>
             <DatePicker
               style={{flex:1}}
               date={this.state.date}
               mode="datetime"
               format="YYYY-MM-DD h:mm a"
               confirmBtnText="确定"
               cancelBtnText="取消"
               iconSource={require('./image/right_arrow.png')}
               customStyles={{
                 dateInput: {
                   marginLeft: 60,
                   borderColor:'#ffffff'
                 },
                 dateIcon: {
                    width:7,
                    height:12,
                    marginRight:15
                  },
               }}
               onDateChange={(date) => {
                 this.setState({date: Tool.handleTime(date,true,'time')})
               }}
             />
           </View>
         </View>
         <View style={{backgroundColor:'#ffffff',marginTop:15,paddingVertical:10}}>
           <View style={{flexDirection:'row',justifyContent:'space-between'}}>
             <Text style={{marginLeft:15,fontSize:15,color:formLeftText,alignSelf:'center'}}>天气</Text>
             <TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={() => this.showWeatherPicker()} underlayColor='transparent'>
               <View style={{flexDirection:'row'}}>
                 <Text style={{alignSelf:'center',color: (this.state.weatherData ? formLeftText : formRightText)}}>
                   {this.state.weatherData ? this.state.weatherData: '请选择事故现场天气'}
                 </Text>
                 <Image style={{width:7,height:12,marginLeft:30,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
               </View>
             </TouchableHighlight>
           </View>
        </View>
        <View style={{backgroundColor:'#ffffff',marginTop:15}}>
          <Text style={{color:formLeftText,marginLeft:15,marginTop:10,fontSize:15}}>
            事故地点
            <Text style={{color:formRightText,fontSize:15}}>
              （可手动更改事故地点）
            </Text>
          </Text>
          <View style={{backgroundColor:'#EFF2F7',width:W,height:1,marginTop:10}}></View>
          <View style={{flexDirection:'row',paddingVertical:10}}>
            <Image source={require('./image/location.png')} style={{width:20,height:20,alignSelf:'center',marginLeft:15}}/>
            <TextInput style={{fontSize:14,height:30,flex:1,marginLeft:15}}
                       defaultValue={this.state.accidentSite}
                       onChangeText={(text) => this.onChangeText(text)}/>
          </View>
        </View>
        <View style={{marginLeft:15, marginTop:50}}>
          <XButton title='拍照取证' onPress={() => this.gotoTakePhoto()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
        </View>
        <ProgressView show={this.state.loading}/>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7'
  }
});

module.exports.AAccidentBasicInformationView = connect()(AAccidentBasicInformationView)

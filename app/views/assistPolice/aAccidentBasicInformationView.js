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

class AAccidentBasicInformationView extends Component {

  constructor(props){
    super(props);
    this.weatherData = ['晴','阴','小雨','大雨','小雪','大雪'];
    this.state = {
      loading: false,
      date: new Date(),
      weatherData: this.weatherData[0],
      accidentSite:'北京市'
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
      },
      onPickerSelect: data => {
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
        <View style={{marginTop:40}}>
          <Text style={{alignSelf:'center'}}>
            事故时间（请选择事故发生时间）
          </Text>
        </View>
        <DatePicker
          style={{width: 250,marginTop:20,alignSelf:'center'}}
          date={this.state.date}
          mode="datetime"
          format="YYYY-MM-DD h:mm:ss a"
          confirmBtnText="确定"
          cancelBtnText="取消"
          customStyles={{
            dateInput: {
              marginLeft: 20,
              borderColor:'#ffffff'
            }
          }}
          onDateChange={(date) => {this.setState({date: date})}}
        />
        <View style={{backgroundColor:'#D4D4D4',height:1,width: 250,alignSelf:'center'}}></View>
        <View style={{marginTop:20}}>
          <Text style={{alignSelf:'center'}}>
            天气（请选择事故现场天气）
          </Text>
        </View>
        <TouchableHighlight style={{alignSelf:'center',marginTop:20}} onPress={() => this.showWeatherPicker()} underlayColor='transparent'>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:14,color:formLeftText,marginLeft:10}}>{this.state.weatherData}</Text>
            <Image style={{width:15,height:10,marginLeft:10,alignSelf:'center'}} source={require('./image/down_arrow.png')}/>
          </View>
        </TouchableHighlight>
        <View style={{backgroundColor:'#D4D4D4',height:1,width: 250,alignSelf:'center'}}></View>
        <View style={{marginTop:20}}>
          <Text style={{alignSelf:'center'}}>
            事故地点（可手动更改事故地点）
          </Text>
          <TextInput style={{fontSize:14,alignSelf:'center',width:300,height:40,borderColor:'#D4D4D4',borderWidth:1,padding:10,marginTop:20}}
          defaultValue={this.state.accidentSite}
          onChangeText={(text) => this.onChangeText(text)}/>
        </View>
        <View style={{marginLeft:15,marginBottom:10,marginTop:100}}>
          <XButton title='拍照取证' onPress={() => this.gotoTakePhoto()}/>
        </View>
        <ProgressView show={loading} tip='定位中...'/>
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

module.exports.AAccidentBasicInformationView = connect()(AAccidentBasicInformationView)

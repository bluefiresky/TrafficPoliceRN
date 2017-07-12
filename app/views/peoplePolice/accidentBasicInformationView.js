/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableHighlight,TextInput,Image,NativeModules, InteractionManager } from "react-native";
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import Picker from 'react-native-picker';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, InputWithIcon, TipModal } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import Tool from '../../utility/Tool';
import { StorageHelper } from '../../utility/index.js';

class AccidentBasicInformationView extends Component {

  constructor(props){
    super(props);
    this.weatherData = ['晴','阴','小雨','大雨','小雪','大雪'];
    this.state = {
      date: Tool.handleTime(Tool.getTime("yyyy-MM-dd hh:mm a"),false,'time'),
      weatherData: '',
      accidentSite:'北京市',
      loading: false,
      showTip: false,
      tipParams: {}
    }

    this.locationData = null;
    this._onGetLocation = this._onGetLocation.bind(this);
    this.gotoTakePhoto = this.gotoTakePhoto.bind(this);
    this.tmp = 1;
  }
  componentDidMount(){
    //页面载入，获取当前系统时间，可修改。点击时间框，调起时间选择插件。时间格式“XXXX年XX月XX日 XX时XX分”。需同时记录当前系统时间、修改后时间，都需传给后台。
    //页面载入时，进行定位，定位结束loading消失,无法定位，弹框提示手动修改事故地点。定位失败，弹框提示重试。定位成功，显示定位到的地点
    InteractionManager.runAfterInteractions(() => {
      this._onGetLocation();
    });
  }

  onChangeText(text){
    //如果定位失败需要 手动设置位置信息
    this.setState({ accidentSite:text })
  }

  showWeatherPicker() {
      Picker.init({
        pickerData: this.weatherData,
        pickerConfirmBtnText:'确定',
        pickerCancelBtnText:'取消',
        pickerTitleText:'请选择',
        onPickerConfirm: data => { this.setState({weatherData:data[0]}) }
     });
     Picker.show();
  }
  //去取证
  gotoTakePhoto(){
    StorageHelper.create({
      id: '1499771792020',
      basic: {
        address: '000测试-北京市朝阳区百子湾南二路78号院-3',
        accidentTime: '2017-07-11 17:10:00',
        latitude: '39.90167',
        longitude: '116.473731',
        weather: '1'
      }
    })
    this.props.navigation.navigate('PhotoEvidenceVeiw');
  }
  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/** 事故时间 */}
           <View style={{backgroundColor:'#ffffff',marginTop:15}}>
             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
               <Text style={{marginLeft:15,fontSize:15,color:formLeftText,alignSelf:'center'}}>事故时间</Text>
               <DatePicker style={{flex:1}} date={this.state.date} mode="datetime" format="YYYY-MM-DD h:mm a" confirmBtnText="确定" cancelBtnText="取消"
                 iconSource={require('./image/right_arrow.png')}
                 customStyles={{dateInput: { alignItems:'flex-end', borderColor:'#ffffff' }, dateIcon: { width:7, height:12, marginRight:15 } }}
                 onDateChange={(date) => { this.setState({date: Tool.handleTime(date,true,'time')}) }}
               />
             </View>
           </View>

           {/** 天气 */}
           <View style={{backgroundColor:'#ffffff',marginTop:15,paddingVertical:10}}>
             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
               <Text style={{marginLeft:15,fontSize:15,color:formLeftText,alignSelf:'center'}}>天气</Text>
               <TouchableHighlight style={{alignSelf:'center',marginRight:15}} onPress={() => this.showWeatherPicker()} underlayColor='transparent'>
                 <View style={{flexDirection:'row'}}>
                   <Text style={{alignSelf:'center',color: (this.state.weatherData ? formLeftText : formRightText)}}>
                     {this.state.weatherData ? this.state.weatherData: '请选择事故现场天气'}
                   </Text>
                   <Image style={{width:7,height:12,marginLeft:5,alignSelf:'center'}} source={require('./image/right_arrow.png')}/>
                 </View>
               </TouchableHighlight>
             </View>
          </View>

          {/** 事故地点 */}
          <View style={{backgroundColor:'#ffffff',marginTop:15}}>
            <Text style={{color:formLeftText,marginLeft:15,marginTop:10,fontSize:15}}>
              事故地点
              <Text style={{color:formRightText,fontSize:15}}> (可手动更改事故地点)</Text>
            </Text>
            <View style={{backgroundColor:'#EFF2F7',width:W,height:1,marginTop:10}}></View>
            <InputWithIcon labelWidth={30} style={{height: 55}} icon={require('./image/location.png')} noBorder={true} value={this.state.accidentSite} onChange={this.onChangeText.bind(this)} multiline={true}/>
          </View>

          {/** 拍照取证 */}
          <View style={{marginLeft:15, marginTop:50}}>
            <XButton title='拍照取证' onPress={() => this.gotoTakePhoto()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
          </View>

        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true}/>
        <TipModal show={this.state.showTip} {...this.state.tipParams} />
      </View>

    );
  }

  /** Private **/
  async _onGetLocation(){
    this.setState({loading: true})
    let self = this;
    // -100 停止定位 -99 坐标转换地址失败 -98 地图管理器启动失败
    this.locationData = await NativeModules.BaiduMapModule.location();
    console.log('AAccidentBasicInformationView execute componentDidMount location and the result -->> ', this.locationData);

    if(this.locationData){
      if(!this.locationData.errorCode) self.setState({accidentSite: this.locationData.address, loading: false})
      else{
        if(this.locationData.errorCode != -100){
          self.setState({ loading: false, showTip: true,
            tipParams:{
              content: '无法获取当前位置，请重试',
              left:{label: '返回首页', event: () => {
                self.setState({showTip: false});
                self.props.navigation.goBack();
              }},
              right:{label: '重试', event: () => {
                self.setState({showTip: false});
                self._onGetLocation();
              }}
          }});
        }else{
          self.setState({loading: false})
        }
      }
    }else{
      this.setState({loading: false})
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF2F7'
  }
});

module.exports.AccidentBasicInformationView = connect()(AccidentBasicInformationView)

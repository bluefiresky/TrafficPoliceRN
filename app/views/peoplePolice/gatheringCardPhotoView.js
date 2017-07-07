/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableHighlight,Platform,Alert } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import ImagePicker from 'react-native-image-picker';

class GatheringCardPhotoView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
    this.carInfoData = [{name:'甲方（张三 京A12345）',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]},
                        {name:'乙方（李四 京A12345）',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]},
                        {name:'丙方（王五 京A12345）',data:[{'title': '驾驶证',imageURL:''},{'title': '行驶证',imageURL:''}]}];
    this.rowNum = 2;
    this.rowMargin = 15;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
    this.options = {
            title: '选择照片', //选择器的标题，可以设置为空来不显示标题
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照', //调取摄像头的按钮，可以设置为空使用户不可选择拍照
            chooseFromLibraryButtonTitle: '从手机相册选择', //调取相册的按钮，可以设置为空使用户不可选择相册照片
            mediaType: 'photo',
            maxWidth: 1500,
            maxHeight: 2000,
            quality: 0.5,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
  }
  //拍照
  takePhoto(index,ind){
    //点击其它是拍照
    let that = this;
    ImagePicker.showImagePicker(this.options, (response) => {
        if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
            let source;
            if (Platform.OS === 'ios') {
                source = {
                    uri: response.uri.replace('file://', ''),
                    isStatic: true
                };
            } else {
                source = {
                    uri: response.uri,
                    isStatic: true
                };
            }
            that.carInfoData[ind].data[index].imageURL = source;
            that.setState({
                refresh: true
            })
        }
    });
  }
  //信息采集完成
  gotoNext(){
    // for (var i = 0; i < this.carInfoData.length; i++) {
    //   for (var j = 0; j < this.carInfoData[i].data.length; j++) {
    //     if (!this.carInfoData[i].data[j].imageURL) {
    //       Toast.showShortCenter(`请上传${this.carInfoData[i].name}的${this.carInfoData[i].data[j].title}`);
    //       return;
    //     }
    //   }
    // }
    let that = this;
    Alert.alert('提示', '请确保拍摄的证件照片清晰完整，提交之后无法修改' ,[{
            text : "返回修改",
            onPress : () => {}
          },{
            text : "确认无误",
            onPress : () => {
              that.props.navigation.navigate('ConfirmInformationView');
            }
          }])
  }
  renderItem(item,index,ind) {
    let innerImgae;
    if (!item.imageURL) {
      innerImgae = <Image style={{width: 40, height: 40, resizeMode: 'contain', alignSelf:'center'}} source={require('./image/personal_camera.png')}/>
    } else {
      innerImgae = null
    }
    return (
      <TouchableHighlight style={{marginLeft:this.rowMargin,marginBottom:15}} underlayColor={'transparent'} onPress={() => this.takePhoto(index,ind)} key={index}>
        <View style={{flex:1}}>
          {
            item.imageURL?
              <Image style={{width: this.rowWH,height: this.rowWH * 0.5,justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}
                     source={item.imageURL ? item.imageURL:null}>
                {innerImgae}
              </Image>
            :
              <View style={{width: this.rowWH,height: this.rowWH * 0.5, justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}>
                {innerImgae}
              </View>
          }

          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  renderOnePersonInfo(value,ind){
    return (
      <View style={{flex:1,backgroundColor:'#ffffff',marginTop:10}} key={ind}>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{value.name}</Text>
        </View>
        <View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}>
          {value.data.map((value,index) => this.renderItem(value,index,ind))}
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
         <View style={{flex:1}}>
           {this.carInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
           <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
             <XButton title='信息采集完成' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
           </View>
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

module.exports.GatheringCardPhotoView = connect()(GatheringCardPhotoView)

/**
* 交警当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView,TouchableHighlight,Platform,Alert,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, TipModal, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { StorageHelper, Utility } from '../../utility/index.js';

const CredentialsIcon = require('./image/e_credentials.png');
const CameraIcon = require('./image/camera.png');
const ImageW = (W - 3 * 20) / 2;
const ImageH = (220 * ImageW)/340;
const photoOption = {
  title: '选择照片', //选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', //调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', //调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo',
  maxWidth: parseInt(W),
  maxHeight: parseInt(H),
  quality: 0.8,
  storageOptions: { cameraRoll:true, skipBackup: true, path: 'images' }
}
const DocumentPath = Platform.select({ android: 'file://', ios: RNFS.DocumentDirectoryPath + '/images/' });

class GatheringCardPhotoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      showTip: false,
      tipParams: {},
      loading:false,
    }
    this.carInfoData = [];
  }

  async componentDidMount(){
    let info = await StorageHelper.getCurrentCaseInfo();
    let titles = [{name:'甲方', type:'30'}, {name:'乙方',type:'31'}, {name:'丙方',type:'32'}];
    let credentials = info.credentials?info.credentials : [];
    for(let i=0; i < info.person.length; i++){
      let p = info.person[i];
      let t = titles[i];
      let c = credentials[i];
      this.carInfoData.push({
        name:t.name+'('+p.name+'  '+ p.licensePlateNum +')',
        data:[{title:'驾驶证及行驶证',image:CredentialsIcon,photoData:(c?c.photoData:null),photoType:t.type,photoDate:(c?c.photoDate:null)}]
      });
    }

    this.forceUpdate();
  }

  //拍照
  takePhoto(index,ind){
    //点击其它是拍照
    let self = this;
    ImagePicker.showImagePicker(photoOption, (response) => {
      if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
        let photoData;
        if(Platform.OS === 'ios'){
          photoData = response.uri.substring(response.uri.lastIndexOf('/')+1);
        }else{
          photoData = response.path;
        }

        let p = self.carInfoData[ind].data[index];
        p.photoData = photoData;
        p.photoDate = Utility.formatDate('yyyy-MM-dd hh:mm:ss')

        self._saveOnePhoto();
        self.setState({refresh: true})
      }
    });
  }

  async _saveOnePhoto(){
    let photoList = [];
    for (let i = 0; i < this.carInfoData.length; i++) {
      for (let j = 0; j < this.carInfoData[i].data.length; j++) {
        let data = this.carInfoData[i].data[j];
        let { photoData, photoDate, photoType } = data;
        photoList.push({photoData, photoDate, photoType});
      }
    }
    await StorageHelper.saveStep4(photoList, true)
  }

  //信息采集完成
  gotoNext(){
    this.setState({loading:true})
    let photoList = [];
    for (var i = 0; i < this.carInfoData.length; i++) {
      for (var j = 0; j < this.carInfoData[i].data.length; j++) {
        let data = this.carInfoData[i].data[j];
        if (!data.photoData) {
          this.setState({loading:false})
          Toast.showShortCenter(`请上传${this.carInfoData[i].name}的${data.title}`);
          return;
        }else{
          let { photoData, photoDate, photoType } = data;
          photoList.push({photoData, photoDate, photoType});
        }
      }
    }

    let self = this;
    self.setState({ showTip: true, loading:false,
      tipParams:{
        content: '请确保拍摄的证件照片清晰完整，提交之后无法修改',
        left:{label: '返回修改', event: () => {
          self.setState({showTip: false});
        }},
        right:{label: '确认无误', event: async () => {
          self.setState({loading: true})
          let success = await StorageHelper.saveStep4(photoList)
          self.setState({showTip: false, loading:false});
          if(success) self.props.navigation.navigate('ConfirmInformationView');
        }}
    }});
  }
  renderItem(item,index,ind) {
    let source=item.photoData?{uri:DocumentPath+item.photoData, isStatic:true}:item.image;
    return (
      <TouchableHighlight style={{paddingLeft: 10, paddingRight: 10,marginBottom:15}} underlayColor={'transparent'} onPress={() => this.takePhoto(index,ind)} key={index}>
        <View style={{flex:1}}>
          <Image source={source} style={{width: ImageW, height: ImageH, justifyContent:'center', alignItems: 'center'}}>
            {item.photoData? null : <Image style={{height: 30, width: 30, resizeMode: 'contain'}} source={CameraIcon}/>}
          </Image>
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
        <View style={{flexDirection:'row',marginTop:10,justifyContent:'center'}}>
          {value.data.map((value,index) => this.renderItem(value,index,ind))}
        </View>
      </View>
    )
  }
  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
           <View style={{flex:1}}>
             {this.carInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
             <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
               <XButton title='信息采集完成' onPress={() => this.gotoNext()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
             </View>
           </View>
        </ScrollView>
        <TipModal show={this.state.showTip} {...this.state.tipParams} />
        <ProgressView show={this.state.loading} hasTitleBar={true} />
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

module.exports.GatheringCardPhotoView = connect()(GatheringCardPhotoView)

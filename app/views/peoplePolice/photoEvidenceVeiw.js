/**
* 交警拍照取证页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TouchableHighlight,FlatList,Platform,Alert,TouchableOpacity,Modal,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';

import { W, H, backgroundGrey,formLeftText, formRightText,babackgroundGrey } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, TipModal } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper, Utility } from '../../utility/index.js';

const ImageW = (W - 3 * 20) / 2;
const ImageH = (220 * ImageW)/340;
const BigImageH = (220 * W)/340
const EFrontIcon = require('./image/e_front.png');
const EBackIcon = require('./image/e_back.png');
const EKnockedIcon = require('./image/e_knocked.png');
const EOtherIcon = require('./image/e_other.png');
const CameraIcon = require('./image/camera.png');
const photoOption = {
  title: '选择照片', //选择器的标题，可以设置为空来不显示标题
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照', //调取摄像头的按钮，可以设置为空使用户不可选择拍照
  chooseFromLibraryButtonTitle: '从手机相册选择', //调取相册的按钮，可以设置为空使用户不可选择相册照片
  mediaType: 'photo',
  maxWidth: 750,
  maxHeight: 1000,
  quality: 0.5,
  storageOptions: { cameraRoll:true, skipBackup: true, path: 'images' }
}
const DocumentPath = Platform.select({ android: 'file://', ios: RNFS.DocumentDirectoryPath + '/images/' });

class PhotoEvidenceVeiw extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showBigImage:false,
      showTip: false,
      tipParams: {},
      reRender: false
    }

    this.photoList = [
      {'title': '侧前方', image:EFrontIcon, photoData: null, photoType: '0', photoDate:''},
      {'title': '侧后方', image:EBackIcon, photoData: null, photoType: '1', photoDate:''},
      {'title': '碰撞部位', image:EKnockedIcon, photoData: null, photoType: '2', photoDate:''}
    ]

    this.currentImgae = null;
    this.currentImgaeIndex = -1;
    this._saveOnePhoto = this._saveOnePhoto.bind(this);

  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(async () => {
      let info = await StorageHelper.getCurrentCaseInfo();
      if(info.photo){
        for(let i=0; i<info.photo.length; i++){
          let p = info.photo[i];
          if(p.photoType == '0') {
            this.photoList[0].photoData = p.photoData;
            this.photoList[0].photoDate = p.photoDate;
          }else if(p.photoType == '1'){
            this.photoList[1].photoData = p.photoData;
            this.photoList[1].photoDate = p.photoDate;
          }else if(p.photoType == '2'){
            this.photoList[2].photoData = p.photoData;
            this.photoList[2].photoDate = p.photoDate;
          }else{
            this.photoList.push({...p, 'title': `其它现场照片${i-2}`,image:EOtherIcon});
          }
        }
        console.log(' componentDidMount and this.photoList -->> ', this.photoList);
        this.setState({loading:false})
      }else{
        this.photoList = [
          {'title': '侧前方', image:EFrontIcon, photoData: null, photoType: '0', photoDate:''},
          {'title': '侧后方', image:EBackIcon, photoData: null, photoType: '1', photoDate:''},
          {'title': '碰撞部位', image:EKnockedIcon, photoData: null, photoType: '2', photoDate:''}
        ];
        this.setState({loading:false})
      }
    });
  }


  //拍照
  takePhoto(item,index){
    let self = this;
    if (item.photoData) {
      this.currentImgae = item.photoData;
      this.currentImgaeIndex = index;
      this.setState({ showBigImage: true })

    } else {
      ImagePicker.showImagePicker(photoOption, (response) => {
        if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
          // console.log(' the ImagePicker response -->> ', response);
          let p = self.photoList[index];
          let photoData;
          if(Platform.OS === 'ios'){
            photoData = response.uri.substring(response.uri.lastIndexOf('/')+1);
          }else{
            photoData = response.path;
          }
          p.photoData = photoData;
          p.photoDate = Utility.formatDate('yyyy-MM-dd hh:mm:ss')

          self._saveOnePhoto();
        }
      });
    }
  }
  //重拍
  reTakePhoto(){
    let self = this;
    ImagePicker.showImagePicker(photoOption, (response) => {
      this.setState({ showBigImage: false });
      if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
        // console.log(' the ImagePicker response -->> ', response);
        let photoData;
        if(Platform.OS === 'ios'){
          photoData = response.uri.substring(response.uri.lastIndexOf('/')+1);
        }else{
          photoData = response.path;
        }

        self.photoList[self.currentImgaeIndex].photoData = photoData;
        self.photoList[self.currentImgaeIndex].photoDate = Utility.formatDate('yyyy-MM-dd hh:mm:ss');

        self._saveOnePhoto();
      }
    });
  }
  //删除照片
  deletePhoto(){
    this.photoList.splice(this.currentImgaeIndex,1)
    for (var i = 3; i < this.photoList.length; i++) {
      let p = this.photoList[i];
      p.title = `其它现场照片${i-2}`;
      p.photoType = `${50+(i-2)}`
    }
    this.setState({ showBigImage: false })
  }

  //增加其他照片
  addOtherPhoto(){
    let self = this;
    ImagePicker.showImagePicker(photoOption, (response) => {
      if (response.didCancel) {} else if (response.error) {} else if (response.customButton) {} else {
        console.log(' the ImagePicker response -->> ', response);
        let photoData;
        if(Platform.OS === 'ios'){
          photoData = response.uri.substring(response.uri.lastIndexOf('/')+1);
        }else{
          photoData = response.path;
        }

        let otherNum = self.photoList.length - 2;
        let otherPhotoType = 50 + otherNum;
        self.photoList.push({'title': `其它现场照片${otherNum}`,image:EOtherIcon,photoData:photoData,photoType:`${otherPhotoType}`,photoDate:Utility.formatDate('yyyy-MM-dd hh:mm:ss')});

        self._saveOnePhoto();
      }
    });

  }

  async _saveOnePhoto(){
    let submitList = [];
    for(let i = 0; i < this.photoList.length; i++){
      let p = this.photoList[i];
      submitList.push({photoData: p.photoData, photoType: p.photoType, photoDate: p.photoDate})
    }
    let success = await StorageHelper.saveStep1(submitList, true);
    this.setState({loading:false})
  }
  //取证完成
  commit() {
    for (let i = 0; i < this.photoList.length; i++) {
      if (!this.photoList[i].photoData) {
        Toast.showShortCenter(`【${this.photoList[i].title}】必须拍照`);
        return
      }
    }

    let submitList = [];
    for(let i = 0; i < this.photoList.length; i++){
      let p = this.photoList[i];
      submitList.push({photoData: p.photoData, photoType: p.photoType, photoDate: p.photoDate});
    }

    let self = this;
    self.setState({ showTip: true,
      tipParams:{
        content: '事故现场照片采集完成，请立即指引当事人挪车。',
        left:{label: '返回修改', event: () => {
          self.setState({showTip: false});
        }},
        right:{label: '采集当事人信息', event: async () => {
          self.setState({loading: true})
          let success = await StorageHelper.saveStep1(submitList)
          self.setState({showTip: false, loading: false});
          if(success) self.props.navigation.navigate('GatheringPartyInformationView');
        }}
    }});
  }
  renderItem({item,index}) {
    let source = item.photoData? {uri: DocumentPath+item.photoData, isStatic:true} : item.image;
    return (
      <TouchableHighlight style={{marginBottom:15, alignItems: 'center', paddingLeft: 10, paddingRight: 10}} underlayColor={'transparent'} onPress={() => this.takePhoto(item,index)}>
        <View style={{flex:1}}>
          <Image source={source} style={{width: ImageW, height: ImageH, justifyContent:'center', alignItems: 'center'}}>
            {item.photoData? null : <Image style={{height: 30, width: 30, resizeMode: 'contain'}} source={CameraIcon}/>}
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render(){
    return(
      <View style={styles.container}>
         <View style={{flex:1,marginTop:15,backgroundColor:'#ffffff'}}>
           <FlatList
             ref={(ref) => { this._listRef = ref }}
             keyExtractor={(data,index) => {return index}}
             showsVerticalScrollIndicator={false}
             data={this.photoList}
             extraData={this.state}
             numColumns={2}
             renderItem={this.renderItem.bind(this)}
           />
         </View>
         <View style={{marginLeft:15,marginBottom:20,marginTop:10,flexDirection:'row'}}>
           <XButton title={'+其他现场照片'} onPress={() => this.addOtherPhoto()} disabled={(this.photoList.length == 15)} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
           <XButton title={'取证完成'} onPress={() => this.commit()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}}/>
         </View>
         <View>
           <Modal animationType="slide" transparent={true} visible={this.state.showBigImage} onRequestClose={() => {}}>
             <TouchableOpacity onPress={() => this.setState({showBigImage:false})} style={styles.modalContainer} activeOpacity={1}>
               <Image source={{uri: DocumentPath+this.currentImgae, isStatic:true}} style={{width:W,height:BigImageH}}/>
               <View style={{marginTop:100,flexDirection:'row', justifyContent: 'center'}}>
                 <XButton title={'重拍'} onPress={() => this.reTakePhoto()} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
                 <XButton title={'删除'} onPress={() => this.deletePhoto()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}} disabled={this.currentImgaeIndex < 3}/>
               </View>
             </TouchableOpacity>
           </Modal>
         </View>
         <TipModal show={this.state.showTip} {...this.state.tipParams} />
         <ProgressView show={this.state.loading} hasTitleBar={true} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});

module.exports.PhotoEvidenceVeiw = connect()(PhotoEvidenceVeiw)

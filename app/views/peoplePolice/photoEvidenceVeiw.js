/**
* 拍照取证页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TouchableHighlight,FlatList,Platform,Alert,TouchableOpacity,Modal } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,babackgroundGrey } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import ImagePicker from 'react-native-image-picker';

class PhotoEvidenceVeiw extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showBigImage:false,
      data: [{'title': '侧前方',imageURL:''},{'title': '侧后方',imageURL:''},{'title': '碰撞部位',imageURL:''},{'title': '其它现场照片1',imageURL:''}]
    }
    this.rowNum = 2;
    this.rowMargin = 20;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
    this.currentImgae = null;
    this.currentImgaeIndex = -1;
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
                cameraRoll:true,
                skipBackup: true,
                path: 'images'
            }
        };
  }
  //拍照
  takePhoto(item,index){
    let that = this;
    if (item.imageURL) {
      this.currentImgae = item.imageURL;
      this.currentImgaeIndex = index;
      this.setState({
        showBigImage: true
      })
    } else {
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
              this.state.data[index].imageURL = source;
              let temp = JSON.parse(JSON.stringify(this.state.data))
              this.state.data = temp
              this.setState({
                data: temp
              })
          }
      });
    }
  }
  //重拍
  reTakePhoto(){
    this.state.data[this.currentImgaeIndex].imageURL = '';
    let temp = JSON.parse(JSON.stringify(this.state.data));
    this.state.data = temp;
    this.setState({
      showBigImage: false,
      data: temp
    })
  }
  //删除照片
  deletePhoto(){
    this.state.data.splice(this.currentImgaeIndex,1)
    let temp = JSON.parse(JSON.stringify(this.state.data));
    this.state.data = temp;
    for (var i = 3; i < this.state.data.length; i++) {
      this.state.data[i].title = `其它现场照片${i-2}`
    }
    this.setState({
      showBigImage: false,
      data: temp
    })
  }
  //增加其他照片
  addOtherPhoto(){
    this.state.data.push({'title': `其它现场照片${this.state.data.length-2}`,imageURL:''});
    let temp = JSON.parse(JSON.stringify(this.state.data))
    this.state.data = temp
    this.setState({
      data: temp
    })
  }
  //取证完成
  commit() {
    for (var i = 0; i < 3; i++) {
      if (!this.state.data[i].imageURL) {
        Toast.showShortCenter(`【${this.state.data[i].title}】必须拍照`);
        return
      }
    }
    let that = this;
    Alert.alert('提示', '事故现场照片采集完成，请立即指引当事人挪车。' ,[{
            text : "返回修改",
            onPress : () => {}
          },{
            text : "采集当事人信息",
            onPress : () => {
              that.props.navigation.navigate('GatheringPartyInformationView');
            }
          }])
  }
  renderItem({item,index}) {
    return (
      <TouchableHighlight style={{marginLeft:this.rowMargin,marginBottom:15}} underlayColor={'transparent'} onPress={() => this.takePhoto(item,index)}>
        <View style={{flex:1}}>
          <Image style={{width: this.rowWH,height: this.rowWH * 0.7,justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}
                 source={item.imageURL ? item.imageURL:null}>
            {!item.imageURL ? <Image style={{alignSelf:'center'}} source={require('./image/personal_camera.png')}/>:null}
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  render(){
    return(
      <View style={styles.container}>
         <View style={{flex:1,marginTop:15,backgroundColor:'#ffffff',marginRight:this.rowMargin}}>
           <FlatList
             keyExtractor={(data,index) => {return index}}
             showsVerticalScrollIndicator={false}
             data={this.state.data}
             numColumns={this.rowNum}
             renderItem={this.renderItem.bind(this)}
           />
         </View>
         <View style={{marginLeft:15,marginBottom:20,marginTop:10,flexDirection:'row'}}>
           <XButton title={'+其他现场照片'} onPress={() => this.addOtherPhoto()} disabled={(this.state.data.length == 15)} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
           <XButton title={'取证完成'} onPress={() => this.commit()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}}/>
         </View>
         <View>
           <Modal animationType="slide" transparent={true} visible={this.state.showBigImage} onRequestClose={() => {}}>
             <TouchableOpacity onPress={() => this.setState({showBigImage:false})} style={styles.modalContainer} underlayColor={'#ffffff'}>
               <Image source={this.currentImgae} style={{width:W,height:W * 0.7,alignSelf:'center'}}/>
               <View style={{marginLeft:15,marginBottom:20,marginTop:100,flexDirection:'row'}}>
                 <XButton title={'重拍'} onPress={() => this.reTakePhoto()} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
                 <XButton title={'删除'} onPress={() => this.deletePhoto()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}} disabled={this.currentImgaeIndex < 3}/>
               </View>
             </TouchableOpacity>
           </Modal>
         </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});

module.exports.PhotoEvidenceVeiw = connect()(PhotoEvidenceVeiw)

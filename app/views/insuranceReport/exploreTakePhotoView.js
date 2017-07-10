/**
* 查勘拍照页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TouchableHighlight,FlatList,Platform,Alert,TouchableOpacity,Modal,ScrollView } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,babackgroundGrey,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import ImagePicker from 'react-native-image-picker';

class ExploreTakePhotoView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showBigImage:false,
      showDamageModalView: false
    }
    this.partyInfoData = [{carNum:'京A12345',carPhotoData:[{'title': '45度车辆前景照片',imageURL:''},{'title': '当事人和车辆合影',imageURL:''},{'title': '当事车辆车架号',imageURL:''},{'title': '当事车辆受损细节（1）',imageURL:''},{'title': '当事车辆受损细节（2）',imageURL:''},
    {'title': '保单照片',imageURL:''},{'title': '银行卡照片',imageURL:''},{'title': '其它现场照片',imageURL:''}]},{carNum:'京B94484',carPhotoData:[{'title': '45度车辆前景照片',imageURL:''},{'title': '当事人和车辆合影',imageURL:''},{'title': '当事车辆车架号',imageURL:''},{'title': '当事车辆受损细节（1）',imageURL:''},{'title': '当事车辆受损细节（2）',imageURL:''},
    {'title': '保单照片',imageURL:''},{'title': '银行卡照片',imageURL:''},{'title': '其它现场照片',imageURL:''}]}]

    this.carDamageData = [{name:'左前部',isSel:false},{name:'正前部',isSel:false},{name:'右前部',isSel:false},{name:'左中部',isSel:false},{name:'右中部',isSel:false},{name:'左后部',isSel:false},{name:'正后部',isSel:false},{name:'右后部',isSel:false}];
    this.rowNum = 2;
    this.rowMargin = 20;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
    this.currentImgae = null;
    this.currentImgaeIndex = -1;   //图片所属的当事人中某张
    this.currentImgaeInSection = -1;  //图片所属的当事人
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
  takePhoto(item,index,ind){
    if (item.imageURL) {
      this.currentImgae = item.imageURL;
      this.currentImgaeIndex = index;
      this.currentImgaeInSection = ind;
      this.setState({
        showBigImage: true
      })
    } else {
      //点击最后一个添加
      if (index == this.partyInfoData[ind].carPhotoData.length - 1) {
        if (this.partyInfoData[ind].carPhotoData.length == 18) {
          Toast.showShortCenter('您好，其他照片总数限制10张');
          return
        }
        this.partyInfoData[ind].carPhotoData.splice(this.partyInfoData[ind].carPhotoData.length - 1,0,{'title': `其它现场照片${this.partyInfoData[ind].carPhotoData.length - 7}`,imageURL:''});
        let temp = JSON.parse(JSON.stringify(this.partyInfoData[ind].carPhotoData))
        this.partyInfoData[ind].carPhotoData = temp
        this.setState({
          refresh: true
        })
      } else if ((index == 3 || index == 4) && this.partyInfoData[ind].carPhotoData[index].title.indexOf('（') > 0 ) {
        let a = this.partyInfoData[ind].carPhotoData[index].title.indexOf('（')
        this.currentImgaeIndex = index;
        this.currentImgaeInSection = ind;
        this.setState({
          showDamageModalView: true
        })
      } else {
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
                this.partyInfoData[ind].carPhotoData[index].imageURL = source;
                let temp = JSON.parse(JSON.stringify(this.partyInfoData[ind].carPhotoData))
                this.partyInfoData[ind].carPhotoData = temp
                this.setState({
                  refresh: true
                })
            }
        });
      }
    }
  }
  //重拍
  reTakePhoto(){
    this.partyInfoData[this.currentImgaeInSection].carPhotoData[this.currentImgaeIndex].imageURL = '';
    let temp = JSON.parse(JSON.stringify(this.partyInfoData[this.currentImgaeInSection].carPhotoData));
    this.partyInfoData[this.currentImgaeInSection].carPhotoData = temp;
    this.setState({
      showBigImage: false
    })
  }
  //删除照片
  deletePhoto(){
    this.partyInfoData[this.currentImgaeInSection].carPhotoData.splice(this.currentImgaeIndex,1)
    let temp = JSON.parse(JSON.stringify(this.partyInfoData[this.currentImgaeInSection].carPhotoData));
    this.partyInfoData[this.currentImgaeInSection].carPhotoData = temp;
    for (var i = 7; i < this.partyInfoData[this.currentImgaeInSection].carPhotoData.length-1; i++) {
        this.partyInfoData[this.currentImgaeInSection].carPhotoData[i].title = `其它现场照片${i-6}`
    }
    this.setState({
      showBigImage: false
    })
  }
  //取证完成
  commit() {
    for (var i = 0; i < this.partyInfoData.length; i++) {
      for (var j = 0; j < 6; j++) {
        if (!this.partyInfoData[i].carPhotoData[j].imageURL) {
          Toast.showShortCenter(`当事人【${this.partyInfoData[i].carNum}】的 “${this.partyInfoData[i].carPhotoData[j].title}”必须拍摄`);
          return
        }
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
  renderItem(item,index,ind) {
    let innerImgae;
    if (index == this.partyInfoData[ind].carPhotoData.length - 1) {
      innerImgae = <Text style={{alignSelf:'center',color:formRightText,fontSize:50}}>+</Text>
    } else {
      if (!item.imageURL) {
        innerImgae = <Image style={{alignSelf:'center'}} source={require('./image/personal_camera.png')}/>
      } else {
        innerImgae = null
      }
    }
    return (
      <TouchableHighlight style={{marginLeft:this.rowMargin,marginBottom:15}} underlayColor={'transparent'} onPress={() => this.takePhoto(item,index,ind)} key={index}>
        <View style={{flex:1}}>
          <Image style={{width: this.rowWH,height: this.rowWH * 0.5,justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}
                 source={item.imageURL ? item.imageURL:null}>
            {innerImgae}
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  renderOnePersonInfo(value,ind){
    return (
      <View style={{flex:1,backgroundColor:'#ffffff',marginTop:10}} key={ind}>
        <View style={{flexDirection:'row',marginTop:10,marginLeft:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>{`当事人【${value.carNum}】`}</Text>
        </View>
        <View style={{marginTop:10,backgroundColor:backgroundGrey,height:1}}></View>
        <View style={{flexDirection:'row',marginTop:10,flexWrap:'wrap'}}>
          {value.carPhotoData.map((value,index) => this.renderItem(value,index,ind))}
        </View>
      </View>
    )
  }
  renderDamageSeleteView(value,index){
    let selBorderColor = value.isSel ? mainBule : backgroundGrey
    let selFontColor = value.isSel ? mainBule : formRightText
    return (
      <TouchableHighlight style={{borderColor:selBorderColor, borderWidth:1,borderRadius:5,paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:5,marginTop:15,marginLeft:10}} key={index} onPress={() => {
        for (var i = 0; i < this.carDamageData.length; i++) {
          this.carDamageData[i].isSel = (index == i)
        }
        this.setState({
          refresh:true
        })
      }} underlayColor='transparent'>
          <Text style={{fontSize:16,color:selFontColor}}>{value.name}</Text>
      </TouchableHighlight>
    )
  }
  renderDamageModalView(){
    return (
      <View>
        <Modal animationType="none" transparent={true} visible={this.state.showDamageModalView} onRequestClose={() => {}}>
          <TouchableHighlight onPress={() => this.setState({showDamageModalView:false})} style={styles.modalContainer} underlayColor='transparent'>
            <View style={{backgroundColor:'#ffffff',alignSelf:'center',marginLeft:30,marginRight:30,borderRadius:10}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',padding:20}}>
                 {this.carDamageData.map((value,index) => this.renderDamageSeleteView(value,index))}
              </View>
              <View style={{height:1,backgroundColor:backgroundGrey}}></View>
              <TouchableHighlight style={{paddingVertical:10,justifyContent:'center'}} underlayColor='transparent' onPress={()=>{
                for (var i = 0; i < this.carDamageData.length; i++) {
                  if (this.carDamageData[i].isSel) {
                    this.partyInfoData[this.currentImgaeInSection].carPhotoData[this.currentImgaeIndex].title = this.carDamageData[i].name;
                  }
                  this.carDamageData[i].isSel = false
                }
                this.setState({
                  showDamageModalView: false
                })
              }}>
                <Text style={{color:mainBule,fontSize:15,alignSelf:'center'}}>确定</Text>
              </TouchableHighlight>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={{flex:1}}
                  showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:10}}>
          <Text style={{fontSize:13,color:'#717171',marginLeft:15}}>
            请按以下要求采集事故现场照片
          </Text>
        </View>
        {this.partyInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
        <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
          <XButton title='下一步' onPress={() => this.commit()} style={{backgroundColor:'#267BD8',borderRadius:20}}/>
        </View>
        <View>
          <Modal animationType="none" transparent={true} visible={this.state.showBigImage} onRequestClose={() => {}}>
            <TouchableOpacity onPress={() => this.setState({showBigImage:false})} style={styles.modalContainer} underlayColor={'#ffffff'}>
              <Image source={this.currentImgae} style={{width:W,height:W * 0.7,alignSelf:'center'}}/>
              <View style={{marginLeft:15,marginBottom:20,marginTop:100,flexDirection:'row'}}>
                <XButton title={'重拍'} onPress={() => this.reTakePhoto()} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
                <XButton title={'删除'} onPress={() => this.deletePhoto()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}} disabled={this.currentImgaeIndex < 7}/>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        {this.renderDamageModalView()}
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});

module.exports.ExploreTakePhotoView = connect()(ExploreTakePhotoView)

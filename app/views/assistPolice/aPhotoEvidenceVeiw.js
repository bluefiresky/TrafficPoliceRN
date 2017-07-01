/**
* 拍照取证页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TouchableHighlight,FlatList,Platform,Alert } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import ImagePicker from 'react-native-image-picker';

class APhotoEvidenceVeiw extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      data: [{'title': '侧前方',imageURL:''},{'title': '侧后方',imageURL:''},{'title': '碰撞部位',imageURL:''},{'title': '其它现场照片',imageURL:''}]
    }
    this.rowNum = 2;
    this.rowMargin = 20;
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
  takePhoto(index){
    if (index == this.state.data.length - 1) {
      if (this.state.data.length == 16) {
        Toast.showShortCenter('您好，照片总数限制15张');
        return
      }
      this.state.data.splice(this.state.data.length - 1,0,{'title': `其它现场照片${this.state.data.length-3}`,imageURL:''});
      let temp = JSON.parse(JSON.stringify(this.state.data))
      this.state.data = temp
      this.setState({
        data: temp
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
  //取证完成
  commit() {
    // for (var i = 0; i < 3; i++) {
    //   if (!this.state.data[i].imageURL) {
    //     Toast.showShortCenter(`【${this.state.data[i].title}】必须拍照`);
    //     return
    //   }
    // }
    let that = this;
    Alert.alert('提示', '请确保拍摄的证件照片清晰完整，提交之后无法修改' ,[{
            text : "再看看",
            onPress : () => {
              console.log('11');
            }
          },{
            text : "确定",
            onPress : () => {
              Alert.alert('提示', '现场证据已留存，请引导当事人将车辆移至路边，及时恢复交通。【确认无误立即挪车】' ,[{
                      text : "返回修改",
                      onPress : () => {
                        console.log('11');
                      }
                    },{
                      text : "继续采集信息",
                      onPress : () => {
                        that.props.navigation.navigate('SelectHandleTypeView');
                      }
                    }])
            }
          }])
  }
  renderItem({item,index}) {
    let innerImgae;
    if (index == this.state.data.length - 1) {
      innerImgae = <Text style={{alignSelf:'center',color:formRightText,fontSize:50}}>+</Text>
    } else {
      if (!item.imageURL) {
        innerImgae = <Image style={{alignSelf:'center'}} source={require('./image/personal_camera.png')}/>
      } else {
        innerImgae = null
      }
    }
    return (
      <TouchableHighlight style={{marginLeft:this.rowMargin,marginBottom:15}} underlayColor={'transparent'} onPress={() => this.takePhoto(index)}>
        <View style={{flex:1}}>
          <Image style={{width: this.rowWH,height: this.rowWH * 0.7,justifyContent:'center',borderColor:'#D4D4D4',borderWidth:1}}
                 source={item.imageURL ? item.imageURL:null}>
                 {innerImgae}
          </Image>
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  render(){
    return(
      <View style={styles.container}>
         <Text style={{fontSize:12,color:formLeftText,padding:15,backgroundColor:'#D4D4D4',lineHeight:20}}>请您在保证自身安全的情况下，单击以下图例并按照图例拍照</Text>
         <View style={{flex:1,marginTop:15,backgroundColor:'#ffffff',marginRight:this.rowMargin}}>
           <FlatList
             keyExtractor={(data,index) => {return index}}
             showsVerticalScrollIndicator={false}
             data={this.state.data}
             numColumns={this.rowNum}
             renderItem={this.renderItem.bind(this)}
           />
         </View>
         <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
           <XButton title={'取证完成'} onPress={() => this.commit()}/>
         </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.APhotoEvidenceVeiw = connect()(APhotoEvidenceVeiw)

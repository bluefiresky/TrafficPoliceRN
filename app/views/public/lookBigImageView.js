/**
* Created by renhanyi on 17/05/02.
* 查看大图
*/
'use strict'
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { W, H , backgroundGrey} from '../../configs/index.js';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform,
  TouchableHighlight
} from 'react-native';
import Swiper from 'react-native-swiper';
import PhotoView from 'react-native-photo-view';
import { XButton } from '../../components/index.js';

class LookBigImageView extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <View style={{marginRight:10}}>
          <TouchableHighlight underlayColor={backgroundGrey}  onPress={()=> {
              navigation.state.params.deleteImage(navigation.state.params.index);
              navigation.goBack()
            }}>
            <Image source={require('./image/personal_icon_delete.png')} style={{width:17,height:19}}/>
         </TouchableHighlight>
        </View>
      )
    }
  }

  constructor(props){
    super(props);
    this.state = {
      refresh: false
    }
  }
  //轮播图
  getImageView(value,index){
    return(
      <View key={index} style={styles.slide}>
        <PhotoView
            source={value}
            resizeMode='contain'
            minimumZoomScale={0.5}
            maximumZoomScale={3}
            androidScaleType="center"
            style={styles.image}/>
      </View>
    )
  }
  render() {
    let { coverImageURLArr, index } = this.props.navigation.state.params;
    return (
      <View style={{flex:1,backgroundColor:'#ffffff'}}>
        <Swiper style={styles.content}
                index={index}
                showsPagination = {true}>
          {coverImageURLArr.map((value,index) => this.getImageView(value,index))}
        </Swiper>
        <View style={{marginLeft:15,marginBottom:20,marginTop:10,flexDirection:'row'}}>
          <XButton title={'重拍'} onPress={() => this.addOtherPhoto()} style={{backgroundColor:'#ffffff',borderRadius:20,width:(W-90)/2,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
          <XButton title={'删除'} onPress={() => this.commit()} style={{backgroundColor:'#267BD8',borderRadius:20,width:(W-90)/2}} textStyle={{color:'#ffffff',fontSize:14}}/>
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  content : {
    flex:1
  },
  image: {
    height:H,
    width:W,
    flex:1,
    marginTop: Platform.OS === 'ios' ? -64 : -44
  },
  slide: {
    flex: 1,
    backgroundColor:'black'
  },
});
module.exports.LookBigImageView = connect()(LookBigImageView)

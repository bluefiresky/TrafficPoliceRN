/**
 * creat by renhanyi
 */
'use strict'
import React, {Component} from 'react';
import {
    StyleSheet,
    Navigator,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Text,
    Platform
} from 'react-native';
import SegmentBtn from './SegmentButton.js';
import { mainBule , userInfoTitleGrey , W, H} from '../../configs/index.js';

export class ScrollerSegment extends Component {
  constructor(props) {
    super(props);
    //segmentBtns
    this.segItems = [];
    //content数据源
    this.contentItems = [];
    //content单个模型
    this.contentObj = {};
    //存储前一个被点击Btn
    this.preSegSelectd = 0;
    //scrollview  content宽度
    this.segContentW = 0;
    this.state = {
      //是否处于待添加状态
      isRefresh:false,
    };
  }

  propTypes: {
    //segment数据源
    segDatas: PropTypes.array.isRequired,
    //选择item后方法
    selectItem: PropTypes.func,
    //segment下面的组件
    contentDatas: PropTypes.array.isRequired,
  }

  initBtns(item, i) {
    let btnW;
    if (this.props.segDatas.length<=4) {
      btnW = W / this.props.segDatas.length;
    }
    return (
      <SegmentBtn
        key = {'seg'+i}
        ref = {'segBtn'+i}
        onClick = {this.clickSeg.bind(this,i)}
        title = {item}
        isSel = {(i == 0 ? true : false)}
        width = {btnW}
        />
    )
  }
  selectedSeg(index){
    this.refs['segBtn'+index]._press();
  }
  //处理前一个被选中的btn
  clickSeg(index){
    this.props.onPress(index);
    //处理seg上面的事件
    this.refs['segBtn'+this.preSegSelectd].setBtnSelected(false);
    this.preSegSelectd = index;
    //处理下面content事件
    if (!this.isHasThisContent(index)) {
      this.contentObj[index.toString()] = this.props.contentDatas[index];
      this.setState({
        isRefresh:true,
      })
    }
    //seg滚动
    this.refs['contentScroller'].scrollTo({x: W * index, y: 0, animated: true});
    if (this.segContentW > W) {
      if (index < this.segItems.length / 2) {
        this.refs['segScroller'].scrollTo({x:0 , y: 0, animated: true});
      }else {
        this.refs['segScroller'].scrollTo({x:(this.segContentW -W) , y:1, animated:true});
      }
    }
  }
  //判断是否已经添加这个content
  isHasThisContent(key) {
    if (this.contentObj.hasOwnProperty(key.toString())) {
      return true;
    } else {
      return false;
    }
  }
  //判断对象是否为空
  isOwnEmpty(obj){
      for(var name in obj){
          if(obj.hasOwnProperty(name)){
              return false;
          }
      }
      return true;
  };
  setEmptyView(tag){
    return(
      <View
         style={styles.contentView}
         key={'placeholderView'+tag}
         >
      </View>
    )
  }
  render() {
    //初始化seg数据源
    if (this.segItems.length == 0) {
      var segdatas = this.props.segDatas;
      for (let i = 0; i < segdatas.length; i++) {
        //当前内容界面需要放置的数据源，先放置多个空view后边点击的时候进行替换，占位
          this.contentItems.push(this.setEmptyView(i));
          this.segItems.push(this.initBtns(segdatas[i], i));
      };
    }
    //判断当前contentObj没有数据时直接赋值第一个
    if (this.isOwnEmpty(this.contentObj)) {
      this.contentObj['0'] = this.props.contentDatas[0];
    }

    var allkeys = Object.getOwnPropertyNames(this.contentObj);
    allkeys.sort(function sortArr(m,n){
      return m>n?1:(m<n?-1:0);
    });
    for (let j = 0; j < allkeys.length; j++) {
      let key = allkeys[j];
      let obj2 = this.contentObj[key];
      //进行替换
      this.contentItems[key] = obj2;
    }
    return (
      <View style={styles.container}>
        <ScrollView
            ref = {'segScroller'}
            contentContainerStyle = {styles.contentSegContainer}
            automaticallyAdjustContentInsets = {false}
            showsHorizontalScrollIndicator = {false}
            showsVerticalScrollIndicator = {false}
            horizontal = {true}
            onContentSizeChange = {(contentW, contentH)=>{
              this.segContentW = contentW;
            }}
            bounces = {false}
            centerContent = {true}
            >
            {this.segItems}
        </ScrollView>
        <View style={styles.separator}>
        </View>
        <View style={styles.contentView}>
          <ScrollView
              ref = {'contentScroller'}
              contentContainerStyle = {[styles.contentContainer,{  width:this.props.contentDatas.length * W}]}
              automaticallyAdjustContentInsets = {false}
              showsHorizontalScrollIndicator = {false}
              showsVerticalScrollIndicator = {false}
              horizontal = {true}
              bounces = {false}
              pagingEnabled = {true}
              centerContent = {true}
              scrollEnabled={false}
              >
              {this.contentItems}
          </ScrollView>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  contentSegContainer: {
    flexDirection:'row',
    height:44,
    backgroundColor:'white'
  },
  separator:{
    width:W,
    height:0.5,
    backgroundColor: '#eaeaea',
  },
  contentContainer:{
    flexDirection:'row',
    height:H - 44,
  },
  container:{
    width:W,
    height:H,
    flexDirection:'column',
    justifyContent:'center',
  },
  contentView:{
    width:W,
    height:H - 44,
    flexDirection:'row',
  },
});

/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

let textColor = '#767676';
class CaseDetailsView extends Component {

  static navigationOptions = ({ navigation }) => {
    // let  title = ''
    // if (currentIndex == 0) {
    //   title = '查看认定书';
    // } else if (currentIndex == 1) {
    //   title = '上传案件'
    // } else if (currentIndex == 2) {
    //   title = '继续处理'
    // }
    // return {
    //   headerRight: (
    //     <Text style={{fontSize:15,color:'#ffffff',marginRight:15}} onPress={() => {navigation.navigate('LookConclusionView')}}>{title}</Text>
    //   )
    // }
  }
  constructor(props){
    super(props);
    this.state = {
      data: [{'title': '侧前方',imageURL:''},{'title': '侧后方',imageURL:''},{'title': '碰撞部位',imageURL:''},{'title': '其他现场照片',imageURL:''}]
    }
    this.rowNum = 3;
    this.rowMargin = 10;
    this.rowWH = (W - (this.rowNum + 1) * this.rowMargin) / this.rowNum;
    this.carInfoData = ['甲方', '乙方','丙方'];
  }
  renderItem({item,index}) {
    return (
      <View style={{marginLeft:this.rowMargin,marginBottom:15}}>
        <Image style={{width: this.rowWH,height: this.rowWH,backgroundColor:'green'}}
               source={this.state.data[index].imageURL ? this.state.data[index].imageURL:null} />
        <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.title}</Text>
      </View>
    )
  }
  renderRowItem(title,value){
    return (
      <View style={{flexDirection:'row',marginLeft:15,marginTop:10,marginBottom:10}}>
        <Text style={{fontSize:13,color:formLeftText}}>{title}</Text>
        <Text style={{fontSize:13,color:formLeftText}}>{value}</Text>
      </View>
    )
  }
  renderOnePersonInfo(value,index){
    return (
      <View style={{marginTop:10,backgroundColor:'#ffffff'}} key={index}>
        <View style={{flexDirection:'row',marginLeft:15,paddingTop:10,paddingBottom:10}}>
          <View style={{width:2,height:15,backgroundColor:'blue',alignSelf:'center'}}></View>
          <Text style={{fontSize:15,color:formLeftText,marginLeft:10,alignSelf:'center'}}>{`${value}当事人`}</Text>
        </View>
        <View style={{width:W,height:1,backgroundColor:backgroundGrey}}></View>
        {this.renderRowItem('姓名：','哈哈')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('联系方式：','13876543267')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('驾驶证号：','7464890864')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('车牌号：','京A12345')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('交通方式：','驾驶小型轿车')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('保险公司：','太平洋')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('保单号：','N298432647236472')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('保险到期日：','2017年2月8日')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        <View style={{marginLeft:40,marginRight:40,marginTop:10,marginBottom:10,flexDirection:'row'}}>
          <View style = {{justifyContent:'center'}}>
            <Image style={{width:(W-120)/2,height:(W-120)/3,backgroundColor:'blue'}}/>
            <Text style={{fontSize:12,color:textColor,marginTop:10,alignSelf:'center'}}>驾驶证</Text>
          </View>
          <View style={{justifyContent:'center',marginLeft:40}}>
            <Image style={{width:(W-120)/2,height:(W-120)/3,backgroundColor:'blue'}}/>
            <Text style={{fontSize:12,color:textColor,marginTop:10,alignSelf:'center'}}>行驶证</Text>
          </View>
        </View>
      </View>
    )
  }
  //下一步
  gotoNext(){
    this.props.navigation.navigate('LookConclusionView');
  }
  renderHeader(){
    return (
      <View style={{marginTop:10, backgroundColor:'#ffffff'}}>
        {this.renderRowItem('事故时间：','2017-06-03 18:27')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('天气：','晴')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('事故地点：','北京市朝阳区')}
        <View style={{width:W,height:1,backgroundColor:backgroundGrey,marginLeft:15}}></View>
        {this.renderRowItem('事故照片：','')}
        <View style={{marginRight:this.rowMargin,marginTop:10}}>
          <FlatList
            keyExtractor={(data,index) => {return index}}
            showsVerticalScrollIndicator={false}
            data={this.state.data}
            numColumns={this.rowNum}
            renderItem={this.renderItem.bind(this)}
          />
        </View>
      </View>
    )
  }
  render(){
    return(
      <ScrollView style={styles.container}
                   showsVerticalScrollIndicator={false}>
        {this.renderHeader()}
        {this.carInfoData.map((value,index) => this.renderOnePersonInfo(value,index))}
        <View style={{marginLeft:15,marginBottom:10,marginTop:10}}>
          <XButton title='查看交通事故认定书' onPress={() => this.gotoNext()}/>
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

module.exports.CaseDetailsView = connect()(CaseDetailsView)

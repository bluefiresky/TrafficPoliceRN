/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,FlatList } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */

class SelectCityView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
    this.data = [{pro:'河北省',city:['北京','呼和浩特','呼和浩特','呼和浩特','呼和浩特','呼和浩特','呼和浩特']},
                 {pro:'广东省',city:['天津','呼和浩特','呼和浩特','呼和浩特','呼和浩特','呼和浩特','呼和浩特']}];
  }
  renderOneCity(value,index,ind) {
    let selBorderColor = value.isSel ? mainBule : backgroundGrey
    let selFontColor = value.isSel ? mainBule : formRightText
    return (
      <TouchableHighlight style={{borderColor:selBorderColor, borderWidth:1,borderRadius:5,paddingTop:5,paddingBottom:5,marginTop:15,marginLeft:15,width:(W-90)/3}} key={index} onPress={() => {
        let selectCity = this.data[ind].city[index];
        this.props.navigation.state.params.selData(`${selectCity}-${this.props.navigation.state.params.selCompany}`)
        this.props.navigation.goBack(global.stackKeys.SelectInInsuranceCompanyView)
      }} underlayColor='transparent'>
          <Text style={{fontSize:14,color:selFontColor,alignSelf:'center'}} numberOfLines={1}>{value}</Text>
      </TouchableHighlight>
    )
  }
  renderOnePro(value,ind){
    return (
      <View style={{marginTop:15}} key={ind}>
        <Text style={{fontSize:15,color:formLeftText,marginLeft:15}}>
          {`${value.pro}：`}
        </Text>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
           {value.city.map((value,index) => this.renderOneCity(value,index,ind))}
        </View>
      </View>
    )
  }
  render(){
    return(
      <View style={styles.container}>
        <View style={{paddingVertical:10,backgroundColor:backgroundGrey}}>
          <Text style={{marginLeft:15,color:'#707070'}}>
            请选择当事人保险报案城市
          </Text>
        </View>
        <ScrollView style={{flex:1,backgroundColor:'#ffffff'}}
                    showsVerticalScrollIndicator={false}>
           <Text style={{marginTop:10,marginLeft:15,fontSize:15,color:formLeftText}}>
             当前定位城市：
           </Text>
           <View style={{backgroundColor:'#298FE2',paddingVertical:10,marginLeft:15,width:100,marginTop:10,borderRadius:10}}>
             <Text style={{fontSize:15,color:'#ffffff',alignSelf:'center'}}>
               北京市
             </Text>
           </View>
           {this.data.map((value,index) => this.renderOnePro(value,index))}
        </ScrollView>
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

module.exports.SelectCityView = connect()(SelectCityView)

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
  }
  renderOneCity(value,index,ind) {
    let { data } = this.props.navigation.state.params
    return (
      <TouchableHighlight style={{borderColor:backgroundGrey, borderWidth:1,borderRadius:5,paddingTop:5,paddingBottom:5,marginTop:15,marginLeft:15,width:(W-90)/3}} key={index} onPress={() => {
        this.props.navigation.state.params.selData({showData:`${value.name}-${data.name}`,insurecode:data.code,citycode:value.code})
        this.props.navigation.goBack(global.stackKeys.SelectInInsuranceCompanyView)
      }} underlayColor='transparent'>
          <Text style={{fontSize:14,color:formRightText,alignSelf:'center'}} numberOfLines={1}>{value.name}</Text>
      </TouchableHighlight>
    )
  }
  renderOnePro(value,ind){
    return (
      <View style={{marginTop:15,marginBottom:10}} key={ind}>
        <Text style={{fontSize:15,color:formLeftText,marginLeft:15}}>
          {`${value.name}：`}
        </Text>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
           {value.citylist.map((value,index) => this.renderOneCity(value,index,ind))}
        </View>
      </View>
    )
  }
  render(){
    let { data } = this.props.navigation.state.params
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
           <TouchableHighlight style={{backgroundColor:'#298FE2',paddingTop:5,paddingBottom:5,marginLeft:15,width:(W-90)/3,marginTop:10,borderRadius:5}} underlayColor='#298FE2' onPress={()=>{
             this.props.navigation.state.params.selData({showData:`${global.personal.cityName}-${data.name}`,insurecode:data.code,citycode:''})
             this.props.navigation.goBack(global.stackKeys.SelectInInsuranceCompanyView)
           }}>
             <Text style={{fontSize:15,color:'#ffffff',alignSelf:'center'}}>
               {global.personal.cityName}
             </Text>
           </TouchableHighlight>
           {data.provincelist.map((value,index) => this.renderOnePro(value,index))}
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

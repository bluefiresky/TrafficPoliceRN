/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,SectionList } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import SignatureCapture from 'react-native-signature-capture'
import AlphabetListView from 'react-native-alphabetlistview';
import zgrb from './image/zgrb.png'
import tpy from './image/tpy.png'
import zgpa from './image/zgpa.png'
import zgrs from './image/zgrs.png'
import zhbx from './image/zhbx.png'
import ygbx from './image/ygbx.png'
var sections = [{"key": "A",data:[{title:'安邦财产保险股份有限公司',index:23},{title:'安诚财产保险股份有限公司',index:16},{title:'安华农业保险股份有限公司',index:26},{title:'安盛天平财产保险股份有限公司',index:32}]},
                {"key": "B",data:[{title:'北京保险行业协会',index:37},{title:'渤海财产保险股份有限公司',index:33}]},
                {"key": "C",data:[{title:'长安责任保险股份有限公司',index:1},{title:'长江财产保险股份有限公司',index:35}]},
                {"key": "D",data:[{title:'东京海上日动火灾保险(中国)有限公司',index:34},{title:'都邦财产保险股份有限公司',index:40}]},
                {"key": "F",data:[{title:'富德财产保险股份有限公司',index:15}]},
                {"key": "G",data:[{title:'国泰财产保险有限责任公司',index:4}]},
                {"key": "H",data:[{title:'合众财产保险股份有限公司',index:41},{title:'华安财产保险股份有限公司',index:39},{title:'华农财产保险股份有限公司',index:0},{title:'华泰财产保险股份有限公司',index:6}]},
                {"key": "L",data:[{title:'利宝保险有限公司',index:24}]},
                {"key": "M",data:[{title:'民安保险(中国)有限公司',index:27}]},
                {"key": "R",data:[{title:'日本财产保险(中国)有限公司',index:14}]},
                {"key": "S",data:[{title:'三井住友海上火灾保险(中国)有限公司',index:13},{title:'三星财产保险（中国）有限公司',index:18},{title:'史带财产保险股份有限公司',index:42}]},
                {"key": "T",data:[{title:'太平财产保险有限公司',index:8},{title:'泰山财产保险股份有限公司',index:11},{title:'天安保险股份有限公司',index:30}]},
                {"key": "X",data:[{title:'信达财产保险股份有限公司',index:17},{title:'现代财产保险(中国)有限公司',index:21}]},
                {"key": "Y",data:[{title:'阳光财产保险股份有限公司',index:36},{title:'燕赵财产保险股份有限公司',index:9},{title:'英大泰和财产保险股份有限公司',index:38},{title:'永安财产保险股份有限公司',index:2},{title:'永诚财产保险股份有限公司',index:29}]},
                {"key": "Z",data:[{title:'浙商财产保险股份有限公司',index:3},{title:'中煤财产保险股份有限公司',index:5},{title:'中国大地财产保险股份有限公司',index:7},{title:'中国人寿财产保险股份有限公司',index:12},{title:'中国人民财产保险股份有限公司',index:19},{title:'中国太平洋财产保险股份有限公司',index:22},{title:'中国平安财产保险股份有限公司',index:25},{title:'中华联合财产保险股份有限公司',index:28},{title:'中银保险有限公司',index:20},{title:'中意财产保险有限公司',index:10},{title:'紫金财产保险股份有限公司',index:31}]}];
class SelectInInsuranceCompanyView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
    //常用数据
    this.commonData = [{code:'110000003001',imageURL:zgrb},{code:'110000003003',imageURL:tpy},{code:'110000003005',imageURL:zgpa},{code:'110000003043',imageURL:zgrs},{code:'110000003007',imageURL:zhbx},{code:'110000003033',imageURL:ygbx}];
    global.stackKeys.SelectInInsuranceCompanyView = props.navigation.state.key;
  }
  componentWillMount(){
    let { insurecitylist } = getStore().getState().insuranceDictionary
    for (var i = 0; i < insurecitylist.length; i++) {
      for (var j = 0; j < this.commonData.length; j++) {
        if (this.commonData[j].code == insurecitylist[i].code) {
          this.commonData[j].data = insurecitylist[i];
        } 
      }
    }
  }
  renderCell(item){
    let { insurecitylist } = getStore().getState().insuranceDictionary
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={()=>{this.props.navigation.navigate('SelectCityView',{selData:this.props.navigation.state.params.selData,data:insurecitylist[item.index]})}}>
        <View style={{flex:1}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#ffffff',paddingVertical:15}}>
            <Text style={{marginLeft:15}}>{item.title}</Text>
            <Image source={require('./image/right_arrow.png')} style={{width:7,height:12,alignSelf:'center',marginRight:15}}/>
          </View>
          <View style={{backgroundColor:backgroundGrey,height:1}}></View>
        </View>
      </TouchableHighlight>
    );
  }
  renderItem({item,index}){
    return (
      <View style={{backgroundColor:'#EFF2F7'}} key={index}>
        {this.renderCell(item)}
      </View>
    );
  }
  renderSectionHeader({ section }){
    return (
      <View style={{backgroundColor:'#EFF2F7',paddingVertical:10}}>
        <Text style={{color:'#7D7D7F',marginLeft:15}}>{section.key}</Text>
      </View>
    );
  }
  renderHearer(){
    let imageW = (W - 2) * 0.5;
    let imageH = imageW * 0.35;
    return (
      <View style={{backgroundColor:backgroundGrey}}>
        <Text style={{marginLeft:15,marginTop:10,marginBottom:10}}>常用</Text>
        <View style={{flexWrap:'wrap',flexDirection:'row'}}>
          {this.commonData.map((value,index) => {
            return(
              <TouchableHighlight onPress={()=>{this.props.navigation.navigate('SelectCityView',{selData:this.props.navigation.state.params.selData,data:value.data})}} underlayColor={'transparent'} key={index}>
                <Image style={{width:imageW,height:imageH,marginLeft:1,backgroundColor:'#ffffff',marginTop:1}} source={value.imageURL} resizeMode='contain'/>
              </TouchableHighlight>
            )
          })}
        </View>
      </View>
    )
  }
  render(){
    return(
      <SectionList
          renderItem={this.renderItem.bind(this)}
          ListHeaderComponent={this.renderHearer.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={sections}
          ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:backgroundGrey,width:W,height:0.5}}></View>)}}
          keyExtractor={(data,index) => {return index}}
          style={styles.container}
          showsVerticalScrollIndicator={false}
        />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});

module.exports.SelectInInsuranceCompanyView = connect()(SelectInInsuranceCompanyView)

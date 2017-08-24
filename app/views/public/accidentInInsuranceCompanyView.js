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
var sections = [
                {"key": "A",data:[{title:'安邦财产保险股份有限公司',code:'110000003025'},{title:'安诚财产保险股份有限公司',code:'110000003045'},{title:'安华农业保险股份有限公司',code:'110000003027'},{title:'安盛天平财产保险股份有限公司',code:'110000003051'},
                  {title:'安联财产保险（中国）有限公司',code:'110000010001'},{title:'安心财产保险有限责任公司',code:'110000010006'},{title:'安信农业保险股份有限公司',code:'110000010026'}]},
                {"key": "B",data:[{title:'渤海财产保险股份有限公司',code:'110000003053'},{title:'北部湾财产保险股份有限公司',code:'110000010004'}]},
                {"key": "C",data:[{title:'长安责任保险股份有限公司',code:'110000003059'},{title:'长江财产保险股份有限公司',code:'110000003077'},{title:'诚泰财产保险股份有限公司',code:'110000010010'}]},
                {"key": "D",data:[{title:'东京海上日动火灾保险(中国)有限公司',code:'110000004001'},{title:'都邦财产保险股份有限公司',code:'110000003035'},{title:'鼎和财产保险股份有限公司',code:'110000010002'}]},
                {"key": "F",data:[{title:'富德财产保险股份有限公司',code:'110000003087'},{title:'富邦财产保险有限公司',code:'110000010011'}]},
                {"key": "G",data:[{title:'国泰财产保险有限责任公司',code:'110000004029'},{title:'国元农业保险股份有限公司',code:'110000010012'}]},
                {"key": "H",data:[{title:'合众财产保险股份有限公司',code:'110000003091'},{title:'华安财产保险股份有限公司',code:'110000003013'},{title:'华农财产保险股份有限公司',code:'110000003037'},{title:'华泰财产保险股份有限公司',code:'110000003017'},
                  {title:'恒邦财产保险股份有限公司',code:'110000010016'},{title:'华海财产保险股份有限公司',code:'110000010017'},{title:'海峡金桥财产保险股份有限公司',code:'110000010022'}]},
                {"key": "J",data:[{title:'锦泰财产保险股份有限公司',code:'110000010013'},{title:'久隆财产保险有限公司',code:'110000010021'},{title:'建信财产保险有限公司',code:'110000010024'}]},
                {"key": "L",data:[{title:'利宝保险有限公司',code:'110000004017'}]},
                {"key": "M",data:[{title:'美亚财产保险有限公司',code:'110000010025'}]},
                {"key": "R",data:[{title:'日本财产保险(中国)有限公司',code:'110000004033'}]},
                {"key": "S",data:[{title:'三井住友海上火灾保险(中国)有限公司',code:'110000004011'},{title:'三星财产保险（中国）有限公司',code:'110000004013'},{title:'史带财产保险股份有限公司',code:'110000003071'}]},
                {"key": "T",data:[{title:'太平财产保险有限公司',code:'110000003019'},{title:'泰山财产保险股份有限公司',code:'110000004602'},{title:'天安保险股份有限公司',code:'110000003009'},{title:'泰康在线财产保险股份有限公司',code:'110000010023'}]},
                {"key": "X",data:[{title:'信达财产保险股份有限公司',code:'110000003067'},{title:'现代财产保险(中国)有限公司',code:'110000004015'},{title:'新疆前海联合财产保险股份有限公司',code:'110000010005'},{title:'鑫安汽车保险股份有限公司',code:'110000010015'}]},
                {"key": "Y",data:[{title:'阳光财产保险股份有限公司',code:'110000003033'},{title:'燕赵财产保险股份有限公司',code:'110000004603'},{title:'英大泰和财产保险股份有限公司',code:'110000003057'},{title:'永安财产保险股份有限公司',code:'110000003015'},
                  {title:'永诚财产保险股份有限公司',code:'110000003029'},{title:'亚太财产保险有限公司',code:'110000003049'},{title:'阳光农业相互保险公司',code:'110000010014'}]},
                {"key": "Z",data:[{title:'浙商财产保险股份有限公司',code:'110000003039'},{title:'中煤财产保险股份有限公司',code:'110000004601'},{title:'中国大地财产保险股份有限公司',code:'110000004501'},{title:'中国人寿财产保险股份有限公司',code:'110000003043'},
                  {title:'中国人民财产保险股份有限公司', code:'110000003001'},{title:'中国太平洋财产保险股份有限公司',code:'110000003003'},{title:'中国平安财产保险股份有限公司',code:'110000003005'},{title:'中华联合财产保险股份有限公司',code:'110000003007'},
                  {title:'中银保险有限公司',code:'110000003047'},{title:'中意财产保险有限公司',code:'110000004503'},{title:'紫金财产保险股份有限公司',code:'110000003073'},{title:'众诚汽车保险股份有限公司',code:'110000010003'},{title:'中国铁路财产保险自保有限公司',code:'110000010007'},{title:'珠峰财产保险股份有限公司',code:'110000010008'},
                  {title:'中航安盟保险有限公司',code:'110000010009'},{title:'中原农业保险股份有限公司',code:'110000010018'},{title:'中路财产保险股份有限公司',code:'110000010019'},{title:'众安在线财产保险股份有限公司',code:'110000010020'}]}
               ];
class AccidentInsuranceCompanyView extends Component {

  constructor(props){
    super(props);
    this.state = {
    }
    //常用数据
    this.commonData = [{title:'中国人民财产保险股份有限公司',code:'110000003001',imageURL:zgrb},{title:'中国太平洋财产保险股份有限公司',code:'110000003003',imageURL:tpy},{title:'中国平安财产保险股份有限公司', code:'110000003005',imageURL:zgpa},
      {title:'中国人寿财产保险股份有限公司', code:'110000003043',imageURL:zgrs},{title:'中华联合财产保险股份有限公司',code:'110000003007',imageURL:zhbx},{title:'阳光财产保险股份有限公司', code:'110000003033',imageURL:ygbx}];
    global.stackKeys.SelectInInsuranceCompanyView = props.navigation.state.key;
  }

  renderCell(item){
    return (
      <TouchableHighlight underlayColor={'transparent'} onPress={()=>{
        this.props.navigation.state.params.returnValue(item)
        this.props.navigation.goBack();
      }}>
        <View style={{flex:1}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#ffffff',paddingVertical:15}}>
            <Text style={{marginLeft:15}}>{item.title}</Text>
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
              <TouchableHighlight onPress={()=>{
                  this.props.navigation.state.params.returnValue(value);
                  this.props.navigation.goBack();
                }}
                underlayColor={'transparent'}
                key={index}>
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
          ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:backgroundGrey,width:W,height:StyleSheet.hairlineWidth}}></View>)}}
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

module.exports.AccidentInsuranceCompanyView = connect()(AccidentInsuranceCompanyView)

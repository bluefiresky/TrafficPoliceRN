/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, InteractionManager } from "react-native";
import { connect } from 'react-redux';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */

const textColor = '#767676';
const ImageW = (W - 3 * 20) / 2;
const ImageH = (220 * ImageW)/340;
const PhotoTypes = {'0':'侧前方','1':'侧后方','2':'碰撞部位','30':'甲方证件照','31':'乙方证件照','32':'丙方证件照'}
const Titles = ['甲方', '乙方', '丙方'];

const testSign = "iVBORw0KGgoAAAANSUhEUgAABTYAAAJuCAYAAACKUF0sAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAABxpRE9UAAAAAgAAAAAAAAE3AAAAKAAAATcAAAE3AABNvtn+CO0AAEAASURBVHgB7N2Jdes4kCjQyUxJTD4K7Yf2fsEDqrWLBIr79TlsyxIJFC4WqmD59f/8jy8CBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAEChxD49+/fZepxiIZrBAECBAgQIECAAAECBAgQIECAAAEC2xK426i8xuO/43//93//Xzki0n8Zx1BeqWtbrRcNAQIECBAgQIAAAQIECBAgQIAAAQKbFiibinFcy5G5aRmNnrz5WWLYNJbgCBAgQIAAAQIECBAgQIAAAQIECBBYViA2DS9l47Aca29gRsu/bnrW+JYFUhsBAgQIECBAgAABAgQIECBAgAABAusKxOblpWxglmPrm5gh9XaTs8S+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…IDAzQUcat48AQyfAAECBAgQIECAAAECBAgQIECAwNkEHGqebcbES4AAAQIECBAgQIAAAQIECBAgQODmApmHmuU/OhTtPW5OavgECBAgQIAAAQIECBAgQIAAAQIECGwpkHmoWdvaMlxtEyBAgAABAgQIECBAgAABAgQIECBwd4Hyl5XlLyzDofm/gO5Q8+7ZZPwECBAgQIAAAQIECBAgQIAAAQIEDhAoh5z18bX0sLPcd0DIuiRAgAABAgQIECBAgAABAgQIECBAgMBngdfDzvcDz3jv6/NdXiVAgAABAgQIECBAgAABAgQIECBAgEBnAvWw019pdjYvwiFAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECAwKfD/AeWJbF+JwkR9AAAAAElFTkSuQmCC"

const SignW = (W - 30);
const SignH = (SignW * W)/H;

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
      data: [{'title': '侧前方',imageURL:''},{'title': '侧后方',imageURL:''},{'title': '碰撞部位',imageURL:''},{'title': '其他现场照片',imageURL:''}],
      loading: false,
      button1Text:null,
      button2Text:null,
      pageFlag:null,
      pageUrl:null,
      handleWay:null,
    }

    this.type = 0;  // 1 历史案件; 2 未上传案件
    this.basic = null;
    this.photoList = null;
    this.personList = null;
    this.signList = null;
    this.factAndResponsibility = null; // 事故事实及责任
    this.compensationAndResult = null;  // 损害赔偿及调解结果
  }

  componentDidMount(){
    this.setState({loading: true});
    InteractionManager.runAfterInteractions(() => {
      let { taskNo, info } = this.props.navigation.state.params;
      if(taskNo){
        /** 历史案件详情 **/
        this.props.dispatch( create_service(Contract.POST_ACCIDENT_DETAILS, {taskNo}))
          .then( res => {
            let { accidentTime, weather, accidentAddress, accidentPhotos, accidentPersons, accidentFact, conciliationResult, pageFlag, pageUrl } = res;
            this.type = 1;
            this.basic = {accidentTime, weather, address:accidentAddress};

            this.photoList = [];
            for(let i = 0; i < accidentPhotos.length; i++){
              let p = accidentPhotos[i];
              this.photoList.push({photoData:p.photoUrl, photoType:p.photoTypeName})
            }

            this.personList = [];
            for(let i = 0; i < accidentPersons.length; i++){
              let { name, phone, driverNum, licensePlateNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, driverUrl, drivingUrl} = accidentPersons[i];
              this.personList.push({name, phone, licensePlateNum, driverNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, driverUrl:{uri:driverUrl}, drivingUrl:driverUrl?{uri:driverUrl}:null/*行驶证url**/})
            }

            this.factAndResponsibility = accidentFact;
            this.compensationAndResult = accidentFact;

            let bl = (pageFlag === '01')?'认定书':'协议书';
            this.setState({loading: false, button1Text:`查看交通事故${bl}`, button2Text:'保险报案', pageFlag, pageUrl})
        })
      }else if(info){
        /*  本地待上传详情  **/
        let { accidentTime, weather, address, photo, person, credentials, sign, conciliation, handleWay } = info;
        this.type = 2;
        this.basic = {accidentTime, weather:this._convertWeather(weather), address};

        this.photoList = photo;
        for(let i = 0; i < photo.length; i++){
          let p = photo[i];
          this.photoList.push({photoData:'data:image/png;base64,'+p.photoData, photoType:this._convertPhotoType(p.photoType)})
        }

        this.personList = [];
        for(let i = 0; i < person.length; i++){
          let { name, phone, driverNum, licensePlateNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate } = person[i];
          let { photoData, photoType } = credentials[i];
          this.personList.push({name, phone, driverNum, licensePlateNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, driverUrl:{uri: 'data:image/png;base64,'+photoData}, drivingUrl:null})
        }

        this.signList = sign;
        this.factAndResponsibility = this._convertInfoToAccidentContent(person);
        this.compensationAndResult = conciliation?conciliation : ' ';

        this.setState({loading: false, button1Text:'查看离线协议书', button2Text:'上传案件', handleWay})
      }
    })
  }

  renderItem({item,index}) {
    return (
      <View style={{marginBottom:15, alignItems: 'center', paddingLeft: 10, paddingRight: 10}} underlayColor={'transparent'} onPress={() => this.takePhoto(item,index)}>
        <Image source={{uri:item.photoData}} style={{width: ImageW, height: ImageH, justifyContent:'center', alignItems: 'center'}} />
        <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.photoType}</Text>
      </View>
    )
  }

  renderRowItem(title,value){
    return (
      <View style={{flexDirection:'row',paddingVertical:3,marginLeft:12}}>
        <Text style={{fontSize:16,color:textColor, width:100}}>{title}</Text>
        <Text style={{fontSize:16,color:textColor}} numberOfLines={1} >{value}</Text>
      </View>
    )
  }
  renderOnePersonInfo(person, index){
    return (
      <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}} key={index}>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>{`${Titles[index]}当事人`}</Text>
        </View>
        {this.renderRowItem('姓名：', person.name)}
        {this.renderRowItem('联系方式：', person.phone)}
        {this.renderRowItem('驾驶证号：', person.driverNum)}
        {this.renderRowItem('车牌号：', person.licensePlateNum)}
        {this.renderRowItem('交通方式：', person.carType)}
        {this.renderRowItem('保险公司：', person.insureCompanyName)}
        {this.renderRowItem('保单号：', person.carInsureNumber)}
        {this.renderRowItem('保险到期日：', person.carInsureDueDate)}

        <View style={{marginVertical:10, flexDirection:'row', justifyContent:'center'}}>
          <View style = {{alignItems:'center'}}>
            <Image source={person.driverUrl} style={{width:ImageW,height:ImageH}}/>
            <Text style={{fontSize:12,color:textColor,marginTop:10}}>{person.drivingUrl?'驾驶证':'证件照'}</Text>
          </View>
          {
            !person.drivingUrl? null :
            <View style={{alignItems:'center',marginLeft:20}}>
              <Image source={person.drivingUrl} style={{width:ImageW,height:ImageH}}/>
              <Text style={{fontSize:12,color:textColor,marginTop:10,alignSelf:'center'}}>行驶证</Text>
            </View>
          }
        </View>
      </View>
    )
  }
  //下一步
  gotoNext(){
    this.props.navigation.navigate('LookConclusionView');
  }

  renderBasic(basic){
    if(!basic) return null;

    return (
      <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>基本信息</Text>
        </View>
        {this.renderRowItem('事故时间：', basic.accidentTime)}
        {this.renderRowItem('天气：', basic.weather)}
        {this.renderRowItem('事故地点：', basic.address)}

      </View>
    )
  }

  renderFactAndResponsibility(content){
    if(!content) return null;

    return (
      <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>事故事实及责任</Text>
        </View>
        <Text style={{color:textColor, fontSize:16}}>{'   '+content}</Text>
      </View>
    )
  }

  renderConciliation(content){
    if(!content) return null;

    return (
      <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>损害赔偿及调解结果</Text>
        </View>
        <Text style={{color:textColor, fontSize:16}}>{'      '+content}</Text>
      </View>
    )
  }

  renderPhotos(photos){
    if(!photos) return null;

    return(
      <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'white'}}>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>现场照片</Text>
        </View>
        <FlatList
          keyExtractor={(data,index) => {return index}}
          showsVerticalScrollIndicator={false}
          data={photos}
          numColumns={2}
          renderItem={this.renderItem.bind(this)}
          extraData={this.state}
        />
      </View>
    )
  }

  renderSignList(signList){
    if(!signList) return null;

    return(
      <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
        <View style={{flexDirection:'row', marginVertical:10}}>
          <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
          <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>当事人签字</Text>
        </View>
        {signList.map((sign, index) => {
          let p = this.personList[index];
          let text = Titles[index]+'当事人 - '+p.name+`(${p.licensePlateNum})`
          return(
            <View key={index}>
              <Text style={{fontSize:14, color:textColor, marginTop:10}}>{text}</Text>
              <Image source={{uri:'data:image/png;base64,'+sign.signData}} style={{width:SignW, height:SignH, alignSelf: 'center', resizeMode:'contain'}} />
            </View>
          )
        })}
      </View>
    )
  }

  render(){
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.renderBasic(this.basic)}
          {this.renderPhotos(this.photoList)}
          {this.personList? this.personList.map((value,index) => this.renderOnePersonInfo(value,index)) : null}
          {this.renderFactAndResponsibility(this.factAndResponsibility)}
          {this.renderConciliation(this.compensationAndResult)}
          {this.renderSignList(this.signList)}

          {
            this.type === 0? null :
            <View style={{backgroundColor:'white', paddingVertical:50, alignItems:'center'}}>
              <XButton title={this.state.button1Text} onPress={() => this.gotoNext(1)} style={{backgroundColor:'#267BD8',borderRadius:20}} textStyle={{color:'#ffffff',fontSize:14}}/>
              <View style={{height: 30}} />
              <XButton title={this.state.button2Text} onPress={() => this.gotoNext(2)} style={{backgroundColor:'#ffffff',borderRadius:20,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
            </View>
          }
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true} />
      </View>

    );
  }

  /** Private */
  _convertInfoToAccidentContent(basic, person){
    if(!basic) return '';

    let num = person.length;
    let content = '';
    if(num === 1){
      let p = person[0];
      content = `    ${basic.accidentTime}, ${p.name}(驾驶证号:${p.driverNum})驾驶车牌号为${p.licensePlateNum}的${p.carType}, 在${basic.address}发生交通事故。`
    }else if(num === 2){
      let p1 = person[0];
      let p2 = person[1];
      content = `    ${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}，与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}发生交通事故。`
    }else if(num === 3){
      let p1 = person[0];
      let p2 = person[1];
      let p3 = person[2];
      content = `    ${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}，及${p3.name}(驾驶证号:${p3.driverNum})驾驶车牌号为${p3.licensePlateNum}的${p3.carType}发生交通事故。`
    }

    return content;
  }

  /** Private **/
  _convertWeather(code){
    let weatherList = getStore().getState().dictionary.weatherList;
    let name = null;
    for(let i = 0; i < weatherList.length; i++){
      let w = weatherList[i];
      if(w.code == code){
        name = w.name;
        break;
      }
    }
    return name;
  }

  _convertPhotoType(typeCode){
    let code = Number(typeCode);
    if(code < 50){
      return PhotoTypes[typeCode];
    }else{
      return '其他现场照' + String(code-50);
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.CaseDetailsView = connect()(CaseDetailsView)

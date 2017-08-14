/**
* 确认事故信息
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, InteractionManager, Platform, TouchableHighlight, TouchableWithoutFeedback, Modal } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';
import RNFS from 'react-native-fs';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, XButton } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service, getStore } from '../../redux/index.js'; /** 调用api的Action */

const textColor = '#767676';
const ImageW = (W - 3 * 20) / 2;
const ImageH = (220 * ImageW)/340;
const BigImageH = H-200
const PhotoTypes = {'0':'侧前方','1':'侧后方','2':'碰撞部位','30':'甲方证件照','31':'乙方证件照','32':'丙方证件照'}
const DutyTypeList = [{name:'全责',code:'0'},{name:'无责',code:'1'},{name:'同等责任',code:'2'},{name:'主责',code:'3'},{name:'次责',code:'4'}];
const Titles = ['甲方', '乙方', '丙方'];

const SignW = (W - 30);
const SignH = (SignW * W)/H;
const DocumentPath = Platform.select({ android: 'file://', ios: RNFS.DocumentDirectoryPath + '/images/' });

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
      loading: false,
      button1Text:null,
      button2Text:null,
      pageFlag:null,
      pageUrl:null,
      handleWay:null,
      showBigImage:false,
    }

    this.type = 0;  // 1 历史案件; 2 未上传案件
    this.basic = null;
    this.photoList = null;
    this.personList = null;
    this.signList = null;
    this.factAndResponsibility = null; // 事故事实及责任
    this.compensationAndResult = null;  // 损害赔偿及调解结果
    this.handleWay = null;
    this.taskModal = null;    // 事故形体
    this.accidentDes = null;  // 事故情形
    this.personResponbilityList = null;  // 事故责任列表
    this.accidentStatus = null;
    this.currentImage = null;

    this._showBigPhoto = this._showBigPhoto.bind(this);
  }

  componentDidMount(){
    this.setState({loading: true});
    InteractionManager.runAfterInteractions(() => {
      let { taskNo, info } = this.props.navigation.state.params;
      if(taskNo){
        /** 历史案件详情 **/
        this.props.dispatch( create_service(Contract.POST_ACCIDENT_DETAILS, {taskNo}))
          .then( res => {
            if(!res) return;

            let {accidentStatus, accidentTime, weather, accidentAddress, accidentPhotos, accidentPersons, accidentFact, conciliationResult, pageFlag, pageUrl, accidentModalName, accidentDesName, supplementAccidentFact } = res;
            this.type = 1;
            this.accidentStatus = accidentStatus;
            this.basic = {accidentTime:this._convertAccidentTime(accidentTime), weather, address:accidentAddress};

            this.photoList = [];
            for(let i = 0; i < accidentPhotos.length; i++){
              let p = accidentPhotos[i];
              this.photoList.push({photoData:{uri:p.photoUrl, isStatic:true}, photoType:p.photoTypeName})
            }

            this.personList = [];
            this.personResponbilityList = [];
            for(let i = 0; i < accidentPersons.length; i++){
              let { name, phone, driverNum, licensePlateNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, driverUrl, drivingUrl, carDamagedPart, dutyTypeName} = accidentPersons[i];
              this.personList.push({name, phone, licensePlateNum, driverNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, driverUrl:{uri:driverUrl, isStatic:true}, drivingUrl:drivingUrl?{uri:drivingUrl, isStatic:true}:null/*行驶证url**/})
              this.personResponbilityList.push({name, licensePlateNum, carDamagedPart:this._convertDamagedCodeToName(carDamagedPart), dutyName:dutyTypeName})
            }

            this.factAndResponsibility = `\t${accidentFact}${supplementAccidentFact}\n\t${this._convertResponsebilityContent(accidentPersons)}`;
            this.compensationAndResult = conciliationResult;
            this.taskModal = accidentModalName;
            this.accidentDes = accidentDesName;

            let bl = (pageFlag === '02')?'协议书':'认定书';
            this.setState({loading: false, button1Text:`交通事故${bl}`, button2Text:null, pageFlag, pageUrl})
        })
      }else if(info){
        /*  本地待上传详情  **/
        let { id, basic, photo, person, credentials, duty, conciliation, handleWay, taskModal, accidentDes, supplementary } = info;
        global.currentCaseId = id;
        this.type = 2;
        this.handleWay = handleWay;

        this.basic = {accidentTime:basic.accidentTime, weather:this._convertWeather(basic.weather), address:basic.address};

        this.photoList = [];
        for(let i = 0; i < photo.length; i++){
          let p = photo[i];
          this.photoList.push({photoData:{uri:DocumentPath+p.photoData, isStatic:true}, photoType:this._convertPhotoType(p.photoType)})
        }

        this.personList = [];
        this.personResponbilityList = [];
        for(let i = 0; i < person.length; i++){
          let { name, phone, driverNum, licensePlateNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, carDamagedPart } = person[i];
          let { photoData, photoType } = credentials[i];
          this.personList.push({name, phone, driverNum, licensePlateNum, carType, insureCompanyName, carInsureNumber, carInsureDueDate, driverUrl:{uri:DocumentPath+photoData, isStatic:true}, drivingUrl:null})
          this.personResponbilityList.push({name, licensePlateNum, carDamagedPart:this._convertDamagedCodeToName(carDamagedPart), dutyName:this._convertCodeToEntry(duty[i].dutyType, DutyTypeList).name})
        }

        if(duty){
          this.signList = [];
          for(let i=0; i<duty.length; i++){
            let {licensePlateNum, dutyType, signTime, refuseFlag, signData} = duty[i];
            if(refuseFlag === '01'){
              this.signList.push({licensePlateNum, dutyType, signTime, refuseFlag, signData:{uri:DocumentPath+signData, isStatic:true}})
            }else{
              this.signList.push({licensePlateNum, dutyType, signTime, refuseFlag, signData:{uri:'data:image/jpeg;base64,'+signData, isStatic:true}})
            }
          }
        }
        this.factAndResponsibility = `${this._convertInfoToAccidentContent(basic, person)}${supplementary?supplementary:''}\n\t${this._convertResponsebilityContent(person, duty)}`;
        this.compensationAndResult = conciliation?conciliation : ' ';
        if(taskModal){
          this.taskModal = this._convertCodeToEntry(taskModal, getStore().getState().dictionary.formList).name;
        }
        if(accidentDes){
          this.accidentDes = this._convertCodeToEntry(accidentDes, getStore().getState().dictionary.situationList).name;
        }

        let bl, pageFlag;
        if(handleWay === '04'){
          bl = '协议书';
          pageFlag = '02'
        }else{
          bl = '认定书';
          pageFlag = '01';
        }
        this.setState({loading: false, button1Text:`查看离线${bl}`, button2Text:'上传案件', pageFlag, handleWay})
      }
    })
  }

  renderItem({item,index}) {
    return (
      <TouchableHighlight style={{marginBottom:15, alignItems: 'center', paddingLeft: 10, paddingRight: 10}} underlayColor={'transparent'} onPress={() => this._showBigPhoto(item.photoData,index)}>
        <View>
          <Image source={item.photoData} style={{width: ImageW, height: ImageH, justifyContent:'center', alignItems: 'center'}} />
          <Text style={{alignSelf:'center',marginTop:10,color:formLeftText,fontSize:12}}>{item.photoType}</Text>
        </View>
      </TouchableHighlight>
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
        <View style={{flexDirection:'row',paddingVertical:3,marginLeft:12,marginRight:5}}>
          <Text style={{fontSize:16,color:textColor, width:100}}>保险公司：</Text>
          <Text style={{fontSize:16,color:textColor, flex:1}} >{person.insureCompanyName}</Text>
        </View>
        {this.renderRowItem('保单号：', person.carInsureNumber)}
        {this.renderRowItem('保险到期日：', person.carInsureDueDate)}

        <View style={{marginVertical:10, flexDirection:'row', justifyContent:'center'}}>
          <TouchableHighlight style={{alignItems:'center'}} underlayColor={'transparent'} onPress={()=> this._showBigPhoto(person.driverUrl) }>
            <View style = {{alignItems:'center'}}>
              <Image source={person.driverUrl} style={{width:ImageW,height:ImageH}}/>
              <Text style={{fontSize:12,color:textColor,marginTop:10}}>{person.drivingUrl?'驾驶证':'证件照'}</Text>
            </View>
          </TouchableHighlight>
          {
            !person.drivingUrl? null :
            <TouchableHighlight style={{alignItems:'center',marginLeft:20}} underlayColor={'transparent'} onPress={()=> this._showBigPhoto(person.drivingUrl) }>
              <View>
                <Image source={person.drivingUrl} style={{width:ImageW,height:ImageH}}/>
                <Text style={{fontSize:12,color:textColor,marginTop:10,alignSelf:'center'}}>行驶证</Text>
              </View>
            </TouchableHighlight>
          }
        </View>
      </View>
    )
  }
  //下一步
  gotoNext(t){
    let { taskNo, info } = this.props.navigation.state.params;
    if(this.type === 1){ // 历史案件
      if(t === 1){
        if(this.accidentStatus && this.accidentStatus == '8') {
          Toast.showShortCenter('该案件已转现场处理');
        }else{
          let { button1Text, pageUrl } = this.state;
          this.props.navigation.navigate('CommonWebView', {title:button1Text, url:pageUrl})
        }
      }else{
        this.props.navigation.navigate('InsuranceReportPartyInfoView',{taskno:taskNo})
      }
    }else if(this.type === 2){  // 本地案件
      if(t === 1){
        this.props.navigation.navigate('CertificateView', {handleWay:this.state.handleWay, canBack:true});
      }else{
        this.props.navigation.navigate('UploadProgressView', {caseType:1});
      }
    }
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
        <View style={{flexDirection:'row',paddingVertical:3,marginLeft:12,marginRight:15}}>
          <Text style={{fontSize:16,color:textColor, width:100}}>事故地点: </Text>
          <Text style={{fontSize:16,color:textColor, flex:1}} >{basic.address}</Text>
        </View>
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

  renderTaskModalAndAccidentDes(taskModal, accidentDes, personResponbilityList){
    if(!taskModal && !accidentDes && !personResponbilityList) return null;

    return (
      <View>
        <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
          <View style={{flexDirection:'row', marginVertical:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
            <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>事故形态</Text>
          </View>
          <Text style={{color:textColor, fontSize:16, marginLeft:15}}>{taskModal}</Text>
        </View>

        <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
          <View style={{flexDirection:'row', marginVertical:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
            <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>事故情形</Text>
          </View>
          <Text style={{color:textColor, fontSize:16, marginLeft:15}}>{accidentDes}</Text>
        </View>

        <View style={{marginTop:15, paddingHorizontal:15, paddingVertical:10, backgroundColor:'#ffffff'}}>
          <View style={{flexDirection:'row', marginVertical:10}}>
            <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center'}}/>
            <Text style={{fontSize:18,color:formLeftText,marginLeft:10}}>事故责任</Text>
          </View>
          {
            personResponbilityList.map((value, index) => (
              <View key={index} style={{marginHorizontal:15}}>
                {index != 0? <View style={{backgroundColor:'lightgrey', height:1, marginVertical:8}} /> : null}
                <Text style={{color:textColor, fontSize:16}}>{`${value.name}（${value.licensePlateNum}）`}</Text>
                <Text style={{color:textColor, fontSize:16, marginTop:5}}>受损部位:  <Text style={{color:textColor, fontSize:16}}>{value.carDamagedPart}</Text></Text>
                <Text style={{color:textColor, fontSize:16, marginTop:5}}>责任类型:  <Text style={{color:textColor, fontSize:16}}>{value.dutyName}</Text></Text>
              </View>
            ))
          }
        </View>

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
              <Image source={sign.signData} style={{width:SignW, height:SignH, alignSelf: 'center', resizeMode:'contain'}} />
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
          {this._renderHandlewayView(this.state.pageFlag)}

          {this.renderSignList(this.signList)}

          {
            this.type === 0? null :
            <View style={{backgroundColor:'white', paddingVertical:50, alignItems:'center'}}>
              <XButton title={'查看'+this.state.button1Text} onPress={() => this.gotoNext(1)} style={{backgroundColor:'#267BD8',borderRadius:20}} textStyle={{color:'#ffffff',fontSize:14}}/>
              <View style={{height: 30}} />
              {
                !this.state.button2Text? null :
                  this.accidentStatus?
                    (this.accidentStatus && this.accidentStatus == '2') ?
                    <XButton title={this.state.button2Text} onPress={() => this.gotoNext(2)} style={{backgroundColor:'#ffffff',borderRadius:20,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>:null
                  :
                  <XButton title={this.state.button2Text} onPress={() => this.gotoNext(2)} style={{backgroundColor:'#ffffff',borderRadius:20,borderWidth:1,borderColor:'#267BD8'}} textStyle={{color:'#267BD8',fontSize:14}}/>
              }
            </View>
          }
        </ScrollView>
        <ProgressView show={this.state.loading} hasTitleBar={true} />

        <View>
          <Modal animationType="fade" transparent={true} visible={this.state.showBigImage} onRequestClose={() => {}}>
            <TouchableWithoutFeedback onPress={() => this.setState({showBigImage:false})}>
              <View style={styles.modalContainer}>
                <Image source={this.currentImage} style={{width:W,height:BigImageH,resizeMode:'contain'}}/>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

      </View>

    );
  }

  _renderHandlewayView(pageFlag){
    if(pageFlag === '02'){
      return this.renderTaskModalAndAccidentDes(this.taskModal, this.accidentDes, this.personResponbilityList)
    }else{
      return(
        <View>
          {this.renderFactAndResponsibility(this.factAndResponsibility)}
          {this.renderConciliation(this.compensationAndResult)}
        </View>
      )
    }
  }

  /** Private */
  _showBigPhoto(photoData, index){
    console.log(' sjda;jsdlfajldjflasdjf');
    this.currentImage = photoData;
    this.setState({showBigImage:true})
  }

  _convertInfoToAccidentContent(basic, person){
    if(!basic) return '';

    let num = person.length;
    let content = '';
    if(num === 1){
      let p = person[0];
      content = `\t${basic.accidentTime}, ${p.name}(驾驶证号:${p.driverNum})驾驶车牌号为${p.licensePlateNum}的${p.carType}, 在${basic.address}发生交通事故。`
    }else if(num === 2){
      let p1 = person[0];
      let p2 = person[1];
      content = `\t${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}，与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}发生交通事故。`
    }else if(num === 3){
      let p1 = person[0];
      let p2 = person[1];
      let p3 = person[2];
      content = `\t${basic.accidentTime}, ${p1.name}(驾驶证号:${p1.driverNum})驾驶车牌号为${p1.licensePlateNum}的${p1.carType}, 在${basic.address}与${p2.name}(驾驶证号:${p2.driverNum})驾驶车牌号为${p2.licensePlateNum}的${p2.carType}，及${p3.name}(驾驶证号:${p3.driverNum})驾驶车牌号为${p3.licensePlateNum}的${p3.carType}发生交通事故。`
    }

    return content;
  }

  _convertResponsebilityContent(person, duty){
    if(!person) return '';

    let num = person.length;
    let content = '';
    if(duty){
      if(num === 1){
        content = `${person[0].name}应负此次事故的${this._convertCodeToEntry(duty[0].dutyType, DutyTypeList).name}。`
      }else if(num === 2){
        content = `${person[0].name}应负此次事故的${this._convertCodeToEntry(duty[0].dutyType, DutyTypeList).name}，${person[1].name}应负此次事故的${this._convertCodeToEntry(duty[1].dutyType, DutyTypeList).name}。`
      }else if(num === 3){
        content = `${person[0].name}应负此次事故的${this._convertCodeToEntry(duty[0].dutyType, DutyTypeList).name}，${person[1].name}应负此次事故的${this._convertCodeToEntry(duty[1].dutyType, DutyTypeList).name}，${person[2].name}应负此次事故的${this._convertCodeToEntry(duty[2].dutyType, DutyTypeList).name}。`
      }
    }else{
      if(num === 1){
        content = `${person[0].name}应负此次事故的${person[0].dutyTypeName}。`
      }else if(num === 2){
        content = `${person[0].name}应负此次事故的${person[0].dutyTypeName}，${person[1].name}应负此次事故的${person[1].dutyTypeName}。`
      }else if(num === 3){
        content = `${person[0].name}应负此次事故的${person[0].dutyTypeName}，${person[1].name}应负此次事故的${person[1].dutyTypeName}，${person[2].name}应负此次事故的${person[2].dutyTypeName}。`
      }
    }

    return content;
  }

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

  _convertAccidentTime(time){
    if(time) return time.substring(0, time.length - 3);
    return ''
  }

  _convertCodeToEntry(code, array){
    if(!code) return;

    let entry = null;
    for(let i=0,max=array.length; i<max; i++){
      let v = array[i];
      if(v.code == code){
        entry = v;
        break;
      }
    }
    return entry;
  }

  _convertDamagedCodeToName(code){
    if(!code) return '';

    let codeArray = code.split(',');
    let damagedData = getStore().getState().dictionary.damagedList;
    let value = '';
    for(let i = 0; i < codeArray.length; i++){
      value += this._convertCodeToEntry(codeArray[i], damagedData).name + '  '
    }

    return value;
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  },
  modalContainer: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  }
});

module.exports.CaseDetailsView = connect()(CaseDetailsView)

/**
* 当事人信息页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput,TouchableHighlight,Platform,Modal,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText,mainBule } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView, SituationPicker, FormPicker } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { getStore } from '../../redux/index.js';       /** Redux的store */
import { XButton } from '../../components/index.js';  /** 自定义组件 */
import { StorageHelper } from '../../utility/index.js';


const TitleList = ['甲方当事人：', '乙方当事人：', '丙方当事人：']
const DamagedW = (W - 50)/3

class AccidentConditionView extends Component {

  constructor(props){
    super(props);
    this.state = {
      refresh:false,
      showModalView: false,
      currentDamageIndex: -1,
      laoding:false,
      accidentDes:null,  // 事故情形
      taskModal:null,    // 事故形态
    }
    this.accidentFormData = getStore().getState().dictionary.formList;       // 事故情形
    this.accidentCondition = getStore().getState().dictionary.situationList;  // 事故形态

    this.carDamageCodeData = []; // 受损部位code
    this.carDamageNameData = []; // 受损部位name
    this.personDamagedArray = []; // 当前当事人受损部分
    this.person = [];
    this.selectDamagedArray = [];
    this.carDamageData = [];
  }

  componentDidMount(){
    this.setState({loading:true})
    InteractionManager.runAfterInteractions(async () => {
      let info = await StorageHelper.getCurrentCaseInfo();
      this.person = info.person;
      this.person.forEach((p) => {
        let carDamagedPardArray = p.carDamagedPart?p.carDamagedPart.split(','):[];
        this.personDamagedArray.push(carDamagedPardArray)
      })
      console.log(' this.person -->> ', this.person);
      this.carDamageData = getStore().getState().dictionary.damagedList;
      this.carDamageData.forEach((d) => {
        this.carDamageCodeData.push(d.code);
        this.carDamageNameData.push(d.name);
      })
      this.setState({
        loading:false,
        taskModal:this._convertCodeToEntry(info.taskModal, this.accidentCondition),
        accidentDes:this._convertCodeToEntry(info.accidentDes, this.accidentFormData)
      })
    })
  }

  async gotoNext() {
    this.setState({loading: true})
    if(this.state.loading) return;

    let error = null;
    if (!this.state.taskModal) error = `请选择事故形态`;
    if (!this.state.accidentDes) error = `请选择事故情形`;
    if(error){
      this.setState({loading:false});
      Toast.showShortCenter(error);
      return;
    }

    for (let i = 0, max = this.personDamagedArray.length; i < max; i++) {
      let pd = this.personDamagedArray[i];
      let p = this.person[i];
      if(pd.length == 0) {
        Toast.showShortCenter(`请选择${p.name}的车损部位`)
        this.setState({loading:false})
        return
      }
    }

    for(let i = 0, max = this.personDamagedArray.length; i < max; i++) {
      let pd = this.personDamagedArray[i];
      let p = this.person[i];
      p.carDamagedPart = pd.toString();
    }

    let success = await StorageHelper.saveStep5_6_1(this.state.taskModal.code, this.state.accidentDes.code, this.person);
    this.setState({loading:false})
    if(success) this.props.navigation.navigate('AccidentConfirmResponView');
  }

  showDamageDataModal(index){
    this.setState({ showModalView: true, currentDamageIndex: index })
  }
  renderDamageSeleteView(code,index){
    let currentDamagedArray = this.personDamagedArray[this.state.currentDamageIndex];
    if(!currentDamagedArray) return;

    let check = currentDamagedArray.indexOf(code) != -1;
    let selBorderColor =  check? mainBule : backgroundGrey
    let selFontColor = check ? mainBule : formRightText

    return (
      <TouchableHighlight style={{borderColor:selBorderColor, borderWidth:1,borderRadius:5,paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:5,marginTop:15,marginLeft:10}} key={index}
        onPress={() => {
          let i = currentDamagedArray.indexOf(code);
          if(i === -1) currentDamagedArray.push(code);
          else currentDamagedArray.splice(i,1);
          this.setState({refresh:true})}}
        underlayColor='transparent'>
          <Text style={{fontSize:16,color:selFontColor}}>{this.carDamageNameData[index]}</Text>
      </TouchableHighlight>
    )
  }
  renderDamageView(value,index){
    return (
      <View style={{borderColor:mainBule, borderWidth:1,borderRadius:10,width:DamagedW,paddingVertical:5,marginHorizontal:5,alignItems:'center',marginBottom:10}} key={index}>
        <Text style={{fontSize:14,color:mainBule}}>{this._convertDamagedCodeToName(value)}</Text>
      </View>
    )
  }
  renderOneParty(p,index){
    let currentDamagedArray = this.personDamagedArray[index];
    return (
      <View key={index}>
        <View style={{height:40, flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{flex:1, paddingLeft:15, fontSize:13,alignSelf:'center'}}>{`${TitleList[index]+p.name}（${p.licensePlateNum}）`}</Text>
          <TouchableHighlight style={{paddingRight:15,justifyContent:'center'}} onPress={() => this.showDamageDataModal(index,p)} underlayColor='transparent'>
            <Text style={{fontSize:13,color:mainBule}}>
              选择受损部位
            </Text>
          </TouchableHighlight>
        </View>
        {
          (currentDamagedArray.length > 0)?
             <View style={{flexDirection:'row', flexWrap:'wrap', paddingHorizontal:10}}>
              {currentDamagedArray.map((value,index) => this.renderDamageView(value,index))}
             </View>
            :
            null
          }
        <View style={{height:1,backgroundColor:backgroundGrey,marginRight:15}}></View>
      </View>
    )
  }

  renderModalView(){
    return (
      <View>
        <Modal animationType="fade" transparent={true} visible={this.state.showModalView} onRequestClose={() => {}}>
          <TouchableHighlight onPress={() => this.setState({showModalView:false})} style={styles.modalContainer} underlayColor='transparent'>
            <View style={{backgroundColor:'#ffffff',alignSelf:'center',marginLeft:60,marginRight:60,borderRadius:10}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',padding:20}}>
                 {this.carDamageCodeData.map((value,index) => this.renderDamageSeleteView(value,index))}
              </View>
              <View style={{height:1,backgroundColor:backgroundGrey}}></View>
              <TouchableHighlight style={{paddingVertical:10,justifyContent:'center'}} underlayColor='transparent'
                onPress={()=>{ this.setState({ showModalView: false })}}>
                <Text style={{color:mainBule,fontSize:15,alignSelf:'center'}}>选好了</Text>
              </TouchableHighlight>
            </View>
          </TouchableHighlight>
        </Modal>
      </View>
    )
  }
  render(){
    let { accidentDes, taskModal } = this.state;
    return(
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{height:15, width:W}}/>
          <FormPicker label={'本次事故形态'} placeholder={'请选择事故形态'} value={taskModal? taskModal.name:null} onChange={(res)=>{this.setState({taskModal:res})} } data={this.accidentCondition} noBorder={true}/>
          <View style={{height:15, width:W}}/>
          <SituationPicker label={'本次事故情形'} placeholder={'请选择事故情形'} value={accidentDes?accidentDes.name:null} onChange={(res)=>{this.setState({accidentDes:res})}} data={this.accidentFormData} noBorder={true}/>

          <View style={{marginTop:15,backgroundColor:'#ffffff'}}>
            <View style={{flexDirection:'row',backgroundColor:'#ffffff',marginTop:10}}>
              <Image source={require('./image/line.png')} style={{width:2,height:16,alignSelf:'center',marginLeft:15}}/>
              <Text style={{fontSize:15,color:formLeftText,marginLeft:10}}>车辆受损部位</Text>
            </View>
            <View style={{backgroundColor:backgroundGrey,height:1,marginTop:10,marginLeft:15}}></View>
            {this.person.map((p,index) => this.renderOneParty(p,index))}
          </View>

          <XButton title='下一步' onPress={() => {
            this.gotoNext()}
          } style={{backgroundColor:'#267BD8',borderRadius:20,marginVertical:50,alignSelf:'center'}}/>

        </ScrollView>

        {this.renderModalView()}
        <ProgressView show={this.state.loading} hasTitleBar={true} />
      </View>
    );
  }

  /** Private */
  _convertDamagedCodeToName(code){
    let name = null;
    for(let i=0,max=this.carDamageData.length; i<max; i++){
      let cd = this.carDamageData[i];
      if(cd.code == code){
        name = cd.name;
        break;
      }
    }
    return name;
  }

  _convertCodeToEntry(code, array){
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

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  }
});

module.exports.AccidentConditionView = connect()(AccidentConditionView)

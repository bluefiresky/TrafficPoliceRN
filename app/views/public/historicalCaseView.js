/**
* 历史案件页面
*/
import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,Platform,Alert,ActivityIndicator,InteractionManager } from "react-native";
import { connect } from 'react-redux';
import Toast from '@remobile/react-native-toast';

import { W, H, backgroundGrey,formLeftText, formRightText, mainBule, borderColor } from '../../configs/index.js';/** 自定义配置参数 */
import { ProgressView } from '../../components/index.js';  /** 自定义组件 */
import * as Contract from '../../service/contract.js'; /** api方法名 */
import { create_service } from '../../redux/index.js'; /** 调用api的Action */
import { StorageHelper, Utility } from '../../utility/index.js';
import HistoricalCaseCellView from './historicalCaseCellView'

class HistoricalCaseView extends Component {

  static navigationOptions = ({ navigation }) => {
    let { title } = navigation.state.params;
    return {
      title: title
    }
  }

  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0,
      currentType: props.navigation.state.params.type,
      isLoadingMore: false,
      loadingMoreString: '',
      loading: false,
      data: 'default',
    }
    this.height = 0;
    this.currentPage = 1;
    this.totalPage = 0;
    this._onGetData = this._onGetData.bind(this);
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions( () => {
      this._onGetData();
    })
  }
  _renderItem({item,index}) {
    return (
      <HistoricalCaseCellView type={this.state.currentType} rowData={item} key={index} navigation={this.props.navigation} dispatch={this.props.dispatch}/>
    )
  }

  render(){
    let { currentType, data } = this.state;
    console.log(' HistoricalCaseView render and the currentType -->> ', currentType);
    return(
      <View style={{flex:1, backgroundColor: backgroundGrey}}>
        {
          currentType === 3?
            this._renderLoadMoreList(data)
          :
            this._renderList(data)
        }
        <View style={{justifyContent:'center', alignItems:'center', width: W, height: this.state.isLoadingMore?30:0}}>
          <ActivityIndicator animating={this.state.isLoadingMore} color={mainBule}/>
        </View>
        <ProgressView show={this.state.loading} hasTitleBar={true}/>
      </View>
    );
  }

  _renderList(data){
    if(data === 'default') return;
    else if(!data || data.length === 0) return this._renderEmptyView();

    return(
      <View style={{flex: 1}}>
        <FlatList
          keyExtractor={(data,index) => {return index}}
          data={data}
          renderItem={this._renderItem.bind(this)}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:backgroundGrey,width:W,height:10}} />)}}
        />
      </View>
    )
  }

  _renderLoadMoreList(data){
    if(data === 'default') return;
    else if(!data || data.length === 0) return this._renderEmptyView();

    return(
      <View style={{flex: 1}}>
        <FlatList
          ref={(ref) => this.loadMoreRef = ref}
          data={data}
          renderItem={this._renderItem.bind(this)}
          onScroll = {this._onScroll.bind(this)}
          onRefresh = {this._onGetData}
          scrollEventThrottle={5}
          onEndReachedThreshold ={-10}
          refreshing = {false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index }
          ListHeaderComponent={() => <View /> }
          ListFooterComponent={() => <View /> }
          onEndReached = {(info) => console.log('滑动到底部',info)}
          ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:backgroundGrey,width:W,height:10}} />)}}
          onLayout={ event => {
              this.height = event.nativeEvent.layout.height;
              console.log('HistoricalCaseView onLayout layout -->> ', event.nativeEvent.layout);
          }}
        />
      </View>
    )
  }

  _renderEmptyView(){
    return(
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 16, color: formRightText}}>当前没有历史案件</Text>
      </View>
    )
  }

  /** Private **/
  async _onGetData(){
    this.setState({loading: true})
    let data = null;
    if(this.state.currentType === 3){
      let res = await this.props.dispatch( create_service(Contract.POST_ACCIDENTS_SEARCH ,{page:1, pageNum:10}));
      data = res.accidents;
      this.totalPage = res.totalPage;
      this.currentPage = 1;
    }else if(this.state.currentType === 2){
      data = await StorageHelper.getUnCompletedCaseList();
      data.reverse();
    }else if(this.state.currentType === 1){
      data = await StorageHelper.getUnUploadedCaseList();
      data.reverse();
    }
    this.setState({loading: false, data});
  }

  _onScroll(e){
    let { type } = this.props.navigation.state.params;
    if(type != 3) return;

    const {height : contentHeight} = e.nativeEvent.contentSize
    const scrollHeight = e.nativeEvent.contentOffset.y
    const scrollerHeight = this.height
    const distanceFromEnd = contentHeight - (scrollerHeight + scrollHeight)
    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('contentHeight',contentHeight,scrollHeight)
    // console.log('加载更多 and the currentPage -->> ', this.currentPage);
    // console.log('加载更多 and the totalPage -->> ', this.totalPage);

    if(contentHeight >= scrollerHeight) {
      if(Platform.OS === 'ios'){
        if(distanceFromEnd < -60 && distanceFromEnd>-80) {
          // console.log('加载更多 and the isLoadingMore -->> ', this.state.isLoadingMore)
          if (this.state.isLoadingMore === true) return;
          else if(this.currentPage >= this.totalPage) {
            this.setState({isLoadingMore: false})
            return;
          }
          InteractionManager.runAfterInteractions(()=>{ this._loadingMore() })
        }
      }else{
        if (distanceFromEnd < 1) {
          if (this.state.isLoadingMore === true) return;
          else if(this.currentPage >= this.totalPage) {
            this.setState({isLoadingMore: false})
            return;
          }
          InteractionManager.runAfterInteractions(()=>{ this._loadingMore() })
        }
      }
    }
  };

  _loadingMore(){
    this.currentPage += 1;
    this.setState({loadingMoreString:'加载更多……', isLoadingMore:true })
    let self = this;
    this.props.dispatch(create_service(Contract.POST_ACCIDENTS_SEARCH,{page:this.currentPage, pageNum: 10}))
      .then((res)=>{
        console.log(' 第 ' + self.currentPage + ' 页的数据 res -->> ' ,res)
        if(res){
          let { totalPage, accidents } = res;
          self.totalPage = totalPage;
          if(self.currentPage > totalPage){
            self.setState({isLoadingMore: false});
            setTimeout(() => { self.loadMoreRef.scrollToEnd(); }, 500);
          }else{
            let newData = self.state.data.concat(accidents);
            self.setState({data: newData, isLoadingMore: false});
          }
        }
    })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.HistoricalCaseView = connect()(HistoricalCaseView)

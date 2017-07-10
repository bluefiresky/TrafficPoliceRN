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
      data: [1,2,3,4,5]
    }
    this.height = 0;
    this.currentPage = 1;
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions( () => {
      this.props.dispatch( create_service(Contract.POST_ACCIDENTS_SEARCH ,{page:this.currentPage, pageNum:10}))
        .then( res => {
          console.log(' HistoricalCaseView and the componentDidMount res -->> ', res);
      })
    })
  }

  _renderItem({item,index}) {
    return (
      <HistoricalCaseCellView rowData={item} key={index} navigation={this.props.navigation}/>
    )
  }

  render(){
    let { currentType, data } = this.state;

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
        <ProgressView show={this.state.loading} />
      </View>
    );
  }

  _renderList(data){
    return(
      <View style={{flex: 1}}>
        <FlatList
          keyExtractor={(data,index) => {return index}}
          data={data}
          renderItem={this._renderItem.bind(this)}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:borderColor,width:W,height:1}} />)}}
        />
      </View>
    )
  }

  _renderLoadMoreList(data){
    return(
      <View style={{flex: 1}}>
        <FlatList
          ref={(ref) => this.loadMoreRef = ref}
          data={data}
          renderItem={this._renderItem.bind(this)}
          onScroll = {this._onScroll.bind(this)}
          onRefresh = {this._onRefresh}
          scrollEventThrottle={5}
          onEndReachedThreshold ={-10}
          refreshing = {false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index }
          ListHeaderComponent={() => <View /> }
          ListFooterComponent={() => <View /> }
          onEndReached = {(info) => console.log('滑动到底部',info)}
          ItemSeparatorComponent={()=>{return(<View style={{backgroundColor:borderColor,width:W,height:1}} />)}}
          onLayout={ event => {
              this.height = event.nativeEvent.layout.height;
              console.log('HistoricalCaseView onLayout layout -->> ', event.nativeEvent.layout);
          }}
        />
      </View>
    )
  }

  /** Private **/
  _onRefresh(){

  }

  _onScroll(e){
    const {height : contentHeight} = e.nativeEvent.contentSize
    const scrollHeight = e.nativeEvent.contentOffset.y
    const scrollerHeight = this.height
    const distanceFromEnd = contentHeight - (scrollerHeight + scrollHeight)
    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('contentHeight',contentHeight,scrollHeight)
    if(contentHeight >= scrollerHeight) {
      if(Platform.OS === 'ios'){
        if(distanceFromEnd < -60 && distanceFromEnd>-80) {
          console.log('加载更多 and the isLoadingMore -->> ', this.state.isLoadingMore)
          if (this.state.isLoadingMore === true) return;
          InteractionManager.runAfterInteractions(()=>{ this._loadingMore() })
        }
      }else{
        if (distanceFromEnd < 1) {
          if (this.state.isLoadingMore === true) return;
          InteractionManager.runAfterInteractions(()=>{ this._loadingMore() })
        }
      }
    }
  };

  _loadingMore(){
    this.currentPage += 1;
    this.setState({loadingMoreString:'加载更多……', isLoadingMore:true })
    console.log('加载的页数',this.currentPage);
    let self = this;
    setTimeout(()=>{
      if(this.currentPage === 2 ){
        self.setState({data:[1,2,3,4,5,6,7,8,9,10], isLoadingMore: false})
      }
      if(self.currentPage === 3){
        self.setState({loadingMoreString:'没有更多了', isLoadingMore: false})
        setTimeout(() => {
          self.loadMoreRef.scrollToEnd();
        },1000)

      }
    }, 3000)
    // this.props.dispatch(create_service(Contract.POST_ACCIDENTS_SEARCH,{page:this.currentPage, pageNum: 10}))
    //   .then((res)=>{
    //     this.setState({data: [1,2,3,4,5,6,7,8,9,10], loadingMoreString: '', isLoadingMore: false})
    //     // console.log('第二页数据',res)
    //     // let newData = []
    //     // if (this.state.mydata.length === res.count){
    //     //   console.log('没有更多数据了')
    //     //   this.setState({loadingMoreString:'没有更多数据了', isLoadingMore:false})
    //     // }else {
    //     //   console.log('总数据',moreData)
    //     //   let moreData = res
    //     //   let oldData = this.state.data;
    //     //   newData = oldData.concat(moreData.list)
    //     //   this.setState({data:newData, isLoadingMore:false })
    //     // }
    // })
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundGrey
  }
});

module.exports.HistoricalCaseView = connect()(HistoricalCaseView)

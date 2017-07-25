/**
 * creat by renhanyi
 */
'use strict'
import React, {Component} from 'react';
import { mainBule , userInfoTitleGrey } from '../../configs/index';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';

const sepatorH = 3;

export default class SegmentBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSel : this.props.isSel,
    };
  }
  static get defaultProps() {
    return {
      isSel:false,
    }
  }
  PropTypes:{
    title: PropTypes.string,
    onClick : PropTypes.func,
    isSel : PropTypes.bool,
    width : PropTypes.number,
  }

  //设置当前btn是否选中
 setBtnSelected(sel){
    this.setState({
      isSel : sel
    });
  }
  _press() {
    if (!this.state.isSel) {
      this.setState({
        isSel : true
      });
      this.props.onClick();
    }
  }
  render() {
    return (
        <TouchableHighlight onPress = {() => this._press()}
                            underlayColor = '#ffffff'
                            >
                              <View style={[styles.container,{width:this.props.width?this.props.width:null,
                              marginLeft:this.props.width?0:15,
                              marginRight:this.props.width?0:15}]}>
                                <Text style = {[styles.buttonText,{color:this.state.isSel ? mainBule : userInfoTitleGrey}]}>
                                  {this.props.title}
                                </Text>
                                <View style={{
                                      height:sepatorH,
                                      backgroundColor:this.state.isSel ? mainBule :'white',
                                  }}>
                                </View>
                              </View>
        </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    flexDirection : 'column',
    height:44,
    marginTop:15,
  },
  button : {
    flexDirection : 'column',
    justifyContent : 'center',
    height : 44 - sepatorH - 15,
  },
  buttonText : {
    height:44 - sepatorH - 15,
    alignSelf : 'center',
    textAlign:'center',
    color : userInfoTitleGrey,
    fontSize : 14
  },
});

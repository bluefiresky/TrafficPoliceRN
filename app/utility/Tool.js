/**
 * creat by renhanyi
 */

'use strict';
import React, {
    Component
} from 'react';
import {
    Linking,
    Alert
} from 'react-native';

export default class Tools {
   //判断是否为空字符串
    static isEmpty(strings) {
            //判断不是字符串直接认定为空串
            if (Object.prototype.toString.call(strings) !== "[object String]") {
                return true;
            }
            if (strings.replace(/(^s*)|(s*$)/g, "").length == 0) {
                return true;
            } else {
                return false;
            }
        }
    static callPhoneNum(phoneStr, showTip) {
                if (!this.isEmpty(phoneStr)) {
                    if (!showTip) {
                        Linking.openURL('tel:' + phoneStr)
                    } else {
                        Alert.alert(
                            '提示',
                            '是否要拨打: ' + phoneStr, [{
                                text: '取消',
                                onPress: () => console.log('Cancel Pressed!')
                            }, {
                                text: '确定',
                                onPress: () => Linking.openURL('tel:' + phoneStr)
                            }, ]
                        )
                    }
                }
            }
    static addZero(s) {
      return s < 10 ? '0' + s: s;
    }
    static getTimes(timestamp,type) {
          let times = new Date(parseInt(timestamp) * 1000);
          let time;
          if (arguments.length == 1) {
            time = times.getFullYear()+'年'+this.addZero(times.getMonth()+1)+'月'+this.addZero(times.getDate())+'日';
          } else {
            time =times.getFullYear()+type+this.addZero(times.getMonth()+1)+type+this.addZero(times.getDate());
          }
          return time;
     }
    static getAllTimes(timestamp,type) {
           let times = new Date(parseInt(timestamp) * 1000);
           let time;
           if (arguments.length == 1) {
             time = times.getFullYear()+'年'+this.addZero(times.getMonth()+1)+'月'+this.addZero(times.getDate())+'日';
           } else {
             time =times.getFullYear()+type+this.addZero(times.getMonth()+1)+type+this.addZero(times.getDate());
           }
           time = time + " " + this.addZero(times.getHours()) + ":" + this.addZero(times.getMinutes())+ ":" + this.addZero(times.getSeconds());
           return time;
    }
    /** 时间处理 */
    static handleTime(time,isChaneg,timeType){
      if (isChaneg) {
        let timeStr = time.split(" ");
        let time1 = timeStr[0].replace('-', '年').replace('-', '月') + '日'
        if (timeType == 'time') {
          let time2;
          if (timeStr[2] == 'am') {
            if (parseInt(timeStr[1].split(':')[0]) < 10) {
              time2 = `0${timeStr[1].split(':')[0]}时${timeStr[1].split(':')[1]}分`
            } else {
              time2 = timeStr[1].replace(':', '时') + '分'
            }
          } else {
            let time2Str = timeStr[1].split(":");
            time2 = (parseInt(time2Str[0]) + 12) + '时' + time2Str[1] + '分'
          }
          return `${time1} ${time2}`
        }
        return time1
      } else {
        let timeStr = time.split(" ");
        let time1 = timeStr[0].replace('-', '年').replace('-', '月') + '日'
        if (timeType == 'time') {
          let time2 = timeStr[1].replace(':', '时') + '分'
          return `${time1} ${time2}`
        }
        return time1
      }
    }
    static getTime(format){
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+" : this.getMonth()+1,                 //月份
          "d+" : this.getDate(),                    //日
          "h+" : this.getHours(),                   //小时
          "m+" : this.getMinutes(),                 //分
          "s+" : this.getSeconds(),                 //秒
          "q+" : Math.floor((this.getMonth()+3)/3), //季度
          "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
       }
       return (new Date().Format(format))
    }
    /** 时间处理 */

}

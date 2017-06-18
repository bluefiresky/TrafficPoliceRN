/**
 * Created by weimeng on 16/4/26.
 * © 2016 NCF GROUP ALL RIGHTS RESERVED
 */

import { Platform, Dimensions } from "react-native"

const o = Dimensions.get("window")

export const W = o.width
export const H = o.height
export const TitleBarHeight = Platform.OS === 'ios' ? 64 : 44
export const HeadSpace = (Platform.OS === 'ios' ? 20 : 0)
export const InputH = 50
/**
 * Responsive helper to resize font/height...
 * @param x
 * @returns {number}
 */
export function getResponsiveSize ( x ) {
  return (W / 320) * x
}



export function getProvincialData () {
  return [{title:'京',isSelcted:false},{title:'津',isSelcted:false},{title:'沪',isSelcted:false},{title:'渝',isSelcted:false},{title:'冀',isSelcted:false},{title:'晋',isSelcted:false},{title:'辽',isSelcted:false},
  {title:'吉',isSelcted:false},{title:'黑',isSelcted:false},{title:'苏',isSelcted:false},{title:'浙',isSelcted:false},{title:'皖',isSelcted:false},{title:'闽',isSelcted:false},{title:'赣',isSelcted:false},{title:'鲁',isSelcted:false},
  {title:'豫',isSelcted:false},{title:'鄂',isSelcted:false},{title:'湘',isSelcted:false},{title:'粤',isSelcted:false},{title:'琼',isSelcted:false},{title:'川',isSelcted:false},{title:'贵',isSelcted:false},{title:'云',isSelcted:false},
  {title:'陕',isSelcted:false},{title:'甘',isSelcted:false},{title:'青',isSelcted:false},{title:'藏',isSelcted:false},{title:'桂',isSelcted:false},{title:'蒙',isSelcted:false},{title:'宁',isSelcted:false},{title:'新',isSelcted:false}];
}
export function getLetterData (){
  return [{title:'A',isSelcted:false},{title:'B',isSelcted:false},{title:'C',isSelcted:false},{title:'D',isSelcted:false},{title:'E',isSelcted:false},{title:'F',isSelcted:false},{title:'G',isSelcted:false},
  {title:'H',isSelcted:false},{title:'I',isSelcted:false},{title:'J',isSelcted:false},{title:'K',isSelcted:false},{title:'L',isSelcted:false},{title:'M',isSelcted:false},{title:'N',isSelcted:false},{title:'O',isSelcted:false},
  {title:'P',isSelcted:false},{title:'Q',isSelcted:false},{title:'R',isSelcted:false},{title:'S',isSelcted:false},{title:'T',isSelcted:false},{title:'U',isSelcted:false},{title:'V',isSelcted:false},{title:'W',isSelcted:false},
  {title:'X',isSelcted:false},{title:'Y',isSelcted:false},{title:'Z',isSelcted:false}];
}

export function getNumberData (){
   return [{title:'1',isSelcted:false},{title:'2',isSelcted:false},{title:'3',isSelcted:false},{title:'4',isSelcted:false},{title:'5',isSelcted:false},{title:'6',isSelcted:false},{title:'7',isSelcted:false},
   {title:'8',isSelcted:false},{title:'9',isSelcted:false},{title:'0',isSelcted:false},{title:'A',isSelcted:false},{title:'B',isSelcted:false},{title:'C',isSelcted:false},{title:'D',isSelcted:false},{title:'E',isSelcted:false},
   {title:'F',isSelcted:false},{title:'G',isSelcted:false},{title:'H',isSelcted:false},{title:'I',isSelcted:false},{title:'J',isSelcted:false},{title:'K',isSelcted:false},{title:'L',isSelcted:false},{title:'M',isSelcted:false},
   {title:'N',isSelcted:false},{title:'O',isSelcted:false},{title:'P',isSelcted:false},{title:'Q',isSelcted:false},{title:'R',isSelcted:false},{title:'S',isSelcted:false},{title:'T',isSelcted:false},{title:'U',isSelcted:false},
   {title:'V',isSelcted:false},{title:'W',isSelcted:false},
   {title:'X',isSelcted:false},{title:'Y',isSelcted:false},{title:'Z',isSelcted:false},{title:'学',isSelcted:false}];
}

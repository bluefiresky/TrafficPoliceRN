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

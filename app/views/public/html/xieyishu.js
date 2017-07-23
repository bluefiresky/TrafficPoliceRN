export function generateXYS(basic, personList, taskModal, damagedList, accidentDes, dutyList){
  return(
    `<!DOCTYPE html>
    <html lang="en">
     <head>
      <meta charset="UTF-8" />
      <title>协警多车无争议协议书图片</title>
      <style>*{padding:0;margin:0;font-size: 16px;font-family: FangSong_GB2312;}h1{font-size: 30px;text-align: center;}h5{line-height: 30px;}p{word-break:break-all;}img{height:80px;width: auto;position: absolute;left:40px;top:-20px;}.hid{overflow: hidden;}.borNo{border:none;}.borNo th{border:none;}.borL{border-left: 1px solid #000;}.borR{border-right: 1px solid #000;}.borT{border-top: 1px solid #000;}.borB{border-bottom: 1px solid #000;}.padL{padding-left: 20px;}.padR{padding-right: 84px;}.content{padding:30px 17px 0 17px;margin:0 auto;width:1200px;}.head{border-bottom: 1px solid #000;}.pad th,.pad td{padding:5px 0;}table{width: 100%;}table,th,td{border:1px solid #000;border-collapse: collapse;font-weight: normal;}th,td,tr{text-align: left;word-break:break-all;}span{padding-left: 15px;display:inline-block;height:18px;}.padNo{padding:0;}.tit{text-align: center;}.mainT th{text-align: center;}.describe{padding-left: 30px;padding-top: 15px;}.describe span{padding:0 5px;border-bottom: 1px solid #000;}.describe div p{float: left;position: relative;}.wid{display: inline-block;width:100px;}</style>
     </head>
     <body>
      <div class="content">
       <h1>道路交通事故自行协商协议书</h1>
       <table style="margin-top:30px;">
        <tbody>
         <tr>
          <th style="width:10%;">事故发生时间</th>
          <th style="width:18%;">${basic.accidentTime}</th>
          <th style="width:10%;">事故发生地点</th>
          <th style="width:43%;">${basic.address}</th>
          <th style="width:5%;">天气</th>
          <th style="width:14%;">${basic.weather}</th>
         </tr>
        </tbody>
       </table>
       <div class="tit borL borR borB">
        <h5>当事人基本信息</h5>
        <p>说明：甲、乙代码按车辆在事故现场“由前向后”或者“由左向右”顺序确定</p>
       </div>
       <table class="mainT">
        <tbody>
         <tr class="pad">
          <th width="3%">代码</th>
          <th width="8%">当事人信息</th>
          <th>驾驶证号</th>
          <th>联系方式</th>
          <th width="8%">号牌号码</th>
          <th>车辆类型</th>
          <th>投保公司</th>
          <th>保险凭证号</th>
          <th>保险期间</th>
          <th width="10%">保险公司报案号</th>
         </tr>
         <tr>
          <td>甲</td>
          <td>${personList[0].name}</td>
          <td>${personList[0].driverNum}</td>
          <td>${personList[0].phone}</td>
          <td>${personList[0].licensePlateNum}</td>
          <td>${personList[0].carType}</td>
          <td>${personList[0].insureCompanyName}</td>
          <td>${personList[0].carInsureNumber}</td>
          <td>${personList[0].carInsureDueDate}</td>
          <td></td>
         </tr>
         <tr>
          <td>乙</td>
          <td>${personList[1].name}</td>
          <td>${personList[1].driverNum}</td>
          <td>${personList[1].phone}</td>
          <td>${personList[1].licensePlateNum}</td>
          <td>${personList[1].carType}</td>
          <td>${personList[1].insureCompanyName}</td>
          <td>${personList[1].carInsureNumber}</td>
          <td>${personList[1].carInsureDueDate}</td>
          <td></td>
         </tr>
         <tr>
          <td>${personList[2]?'丙':''}</td>
          <td>${personList[2]?(personList[2].name):''}</td>
          <td>${personList[2]?(personList[2].driverNum):''}</td>
          <td>${personList[2]?(personList[2].phone):''}</td>
          <td>${personList[2]?(personList[2].licensePlateNum):''}</td>
          <td>${personList[2]?(personList[2].carType):''}</td>
          <td>${personList[2]?(personList[2].insureCompanyName):''}</td>
          <td>${personList[2]?(personList[2].carInsureNumber):''}</td>
          <td>${personList[2]?(personList[2].carInsureDueDate):''}</td>
          <td></td>
         </tr>
        </tbody>
       </table>
       <div class="tit borL borR borB">
        <h5>道路交通事故形态及责任(在□中打√)</h5>
       </div>
       <table>
        <tbody>
         <tr class="pad">
          <td colspan="2" style="text-align:center;">甲</td>
          <td colspan="2" style="text-align:center;">乙</td>
          ${!personList[2]?'':'<td colspan="2" style="text-align:center;">丙</td>'}
         </tr>
         <tr class="borT">
          <th width="3%">事故形态</th>
          <th colspan="5" class="borNo"><p style="width:900px;">${taskModal}</p></th>
         </tr>
         <tr class="borT">
          <th width="3%">车损部分</th>
          <th class="borNo"><p style="width:240px;">${damagedList[0]}</p></th>
          <th width="3%">车损部分</th>
          <th class="borR"><p style="width:240px;">${damagedList[1]}</p></th>
          ${
            !damagedList[2]?'':
            '<th width="3%">车损部分</th><th class="borR"><p style="width:240px;">'+damagedList[2]+'</p></th>'
          }
         </tr>
         <tr class="borT">
          <th width="3%">事故情形</th>
          <th colspan="5" class="borNo"><p style="width:900px;">${accidentDes}</p></th>
         </tr>
         <tr class="borT">
          <th>事故责任</th>
          <th class="borNo">${dutyList[0]}</th>
          <th>事故责任</th>
          <th class="borR">${dutyList[1]}</th>
          ${
            !dutyList[2]?'':
            '<th>事故责任</th><th class="borR">'+dutyList[1]+'</th>'
          }
         </tr>
        </tbody>
       </table>
       <div class="describe">
        <p>以上信息和道路交通事故事实形态如有虚假，由当事人承担法律责任。</p>
        <div style="padding-top:60px;">
         <p>当事人签名：</p>
         <p class="padR">
          甲：<span class="wid"><img src=${personList[0].signData} alt="" /></span>，<span>${personList[0].signTime}</span>
         </p>
         <p class="padR">
          乙：<span class="wid"><img src=${personList[1].signData} alt="" /></span>，<span>${personList[1].signTime}</span>
         </p>
          ${
            !personList[2]?'':
             '<p class="padR">乙：<span class="wid"><img src=' + personList[2].signData + ' alt="" /></span>，<span>' + personList[2].signTime + '</span></p>'
           }

        </div>
       </div>
      </div>
     </body>
    </html>`
  )
}
// <!DOCTYPE html>
// <html lang="en">
//  <head>
//   <meta charset="UTF-8" />
//   <title>协警多车无争议协议书图片</title>
//   <style>*{padding:0;margin:0;font-size: 16px;font-family: FangSong_GB2312;}h1{font-size: 30px;text-align: center;}h5{line-height: 30px;}p{word-break:break-all;}img{height:80px;width: auto;position: absolute;left:40px;top:-20px;}.hid{overflow: hidden;}.borNo{border:none;}.borNo th{border:none;}.borL{border-left: 1px solid #000;}.borR{border-right: 1px solid #000;}.borT{border-top: 1px solid #000;}.borB{border-bottom: 1px solid #000;}.padL{padding-left: 20px;}.padR{padding-right: 84px;}.content{padding:30px 17px 0 17px;margin:0 auto;width:1200px;}.head{border-bottom: 1px solid #000;}.pad th,.pad td{padding:5px 0;}table{width: 100%;}table,th,td{border:1px solid #000;border-collapse: collapse;font-weight: normal;}th,td,tr{text-align: left;word-break:break-all;}span{padding-left: 15px;display:inline-block;height:18px;}.padNo{padding:0;}.tit{text-align: center;}.mainT th{text-align: center;}.describe{padding-left: 30px;padding-top: 15px;}.describe span{padding:0 5px;border-bottom: 1px solid #000;}.describe div p{float: left;position: relative;}.wid{display: inline-block;width:100px;}</style>
//  </head>
//  <body>
//   <div class="content">
//    <h1>道路交通事故自行协商协议书</h1>
//    <table style="margin-top:30px;">
//     <tbody>
//      <tr>
//       <th style="width:10%;">事故发生时间</th>
//       <th style="width:18%;">2017年07月21日 21时07分</th>
//       <th style="width:10%;">事故发生地点</th>
//       <th style="width:43%;">中国北京市朝阳区百子湾南二路78号院-3</th>
//       <th style="width:5%;">天气</th>
//       <th style="width:14%;">晴</th>
//      </tr>
//     </tbody>
//    </table>
//    <div class="tit borL borR borB">
//     <h5>当事人基本信息</h5>
//     <p>说明：甲、乙代码按车辆在事故现场“由前向后”或者“由左向右”顺序确定</p>
//    </div>
//    <table class="mainT">
//     <tbody>
//      <tr class="pad">
//       <th width="3%">代码</th>
//       <th width="8%">当事人信息</th>
//       <th>驾驶证号</th>
//       <th>联系方式</th>
//       <th width="8%">号牌号码</th>
//       <th>车辆类型</th>
//       <th>投保公司</th>
//       <th>保险凭证号</th>
//       <th>保险期间</th>
//       <th width="10%">保险公司报案号</th>
//      </tr>
//      <tr>
//       <td>甲</td>
//       <td>吴然</td>
//       <td>123456487907546487</td>
//       <td>15822853996</td>
//       <td>京4567A3</td>
//       <td>京4567A3</td>
//       <td>中国人民财产保险股份有限公司</td>
//       <td></td>
//       <td></td>
//       <td></td>
//      </tr>
//      <tr>
//       <td>乙</td>
//       <td>机器</td>
//       <td>123456789054613187</td>
//       <td>18910945328</td>
//       <td>京567890</td>
//       <td>京567890</td>
//       <td>中国人民财产保险股份有限公司</td>
//       <td></td>
//       <td></td>
//       <td></td>
//      </tr>
//     </tbody>
//    </table>
//    <div class="tit borL borR borB">
//     <h5>道路交通事故形态及责任(在□中打√)</h5>
//    </div>
//    <table>
//     <tbody>
//      <tr class="pad">
//       <td colspan="2" style="text-align:center;">甲</td>
//       <td colspan="2" style="text-align:center;">乙</td>
//      </tr>
//      <tr class="borT">
//       <th width="3%">事故形态</th>
//       <th colspan="5" class="borNo"><p style="width:900px;"><span>√追尾碰撞</span><span>□正面碰撞</span><span>□侧面碰撞（同向）</span><span>□侧面碰撞（对向）</span><span>□侧面碰撞（直角）</span><span>□侧面碰撞（角度不确定）</span><span>□同向刮擦</span><span>□对向刮擦</span><span>□其他</span></p></th>
//      </tr>
//      <tr class="borT">
//       <th width="3%">车损部分</th>
//       <th class="borNo"><p style="width:240px;"><span>□车头</span><span>√左前角</span><span>□右前角</span><span>√车身左侧</span><span>□车尾</span><span>□左后角</span><span>□右后角</span><span>□车身右侧</span></p></th>
//       <th width="3%">车损部分</th>
//       <th class="borR"><p style="width:240px;"><span>□车头</span><span>□左前角</span><span>□右前角</span><span>□车身左侧</span><span>□车尾</span><span>□左后角</span><span>√右后角</span><span>√车身右侧</span></p></th>
//      </tr>
//      <tr class="borT">
//       <th>事故情形</th>
//       <th class="borNo"><p style="width:320px;"><span>√未保持安全车距与前车追尾</span><span>□逆行</span><span>□倒车</span><span>□溜车</span><span>□开关车门</span><span>□违反交通信号灯</span><span>□未按规定让行</span><span>□停车</span><span>□变更车道与其他车辆刮擦</span><span>□其他</span></p></th>
//       <th>事故情形</th>
//       <th class="borR"><p style="width:320px;"><span>√未保持安全车距与前车追尾</span><span>□逆行</span><span>□倒车</span><span>□溜车</span><span>□开关车门</span><span>□违反交通信号灯</span><span>□未按规定让行</span><span>□停车</span><span>□变更车道与其他车辆刮擦</span><span>□其他</span></p></th>
//      </tr>
//      <tr class="borT">
//       <th>事故责任</th>
//       <th class="borNo"><span>□全部责任</span><span>√无责任</span><span>□同等责任</span></th>
//       <th>事故责任</th>
//       <th class="borR"><span>√全部责任</span><span>□无责任</span><span>□同等责任</span></th>
//      </tr>
//     </tbody>
//    </table>
//    <div class="describe">
//     <p>以上信息和道路交通事故事实形态如有虚假，由当事人承担法律责任。</p>
//     <div style="padding-top:60px;">
//      <p>当事人签名：</p>
//      <p class="padR">甲：<span class="wid"><img src="https://testx.zhongchebaolian.com/photobase/photos/sign//2017-07-21/1101201707212114539800005/sign_063ee56d-fca0-4ac9-9027-700806ffd27b.jpg" alt="" /></span>，<span>2017</span>年<span>7</span>月<span>21</span>日</p>
//      <p>乙：<span class="wid"><img src="https://testx.zhongchebaolian.com/photobase/photos/sign//2017-07-21/1101201707212114539800005/sign_a013190f-fd29-40c5-ad5f-8bb1a4505475.jpg" alt="" /></span>，<span>2017</span>年<span>7</span>月<span>21</span>日</p>
//     </div>
//    </div>
//   </div>
//  </body>
// </html>

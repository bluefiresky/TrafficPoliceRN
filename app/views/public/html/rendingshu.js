export function generateRDS(basic, personList, factAndResponsibility, width){
  return(
    `<!DOCTYPE html>
    <html>
     <head lang="en">
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title></title>
      <style>
        p{text-indent: 2em;}
        .slash{
            position: relative;
        }
        .slash:before{
            content: '';
            width: 60%;
            height: 1px;
            position: absolute;
            background-color: #000;
            left:20%;
            top:50%;
        }
    	img{width:100px;}
       </style>
       <script>
        window.onload=function(){
          try{
            document.getElementsByTagName("html")[0].style.width='600px';
	          document.getElementsByTagName("body")[0].style.margin='5';
  					var imgs=document.getElementsByTagName("img");
  					for(i=0;i<imgs.length;i++){
  						imgs[i] .style.width='80px';
  					}
  					document.getElementById("maxh").style.fontSize='16px';
  					document.getElementById("minh").style.fontSize='12px';
  					document.getElementById("maxh").style.margin='0px';
  					document.getElementById("minh").style.margin='0px';
  					document.getElementById("maxh").style.fontweight='bolder';
  					document.getElementById("tab").style.fontSize='12px';
          }catch(e){}
        }
       </script>
     </head>
     <body style="margin: 5 10px;">
      <h2 style="font-size:20px;font-weight:normal;text-align:center;padding-top: 5px;width:100%;" id="maxh">北京交管局双井交通大队<br />道路交通事故认定书（简易程序） </h2>
      <h3 style="font-size:16px;text-align:center;font-weight:normal;width:1;" id="minh">第201707101025266600002号</h3>
      <table border="1" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;" id="tab">
       <tbody>
        <tr>
         <td>事故时间</td>
         <td colspan="3">${basic.accidentTime}</td>
         <td>天气</td>
         <td>${basic.weather}</td>
        </tr>
        <tr style="border-top:1px solid #000000;border-bottom:1px solid #000000;">
         <td>事故地点</td>
         <td colspan="5">${basic.address}</td>
        </tr>
        <tr>
         <td>当事人</td>
         <td>${personList[0].name}</td>
         <td>驾驶证或身份证号码</td>
         <td>${personList[0].driverNum}</td>
         <td>联系电话</td>
         <td>${personList[0].phone}</td>
        </tr>
        <tr>
         <td>交通方式</td>
         <td>${personList[0].carType}</td>
         <td>机动车型号、牌号</td>
         <td>${personList[0].licensePlateNum}</td>
         <td>保险凭证号</td>
         <td>${personList[0].carInsureNumber}</td>
        </tr>
        <tr>
         <td>当事人</td>
         <td ${personList[1].name?'':'class="slash"'} >${personList[1].name}</td>
         <td>驾驶证或身份证号码</td>
         <td ${personList[1].driverNum?'':'class="slash"'} >${personList[1].driverNum}</td>
         <td>联系电话</td>
         <td ${personList[1].phone?'':'class="slash"'} >${personList[1].phone}</td>
        </tr>
        <tr>
         <td>交通方式</td>
         <td ${personList[1].carType?'':'class="slash"'} >${personList[1].carType}</td>
         <td>机动车型号、牌号</td>
         <td ${personList[1].licensePlateNum?'':'class="slash"'} >${personList[1].licensePlateNum}</td>
         <td>保险凭证号</td>
         <td ${personList[1].carInsureNumber?'':'class="slash"'} >${personList[1].carInsureNumber}</td>
        </tr>
        ${
          !personList[2].name?'':
          '<tr>
           <td>当事人</td>
           <td>'+${personList[2].name}+'</td>
           <td>驾驶证或身份证号码</td>
           <td>'+${personList[2].driverNum}+'</td>
           <td>联系电话</td>
           <td>'+${personList[2].phone}+'</td>
          </tr>
          <tr>
           <td>交通方式</td>
           <td>'+${personList[2].carType}+'</td>
           <td>机动车型号、牌号</td>
           <td>'+${personList[2].licensePlateNum}+'</td>
           <td>保险凭证号</td>
           <td>'+${personList[2].carInsureNumber}+'</td>
          </tr>
          <tr>'
        }
         <td colspan="6">
          <table border="1px" scellpadding="0" cellspacing="0" style="font-size:14px; border-bottom: 0px;border-right: 0px;" width="100%">
           <tbody>
            <tr>
             <td style="width:80px;text-align:center;;border-top:0px;  border-right: 0px;"> 交<br />通<br />事<br />故<br />事<br />实<br />及<br />责<br />任 </td>
             <td style="text-align:left;border-top:0px;  border-right: 0px;">
                <p>
                    ${factAndResponsibility}
                </p>
                <p></p>
                <p></p>
                <br /> 当事人：<img src=${personList[0].signData} />
                ${personList[1].signData?'<img src='+personList[1].signData+' alt="" />':''}
                ${personList[2].signData?'<img src='+personList[2].signData+' />':''}
                <br />
                交通警察<img src=${'data:image/jpeg;base64,'+global.personal.sealUrlBase64} /> （印章）<img src=${'data:image/jpeg;base64,'+global.personal.depSealUrlBase64} />
            </td>
            </tr>
            <tr>
             <td style="width:80px;text-align:center;border-bottom:0px; border-left: 0px; border-right: 0px;"> 损<br />害<br />赔<br />偿<br />调<br />解<br />结<br />果 </td>
             <td style="text-align:left;border-bottom:0px; border-right: 0px;">经各方当事人共同申请调解，自愿达成协议如下： <br />由当事人自行协商解决。此事故一次结清，签字生效。
             <br /> 当事人：<img src=${personList[0].signData} />
             ${personList[1].signData?'<img src='+personList[1].signData+' />':''}
             ${personList[2].signData?'<img src='+personList[2].signData+' />':''}
             <br />
             交通警察<img src=${'data:image/jpeg;base64,'+global.personal.sealUrlBase64} /> （印章）<img src=${'data:image/jpeg;base64,'+global.personal.depSealUrlBase64}  /> </td>
            </tr>
           </tbody>
          </table></td>
        </tr>
       </tbody>
      </table>
        <p style="text-indent:2em;">
            有下列情形之一或者调解未达成协议及调解生效后当事人不履行的，当事人可以向人民法院提起民事诉讼：（一）当事人对交通事故认定有异议的；（二）当事人拒绝签字的；（三）当事人不同意由警察调解的。
        </p>
        <p style="text-indent:2em;">注：此文书存档一份。交付各方当事人各一份。</p>
     </body>
    </html>`
  )
}

// <!DOCTYPE html>
// <html>
//  <head lang="en">
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width,initial-scale=1.0">
//   <title></title>
//   <style>
//     p{text-indent: 2em;}
//     .slash{
//         position: relative;
//     }
//     .slash:before{
//         content: '';
//         width: 60%;
//         height: 1px;
//         position: absolute;
//         background-color: #000;
//         left:20%;
//         top:50%;
//     }
// 	img{width:100px;}
//    </style>
//    <script>
//    window.onload=function(){
//    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
//             if(window.location.href.indexOf("?mobile")<0){
//                 try{
//                     if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
//                        document.getElementsByTagName("html")[0].style.width='600px';
// 					   document.getElementsByTagName("body")[0].style.margin='0';
// 					   var imgs=document.getElementsByTagName("img");
// 					   for(i=0;i<imgs.length;i++){
// 							imgs[i] .style.width='80px';
// 					   }
// 					  document.getElementById("maxh").style.fontSize='16px';
// 					  document.getElementById("minh").style.fontSize='12px';
// 					  document.getElementById("maxh").style.margin='0px';
// 					  document.getElementById("minh").style.margin='0px';
// 					  document.getElementById("maxh").style.fontweight='bolder';
// 					  document.getElementById("tab").style.fontSize='12px';
//                     }else if(/iPad/i.test(navigator.userAgent)){
//                     }else{
//                         //window.location.href="http://www.bqkeji.com";//pc端网址
//                     }
//                 }catch(e){}
//             }
//         }
//    }
//
//    </script>
//  </head>
//  <body style="margin: 5 10px;">
//   <h2 style="font-size:20px;font-weight:normal;text-align:center;padding-top: 5px;width:100%;" id="maxh">北京交管局双井交通大队<br />道路交通事故认定书（简易程序） </h2>
//   <h3 style="font-size:16px;text-align:center;font-weight:normal;width:1;" id="minh">第201707101025266600002号</h3>
//   <table border="1" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;" id="tab">
//    <tbody>
//     <tr>
//      <td>事故时间</td>
//      <td colspan="3">2017年07月08日 08时30分</td>
//      <td>天气</td>
//      <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
//     </tr>
//     <tr style="border-top:1px solid #000000;border-bottom:1px solid #000000;">
//      <td>事故地点</td>
//      <td colspan="5">北京市朝阳区百子湾南二路78号院-3</td>
//     </tr>
//     <tr>
//      <td>当事人</td>
//      <td>张三</td>
//      <td>驾驶证或身份证号码</td>
//      <td>111222121333636666</td>
//      <td>联系电话</td>
//      <td>15010955030</td>
//     </tr>
//     <tr>
//      <td>交通方式</td>
//      <td></td>
//      <td>机动车型号、牌号</td>
//      <td>冀CWA356</td>
//      <td>保险凭证号</td>
//      <td></td>
//     </tr>
//     <tr>
//      <td>当事人</td>
//      <td>李四</td>
//      <td>驾驶证或身份证号码</td>
//      <td>321123456654789987</td>
//      <td>联系电话</td>
//      <td>18910561309</td>
//     </tr>
//     <tr>
//      <td>交通方式</td>
//      <td class="slash"></td>
//      <td>机动车型号、牌号</td>
//      <td>京C11157</td>
//      <td>保险凭证号</td>
//      <td></td>
//     </tr>
//     <tr>
//      <td colspan="6">
//       <table border="1px" scellpadding="0" cellspacing="0" style="font-size:14px; border-bottom: 0px;border-right: 0px;" width="100%">
//        <tbody>
//         <tr>
//          <td style="width:80px;text-align:center;;border-top:0px;  border-right: 0px;"> 交<br />通<br />事<br />故<br />事<br />实<br />及<br />责<br />任 </td>
//          <td style="text-align:left;border-top:0px;  border-right: 0px;">
//             <p>
//                 2017年07月08日 08时30分，在北京市朝阳区百子湾南二路78号院-3处，张三驾驶的冀CWA356小型载客汽车，与李四驾驶的京C11157小型载客汽车发生追尾碰撞的交通事故。本次事故情形为变更车道与其他车辆刮擦。本次事故责任为李四无责任，李四无责任。
//             </p>
//             <p>sflsk;kfd;fkd;fk;dks;fks;fk;sfkd;fkd;fkd;fkd;fk;fkd;kdf</p>
//             <p>lslfolireioeuoerueleoieiroerueori</p>
//             <br /> 当事人：<img src="http://192.168.1.188:8080/photobase//photos/sign//2017-07-10/1101201707101025255250001/sign_696b8c03-f108-432a-853f-43e8f284a6af.jpg" />、<img src="http://192.168.1.188:8080/photobase//photos/sign//2017-07-10/1101201707101025255250001/sign_76f55d30-9cf3-4333-a4e4-9429d395a3e9.jpg" /><br /> 交通警察<img src="http://testx.zhongchebaolian.com/photobase//photos/printSign/91eb62d3-5e28-4443-9ab7-e7fcfd4511eb.png" /> （印章）<img src="http://testx.zhongchebaolian.com/photobase//photos/printSign/10f047a2-c10a-45cc-b573-8732ac7ef7b8.png"/>
//         </td>
//         </tr>
//         <tr>
//          <td style="width:80px;text-align:center;border-bottom:0px; border-left: 0px; border-right: 0px;"> 损<br />害<br />赔<br />偿<br />调<br />解<br />结<br />果 </td>
//          <td style="text-align:left;border-bottom:0px; border-right: 0px;">经各方当事人共同申请调解，自愿达成协议如下： <br />由当事人自行协商解决。此事故一次结清，签字生效。 <br /> 当事人：<img src="http://192.168.1.188:8080/photobase//photos/sign//2017-07-10/1101201707101025255250001/sign_696b8c03-f108-432a-853f-43e8f284a6af.jpg"/>、<img src="http://192.168.1.188:8080/photobase//photos/sign//2017-07-10/1101201707101025255250001/sign_76f55d30-9cf3-4333-a4e4-9429d395a3e9.jpg" /><br /> 交通警察<img src="http://testx.zhongchebaolian.com/photobase//photos/printSign/91eb62d3-5e28-4443-9ab7-e7fcfd4511eb.png" /> （印章）<img src="http://testx.zhongchebaolian.com/photobase//photos/printSign/10f047a2-c10a-45cc-b573-8732ac7ef7b8.png"  /> </td>
//         </tr>
//        </tbody>
//       </table></td>
//     </tr>
//    </tbody>
//   </table>
//     <p style="text-indent:2em;">
//         有下列情形之一或者调解未达成协议及调解生效后当事人不履行的，当事人可以向人民法院提起民事诉讼：（一）当事人对交通事故认定有异议的；（二）当事人拒绝签字的；（三）当事人不同意由警察调解的。
//     </p>
//     <p style="text-indent:2em;">注：此文书存档一份。交付各方当事人各一份。</p>
//  </body>
// </html>

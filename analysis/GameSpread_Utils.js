_RF.push(t,"3ec04rUR5lCqa4ynG+k6Pp0","GameSpread_Utils"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.ESpreadType=void 0
;var o=e("../../dataMgr/FK_ABTestMgr"),n=e("../../game/fruit/view/Illustrated/IllustratedMgr"),s=e("./ExpertChallenge_Utils"),r=e("./FlowStrategy_Utils"),a=e("./Game_Utils"),l=e("./Level_Utils"),c=e("./NormalCfg_Utils")
;var u
;(function(e){
e[e.Simple=1]="Simple",e[e.Normal=2]="Normal",e[e.Difficult=3]="Difficult"
;
})(u=i.ESpreadType||(i.ESpreadType={

}))
;var d=/*#__PURE__*/function(){
function d(){
_classCallCheck2(this,d)
;
}_createClass2(d,null,[{
key:"initLevelChangeIds",value:function initLevelChangeIds(e){
this.levelChangeTypeIdMap=new Map()
;var t=l.default.getLevelData()
;if(t&&t.exchangeCount){
var _i110=Math.min(e.length,t.exchangeCount)
;for(var _t128=0
;_t128<_i110
;_t128++)this.levelChangeTypeIdMap.set(e[_t128],!1)
;
}
}
},{
key:"clearLevelChangeData",value:function clearLevelChangeData(){
this.levelChangeTypeIdMap&&this.levelChangeTypeIdMap.clear(),this.levelChangeItemList=[]
;
}
},{
key:"clearLevelChangeDataById",value:function clearLevelChangeDataById(e){
if(this.levelChangeTypeIdMap&&this.levelChangeTypeIdMap.delete(e),this.levelChangeItemList&&this.levelChangeItemList.length>0){
var _t129
;for(var _i111=0
;_i111<this.levelChangeItemList.length
;_i111++)if((_t129=this.levelChangeItemList[_i111])&&_t129.getId()===e){
this.levelChangeItemList.splice(_i111,1)
;break
;
}
}
}
},{
key:"isOpenByCondition",value:function isOpenByCondition(e,t){
if(e&&e.length>0){
var _i112=l.default.getCurLevelId()<=e[0]
;var _o77=l.default.getHoleData()
;var _n47=l.default.getTargetCount(),_s38=Math.max(0,_n47-_o77.x)>=e[1],_r29=100*Math.random(),_a18=t(),_c9=_r29<=e[2],_u6=this.downType===e[3]
;return _i112&&_s38&&_a18&&_c9&&_u6
;
}return!1
;
}
},{
key:"isOpenNewSpread",value:function isOpenNewSpread(){
if(s.default.isExpertChallenge)return!1
;if(0!=l.default.getActiveId()&&l.default.getCurLevelId()>27)return!1
;var e=c.default.getDensitySpreadVertical()
;return this.isOpenByCondition(e,function(){
return o.default.getDensitySpreadVertical()===o.FK_ABType.B
;
})
;
}
},{
key:"isOpenNewSpread4_0",value:function isOpenNewSpread4_0(){
if(s.default.isExpertChallenge)return!1
;if(0!=l.default.getActiveId()&&l.default.getCurLevelId()>27)return!1
;var e=c.default.getProgressSpreadWeight()
;return this.isOpenByCondition(e,function(){
return o.default.getProgressSpreadWeight()===o.FK_ABType.B
;
})
;
}
},{
key:"downType",get:function get(){
return s.default.isExpertChallenge?s.default.getDownType():l.default.getDownType()
;
}
},{
key:"fruitTypeCount",get:function get(){
return s.default.isExpertChallenge?s.default.getFruitTypeCount():l.default.getFruitTypeCount()
;
}
},{
key:"updateIdsBySecretList",value:function updateIdsBySecretList(e){
if(s.default.isExpertChallenge)return
;var t=n.IllustratedMgr.Instance.getSecretItemIdListByTheme(l.default.getCurTheme())
;if(t.length>0){
var _i113=Math.floor(e.length/2)
;for(var _o78=0
;_o78<t.length
;_o78++)e[Math.floor(Math.random()*(e.length-_i113))+_i113]=t[_o78]
;
}
}
},{
key:"getVerticalIds",value:function getVerticalIds(e,t){
return o.default.getFlowStrategy()===o.FK_ABType.B?this.getFlowStrategyVerticalIds(e):this.getIds(e,t)
;
}
},{
key:"getIds",value:function getIds(e,t){
return this.spreadType=u.Normal,l.default.isSliceFruitActive()?d.getIdsSpread2_0(e,t):d.isOpenNewSpread()?d.getIdsSpread3_0(e,t):d.isOpenNewSpread4_0()?d.getIdsSpread4_0(e,t):d.getIdsSpread2_0(e,t)
;
}
},{
key:"getIdsSpread2_0",value:function getIdsSpread2_0(e,t){
var i=6,o=.1
;0!==this.downType?(i=4,o=.2):(s.default.isExpertChallenge?s.default.getHoleData():l.default.getHoleData()).x>0&&(o=.1)
;var n=0,r=this.getFruitTypes(t)
;console.log("\u539F\u59CB\u68CB\u5B50\u6C60\u5B50id",r)
;var c=[],u=new Map()
;for(var _s39=0
;_s39<i
;_s39++)c.push(r[_s39]),u.set(r[_s39],1)
;for(var _s40=0
;_s40<Math.floor(e*o)-i
;_s40++){
var _e172=Math.floor(Math.random()*i)
;c.push(r[_e172]),u.set(r[_e172],u.get(r[_e172])+1)
;
}a.default.shuffleArray(c),n+=c.length,console.log("\u5F00\u59CBID\u6570: "+c.length+" \u79CD\u7C7B\u6570: "+u.size+"  beginIds: "+c)
;var _d11=[]
;var _iterator25=_createForOfIteratorHelper2(u.keys()),_step25
;try{
for(_iterator25.s()
;!(_step25=_iterator25.n()).done
;){
var _s51=_step25.value
;u.get(_s51)%2==1&&_d11.push(_s51)
;
}
}catch(err){
_iterator25.e(err)
;
}finally{
_iterator25.f()
;
}var h=Math.ceil(.6*r.length),f=new Map()
;for(var _s41=0
;_s41<h
;_s41++)_d11.push(r[_s41]),f.set(r[_s41],1)
;var g=Math.ceil(.3*e)
;g%2==1&&g++
;var p=g-(n+_d11.length)
;for(var _s42=0
;_s42<p
;_s42++){
var _e173=Math.floor(Math.random()*h)
;_d11.push(r[_e173]),f.has(r[_e173])?f.set(r[_e173],f.get(r[_e173])+1):f.set(r[_e173],1)
;
}a.default.shuffleArray(_d11)
;var m=new Set(_d11)
;console.log("10%-30% ID\u6570: "+_d11.length+" \u79CD\u7C7B\u6570: "+m.size+" ids_10_30: "+_d11),n+=_d11.length
;var _=[]
;f.forEach(function(e,t){
e%2==1&&_.push(t)
;
})
;var v=Math.ceil(.5*e)
;v%2==1&&v++
;var y=v-(n+_.length)
;y%2==1&&console.error("\u5269\u4F59\u5BF9\u6570\u4E0D\u53EF\u80FD\u662F\u57FA\u6570 lastCount_30_50: "+y)
;for(var _s43=0
;_s43<y/2
;_s43++){
var _e174=Math.floor(Math.random()*h)
;_.push(r[_e174]),_.push(r[_e174])
;
}a.default.shuffleArray(_)
;var C=new Set(_)
;console.log("30%-50% ID\u6570: "+_.length+" \u79CD\u7C7B\u6570: "+C.size+" ids_30_50: "+_),n+=_.length
;var T=[],I=new Map()
;var S=[]
;for(
;S.length<4
;){
var _e175=Math.floor(Math.random()*(r.length-h))+h
;-1===S.indexOf(_e175)&&S.push(_e175)
;
}for(var _s44=0
;_s44<S.length
;_s44++)T.push(r[S[_s44]]),I.set(r[S[_s44]],1)
;for(var _s45=4
;_s45<12
;_s45++){
var _e176=Math.floor(Math.random()*r.length)
;T.push(r[_e176]),I.has(r[_e176])?I.set(r[_e176],I.get(r[_e176])+1):I.set(r[_e176],1)
;
}a.default.shuffleArray(T)
;var b=new Set(T),F=[]
;var _loop18=function _loop18(){
var e=T[_s46]
;-1===_d11.findIndex(function(t){
return t===e
;
})&&F.push(e)
;
}
;for(var _s46=0
;_s46<T.length
;_s46++){
_loop18()
;
}console.log("50%\u5F00\u59CBID\u6570: "+T.length+" \u79CD\u7C7B\u6570: "+b.size+" ids_50_link: "+T,"\u65B0\u589Eid\uFF1A",F),n+=T.length
;var w=[]
;I.forEach(function(e,t){
e%2==1&&w.push(t)
;
})
;var D=e-(n+w.length)
;D%2==1&&console.error("\u5269\u4F59\u5BF9\u6570\u4E0D\u53EF\u80FD\u662F\u57FA\u6570 lastCount: "+D)
;for(var _s47=0
;_s47<D/2
;_s47++){
var _e177=void 0
;_e177=h+_s47<r.length?h+_s47:Math.floor(Math.random()*r.length),w.push(r[_e177]),w.push(r[_e177])
;
}a.default.shuffleArray(w)
;var P=new Set(w)
;console.log("\u6700\u540E\u68CB\u5B50ID\u6570: "+w.length+" \u79CD\u7C7B\u6570: "+P.size+" lastIds: "+w),n+=w.length
;var A=_d11.concat(_)
;a.default.shuffleArray(A)
;var M=c.concat(A)
;var E=[]
;for(var _s48=0
;_s48<M.length
;_s48++)-1===E.indexOf(M[_s48])&&E.push(M[_s48])
;console.log("0-50% ID\u6570: "+M.length+" \u79CD\u7C7B\u6570: "+E.length+" ids\uFF1A",M)
;var R=T.concat(w)
;a.default.shuffleArray(R)
;var L=[]
;for(var _s49=0
;_s49<R.length
;_s49++)-1===L.indexOf(R[_s49])&&L.push(R[_s49])
;console.log("50-100% ID\u6570: "+R.length+" \u79CD\u7C7B\u6570: "+L.length+" ids\uFF1A",R)
;var k=M.concat(R),O=Object.create(null)
;for(var _s50=0
;_s50<k.length
;_s50++)O[k[_s50]]?O[k[_s50]]++:O[k[_s50]]=1
;return console.log("id\u603B\u6570: "+k.length+" \u603B\u79CD\u7C7B\u6570: "+Object.keys(O).length),console.log("\u68CB\u5B50\u6570\u91CF\u5206\u5E03: ",O),k
;
}
},{
key:"getIdsSpread3_0",value:function getIdsSpread3_0(e,t){
var i=6,o=.1
;0!==this.downType?(i=4,o=.2):(s.default.isExpertChallenge?s.default.getHoleData():l.default.getHoleData()).x>0&&(o=.1)
;var n=0,r=this.getFruitTypes(t)
;console.log("\u9AD8\u5BC6\u5EA6\u68CB\u5B50\u5206\u5E03 --------------------start"),console.log("\u539F\u59CB\u68CB\u5B50\u6C60\u5B50id",r)
;var c=[],u=new Map()
;for(var _s52=0
;_s52<i
;_s52++)c.push(r[_s52]),u.set(r[_s52],1)
;for(var _s53=0
;_s53<Math.floor(e*o)-i
;_s53++){
var _e178=Math.floor(Math.random()*i)
;c.push(r[_e178]),u.set(r[_e178],u.get(r[_e178])+1)
;
}a.default.shuffleArray(c),n+=c.length
;var _d12=[]
;var _iterator26=_createForOfIteratorHelper2(u),_step26
;try{
for(_iterator26.s()
;!(_step26=_iterator26.n()).done
;){
var _step26$value=_slicedToArray2(_step26.value,2),_s61=_step26$value[0],_a19=_step26$value[1]
;_a19%2==1&&_d12.push(_s61)
;
}
}catch(err){
_iterator26.e(err)
;
}finally{
_iterator26.f()
;
}console.log("0-10% \u5F00\u59CBID\u6570: "+c.length+" \u79CD\u7C7B\u6570: "+u.size+"  beginIds: "+c,"\u5947\u6570\u79CD\u7C7Bids\uFF1A",_d12)
;var h=[],f=Math.ceil(.6*r.length),g=new Map()
;for(var _s54=0
;_s54<f
;_s54++)h.push(r[_s54]),g.set(r[_s54],1)
;var p=Math.ceil(.3*e)
;p%2==1&&p++
;var m=p-(n+h.length)
;for(var _s55=0
;_s55<m
;_s55++){
var _e179=Math.floor(Math.random()*f)
;h.push(r[_e179]),g.has(r[_e179])?g.set(r[_e179],g.get(r[_e179])+1):g.set(r[_e179],1)
;
}a.default.shuffleArray(h)
;var _=new Set(h)
;var v=[]
;var _iterator27=_createForOfIteratorHelper2(g),_step27
;try{
for(_iterator27.s()
;!(_step27=_iterator27.n()).done
;){
var _step27$value=_slicedToArray2(_step27.value,2),_s62=_step27$value[0],_a20=_step27$value[1]
;_a20%2==1&&v.push(_s62)
;
}
}catch(err){
_iterator27.e(err)
;
}finally{
_iterator27.f()
;
}console.log("10%-30% ID\u6570: "+h.length+" \u79CD\u7C7B\u6570: "+_.size+" ids_10_30: "+h,"\u5947\u6570\u79CD\u7C7Bids\uFF1A",v),n+=h.length
;var y=[],C=Math.floor(e*(.4-.3))
;C%2==1&&C++
;var T=C-y.length,I=new Map()
;for(var _s56=0
;_s56<T
;_s56++){
var _e180=Math.floor(Math.random()*f)
;y.push(r[_e180]),I.has(r[_e180])?I.set(r[_e180],I.get(r[_e180])+1):I.set(r[_e180],1)
;
}a.default.shuffleArray(y)
;var S=new Set(h)
;var b=[]
;var _iterator28=_createForOfIteratorHelper2(I),_step28
;try{
for(_iterator28.s()
;!(_step28=_iterator28.n()).done
;){
var _step28$value=_slicedToArray2(_step28.value,2),_s63=_step28$value[0],_a21=_step28$value[1]
;_a21%2==1&&b.push(_s63)
;
}
}catch(err){
_iterator28.e(err)
;
}finally{
_iterator28.f()
;
}console.log("30%-40% ID\u6570: "+y.length+" \u79CD\u7C7B\u6570: "+S.size+" ids_30_40: "+y,"\u5947\u6570\u79CD\u7C7Bids\uFF1A",b),n+=y.length
;var F=r.slice(f)
;var w=[],D=3*r.length
;D%2==1&&D++
;var P=new Map()
;for(var _s57=0
;_s57<r.length
;_s57++)w.push(r[_s57]),w.push(r[_s57]),P.set(r[_s57],2)
;var A=D-w.length
;var M=Math.ceil(.5*F.length),E=F.slice(0,M),R=r.slice(0,f).concat(E)
;for(var _s58=0
;_s58<A
;_s58++){
var _e181=Math.floor(Math.random()*R.length)
;w.push(R[_e181]),P.has(R[_e181])?P.set(R[_e181],P.get(R[_e181])+1):P.set(R[_e181],1)
;
}a.default.shuffleArray(w)
;var L=new Set(w)
;var k=[]
;var _iterator29=_createForOfIteratorHelper2(P),_step29
;try{
for(_iterator29.s()
;!(_step29=_iterator29.n()).done
;){
var _step29$value=_slicedToArray2(_step29.value,2),_s64=_step29$value[0],_a22=_step29$value[1]
;_a22%2==1&&k.push(_s64)
;
}
}catch(err){
_iterator29.e(err)
;
}finally{
_iterator29.f()
;
}console.log("40%-65% ID\u6570: "+w.length+" \u79CD\u7C7B\u6570: "+L.size+" ids_40_65: "+w,"\u5947\u6570\u79CD\u7C7Bids\uFF1A",k),n+=w.length
;var O=[]
;var _iterator30=_createForOfIteratorHelper2(u.keys()),_step30
;try{
for(_iterator30.s()
;!(_step30=_iterator30.n()).done
;){
var _s65=_step30.value
;u.get(_s65)%2==1&&O.push(_s65)
;
}
}catch(err){
_iterator30.e(err)
;
}finally{
_iterator30.f()
;
}g.forEach(function(e,t){
e%2==1&&O.push(t)
;
}),I.forEach(function(e,t){
e%2==1&&O.push(t)
;
}),P.forEach(function(e,t){
e%2==1&&O.push(t)
;
})
;var K=[].concat(O)
;var N=e-n-O.length
;N%2==1&&console.error("\u5269\u4F59\u5BF9\u6570\u4E0D\u53EF\u80FD\u662F\u57FA\u6570 65-100%: "+N)
;for(var _s59=0
;_s59<Math.floor(N/2)
;_s59++){
var _e182=Math.floor(Math.random()*f)
;O.push(r[_e182]),O.push(r[_e182])
;
}a.default.shuffleArray(O)
;var U=new Set(O)
;console.log("65-100% ID\u6570: "+O.length+" \u79CD\u7C7B\u6570: "+U.size+" ids_65_100: "+O,"\u8865\u5145\u5947\u6570\u79CD\u7C7Bids\uFF1A",K)
;var B=c.concat(h,y,w,O),x=Object.create(null)
;for(var _s60=0
;_s60<B.length
;_s60++)x[B[_s60]]?x[B[_s60]]++:x[B[_s60]]=1
;return console.log("id\u603B\u6570: "+B.length+" \u603B\u79CD\u7C7B\u6570: "+Object.keys(x).length),console.log("\u68CB\u5B50\u6570\u91CF\u5206\u5E03: ",x),console.log("\u9AD8\u5BC6\u5EA6\u68CB\u5B50\u5206\u5E03 --------------------end"),B
;
}
},{
key:"getIdsSpread4_0",value:function getIdsSpread4_0(e,t){
console.log("\u8FDB\u5EA6\u5206\u5E03 --------------------start")
;var i=0,o=this.getFruitTypes(t)
;console.log("\u539F\u59CB\u68CB\u5B50\u6C60\u5B50id",o)
;var n=[],s=new Map()
;for(var _a23=0
;_a23<4
;_a23++)n.push(o[_a23]),s.set(o[_a23],1)
;for(var _a24=0
;_a24<Math.floor(.1*e)-4
;_a24++){
var _e183=Math.floor(4*Math.random())
;n.push(o[_e183]),s.set(o[_e183],s.get(o[_e183])+1)
;
}a.default.shuffleArray(n),i+=n.length,console.log("\u5F00\u59CBID\u6570: "+n.length+" \u79CD\u7C7B\u6570: "+s.size+"  beginIds: "+n)
;var r=[]
;var _iterator31=_createForOfIteratorHelper2(s.keys()),_step31
;try{
for(_iterator31.s()
;!(_step31=_iterator31.n()).done
;){
var _a37=_step31.value
;s.get(_a37)%2==1&&r.push(_a37)
;
}
}catch(err){
_iterator31.e(err)
;
}finally{
_iterator31.f()
;
}var l=Math.ceil(.4*o.length),c=new Map()
;for(var _a25=0
;_a25<l
;_a25++)r.push(o[_a25]),c.set(o[_a25],1)
;var u=Math.ceil(.2*e)
;u%2==1&&u++
;var _d13=u-(i+r.length)
;for(var _a26=0
;_a26<_d13
;_a26++){
var _e184=Math.floor(Math.random()*l)
;r.push(o[_e184]),c.has(o[_e184])?c.set(o[_e184],c.get(o[_e184])+1):c.set(o[_e184],1)
;
}a.default.shuffleArray(r),i+=r.length,console.log("10%-20% ID\u6570: "+r.length+" \u79CD\u7C7B\u6570: "+new Set(r).size+" ids_10_30: "+r)
;var h=[]
;var _iterator32=_createForOfIteratorHelper2(c.keys()),_step32
;try{
for(_iterator32.s()
;!(_step32=_iterator32.n()).done
;){
var _a38=_step32.value
;c.get(_a38)%2==1&&h.push(_a38)
;
}
}catch(err){
_iterator32.e(err)
;
}finally{
_iterator32.f()
;
}var f=Math.ceil(.6*o.length),g=new Map()
;for(var _a27=0
;_a27<f
;_a27++)h.push(o[_a27]),g.set(o[_a27],1)
;var p=Math.ceil(.3*e)
;p%2==1&&p++
;var m=p-(i+h.length)
;for(var _a28=0
;_a28<m
;_a28++){
var _e185=Math.floor(Math.random()*f)
;h.push(o[_e185]),g.has(o[_e185])?g.set(o[_e185],g.get(o[_e185])+1):g.set(o[_e185],1)
;
}a.default.shuffleArray(h),console.log("20%-30% ID\u6570: "+h.length+" \u79CD\u7C7B\u6570: "+new Set(h).size+" ids_20_30: "+h),i+=h.length
;var _=[]
;g.forEach(function(e,t){
e%2==1&&_.push(t)
;
})
;var v=Math.ceil(.5*e)
;v%2==1&&v++
;var y=v-(i+_.length)
;y%2==1&&console.error("\u5269\u4F59\u5BF9\u6570\u4E0D\u53EF\u80FD\u662F\u57FA\u6570 lastCount_30_50: "+y)
;for(var _a29=0
;_a29<y/2
;_a29++){
var _e186=Math.floor(Math.random()*f)
;_.push(o[_e186]),_.push(o[_e186])
;
}a.default.shuffleArray(_)
;var C=new Set(_)
;console.log("30%-50% ID\u6570: "+_.length+" \u79CD\u7C7B\u6570: "+C.size+" ids_30_50: "+_),i+=_.length
;var T=[],I=new Map()
;var S=[]
;for(
;S.length<4
;){
var _e187=Math.floor(Math.random()*(o.length-f))+f
;-1===S.indexOf(_e187)&&S.push(_e187)
;
}for(var _a30=0
;_a30<S.length
;_a30++)T.push(o[S[_a30]]),I.set(o[S[_a30]],1)
;for(var _a31=4
;_a31<12
;_a31++){
var _e188=Math.floor(Math.random()*o.length)
;T.push(o[_e188]),I.has(o[_e188])?I.set(o[_e188],I.get(o[_e188])+1):I.set(o[_e188],1)
;
}a.default.shuffleArray(T)
;var b=new Set(T),F=[]
;var _loop19=function _loop19(){
var e=T[_a32]
;-1===h.findIndex(function(t){
return t===e
;
})&&F.push(e)
;
}
;for(var _a32=0
;_a32<T.length
;_a32++){
_loop19()
;
}console.log("50%\u5F00\u59CBID\u6570: "+T.length+" \u79CD\u7C7B\u6570: "+b.size+" ids_50_link: "+T,"\u65B0\u589Eid\uFF1A",F),i+=T.length
;var w=[]
;I.forEach(function(e,t){
e%2==1&&w.push(t)
;
})
;var D=e-(i+w.length)
;D%2==1&&console.error("\u5269\u4F59\u5BF9\u6570\u4E0D\u53EF\u80FD\u662F\u57FA\u6570 lastCount: "+D)
;for(var _a33=0
;_a33<D/2
;_a33++){
var _e189=void 0
;_e189=f+_a33<o.length?f+_a33:Math.floor(Math.random()*o.length),w.push(o[_e189]),w.push(o[_e189])
;
}a.default.shuffleArray(w)
;var P=new Set(w)
;console.log("\u6700\u540E\u68CB\u5B50ID\u6570: "+w.length+" \u79CD\u7C7B\u6570: "+P.size+" lastIds: "+w),i+=w.length
;var A=r.concat(h.concat(_))
;a.default.shuffleArray(A)
;var M=n.concat(A)
;var E=[]
;for(var _a34=0
;_a34<M.length
;_a34++)-1===E.indexOf(M[_a34])&&E.push(M[_a34])
;console.log("0-50% ID\u6570: "+M.length+" \u79CD\u7C7B\u6570: "+E.length+" ids\uFF1A",M)
;var R=T.concat(w)
;a.default.shuffleArray(R)
;var L=[]
;for(var _a35=0
;_a35<R.length
;_a35++)-1===L.indexOf(R[_a35])&&L.push(R[_a35])
;console.log("50-100% ID\u6570: "+R.length+" \u79CD\u7C7B\u6570: "+L.length+" ids\uFF1A",R)
;var k=M.concat(R),O=Object.create(null)
;for(var _a36=0
;_a36<k.length
;_a36++)O[k[_a36]]?O[k[_a36]]++:O[k[_a36]]=1
;return console.log("id\u603B\u6570: "+k.length+" \u603B\u79CD\u7C7B\u6570: "+Object.keys(O).length),console.log("\u68CB\u5B50\u6570\u91CF\u5206\u5E03: ",O),k
;
}
},{
key:"getIdsSpreadA",value:function getIdsSpreadA(e){
var t=6,i=.1
;0!==this.downType?(t=4,i=.2):(s.default.isExpertChallenge?s.default.getHoleData():l.default.getHoleData()).x>0&&(i=.1)
;var o=this.getFruitTypes(),n=[]
;for(var _s66=0
;_s66<o.length
;_s66++){
var _e190=30,_t130=Math.floor(o.length/2)
;_s66<_t130&&(_e190+=10*(_t130-_s66)),n.push(_e190)
;
}var r=new Map()
;for(var _s67=0
;_s67<o.length
;_s67++)r.set(o[_s67],2)
;for(var _s68=0
;_s68<e/2-o.length
;_s68++){
var c=this.getNextFruitId(o,n)
;r.set(c,r.get(c)+2)
;
}var u=Array.from(r.entries())
;u.sort(function(e,t){
return t[1]-e[1]
;
})
;var _d14=u.slice(0,t).map(function(e){
return e[0]
;
}),h=[]
;for(var _s69=0
;_s69<t
;_s69++)for(var _e191=0
;_e191<r.get(_d14[_s69])
;_e191++)h.push(_d14[_s69])
;a.default.shuffleArray(h),h.splice(Math.floor(e*i))
;for(var _s70=0
;_s70<h.length
;_s70++){
var _e192=h[_s70]
;r.set(_e192,r.get(_e192)-1)
;
}var f=[]
;r.forEach(function(e,t){
e>0&&f.push(t)
;
}),a.default.shuffleArray(f)
;var g=0,p=Math.floor(f.length/2)
;for(var _s71=0
;_s71<f.length
;_s71++)if((g+=r.get(f[_s71]))+h.length>=e/2&&_s71>p){
p=_s71
;break
;
}f.splice(p+1)
;var m=[]
;for(p=0
;m.length+h.length<e/2
;){
var _e193=f[p]
;r.get(_e193)>0&&(m.push(_e193),r.set(_e193,r.get(_e193)-1)),p=(p+1)%f.length
;
}a.default.shuffleArray(m)
;var _=[]
;r.forEach(function(e,t){
if(e>0)for(var _i114=0
;_i114<e
;_i114++)_.push(t)
;
}),a.default.shuffleArray(_)
;var v=[]
;return v=h.concat(m,_),console.log("ID\u603B\u6570\uFF1A"+v.length),v
;
}
},{
key:"getIdsSpreadB",value:function getIdsSpreadB(e,t){
this.spreadType=u.Simple
;var i=6,o=.1,n=Math.floor(e/2)
;0!==this.downType?(i=4,o=.2):(s.default.isExpertChallenge?s.default.getHoleData():l.default.getHoleData()).x>0&&(o=.1)
;var r=this.getFruitTypes(t),c=[]
;for(var _s72=0
;_s72<r.length
;_s72++){
var _e194=30,_t131=Math.floor(r.length/2)
;_s72<_t131&&(_e194+=10*(_t131-_s72)),c.push(_e194)
;
}var _d15=new Map()
;for(var _s73=0
;_s73<r.length
;_s73++)_d15.set(r[_s73],2)
;for(var _s74=0
;_s74<n-r.length
;_s74++){
var h=this.getNextFruitId(r,c)
;_d15.set(h,_d15.get(h)+2)
;
}var f=Array.from(_d15.entries())
;f.sort(function(e,t){
return t[1]-e[1]
;
})
;var g=f.slice(0,i).map(function(e){
return e[0]
;
})
;console.log("beginKeys: "+g.toString())
;var p=[]
;for(var _s75=0
;_s75<i
;_s75++)for(var _e195=0
;_e195<_d15.get(g[_s75])
;_e195++)p.push(g[_s75])
;var m=[],_=Math.floor(n*o)
;for(var _s76=0
;_s76<_
;_s76++){
var _e196=Math.floor(Math.random()*(p.length/2)),_t132=p[2*_e196]
;m.push(_t132),m.push(_t132),p.splice(2*_e196,2),_d15.set(_t132,_d15.get(_t132)-2)
;
}a.default.shuffleArray(m),console.log("\u5F00\u59CB\u7684Id\u6570\uFF1A"+2*_+"  beginIds: "+m.toString())
;var v=[]
;_d15.forEach(function(e,t){
e>0&&v.push(t)
;
}),a.default.shuffleArray(v)
;var y=[],C=Math.floor(.5*n-m.length/2)
;for(var _s77=0
;_s77<v.length
;_s77++){
for(var _e197=0
;_e197<_d15.get(v[_s77])
;_e197++)y.push(v[_s77])
;if(_s77>v.length/2&&y.length>=2*C)break
;
}var T=[]
;for(var _s78=0
;_s78<C
;_s78++){
var _e198=Math.floor(Math.random()*(y.length/2)),_t133=y[2*_e198]
;T.push(_t133),T.push(_t133),y.splice(2*_e198,2),_d15.set(_t133,_d15.get(_t133)-2)
;
}a.default.shuffleArray(T),console.log("\u4E2D\u90E8 \u7684Id\u6570\uFF1A"+2*C+"  midIds: "+T.toString())
;var I=[]
;_d15.forEach(function(e,t){
if(e>0)for(var _i115=0
;_i115<e
;_i115++)I.push(t)
;
}),a.default.shuffleArray(I),console.log("\u6700\u540E \u7684Id\u6570\uFF1A"+I.length+"  lastIds: "+I.toString())
;var S=[]
;return S=m.concat(T,I),console.log("\u603Bid\u6570 = "+S.length),S
;
}
},{
key:"getIdsFromDifficulty",value:function getIdsFromDifficulty(e){
var t=0===this.downType,i=e>150,o=this.fruitTypeCount>15
;if(!t||!i||!o)return console.log("[\u56F0\u96BE\u5206\u5E03] \u5F53\u524D\u4E0D\u6EE1\u8DB3\u56F0\u96BE\u5206\u5E03\u6761\u4EF6\uFF0C\u8D70\u6B63\u5E38\u5206\u5E03\u903B\u8F91"),console.log("[\u56F0\u96BE\u5206\u5E03] \u6761\u4EF61(\u7EB5\u5411\u5206\u5E03): \u9700\u8981 downType=0, \u5F53\u524D\u503C=".concat(this.downType,", ").concat(t?"\u6EE1\u8DB3":"\u4E0D\u6EE1\u8DB3")),console.log("[\u56F0\u96BE\u5206\u5E03] \u6761\u4EF62(\u68CB\u5B50\u603B\u6570): \u9700\u8981 >150, \u5F53\u524D\u503C=".concat(e,", ").concat(i?"\u6EE1\u8DB3":"\u4E0D\u6EE1\u8DB3")),console.log("[\u56F0\u96BE\u5206\u5E03] \u6761\u4EF63(\u68CB\u5B50\u79CD\u7C7B): \u9700\u8981 >15, \u5F53\u524D\u503C=".concat(this.fruitTypeCount,", ").concat(o?"\u6EE1\u8DB3":"\u4E0D\u6EE1\u8DB3")),this.getIds(e)
;var n=r.default.DEDUCT_TYPE_COUNT,s=e-r.default.getDeductFruitCount(),a=this.fruitTypeCount-n,l=this.getIds(s,a)
;this.spreadType=u.Difficult
;var c=[]
;for(var _r30=0
;_r30<n
;_r30++)c.push(a+_r30+1)
;var _d16=[]
;for(var _r31=0
;_r31<n
;_r31++){
var _e199=c[_r31],_t134=Math.max(0,l.length-20),_i116=_t134+Math.floor(Math.random()*Math.min(20,l.length-_t134))
;l.splice(_i116,0,_e199),_d16.push(_i116)
;
}var h=[]
;for(var _r32=0
;_r32<n
;_r32++){
var _e200=c[_r32],_t135=Math.max(0,l.length-80),_i117=Math.max(0,l.length-60),_o79=Math.max(1,_i117-_t135),_n48=_t135+Math.floor(Math.random()*_o79)
;l.splice(_n48,0,_e200),h.push(_n48)
;
}return console.log("[\u7EB5\u5411\u56F0\u96BE\u5206\u5E03] \u6263\u9664\u7684\u68CB\u5B50\u79CD\u7C7B\u6570\u5217\u8868: ".concat(c.join(", "))),console.log("[\u7EB5\u5411\u56F0\u96BE\u5206\u5E03] \u6700\u672B\u5C3E\u63D2\u5165\u7684\u4F4D\u7F6E: ".concat(_d16.join(", "))),console.log("[\u7EB5\u5411\u56F0\u96BE\u5206\u5E03] \u672B\u5C3E\u5F80\u524D\u657060-80\u7684\u4F4D\u7F6E: ".concat(h.join(", "))),console.log("[\u7EB5\u5411\u56F0\u96BE\u5206\u5E03] \u5F53\u524D\u6240\u6709\u68CB\u5B50id\u5217\u8868: ".concat(l.join(", "))),l
;
}
},{
key:"getFlowStrategyVerticalIds",value:function getFlowStrategyVerticalIds(e,t){
var i=null!=e?e:this.getFruitCount(),o=r.default.getUserType()
;if(o===r.EUserType.Default)return this.getIds(i,t)
;if(o===r.EUserType.NormalAdWatch){
var _e201=r.default.isNormalAdWatchUseEasyDistribution(),_o80=r.default.getNormalAdWatchAdjustDetail()
;return 0!==_o80.finalAdjustPercent&&r.default.setNormalAdTypeAdjust(_o80.finalAdjustPercent,this.fruitTypeCount),_e201?this.getIdsSpreadB(i,t):this.getIds(i,t)
;
}if(o===r.EUserType.NoAdWatch){
var _e202=r.default.getContinuousNoAdLevelCount(),_o81=r.default.getNoAdWinCount(),_n49=r.default.calcNoAdTypeAdjustPercent(),_s79=c.default.getMaxFruitTypeCount()
;if(_e202<=2)return console.log("[\u4E0D\u770B\u5E7F\u544A\u7528\u6237] \u524D".concat(_e202,"\u5173\u4E5F\u672A\u770B\u8FC7\u5E7F\u544A\uFF0C\u91C7\u7528\u6B63\u5E38\u5206\u5E03")),console.log("[\u4E0D\u770B\u5E7F\u544A\u7528\u6237] \u4E0D\u770B\u5E7F\u544A\u901A\u5173\u6B21\u6570: ".concat(_o81,", \u68CB\u5B50\u79CD\u7C7B\u8C03\u6574: +").concat(100*_n49,"%")),r.default.setNoAdTypeAdjust(_n49,_s79),this.getIds(i,t)
;var _a39=50,_l9=10*_e202,_u7=_a39+_l9,_d17=Math.random()*_u7<_l9
;return console.log("[\u4E0D\u770B\u5E7F\u544A\u7528\u6237] \u524D".concat(_e202,"\u5173\u4E5F\u672A\u770B\u8FC7\u5E7F\u544A\uFF0C\u6743\u91CD\u8BA1\u7B97: \u6B63\u5E38\u5206\u5E03=").concat(_a39,", \u56F0\u96BE\u5206\u5E03=").concat(_l9)),console.log("[\u4E0D\u770B\u5E7F\u544A\u7528\u6237] \u91C7\u7528".concat(_d17?"\u56F0\u96BE\u5206\u5E03 getIdsFromDifficulty":"\u6B63\u5E38\u5206\u5E03 getIds","\u5206\u5E03")),console.log("[\u4E0D\u770B\u5E7F\u544A\u7528\u6237] \u4E0D\u770B\u5E7F\u544A\u901A\u5173\u6B21\u6570: ".concat(_o81,", \u68CB\u5B50\u79CD\u7C7B\u8C03\u6574: +").concat(100*_n49,"%")),r.default.setNoAdTypeAdjust(_n49,_s79),_d17?this.getIdsFromDifficulty(i):this.getIds(i,t)
;
}return o===r.EUserType.CrossDayLogin||o===r.EUserType.MultiDayStuck?this.getIdsSpreadB(i,t):(r.EUserType.NotPassLevel,this.getIds(i,t))
;
}
},{
key:"getIdsSpreadHor1",value:function getIdsSpreadHor1(e,t){
var i=this.fruitTypeCount,o=[],n=this.getFruitTypes(t)
;console.log("\u6240\u6709\u68CB\u5B50ID: ",n,"\u79CD\u7C7B\u6570: ",i)
;var s=Math.ceil(.3*i),r=n.slice(0,6),l=n.slice(6,6+s),c=n.slice(6+s),u=2*Math.ceil(Math.floor(.2*e)/2),_d18=2*Math.ceil(Math.floor(.4*e)/2),h=e-u-_d18
;h=2*Math.ceil(h/2)
;var f=_d18-18
;f=2*Math.ceil(f/2)
;var g=r.slice()
;for(var _a40=0
;_a40<u/2
;_a40++){
var _e203=g[Math.floor(Math.random()*g.length)]
;o.push(_e203),o.push(_e203)
;
}a.default.shuffleArray(o),console.log("0-20% \u68CB\u5B50ID\u6570: "+o.length+" \u79CD\u7C7B\u6570:"+g.length+" ids: "+o.toString())
;var p=[],m=l.slice(0,Math.ceil(.3*i)),_=g.concat(m)
;for(var _a41=0
;_a41<18
;_a41++){
if(m.length>0){
var _e204=m.pop()
;p.push(_e204)
;continue
;
}var _e205=_[Math.floor(Math.random()*_.length)]
;p.push(_e205)
;
}a.default.shuffleArray(p),o=o.concat(p),console.log("20%-60%\u524D18\u4E2A \u68CB\u5B50ID\u6570: "+p.length+" \u79CD\u7C7B\u6570:"+_.length,"part1Ids:",p)
;var v=new Map()
;for(var _a42=0
;_a42<p.length
;_a42++)v.set(p[_a42],(v.get(p[_a42])||0)+1)
;var y=[]
;var _iterator33=_createForOfIteratorHelper2(v),_step33
;try{
for(_iterator33.s()
;!(_step33=_iterator33.n()).done
;){
var _step33$value=_slicedToArray2(_step33.value,2),_a45=_step33$value[0],b=_step33$value[1]
;b%2==1&&y.push(_a45)
;
}
}catch(err){
_iterator33.e(err)
;
}finally{
_iterator33.f()
;
}console.log("\u6CA1\u6709\u914D\u5BF9\u7684\u68CB\u5B50 = ",y)
;var C=[],T=_.slice()
;c.length>0&&T.push(c[0]),C.push.apply(C,y)
;for(var _a43=0
;_a43<(f-y.length)/2
;_a43++){
if(0==_a43){
C.push(c[0]),C.push(c[0])
;continue
;
}var _e206=T[Math.floor(Math.random()*T.length)]
;C.push(_e206),C.push(_e206)
;
}a.default.shuffleArray(C),o=o.concat(C),console.log("20%-60%\u5269\u4F59 \u68CB\u5B50ID\u6570: "+C.length+" \u79CD\u7C7B\u6570:"+T.length,"part2Ids:",C)
;var I=[],S=g.concat(l).concat(c)
;for(var _a44=0
;_a44<h/2
;_a44++){
var _e207=S[Math.floor(Math.random()*S.length)]
;I.push(_e207),I.push(_e207)
;
}if(a.default.shuffleArray(I),o=o.concat(I),console.log("60%-100% \u68CB\u5B50ID\u6570: "+I.length+" \u79CD\u7C7B\u6570:"+S.length,"zone3Ids:",I),o.length<e){
var _t136=e-o.length
;_t136=2*Math.ceil(_t136/2)
;for(var _e208=0
;_e208<_t136/2
;_e208++){
var _e209=n[Math.floor(Math.random()*n.length)]
;o.push(_e209),o.push(_e209)
;
}
}if(o.length>e){
var _t137=o.length-e
;if(_t137=2*Math.ceil(_t137/2),(o=o.slice(0,e)).length%2!=0){
o=o.slice(0,e-1)
;var _t138=n[Math.floor(Math.random()*n.length)]
;o.push(_t138),o.push(_t138)
;
}
}return console.log("id\u603B\u6570: "+o.length),o
;
}
},{
key:"getIdsSpreadHor2",value:function getIdsSpreadHor2(e){
var t=this.fruitTypeCount,i=[],o=this.getFruitTypes()
;console.log("\u6240\u6709\u68CB\u5B50ID: ",o,"\u79CD\u7C7B\u6570: ",t)
;var n=Math.ceil(.3*t),s=o.slice(0,6),r=o.slice(6,6+n),l=o.slice(6+n),c=2*Math.ceil(Math.floor(.2*e)/2),u=2*Math.ceil(Math.floor(.4*e)/2),_d19=e-c-u,h=18,f=(_d19=2*Math.ceil(_d19/2))-(h=2*Math.ceil(h/2))
;f=2*Math.ceil(f/2)
;var g=s.slice()
;for(var _a46=0
;_a46<c/2
;_a46++){
var _e210=g[Math.floor(Math.random()*g.length)]
;i.push(_e210),i.push(_e210)
;
}a.default.shuffleArray(i),console.log("0-20% \u68CB\u5B50ID\u6570: "+i.length+" \u79CD\u7C7B\u6570:"+g.length+" ids: "+i.toString())
;var p=[],m=g.concat(l.slice(1))
;for(var _a47=0
;_a47<u/2
;_a47++){
var _e211=m[Math.floor(Math.random()*m.length)]
;p.push(_e211),p.push(_e211)
;
}a.default.shuffleArray(p),i=i.concat(p),console.log("20%-60% \u68CB\u5B50ID\u6570: "+p.length+" \u79CD\u7C7B\u6570:"+m.length,"part2Ids:",p)
;var _=[],v=r.slice(0,Math.ceil(.3*t)),y=g.concat(v).concat(l.slice(1))
;for(var _a48=0
;_a48<h/2
;_a48++){
if(v.length>0){
var _e212=v.pop()
;_.push(_e212)
;continue
;
}var _e213=y[Math.floor(Math.random()*y.length)]
;_.push(_e213)
;
}a.default.shuffleArray(_),i=i.concat(_),console.log("60%-100%\u524D18\u4E2A \u68CB\u5B50ID\u6570: "+_.length+" \u79CD\u7C7B\u6570:"+y.length,"zone3Part1Ids:",_)
;var C=new Map()
;for(var _a49=0
;_a49<_.length
;_a49++)C.set(_[_a49],(C.get(_[_a49])||0)+1)
;var T=[]
;var _iterator34=_createForOfIteratorHelper2(C),_step34
;try{
for(_iterator34.s()
;!(_step34=_iterator34.n()).done
;){
var _step34$value=_slicedToArray2(_step34.value,2),_a51=_step34$value[0],b=_step34$value[1]
;b%2==1&&T.push(_a51)
;
}
}catch(err){
_iterator34.e(err)
;
}finally{
_iterator34.f()
;
}console.log("\u6CA1\u6709\u914D\u5BF9\u7684\u68CB\u5B50 = ",T)
;var I=[],S=o.slice()
;I.push.apply(I,T)
;for(var _a50=0
;_a50<(f-T.length)/2
;_a50++){
if(0==_a50){
I.push(l[0]),I.push(l[0])
;continue
;
}var _e214=S[Math.floor(Math.random()*S.length)]
;I.push(_e214),I.push(_e214)
;
}if(a.default.shuffleArray(I),i=i.concat(I),console.log("60%-100%\u5269\u4F59 \u68CB\u5B50ID\u6570: "+I.length+" \u79CD\u7C7B\u6570:"+S.length,"zone3Part2Ids:",I),i.length<e){
var _t139=e-i.length
;_t139=2*Math.ceil(_t139/2)
;for(var _e215=0
;_e215<_t139/2
;_e215++){
var _e216=o[Math.floor(Math.random()*o.length)]
;i.push(_e216),i.push(_e216)
;
}
}if(i.length>e){
var _t140=i.length-e
;if(_t140=2*Math.ceil(_t140/2),(i=i.slice(0,e)).length%2!=0){
i=i.slice(0,e-1)
;var _t141=o[Math.floor(Math.random()*o.length)]
;i.push(_t141),i.push(_t141)
;
}
}return console.log("id\u603B\u6570: "+i.length),i
;
}
},{
key:"getHorIds",value:function getHorIds(e,t){
var i=[]
;return i=d.getIdsSpreadHor1(e,t),this.spreadType=u.Normal,i
;
}
},{
key:"getFruitCount",value:function getFruitCount(){
var e=s.default.isExpertChallenge?s.default.getHoleData():l.default.getHoleData(),t=l.default.getTargetCount()
;return Math.max(0,t-e.x)
;
}
},{
key:"getNextFruitId",value:function getNextFruitId(e,t){
var i=t.reduce(function(e,t){
return e+t
;
},0),o=Math.random()*i,n=0
;for(var _s80=0
;_s80<t.length
;_s80++)if(o<=(n+=t[_s80]))return e[_s80]
;return 1
;
}
},{
key:"getFruitTypes",value:function getFruitTypes(e){
var t=null!=e?e:this.fruitTypeCount,i=t,o=!1,n=""
;var s=c.default.getMaxFruitTypeCount()
;var l=0
;var u=r.default.getUserType()
;if(u===r.EUserType.NotPassLevel)l=-.1,console.log("[\u5361\u5173\u4E0D\u901A\u8FC7\u7528\u6237] \u68CB\u5B50\u79CD\u7C7B\u8C03\u6574: ".concat(100*l,"%")),0!==l&&(t=i-Math.floor(i*Math.abs(l)),o=!0,n="decrease")
;else if(u===r.EUserType.MultiDayStuck){
var _e217=r.default.getContinuousNoWinDays()
;l=_e217<=3?0:4===_e217?-.1:-.2,console.log("[\u8FDE\u7EED\u591A\u65E5\u672A\u901A\u5173\u7528\u6237] \u8FDE\u7EED".concat(_e217,"\u5929\u672A\u901A\u5173(\u6BCF\u65E5\u6709\u6548\u6311\u6218>=3\u6B21), \u68CB\u5B50\u79CD\u7C7B\u8C03\u6574: ").concat(100*l,"%")),0!==l&&(t=Math.max(1,Math.floor(t*(1+l))),o=!0,n=l>0?"increase":"decrease")
;
}else u===r.EUserType.LowAdWatch?(l=r.default.getLowAdWatchTypeAdjustPercent())>0&&(t=i+Math.floor(i*l),o=!0,n="increase",console.log("[\u770B\u5E7F\u544A\u8F83\u5C11\u7528\u6237] \u68CB\u5B50\u79CD\u7C7B\u63D0\u5347\u5E45\u5EA6: ".concat(100*l,"%, \u539F\u59CB: ").concat(i,", \u8C03\u6574\u540E: ").concat(Math.max(1,Math.min(s,t))))):u===r.EUserType.NoAdWatch?0!==(l=r.default.getNoAdTypeAdjustPercent())&&(o=!0,l>0?(n="increase",t=i+Math.floor(i*l)):(n="decrease",t=i-Math.floor(i*Math.abs(l))),r.default.resetNoAdTypeAdjust()):u===r.EUserType.NormalAdWatch&&0!==(l=r.default.getNormalAdTypeAdjustPercent())&&(o=!0,l>0?(n="increase",t=i+Math.floor(i*l)):(n="decrease",t=i-Math.floor(i*Math.abs(l))),r.default.resetNormalAdTypeAdjust())
;t=Math.max(1,Math.min(s,t)),this.fruitAdjustPercent=Math.floor(100*l),console.log("\u79CD\u7C7B\u68CB\u5B50\u8C03\u6574\u767E\u5206\u6BD4",this.fruitAdjustPercent)
;var _d20=a.default.getRandomId(i,null,!1),h=a.default.getRandomId(t,null,!1)
;return o&&(console.log("[".concat(r.default.getUserTypeString(u),"] \u539F\u79CD\u7C7Bid\u5217\u8868 (").concat(i,"\u4E2A): [").concat(_d20.join(", "),"]")),console.log("[".concat(r.default.getUserTypeString(u),"] ").concat("increase"===n?"\u589E\u52A0":"\u51CF\u5C11","\u540E\u79CD\u7C7Bid\u5217\u8868 (").concat(t,"\u4E2A): [").concat(h.join(", "),"]"))),a.default.shuffleArray(h),this.updateIdsBySecretList(h),this.initLevelChangeIds(h),h
;
}
},{
key:"initChangeItemList",value:function initChangeItemList(e){
var _this212=this
;if(this.levelChangeItemList=[],s.default.isExpertChallenge)return void(this.levelChangeTypeIdMap&&this.levelChangeTypeIdMap.clear())
;var t=l.default.getLevelData()
;if(t&&t.exchangeCount){
var _t142=function _t142(){
return Array.from(_this212.levelChangeTypeIdMap.values()).includes(!1)
;
}
;for(
;_t142()
;){
var _t143=e[Math.floor(Math.random()*e.length)]
;!1===this.levelChangeTypeIdMap.get(_t143.getId())&&(_t143.isChanged=!0,_t143.setChangeFlag(!0,!1),this.levelChangeItemList.push(_t143),this.levelChangeTypeIdMap.set(_t143.getId(),!0))
;
}
}
}
},{
key:"updateChangeItemListPos",value:function updateChangeItemListPos(){
var _this213=this
;if(!this.isChangeItemList){
if(this.levelChangeItemList&&this.levelChangeItemList.length>1){
var _e218=[]
;var _t144=[],_i118=[]
;this.levelChangeItemList.forEach(function(o){
o.startChangeFlagAnim(function(){
if(_e218.length!==_this213.levelChangeItemList.length){
_e218.length=0
;for(var _o82=0
;_o82<_this213.levelChangeItemList.length
;_o82++){
var _n50=void 0
;_n50=_this213.levelChangeItemList.length-1===_o82?0:_o82+1,_e218[_n50]={
id:_this213.levelChangeItemList[_o82].getId(),isSlice:_this213.levelChangeItemList[_o82].isSlice
},_t144.push(_this213.levelChangeItemList[_o82].getId()),_i118[_n50]=_e218[_n50].id
;
}console.log("itemIds = "+_t144.toString()),console.log("dataIds = "+_i118.toString())
;
}var n=_this213.levelChangeItemList.indexOf(o)
;o.setSprite(_e218[n].id,_e218[n].isSlice)
;
})
;
})
;
}else this.hideAllChangeItemList()
;this.isChangeItemList=!0
;
}
}
},{
key:"hideAllChangeItemList",value:function hideAllChangeItemList(){
this.levelChangeItemList&&1===this.levelChangeItemList.length&&this.levelChangeItemList.forEach(function(e){
e.setChangeFlag(!1)
;
})
;
}
}])
;return d
;
}()
;i.default=d,cc._RF.pop()
;

_RF.push(t,"7320364f6NAE7bP1VkGcVmw","DynamicLevel_Utils"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.DynamicLevel_Utils=void 0
;var o=e("../../config/FK_Cfg"),n=e("../../dataMgr/FK_ABTestMgr"),s=e("../mgr/StorageMgr"),r=e("../mgr/ToastMgr"),a=e("./Level_Utils"),l=e("./NormalCfg_Utils")
;var c=/*#__PURE__*/function(){
function c(){
_classCallCheck2(this,c)
;
}_createClass2(c,null,[{
key:"getCountsDiffcultRatio",value:function getCountsDiffcultRatio(){
var e=this.getChallengeCounts(),t=this.getAdvertCounts()
;return 0===e?0:t/e
;
}
},{
key:"isCondRange",value:function isCondRange(e,t){
if(!t||!t.trim())return!1
;var i=t.split(","),o=i[0][0],n=i[1][i[1].length-1]
;var s=!1
;"["===o?s=e>=parseInt(i[0].slice(1)):"("===o&&(s=e>parseInt(i[0].slice(1)))
;var r=!1
;return"]"===n?r=e<=parseInt(i[1].slice(0,i[1].length-1)):")"===n&&(r=e<parseInt(i[1].slice(0,i[1].length-1))),s&&r
;
}
},{
key:"getLevelCondCfg",value:function getLevelCondCfg(e,t){
var i=o.FK_Cfg.LevelCond.getAll(),n=Object.entries(i)
;for(var _o10=0
;_o10<n.length
;_o10++){
var _n$_o=_slicedToArray2(n[_o10],2),_i27=_n$_o[0],_s8=_n$_o[1],_r5=this.isCondRange(e,_s8.cond1),_a2=this.isCondRange(t,_s8.cond2)
;if(_r5&&_a2)return _s8
;
}return console.warn("[DynamicLevel] \u672A\u627E\u5230\u5339\u914D\u7684LevelCond\u914D\u7F6E, ratio=".concat(e,", challengeCounts=").concat(t)),null
;
}
},{
key:"getStayDayCfg",value:function getStayDayCfg(e){
var t=o.FK_Cfg.StayDay.getAll(),i=Object.entries(t)
;for(var _o11=0
;_o11<i.length
;_o11++){
var _i$_o=_slicedToArray2(i[_o11],2),_t24=_i$_o[0],_n8=_i$_o[1]
;if(this.isCondRange(e,_n8.cond3))return _n8
;
}return null
;
}
},{
key:"getStrategyCfg",value:function getStrategyCfg(e){
var t=o.FK_Cfg.Strategy.getAll(),i=Object.entries(t)
;for(var _o12=0
;_o12<i.length
;_o12++){
var _i$_o2=_slicedToArray2(i[_o12],2),_t25=_i$_o2[0],_n9=_i$_o2[1]
;if(this.isCondRange(e,_n9.cond1))return _n9
;
}return console.warn("[DynamicLevel] \u672A\u627E\u5230\u5339\u914D\u7684Strategy\u914D\u7F6E, ratio=".concat(e)),null
;
}
},{
key:"getCurLevelCondCfg",value:function getCurLevelCondCfg(){
var e=this.getCountsDiffcultRatio(),t=this.getChallengeCounts()
;return this.getLevelCondCfg(e,t)
;
}
},{
key:"getCurStayDayCfg",value:function getCurStayDayCfg(){
return this.getStayDayCfg(this.stayDays)
;
}
},{
key:"getCurStrategyCfg",value:function getCurStrategyCfg(){
var e=0
;var t=this.getCurLevelCondCfg()
;t&&(e+=t.base*parseFloat(t.ratio))
;var i=this.getCurStayDayCfg()
;return i&&(e+=i.base*parseFloat(i.ratio)),this.getStrategyCfg(e)
;
}
},{
key:"getFruitTypeCount",value:function getFruitTypeCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e44=this.getCurStrategyCfg()
;if(_e44)return parseInt(_e44.fruitTypeCount)
;
}return 0
;
}
},{
key:"getQuistFlowerCount",value:function getQuistFlowerCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e45=this.getCurStrategyCfg()
;if(_e45)return parseInt(_e45.quistFlowerCount)
;
}return 0
;
}
},{
key:"getHoleCount",value:function getHoleCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e46=this.getCurStrategyCfg()
;if(_e46)return parseInt(_e46.holeCount)
;
}return 0
;
}
},{
key:"getHoleFruit",value:function getHoleFruit(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e47=this.getCurStrategyCfg()
;if(_e47)return parseInt(_e47.holeFruit)
;
}return 0
;
}
},{
key:"getIceCount",value:function getIceCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e48=this.getCurStrategyCfg()
;if(_e48)return parseInt(_e48.iceCount)
;
}return 0
;
}
},{
key:"getIceLog",value:function getIceLog(){
if(n.default.getDynamicLevelAB()!==n.FK_ABType.B)return 0
;if(a.default.getIceCount()>0){
var _e49=this.getCurStrategyCfg()
;if(_e49)return parseInt(_e49.iceLog)
;
}return 0
;
}
},{
key:"getBlockCount",value:function getBlockCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e50=this.getCurStrategyCfg()
;if(_e50)return parseInt(_e50.blockCount)
;
}return 0
;
}
},{
key:"getRopeCount",value:function getRopeCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e51=this.getCurStrategyCfg()
;if(_e51)return parseInt(_e51.ropeCount)
;
}return 0
;
}
},{
key:"getFireCount",value:function getFireCount(){
if(n.default.getDynamicLevelAB()===n.FK_ABType.B){
var _e52=this.getCurStrategyCfg()
;if(_e52)return parseInt(_e52.fireCount)
;
}return 0
;
}
},{
key:"printDynamicLevelInfo",value:function printDynamicLevelInfo(){
if(n.default.getDynamicLevelAB()!==n.FK_ABType.B)return
;var e=parseInt(s.default.getItem("challengeCounts")||"0"),t=parseInt(s.default.getItem("advertCounts")||"0")
;console.log("=== \u5173\u5361\u4FE1\u606F ==="),console.log("\u5F53\u524D\u6311\u6218\u6B21\u6570: ".concat(e)),console.log("\u770B\u5E7F\u544A\u6B21\u6570: ".concat(t)),console.log("\u505C\u7559\u5929\u6570: ".concat(this.stayDays))
;var i=this.getCurLevelCondCfg()
;i&&(console.log("\n=== FK_LevelCondCfg ==="),console.log("\u6D88\u9664\u3001\u5237\u65B0\u9053\u5177\u6B21\u6570: ".concat(i.itemCounts)),console.log("\u590D\u6D3B\u6B21\u6570: ".concat(i.resurrection)),console.log("\u5F39\u7A97\u5173\u95ED\u6B21\u6570: ".concat(i.popCounts)))
;var o=this.getCurStrategyCfg()
;if(o){
console.log("\n=== FK_StrategyCfg ==="),console.log("\u6C34\u679C\u79CD\u7C7B: ".concat(o.fruitTypeCount)),console.log("\u95EE\u53F7\u82B1: ".concat(o.quistFlowerCount)),console.log("\u6D1E\u7A74\u6570\u91CF: ".concat(o.holeCount)),console.log("\u6D1E\u7A74\u6C34\u679C\u6570\u91CF: ".concat(o.holeFruit)),console.log("\u51B0\u5757\u6570\u91CF: ".concat(o.iceCount)),console.log("\u51B0\u5757\u6D88\u9664\u5BF9\u6570: ".concat(o.iceLog)),console.log("\u969C\u788D\u7269\u6570\u91CF: ".concat(o.blockCount)),console.log("\u7EF3\u5B50\u6570\u91CF: ".concat(o.ropeCount)),console.log("\u5927\u706B\u6570\u91CF: ".concat(o.fireCount))
;var _e53=a.default.getLevelData()
;_e53&&(console.log("\n=== \u539F\u5173\u5361\u8868 ==="),console.log("\u6C34\u679C\u79CD\u7C7B: ".concat(_e53.fruitTypeCount)),console.log("\u95EE\u53F7\u82B1: ".concat(_e53.quistFlowerCount)),console.log("\u6D1E\u7A74\u6570\u91CF: ".concat(_e53.holeCount)),console.log("\u6D1E\u7A74\u6C34\u679C\u6570\u91CF: ".concat(_e53.holeFruit)),console.log("\u51B0\u5757\u6570\u91CF: ".concat(_e53.iceCount)),console.log("\u969C\u788D\u7269\u6570\u91CF: ".concat(_e53.blockCount)),console.log("\u7EF3\u5B50\u6570\u91CF: ".concat(_e53.ropeCount)),console.log("\u5927\u706B\u6570\u91CF: ".concat(_e53.fireCount))),console.log("\n=== \u5F53\u524D\u5173\u5361\u8868 ===")
;var _t26=0
;if(_e53.fruitTypeCount>0){
_t26=_e53.fruitTypeCount+parseInt(o.fruitTypeCount)
;var _i28=l.default.getMaxFruitTypeCount()
;_t26>_i28&&(_t26=_i28)
;
}console.log("\u6C34\u679C\u79CD\u7C7B: ".concat(_t26))
;var _i29=0
;_e53.quistFlowerCount>0&&(_i29=_e53.quistFlowerCount+parseInt(o.quistFlowerCount)),console.log("\u95EE\u53F7\u82B1: ".concat(_i29))
;var _n10=0
;_e53.holeCount>0&&(_n10=_e53.holeCount+parseInt(o.holeCount)),console.log("\u6D1E\u7A74\u6570\u91CF: ".concat(_n10))
;var _s9=0
;_e53.holeFruit>0&&(_s9=_e53.holeFruit+parseInt(o.holeFruit)),console.log("\u6D1E\u7A74\u6C34\u679C\u6570\u91CF: ".concat(_s9))
;var _r6=0
;_e53.iceCount>0&&(_r6=_e53.iceCount+parseInt(o.iceCount)),console.log("\u51B0\u5757\u6570\u91CF: ".concat(_r6))
;var _c2=0
;_r6>0&&(_c2=parseInt(o.iceLog)),console.log("\u51B0\u5757\u6D88\u9664\u5BF9\u6570: ".concat(_c2))
;var u=0
;_e53.blockCount>0&&(u=_e53.blockCount+parseInt(o.blockCount)),console.log("\u969C\u788D\u7269\u6570\u91CF: ".concat(u))
;var d=0
;_e53.ropeCount>0&&(d=_e53.ropeCount+parseInt(o.ropeCount)),console.log("\u7EF3\u5B50\u6570\u91CF: ".concat(d))
;var h=0
;_e53.fireCount>0&&(h=_e53.fireCount+parseInt(o.fireCount)),console.log("\u5927\u706B\u6570\u91CF: ".concat(h))
;
}console.log("=================")
;
}
},{
key:"getChallengeCounts",value:function getChallengeCounts(){
return parseInt(s.default.getItem("challengeCounts")||"0")
;
}
},{
key:"getAdvertCounts",value:function getAdvertCounts(){
return parseInt(s.default.getItem("advertCounts")||"0")
;
}
},{
key:"setHistoryLevel",value:function setHistoryLevel(){
var e=a.default.getCurLevelId(),t=s.default.getItem("historyLevel")||"0"
;parseInt(t)!==e&&(this.resetAdvertCounts(),this.resetChallengeCounts(),s.default.setItem("historyLevel",e.toString()),this.resetStayDays())
;
}
},{
key:"addChallengeCounts",value:function addChallengeCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;if(n.default.getDynamicLevelAB()==n.FK_ABType.B){
var _t27=this.getChallengeCounts()
;s.default.setItem("challengeCounts",(_t27+1).toString()),e&&r.default.show("\u5F53\u524D\u6311\u6218\u6B21\u6570\uFF1A".concat(this.getChallengeCounts()))
;
}else e&&r.default.show("\u672A\u901A\u8FC7AB\u6D4B\u8BD5\uFF0C\u8BF7\u5F00\u901A\u6743\u9650\u540E\u91CD\u8BD5")
;
}
},{
key:"resetChallengeCounts",value:function resetChallengeCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;s.default.setItem("challengeCounts","0"),e&&r.default.show("\u5DF2\u91CD\u7F6E\uFF0C\u5F53\u524D\u6311\u6218\u6B21\u6570\uFF1A".concat(this.getChallengeCounts()))
;
}
},{
key:"addAdvertCounts",value:function addAdvertCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;if(n.default.getDynamicLevelAB()==n.FK_ABType.B){
var _t28=this.getAdvertCounts()
;s.default.setItem("advertCounts",(_t28+1).toString()),e&&r.default.show("\u5F53\u524D\u89C2\u770B\u5E7F\u544A\u6B21\u6570\uFF1A".concat(this.getAdvertCounts()))
;
}else e&&r.default.show("\u672A\u901A\u8FC7AB\u6D4B\u8BD5\uFF0C\u8BF7\u5F00\u901A\u6743\u9650\u540E\u91CD\u8BD5")
;
}
},{
key:"resetAdvertCounts",value:function resetAdvertCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;s.default.setItem("advertCounts","0"),e&&r.default.show("\u5DF2\u91CD\u7F6E\uFF0C\u5F53\u524D\u89C2\u770B\u5E7F\u544A\u6B21\u6570\uFF1A".concat(this.getAdvertCounts()))
;
}
},{
key:"resetStayDays",value:function resetStayDays(){
this.stayDays=0,s.default.setItem("histroyTime",Date.now().toString())
;
}
}])
;return c
;
}()
;i.DynamicLevel_Utils=c,c.stayDays=0,cc._RF.pop()
;

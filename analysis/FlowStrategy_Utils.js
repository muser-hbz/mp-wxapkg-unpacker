_RF.push(t,"7ed72r3aoVMBrA1SHp2Bt+i","FlowStrategy_Utils"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.ETimeUnit=i.EUserType=void 0
;var o=e("../mgr/StorageMgr"),n=e("../mgr/GameHelper"),s=e("./TimeUtil"),r=e("./Level_Utils"),a=e("./ExpertChallenge_Utils"),l=e("../../dataMgr/FK_ABTestMgr"),c=e("../../dataMgr/FK_UserDataMgr"),u=e("./NormalCfg_Utils")
;var d,h
;(function(e){
e[e.Default=0]="Default",e[e.CrossDayLogin=1]="CrossDayLogin",e[e.MultiDayStuck=2]="MultiDayStuck",e[e.FirstDaySecondLevel=3]="FirstDaySecondLevel",e[e.NoAdWatch=4]="NoAdWatch",e[e.LowAdWatch=5]="LowAdWatch",e[e.NormalAdWatch=6]="NormalAdWatch",e[e.NotPassLevel=7]="NotPassLevel"
;
})(d=i.EUserType||(i.EUserType={

})),function(e){
e.Second="second",e.Minute="minute",e.Hour="hour",e.Day="day"
;
}(h=i.ETimeUnit||(i.ETimeUnit={

}))
;var f=/*#__PURE__*/function(){
function f(){
_classCallCheck2(this,f)
;
}_createClass2(f,null,[{
key:"log",value:function log(e){
this.isOpenLog&&console.log(e)
;
}
},{
key:"getDeductFruitCount",value:function getDeductFruitCount(){
return 2*this.DEDUCT_TYPE_COUNT
;
}
},{
key:"shouldSkip",value:function shouldSkip(){
return a.default.isExpertChallenge||l.default.getFlowStrategy()!==l.FK_ABType.B
;
}
},{
key:"getUserType",value:function getUserType(){
if(this.shouldSkip())return this.curUserType=d.Default,d.Default
;var e
;return e=this.isCrossDayLoginUser()?d.CrossDayLogin:this.isMultiDayStuckUser()?d.MultiDayStuck:this.isFirstDaySecondLevelUser()?d.FirstDaySecondLevel:this.isNotPassLevelUser()?d.NotPassLevel:this.isNoAdWatchUser()?d.NoAdWatch:this.isLowAdWatchUser()?d.LowAdWatch:this.isNormalAdWatchUser()?d.NormalAdWatch:d.Default,parseInt(o.default.getItem(this.KEY_LAST_USER_TYPE)||"0")!==e&&(o.default.setItem(this.KEY_DAILY_WIN_HISTORY,"[]"),o.default.setItem(this.KEY_LAST_USER_TYPE,e.toString())),this.curUserType=e,e
;
}
},{
key:"getCurUserType",value:function getCurUserType(){
return this.curUserType
;
}
},{
key:"isCrossDayLoginUser",value:function isCrossDayLoginUser(){
if(this.getCrossDayRemainCount()>0)return!0
;var e=this.getLastGameStartTime()
;return!!e&&(n.default.getCurrentTime()-e)/36e5>=40&&(this.setCrossDayRemainCount(this.CROSS_DAY_CHALLENGE_COUNT),!0)
;
}
},{
key:"tryConsumeCrossDayRemainCount",value:function tryConsumeCrossDayRemainCount(){
if(this.shouldSkip())return
;var e=this.getCrossDayRemainCount()
;e>0&&this.setCrossDayRemainCount(e-1)
;
}
},{
key:"getCrossDayRemainCount",value:function getCrossDayRemainCount(){
return parseInt(o.default.getItem(this.KEY_CROSS_DAY_REMAIN_COUNT)||"0")
;
}
},{
key:"setCrossDayRemainCount",value:function setCrossDayRemainCount(e){
o.default.setItem(this.KEY_CROSS_DAY_REMAIN_COUNT,e.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u8DE8\u5929\u767B\u5F55\u7528\u6237\u5269\u4F59\u6311\u6218\u6B21\u6570: ".concat(e))
;
}
},{
key:"getTimeSinceRegister",value:function getTimeSinceRegister(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:h.Hour
;var t=c.default.registerTime
;if(!t)return 0
;var i=n.default.getCurrentTime()-1e3*t
;switch(e){
case h.Second:return i/1e3
;case h.Minute:return i/6e4
;case h.Hour:return i/36e5
;case h.Day:return i/864e5
;default:return i/36e5
;
}
}
},{
key:"isFirstDaySecondLevelUser",value:function isFirstDaySecondLevelUser(){
return!(c.default.totalLoginDays>1||2!==r.default.getCurLevelId()||this.getTotalChallengeCount()<=this.FIRST_DAY_SECOND_LEVEL_MIN_CHALLENGE||this.getDailyAdCount()>0)
;
}
},{
key:"isNotPassLevelUser",value:function isNotPassLevelUser(){
return!(this.getCurLevelChallengeCount()<30||this.getChallengeCount()<20||this.getAdCount()<15)
;
}
},{
key:"isMultiDayStuckUser",value:function isMultiDayStuckUser(){
var _this190=this
;var e=this.getDailyChallengeHistory(),t=this.getDailyWinHistory()
;var i=0
;var o=n.default.getCurrentTime()
;var _loop9=function _loop9(){
var r=o-864e5*_n40,a=s.TimeUtil.formatDate(r).trim(),l=e.find(function(e){
return e.date===a
;
})
;if(!l||l.count<_this190.MULTI_DAY_STUCK_MIN_CHALLENGE)return"break"
;var c=t.find(function(e){
return e.date===a
;
})
;if(c&&c.count>0)return"break"
;i++
;
}
;for(var _n40=0
;_n40<this.CONTINUOUS_NO_WIN_MAX_CHECK_DAYS
;_n40++){
var _ret=_loop9()
;if(_ret==="break")break
;
}return i>=this.MULTI_DAY_STUCK_THRESHOLD
;
}
},{
key:"isNoAdWatchUser",value:function isNoAdWatchUser(){
var e=r.default.getCurLevelId()
;if(e<=this.NO_AD_WATCH_MIN_LEVEL)return!1
;if(this.getCurLevelAdCount()>0)return!1
;var t=e-1
;if(t<=this.NO_AD_WATCH_MIN_LEVEL)return!1
;var i=this.getLevelAdHistory().find(function(e){
return e.levelId===t
;
})
;return!(!i||i.adCount>0)
;
}
},{
key:"isLowAdWatchUser",value:function isLowAdWatchUser(){
if(r.default.getCurLevelId()<=this.LOW_AD_WATCH_MIN_LEVEL)return!1
;var e=this.getTimeSinceRegister(h.Day)
;if(console.log("isLowAdWatchUser daysSinceRegister = "+e),e<1)return!1
;var t=this.getDailyAdCount(),i=this.getDailyChallengeCount()
;return console.log("dailyAdCount = "+t),console.log("dailyChallengeCount = "+i),0===t&&i>=7||i>0&&t/i<=.15
;
}
},{
key:"getLowAdWatchTypeAdjustPercent",value:function getLowAdWatchTypeAdjustPercent(){
var e=this.getDailyAdCount(),t=this.getDailyChallengeCount()
;if(0===e)return t>=10?.16:t>=7?.08:0
;if(0===t)return 0
;var i=e/t
;return i<.08?.16:i<=.15?.08:0
;
}
},{
key:"isNormalAdWatchUser",value:function isNormalAdWatchUser(){
if(this.getRecentDays(this.NORMAL_AD_WATCH_CHECK_DAYS).length>0){
var _e132=this.getRecentDaysAvgAdCount()
;return _e132>=3&&_e132<=20
;
}return!1
;
}
},{
key:"getRecentDaysAdCount",value:function getRecentDaysAdCount(){
var e=this.getDailyAdHistory(),t=this.getRecentDays(this.DAILY_HISTORY_MAX_DAYS)
;var i=0
;var _iterator17=_createForOfIteratorHelper2(t),_step17
;try{
var _loop10=function _loop10(){
var o=_step17.value
;var t=e.find(function(e){
return e.date===o
;
})
;t&&(i+=t.count)
;
}
;for(_iterator17.s()
;!(_step17=_iterator17.n()).done
;){
_loop10()
;
}
}catch(err){
_iterator17.e(err)
;
}finally{
_iterator17.f()
;
}return i
;
}
},{
key:"getRecentDaysAvgAdCount",value:function getRecentDaysAvgAdCount(){
var e=this.getDailyAdHistory(),t=this.getRecentDays(this.DAILY_HISTORY_MAX_DAYS)
;var i=0,o=0
;var _iterator18=_createForOfIteratorHelper2(t),_step18
;try{
var _loop11=function _loop11(){
var n=_step18.value
;var t=e.find(function(e){
return e.date===n
;
})
;t&&t.count>0&&(i+=t.count,o++)
;
}
;for(_iterator18.s()
;!(_step18=_iterator18.n()).done
;){
_loop11()
;
}
}catch(err){
_iterator18.e(err)
;
}finally{
_iterator18.f()
;
}return o>0?i/o:0
;
}
},{
key:"getRecentDaysAvgChallengeCount",value:function getRecentDaysAvgChallengeCount(){
var e=this.getDailyChallengeHistory(),t=this.getRecentDays(this.DAILY_HISTORY_MAX_DAYS)
;var i=0,o=0
;var _iterator19=_createForOfIteratorHelper2(t),_step19
;try{
var _loop12=function _loop12(){
var n=_step19.value
;var t=e.find(function(e){
return e.date===n
;
})
;t&&t.count>0&&(i+=t.count,o++)
;
}
;for(_iterator19.s()
;!(_step19=_iterator19.n()).done
;){
_loop12()
;
}
}catch(err){
_iterator19.e(err)
;
}finally{
_iterator19.f()
;
}return o>0?i/o:0
;
}
},{
key:"isNormalAdWatchUseEasyDistribution",value:function isNormalAdWatchUseEasyDistribution(){
var e=this.getDailyAdCount(),t=this.getDailyChallengeCount(),i=this.getRecentDaysAvgAdCount(),o=this.getRecentDaysAvgChallengeCount()
;return(0!==i||0!==o)&&i>=7&&(i>=7?e/i:0)>=1.5&&(o>0?t/o:0)>=1.5
;
}
},{
key:"calcNormalAdWatchTypeAdjustPercent",value:function calcNormalAdWatchTypeAdjustPercent(){
var e=this.getDailyAdCount(),t=this.getDailyChallengeCount(),i=this.getRecentDaysAvgAdCount(),o=this.getRecentDaysAvgChallengeCount()
;var n=0,s=0
;o>0&&t>o&&(s=-(t-o)/o),i>0&&e>i&&(n=-(e-i)/i)
;var r=Math.min(n,s)
;return Math.max(-.2,r)
;
}
},{
key:"getNormalAdWatchAdjustDetail",value:function getNormalAdWatchAdjustDetail(){
var e=this.getDailyAdCount(),t=this.getDailyChallengeCount(),i=this.getRecentDaysAvgAdCount(),o=this.getRecentDaysAvgChallengeCount()
;var n=0,s=0
;i>0&&(n=e/i),console.log("todayAdCount = "+e+" avgAdCount = "+i)
;var r=""
;return n>0&&n<=.5?(r="\u8C03\u65740.5\u6863\u4F4D",s=Math.random()<.5?.1:.15):n>0&&n<=.75?(r="\u8C03\u65740.75\u6863\u4F4D",s=Math.random()<.5?.05:.1):r="\u65E0\u9700\u8C03\u6574",{
todayAdCount:e,todayChallengeCount:t,avgAdCount:i,avgChallengeCount:o,finalAdjustPercent:s,usedCondition:r
}
;
}
},{
key:"printUserInfo",value:function printUserInfo(){
if(this.shouldSkip())return
;var e=this.getUserType(),t=this.getUserTypeString(e)
;switch(console.log("========== \u7528\u6237\u7C7B\u578B\u4FE1\u606F =========="),console.log("\u5F53\u524D\u7528\u6237\u7C7B\u578B: ".concat(t)),e){
case d.CrossDayLogin:this.printCrossDayLoginInfo()
;break
;case d.MultiDayStuck:this.printMultiDayStuckInfo()
;break
;case d.FirstDaySecondLevel:this.printFirstDaySecondLevelInfo()
;break
;case d.NotPassLevel:this.printNotPassLevelInfo()
;break
;case d.NoAdWatch:this.printNoAdWatchInfo()
;break
;case d.LowAdWatch:this.printLowAdWatchInfo()
;break
;case d.NormalAdWatch:this.printNormalAdWatchInfo()
;break
;case d.Default:console.log("[\u6B63\u5E38\u9ED8\u8BA4\u7528\u6237] \u65E0\u7279\u6B8A\u6761\u4EF6 \u91C7\u7528\u6B63\u5E38\u5206\u5E03")
;
}console.log("==================================")
;
}
},{
key:"printCrossDayLoginInfo",value:function printCrossDayLoginInfo(){
var e=this.getLastGameStartTime(),t=(n.default.getCurrentTime()-e)/36e5,i=this.getCrossDayRemainCount()
;console.log("[\u8DE8\u5929\u767B\u5F55] \u6761\u4EF6: >=40\u5C0F\u65F6, \u5F53\u524D\u503C: ".concat(t.toFixed(2),"\u5C0F\u65F6")),console.log("[\u8DE8\u5929\u767B\u5F55] \u5269\u4F59\u6311\u6218\u6B21\u6570: ".concat(i)),console.log("[\u8DE8\u5929\u767B\u5F55] \u5206\u5E03\u7C7B\u578B: \u7B80\u5355\u5206\u5E03 getIdsSpreadB")
;
}
},{
key:"printMultiDayStuckInfo",value:function printMultiDayStuckInfo(){
var e=this.getDailyChallengeHistory(),t=this.getDailyWinHistory(),i=this.getRecentDaysIncludingToday(this.MULTI_DAY_STUCK_DAYS)
;console.log("[\u8FDE\u7EED\u591A\u65E5\u672A\u901A\u5173] \u6761\u4EF6: \u8FDE\u7EED".concat(this.MULTI_DAY_STUCK_DAYS,"\u65E5\u6BCF\u65E5\u6709\u6548\u6311\u6218\u2265").concat(this.MULTI_DAY_STUCK_MIN_CHALLENGE,"\u6B21\u4E14\u672A\u901A\u5173")),console.log("[\u8FDE\u7EED\u591A\u65E5\u672A\u901A\u5173] \u5206\u5E03\u7C7B\u578B: \u7B80\u5355\u5206\u5E03 getIdsSpreadB")
;var _iterator20=_createForOfIteratorHelper2(i),_step20
;try{
var _loop13=function _loop13(){
var o=_step20.value
;var i=e.find(function(e){
return e.date===o
;
}),n=t.find(function(e){
return e.date===o
;
})
;console.log("  ".concat(o,": \u6709\u6548\u6311\u6218").concat((null==i?void 0:i.count)||0,"\u6B21, \u901A\u5173").concat((null==n?void 0:n.count)||0,"\u6B21"))
;
}
;for(_iterator20.s()
;!(_step20=_iterator20.n()).done
;){
_loop13()
;
}
}catch(err){
_iterator20.e(err)
;
}finally{
_iterator20.f()
;
}
}
},{
key:"printNoAdWatchInfo",value:function printNoAdWatchInfo(){
var e=r.default.getCurLevelId(),t=this.getCurLevelAdCount(),i=this.getContinuousNoAdLevelCount()
;console.log("[\u4E0D\u770B\u5E7F\u544A] \u6761\u4EF6: \u5173\u5361>".concat(this.NO_AD_WATCH_MIN_LEVEL,", \u5F53\u524D\u5173\u548C\u524D\u4E00\u5173\u90FD\u672A\u770B\u5E7F\u544A")),console.log("  \u5F53\u524D\u5173\u5361: ".concat(e,", \u5F53\u524D\u5173\u5E7F\u544A: ").concat(t,"\u6B21, \u8FDE\u7EED\u672A\u770B\u5E7F\u544A\u5173\u5361\u6570: ").concat(i))
;
}
},{
key:"printLowAdWatchInfo",value:function printLowAdWatchInfo(){
var e=r.default.getCurLevelId(),t=this.getTimeSinceRegister(h.Day),i=this.getDailyAdCount(),o=this.getDailyChallengeCount()
;if(console.log("[\u770B\u5E7F\u544A\u8F83\u5C11\u7528\u6237] \u5224\u65AD\u6761\u4EF6:"),console.log("  \u6761\u4EF61: \u4E3B\u7EBF\u5173\u5361 > 6\u5173"),console.log("    \u5F53\u524D\u503C: curLevel = ".concat(e,", \u662F\u5426\u6EE1\u8DB3: ").concat(e>this.LOW_AD_WATCH_MIN_LEVEL?"\u2713":"\u2717")),console.log("  \u6761\u4EF62: \u7528\u6237\u6CE8\u518C\u8D26\u53F7\u5929\u6570 >= 1\u5929"),console.log("    \u5F53\u524D\u503C: \u6CE8\u518C\u5929\u6570 = ".concat(t.toFixed(2),"\u5929, \u662F\u5426\u6EE1\u8DB3: ").concat(t>=1?"\u2713":"\u2717")),console.log("  \u6761\u4EF63: \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 / \u5F53\u65E5\u6709\u6548\u6311\u6218\u6B21\u6570 <= 0.15 \u6216\u8005 \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 = 0 \u5E76\u4E14 \u5F53\u65E5\u6311\u6218\u6B21\u6570 >= 7"),0===i)console.log("    \u5F53\u524D\u503C: \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 = ".concat(i,", \u5F53\u65E5\u6311\u6218\u6B21\u6570 = ").concat(o)),console.log("    \u5224\u65AD\u8DEF\u5F84: \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 = 0, \u5F53\u65E5\u6311\u6218\u6B21\u6570 >= 7 ? ".concat(o>=7?"\u2713":"\u2717"))
;else{
var _e133=o>0?i/o:999
;console.log("    \u5F53\u524D\u503C: \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 = ".concat(i,", \u5F53\u65E5\u6311\u6218\u6B21\u6570 = ").concat(o,", \u6BD4\u4F8B = ").concat(_e133.toFixed(3))),console.log("    \u5224\u65AD\u8DEF\u5F84: \u6BD4\u4F8B <= 0.15 ? ".concat(_e133<=.15?"\u2713":"\u2717"))
;
}console.log("[\u770B\u5E7F\u544A\u8F83\u5C11\u7528\u6237] \u5206\u5E03\u65B9\u5F0F: \u6B63\u5E38\u5206\u5E03 getIds")
;var n=this.getLowAdWatchTypeAdjustPercent()
;if(console.log("[\u770B\u5E7F\u544A\u8F83\u5C11\u7528\u6237] \u68CB\u5B50\u79CD\u7C7B\u8C03\u8282:"),0===i)o>=10?(console.log("  \u89C4\u5219\u5339\u914D: \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 = 0, \u5F53\u65E5\u6311\u6218\u6B21\u6570 >= 10"),console.log("  \u8C03\u6574\u5E45\u5EA6: +".concat(100*n,"%"))):o>=7?(console.log("  \u89C4\u5219\u5339\u914D: \u5F53\u65E5\u5E7F\u544A\u6B21\u6570 = 0, \u5F53\u65E5\u6311\u6218\u6B21\u6570 >= 7"),console.log("  \u8C03\u6574\u5E45\u5EA6: +".concat(100*n,"%"))):console.log("  \u65E0\u8C03\u6574")
;else if(o>0){
var _e134=i/o
;_e134<.05?(console.log("  \u89C4\u5219\u5339\u914D: \u6BD4\u4F8B < 0.05"),console.log("  \u8C03\u6574\u5E45\u5EA6: +".concat(100*n,"%"))):_e134<=.15?(console.log("  \u89C4\u5219\u5339\u914D: 0.05 <= \u6BD4\u4F8B <= 0.15"),console.log("  \u8C03\u6574\u5E45\u5EA6: +".concat(100*n,"%"))):console.log("  \u65E0\u8C03\u6574")
;
}else console.log("  \u65E0\u8C03\u6574")
;
}
},{
key:"printFirstDaySecondLevelInfo",value:function printFirstDaySecondLevelInfo(){
var e=c.default.totalLoginDays,t=r.default.getCurLevelId(),i=this.getTotalChallengeCount(),o=this.getDailyAdCount()
;console.log("[\u9996\u65E5\u7B2C2\u5173\u7528\u6237] \u5224\u65AD\u6761\u4EF6:"),console.log("  \u6761\u4EF61: \u9996\u65E5\u7528\u6237 (totalLoginDays <= 1)"),console.log("    \u5F53\u524D\u503C: totalLoginDays = ".concat(e,", \u662F\u5426\u6EE1\u8DB3: ").concat(e<=1?"\u2713":"\u2717")),console.log("  \u6761\u4EF62: \u5F53\u524D\u5173\u5361\u662F\u7B2C2\u5173"),console.log("    \u5F53\u524D\u503C: curLevel = ".concat(t,", \u662F\u5426\u6EE1\u8DB3: ").concat(2===t?"\u2713":"\u2717")),console.log("  \u6761\u4EF63: \u603B\u6311\u6218\u6B21\u6570 > 4"),console.log("    \u5F53\u524D\u503C: totalChallengeCount = ".concat(i,", \u662F\u5426\u6EE1\u8DB3: ").concat(i>this.FIRST_DAY_SECOND_LEVEL_MIN_CHALLENGE?"\u2713":"\u2717")),console.log("  \u6761\u4EF64: \u6CA1\u770B\u8FC7\u4E00\u6B21\u5E7F\u544A"),console.log("    \u5F53\u524D\u503C: dailyAdCount = ".concat(o,", \u662F\u5426\u6EE1\u8DB3: ").concat(0===o?"\u2713":"\u2717"))
;var _this$getFirstDaySeco=this.getFirstDaySecondLevelDistribution(),n=_this$getFirstDaySeco.normalWeight,s=_this$getFirstDaySeco.easyWeight,a=_this$getFirstDaySeco.cachedWeight,l=_this$getFirstDaySeco.useEasyDistribution
;console.log("[\u9996\u65E5\u7B2C2\u5173\u7528\u6237] \u5206\u5E03\u8BA1\u7B97:"),console.log("  \u6B63\u5E38\u5206\u5E03\u6743\u91CD: ".concat(n)),console.log("  \u7B80\u5355\u5206\u5E03\u6743\u91CD: (\u603B\u6311\u6218\u6B21\u6570 - 4) * 10 = (".concat(i," - 4) * 10 = ").concat(s)),console.log("  \u7F13\u5B58\u7684\u6743\u91CD\u503C: ".concat(a)),console.log("  \u6700\u7EC8\u5206\u5E03: ".concat(l?"\u7B80\u5355\u5206\u5E03 getIdsSpreadB":"\u6B63\u5E38\u5206\u5E03 getIds"))
;
}
},{
key:"printNotPassLevelInfo",value:function printNotPassLevelInfo(){
var e=this.getCurLevelChallengeCount(),t=this.getChallengeCount(),i=this.getAdCount()
;console.log("[\u5361\u5173\u4E0D\u901A\u8FC7\u7528\u6237] \u5224\u65AD\u6761\u4EF6:"),console.log("  \u6761\u4EF61: \u5F53\u524D\u5173\u5361\u6311\u6218\u6B21\u6570 >= 30"),console.log("    \u5F53\u524D\u503C: ".concat(e,", \u662F\u5426\u6EE1\u8DB3: ").concat(e>=30?"\u2713":"\u2717")),console.log("  \u6761\u4EF62: \u5F53\u524D\u6709\u6548\u6311\u6218 >= 20\u6B21"),console.log("    \u5F53\u524D\u503C: ".concat(t,", \u662F\u5426\u6EE1\u8DB3: ").concat(t>=20?"\u2713":"\u2717")),console.log("  \u6761\u4EF63: \u5F53\u524D\u5E7F\u544A\u6B21\u6570 >= 15\u6B21"),console.log("    \u5F53\u524D\u503C: ".concat(i,", \u662F\u5426\u6EE1\u8DB3: ").concat(i>=15?"\u2713":"\u2717")),console.log("[\u5361\u5173\u4E0D\u901A\u8FC7\u7528\u6237] \u5206\u5E03\u65B9\u5F0F: \u6B63\u5E38\u5206\u5E03 getIds"),console.log("[\u5361\u5173\u4E0D\u901A\u8FC7\u7528\u6237] \u68CB\u5B50\u79CD\u7C7B\u8C03\u8282: -10%")
;
}
},{
key:"getFirstDaySecondLevelDistribution",value:function getFirstDaySecondLevelDistribution(){
var e=this.getTotalChallengeCount(),t=this.FIRST_DAY_SECOND_LEVEL_NORMAL_WEIGHT,i=10*(e-this.FIRST_DAY_SECOND_LEVEL_MIN_CHALLENGE)+20
;if(0===this._firstDaySecondLevelCachedWeight){
var _e135=t+i
;this._firstDaySecondLevelCachedWeight=Math.random()*_e135,this.log("[\u9996\u65E5\u7B2C2\u5173\u7528\u6237] \u9996\u6B21\u8BA1\u7B97\u6743\u91CD: \u968F\u673A\u503C=".concat(this._firstDaySecondLevelCachedWeight.toFixed(2),", \u603B\u6743\u91CD=").concat(_e135))
;
}var o=this._firstDaySecondLevelCachedWeight<i
;return{
normalWeight:t,easyWeight:i,cachedWeight:this._firstDaySecondLevelCachedWeight,useEasyDistribution:o
}
;
}
},{
key:"clearFirstDaySecondLevelWeightCache",value:function clearFirstDaySecondLevelWeightCache(){
this._firstDaySecondLevelCachedWeight=0
;
}
},{
key:"printNormalAdWatchInfo",value:function printNormalAdWatchInfo(){
var e=this.getDailyAdHistory(),t=this.getDailyChallengeHistory(),i=this.getRecentDays(this.NORMAL_AD_WATCH_CHECK_DAYS)
;console.log("[\u6B63\u5E38\u770B\u5E7F\u544A] \u6761\u4EF6: \u524D".concat(this.NORMAL_AD_WATCH_CHECK_DAYS,"\u5929\u81F3\u5C111\u5929\u6709\u6311\u6218\u6216\u5E7F\u544A\u6B21\u6570"))
;var _iterator21=_createForOfIteratorHelper2(i),_step21
;try{
var _loop14=function _loop14(){
var a=_step21.value
;var i=e.find(function(e){
return e.date===a
;
}),o=t.find(function(e){
return e.date===a
;
}),n=(null==i?void 0:i.count)>0||(null==o?void 0:o.count)>0
;console.log("  ".concat(a,": \u5E7F\u544A").concat((null==i?void 0:i.count)||0,"\u6B21, \u6311\u6218").concat((null==o?void 0:o.count)||0,"\u6B21").concat(n?" \u2713":""))
;
}
;for(_iterator21.s()
;!(_step21=_iterator21.n()).done
;){
_loop14()
;
}
}catch(err){
_iterator21.e(err)
;
}finally{
_iterator21.f()
;
}var o=this.getRecentDaysAvgChallengeCount(),n=this.getRecentDaysAvgAdCount()
;console.log("  \u524D".concat(this.DAILY_HISTORY_MAX_DAYS,"\u5929\u5E73\u5747\u6709\u6548\u6311\u6218\u6B21\u6570: ").concat(o.toFixed(2),"\u6B21")),console.log("  \u524D".concat(this.DAILY_HISTORY_MAX_DAYS,"\u5929\u5E73\u5747\u5E7F\u544A\u6B21\u6570: ").concat(n.toFixed(2),"\u6B21"))
;var s=this.isNormalAdWatchUseEasyDistribution(),r=this.getNormalAdWatchAdjustDetail()
;console.log("  \u4F7F\u7528".concat(s?"\u7B80\u5355\u5206\u5E03 getIdsSpreadB":"\u6B63\u5E38\u5206\u5E03 getIds")),console.log("  \u5F53\u524D\u6709\u6548\u6311\u6218\u6B21\u6570: ".concat(r.todayChallengeCount,", \u5F53\u524D\u5E7F\u544A\u6B21\u6570: ").concat(r.todayAdCount," ")),console.log("  \u53D6".concat(r.usedCondition," \u7684\u6BD4\u4F8B, \u68CB\u5B50\u79CD\u7C7B\u8C03\u6574: ").concat(100*r.finalAdjustPercent,"%
}"))
;
}
},{
key:"getUserTypeString",value:function getUserTypeString(e){
switch(e){
case d.Default:return"\u9ED8\u8BA4\u7528\u6237"
;case d.CrossDayLogin:return"\u8DE8\u5929\u767B\u5F55\u7528\u6237"
;case d.FirstDaySecondLevel:return"\u9996\u65E5\u7B2C2\u5173\u7528\u6237"
;case d.MultiDayStuck:return"\u8FDE\u7EED\u591A\u65E5\u672A\u901A\u5173\u7528\u6237"
;case d.NoAdWatch:return"\u4E0D\u770B\u5E7F\u544A\u7528\u6237"
;case d.LowAdWatch:return"\u770B\u5E7F\u544A\u8F83\u5C11\u7528\u6237"
;case d.NormalAdWatch:return"\u6B63\u5E38\u770B\u5E7F\u544A\u7528\u6237"
;case d.NotPassLevel:return"\u5361\u5173\u4E0D\u901A\u8FC7\u7528\u6237"
;default:return"\u672A\u77E5\u7528\u6237\u7C7B\u578B"
;
}
}
},{
key:"getLastGameStartTime",value:function getLastGameStartTime(){
return parseInt(o.default.getItem(this.KEY_LAST_GAME_START_TIME)||"0")
;
}
},{
key:"setLastGameStartTime",value:function setLastGameStartTime(e){
if(this.shouldSkip())return
;var t=this.getLastGameStartTime(),i=e||n.default.getCurrentTime()
;o.default.setItem(this.KEY_LAST_GAME_START_TIME,i.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u4E0A\u6B21\u6700\u540E\u4E00\u5C40\u5F00\u59CB\u65F6\u95F4: ".concat(t," -> ").concat(i," "))
;
}
},{
key:"getCurLevelStartTime",value:function getCurLevelStartTime(){
return parseInt(o.default.getItem(this.KEY_CUR_LEVEL_START_TIME)||"0")
;
}
},{
key:"setCurLevelStartTime",value:function setCurLevelStartTime(e){
if(this.shouldSkip())return
;var t=e||n.default.getCurrentTime()
;o.default.setItem(this.KEY_CUR_LEVEL_START_TIME,t.toString())
;
}
},{
key:"getNoAdWinCount",value:function getNoAdWinCount(){
return parseInt(o.default.getItem(this.KEY_NO_AD_WIN_COUNT)||"0")
;
}
},{
key:"addNoAdWinCount",value:function addNoAdWinCount(){
if(this.shouldSkip())return
;var e=this.getNoAdWinCount(),t=e+1
;o.default.setItem(this.KEY_NO_AD_WIN_COUNT,t.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u4E0D\u770B\u5E7F\u544A\u901A\u5173\u6B21\u6570: ".concat(e," -> ").concat(t," "))
;
}
},{
key:"getAdWinCount",value:function getAdWinCount(){
return parseInt(o.default.getItem(this.KEY_AD_WIN_COUNT)||"0")
;
}
},{
key:"addAdWinCount",value:function addAdWinCount(){
if(this.shouldSkip())return
;var e=this.getAdWinCount(),t=e+1
;o.default.setItem(this.KEY_AD_WIN_COUNT,t.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u770B\u5E7F\u544A\u901A\u5173\u6B21\u6570: ".concat(e," -> ").concat(t," "))
;
}
},{
key:"onGameStart",value:function onGameStart(){
if(this.shouldSkip())return
;this.addTotalChallengeCount(),this.addCurLevelChallengeCount(),this.tryConsumeCrossDayRemainCount(),this.clearFirstDaySecondLevelWeightCache()
;var e=parseInt(o.default.getItem("lastRecordLevel")||"0"),t=r.default.getCurLevelId()
;e!==t&&(this.resetCurLevelAdCount(),o.default.setItem("lastRecordLevel",t.toString()))
;
}
},{
key:"onGameEnd",value:function onGameEnd(e,t){
if(!this.shouldSkip()&&e){
t?this.addAdWinCount():this.addNoAdWinCount(),this.addDailyWinCount()
;var _e136=r.default.getCurLevelId()
;this.saveLevelAdToHistory(_e136),this.setCrossDayRemainCount(0),this.resetCurLevelChallengeCount()
;
}
}
},{
key:"getAdCount",value:function getAdCount(){
return parseInt(o.default.getItem(this.KEY_AD_COUNT)||"0")
;
}
},{
key:"addAdCount",value:function addAdCount(){
if(this.shouldSkip())return
;var e=this.getAdCount(),t=e+1
;o.default.setItem(this.KEY_AD_COUNT,t.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u524D\u5E7F\u544A\u6B21\u6570(\u7D2F\u8BA1): ".concat(e," -> ").concat(t," ")),this.addCurLevelAdCount(),this.addDailyAdCount()
;
}
},{
key:"getCurLevelAdCount",value:function getCurLevelAdCount(){
return parseInt(o.default.getItem(this.KEY_CUR_LEVEL_AD_COUNT)||"0")
;
}
},{
key:"addCurLevelAdCount",value:function addCurLevelAdCount(){
var e=this.getCurLevelAdCount(),t=e+1
;o.default.setItem(this.KEY_CUR_LEVEL_AD_COUNT,t.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u524D\u5173\u5361\u5E7F\u544A\u6B21\u6570: ".concat(e," -> ").concat(t," "))
;
}
},{
key:"resetCurLevelAdCount",value:function resetCurLevelAdCount(){
this.shouldSkip()||o.default.setItem(this.KEY_CUR_LEVEL_AD_COUNT,"0")
;
}
},{
key:"getContinuousNoAdLevelCount",value:function getContinuousNoAdLevelCount(){
if(this.getCurLevelAdCount()>0)return 0
;var e=0
;var t=r.default.getCurLevelId(),i=this.getLevelAdHistory()
;for(var _o65=i.length-1
;_o65>=0
;_o65--){
var _n41=i[_o65]
;if(!(_n41.levelId>=t)){
if(_n41.levelId<=this.NO_AD_WATCH_MIN_LEVEL)break
;if(0!==_n41.adCount)break
;e++
;
}
}return e
;
}
},{
key:"getLevelAdHistory",value:function getLevelAdHistory(){
var e=o.default.getItem(this.KEY_LEVEL_AD_HISTORY)
;if(!e)return[]
;try{
return JSON.parse(e)
;
}catch(t){
return[]
;
}
}
},{
key:"saveLevelAdToHistory",value:function saveLevelAdToHistory(e){
if(this.shouldSkip())return
;if(e<=this.LEVEL_AD_RECORD_MIN_LEVEL)return
;var t=this.getLevelAdHistory(),i=this.getCurLevelAdCount()
;for(t.push({
levelId:e,adCount:i
})
;t.length>this.LEVEL_AD_HISTORY_MAX
;)t.shift()
;o.default.setItem(this.KEY_LEVEL_AD_HISTORY,JSON.stringify(t))
;
}
},{
key:"getDailyAdHistory",value:function getDailyAdHistory(){
var e=o.default.getItem(this.KEY_DAILY_AD_HISTORY)
;if(!e)return[]
;try{
return JSON.parse(e)
;
}catch(t){
return[]
;
}
}
},{
key:"getDailyAdCount",value:function getDailyAdCount(){
var e=this.getDailyAdHistory(),t=this.getTodayDateStr(),i=e.find(function(e){
return e.date===t
;
})
;return i?i.count:0
;
}
},{
key:"addDailyAdCount",value:function addDailyAdCount(){
var e=this.getDailyAdHistory(),t=this.getTodayDateStr(),i=e.find(function(e){
return e.date===t
;
}),n=i?i.count:0
;i?i.count++:e.push({
date:t,count:1
}),this.trimDailyHistory(e),o.default.setItem(this.KEY_DAILY_AD_HISTORY,JSON.stringify(e)),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u65E5\u5E7F\u544A\u6B21\u6570(".concat(t,"): ").concat(n," -> ").concat(n+1," "))
;
}
},{
key:"getChallengeCount",value:function getChallengeCount(){
return parseInt(o.default.getItem(this.KEY_CHALLENGE_COUNT)||"0")
;
}
},{
key:"getTotalChallengeCount",value:function getTotalChallengeCount(){
return parseInt(o.default.getItem(this.KEY_TOTAL_CHALLENGE_COUNT)||"0")
;
}
},{
key:"addTotalChallengeCount",value:function addTotalChallengeCount(){
if(this.shouldSkip())return
;var e=this.getTotalChallengeCount(),t=e+1
;this.setTotalChallengeCount(t),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u603B\u6311\u6218\u6B21\u6570: ".concat(e," -> ").concat(t," "))
;
}
},{
key:"setTotalChallengeCount",value:function setTotalChallengeCount(e){
o.default.setItem(this.KEY_TOTAL_CHALLENGE_COUNT,e.toString())
;
}
},{
key:"getCurLevelChallengeCount",value:function getCurLevelChallengeCount(){
return parseInt(o.default.getItem(this.KEY_CUR_LEVEL_CHALLENGE_COUNT)||"0")
;
}
},{
key:"addCurLevelChallengeCount",value:function addCurLevelChallengeCount(){
if(this.shouldSkip())return
;var e=this.getCurLevelChallengeCount(),t=e+1
;o.default.setItem(this.KEY_CUR_LEVEL_CHALLENGE_COUNT,t.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u524D\u5173\u5361\u6311\u6218\u6B21\u6570: ".concat(e," -> ").concat(t," "))
;
}
},{
key:"resetCurLevelChallengeCount",value:function resetCurLevelChallengeCount(){
this.shouldSkip()||(o.default.setItem(this.KEY_CUR_LEVEL_CHALLENGE_COUNT,"0"),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u524D\u5173\u5361\u6311\u6218\u6B21\u6570\u5DF2\u91CD\u7F6E\u4E3A 0"))
;
}
},{
key:"addValidChallengeCount",value:function addValidChallengeCount(){
var e=this.getChallengeCount(),t=e+1
;o.default.setItem(this.KEY_CHALLENGE_COUNT,t.toString()),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u524D\u6709\u6548\u6311\u6218\u6B21\u6570(\u7D2F\u8BA1): ".concat(e," -> ").concat(t," ")),this.addDailyChallengeCount()
;
}
},{
key:"tryAddChallengeCount",value:function tryAddChallengeCount(e){
return!(this.shouldSkip()||e<this.CHALLENGE_PROGRESS_THRESHOLD||(this.addValidChallengeCount(),0))
;
}
},{
key:"reduceChallengeCount",value:function reduceChallengeCount(e){
if(this.shouldSkip())return
;var t=this.getChallengeCount(),i=Math.floor(t*e)
;i>0&&o.default.setItem(this.KEY_CHALLENGE_COUNT,Math.max(0,t-i).toString())
;
}
},{
key:"reduceAdCount",value:function reduceAdCount(e){
if(this.shouldSkip())return
;var t=this.getAdCount(),i=Math.floor(t*e)
;i>0&&o.default.setItem(this.KEY_AD_COUNT,Math.max(0,t-i).toString())
;
}
},{
key:"getDailyChallengeHistory",value:function getDailyChallengeHistory(){
var e=o.default.getItem(this.KEY_DAILY_CHALLENGE_HISTORY)
;if(!e)return[]
;try{
return JSON.parse(e)
;
}catch(t){
return[]
;
}
}
},{
key:"getDailyChallengeCount",value:function getDailyChallengeCount(){
var e=this.getDailyChallengeHistory(),t=this.getTodayDateStr(),i=e.find(function(e){
return e.date===t
;
})
;return i?i.count:0
;
}
},{
key:"addDailyChallengeCount",value:function addDailyChallengeCount(){
var e=this.getDailyChallengeHistory(),t=this.getTodayDateStr(),i=e.find(function(e){
return e.date===t
;
}),n=i?i.count:0
;i?i.count++:e.push({
date:t,count:1
}),this.trimDailyHistory(e),o.default.setItem(this.KEY_DAILY_CHALLENGE_HISTORY,JSON.stringify(e)),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u65E5\u6709\u6548\u6311\u6218\u6B21\u6570(".concat(t,"): ").concat(n," -> ").concat(n+1," "))
;
}
},{
key:"getDailyWinHistory",value:function getDailyWinHistory(){
var e=o.default.getItem(this.KEY_DAILY_WIN_HISTORY)
;if(!e)return[]
;try{
return JSON.parse(e)
;
}catch(t){
return[]
;
}
}
},{
key:"getDailyWinCount",value:function getDailyWinCount(){
var e=this.getDailyWinHistory(),t=this.getTodayDateStr(),i=e.find(function(e){
return e.date===t
;
})
;return i?i.count:0
;
}
},{
key:"addDailyWinCount",value:function addDailyWinCount(){
if(this.shouldSkip())return
;var e=this.getDailyWinHistory(),t=this.getTodayDateStr(),i=e.find(function(e){
return e.date===t
;
}),n=i?i.count:0
;i?i.count++:e.push({
date:t,count:1
}),this.trimDailyHistory(e),o.default.setItem(this.KEY_DAILY_WIN_HISTORY,JSON.stringify(e)),this.log("[\u5FC3\u6D41\u6570\u636E\u53D8\u5316] \u5F53\u65E5\u901A\u5173\u6B21\u6570(".concat(t,"): ").concat(n," -> ").concat(n+1," "))
;
}
},{
key:"getContinuousNoWinDays",value:function getContinuousNoWinDays(){
var _this191=this
;var e=this.getDailyWinHistory(),t=this.getDailyChallengeHistory()
;var i=0
;var o=n.default.getCurrentTime()
;var _loop15=function _loop15(){
var r=o-864e5*_n42,a=s.TimeUtil.formatDate(r).trim(),l=e.find(function(e){
return e.date===a
;
}),c=t.find(function(e){
return e.date===a
;
})
;if(l&&0!==l.count||!c||!(c.count>=_this191.MULTI_DAY_STUCK_MIN_CHALLENGE))return"break"
;i++
;
}
;for(var _n42=0
;_n42<this.CONTINUOUS_NO_WIN_MAX_CHECK_DAYS
;_n42++){
var _ret2=_loop15()
;if(_ret2==="break")break
;
}return i
;
}
},{
key:"setNoAdTypeAdjust",value:function setNoAdTypeAdjust(e,t){
this.shouldSkip()||(this._noAdTypeAdjustPercent=e>0?Math.min(this.NO_AD_TYPE_ADJUST_MAX,e):Math.max(-this.NO_AD_TYPE_ADJUST_MAX,e),this._noAdMaxTypeCount=t)
;
}
},{
key:"setNormalAdTypeAdjust",value:function setNormalAdTypeAdjust(e,t){
this.shouldSkip()||(this._normalAdTypeAdjustPercent=e>0?Math.min(this.NO_AD_TYPE_ADJUST_MAX,e):Math.max(-this.NO_AD_TYPE_ADJUST_MAX,e),this._normalAdMaxTypeCount=t)
;
}
},{
key:"getNoAdTypeAdjustPercent",value:function getNoAdTypeAdjustPercent(){
return this._noAdTypeAdjustPercent
;
}
},{
key:"getNoAdMaxTypeCount",value:function getNoAdMaxTypeCount(){
return this._noAdMaxTypeCount
;
}
},{
key:"resetNoAdTypeAdjust",value:function resetNoAdTypeAdjust(){
this.shouldSkip()||(this._noAdTypeAdjustPercent=0,this._noAdMaxTypeCount=u.default.getMaxFruitTypeCount())
;
}
},{
key:"getNormalAdTypeAdjustPercent",value:function getNormalAdTypeAdjustPercent(){
return this._normalAdTypeAdjustPercent
;
}
},{
key:"getNormalAdMaxTypeCount",value:function getNormalAdMaxTypeCount(){
return this._normalAdMaxTypeCount
;
}
},{
key:"resetNormalAdTypeAdjust",value:function resetNormalAdTypeAdjust(){
this.shouldSkip()||(this._normalAdTypeAdjustPercent=0,this._normalAdMaxTypeCount=u.default.getMaxFruitTypeCount())
;
}
},{
key:"calcNoAdTypeAdjustPercent",value:function calcNoAdTypeAdjustPercent(){
if(this.shouldSkip())return 0
;var e=this.getNoAdWinCount()
;return Math.min(this.NO_AD_TYPE_ADJUST_MAX,.04*e)
;
}
},{
key:"getTodayDateStr",value:function getTodayDateStr(){
return s.TimeUtil.formatDate(n.default.getCurrentTime()).trim()
;
}
},{
key:"getRecentDays",value:function getRecentDays(e){
var t=[],i=n.default.getCurrentTime()
;for(var _o66=1
;_o66<=e
;_o66++){
var _e137=i-864e5*_o66
;t.push(s.TimeUtil.formatDate(_e137).trim())
;
}return t
;
}
},{
key:"getRecentDaysIncludingToday",value:function getRecentDaysIncludingToday(e){
var t=[],i=n.default.getCurrentTime()
;for(var _o67=0
;_o67<e
;_o67++){
var _e138=i-864e5*_o67
;t.push(s.TimeUtil.formatDate(_e138).trim())
;
}return t
;
}
},{
key:"trimDailyHistory",value:function trimDailyHistory(e){
for(
;e.length>this.DAILY_HISTORY_MAX_DAYS
;)e.shift()
;
}
},{
key:"checkAndResetAllDailyCounters",value:function checkAndResetAllDailyCounters(){
if(this.shouldSkip())return
;var e=this.getDailyAdHistory()
;this.trimDailyHistory(e),o.default.setItem(this.KEY_DAILY_AD_HISTORY,JSON.stringify(e))
;var t=this.getDailyChallengeHistory()
;this.trimDailyHistory(t),o.default.setItem(this.KEY_DAILY_CHALLENGE_HISTORY,JSON.stringify(t))
;var i=this.getDailyWinHistory()
;this.trimDailyHistory(i),o.default.setItem(this.KEY_DAILY_WIN_HISTORY,JSON.stringify(i))
;
}
}])
;return f
;
}()
;i.default=f,f.isOpenLog=!0,f.curUserType=d.Default,f.KEY_LAST_GAME_START_TIME="lastGameStartTime",f.KEY_CUR_LEVEL_START_TIME="curLevelStartTime",f.KEY_NO_AD_WIN_COUNT="noAdWinCount",f.KEY_AD_WIN_COUNT="adWinCount",f.KEY_CROSS_DAY_REMAIN_COUNT="flowStrategy_crossDayRemainCount",f.KEY_AD_COUNT="flowStrategy_adCount",f.KEY_CUR_LEVEL_AD_COUNT="flowStrategy_curLevelAdCount",f.KEY_LEVEL_AD_HISTORY="flowStrategy_levelAdHistory",f.KEY_DAILY_AD_HISTORY="flowStrategy_dailyAdHistory",f.KEY_CHALLENGE_COUNT="flowStrategy_challengeCount",f.KEY_TOTAL_CHALLENGE_COUNT="flowStrategy_totalChallengeCount",f.KEY_CUR_LEVEL_CHALLENGE_COUNT="flowStrategy_curLevelChallengeCount",f.KEY_DAILY_CHALLENGE_HISTORY="flowStrategy_dailyChallengeHistory",f.CHALLENGE_PROGRESS_THRESHOLD=.25,f.KEY_DAILY_WIN_HISTORY="flowStrategy_dailyWinHistory",f.KEY_LAST_USER_TYPE="flowStrategy_lastUserType",f.CROSS_DAY_CHALLENGE_COUNT=3,f.FIRST_DAY_SECOND_LEVEL_MIN_CHALLENGE=4,f.FIRST_DAY_SECOND_LEVEL_NORMAL_WEIGHT=50,f._firstDaySecondLevelCachedWeight=0,f.DAILY_HISTORY_MAX_DAYS=5,f.LEVEL_AD_HISTORY_MAX=5,f.LEVEL_AD_RECORD_MIN_LEVEL=10,f.MULTI_DAY_STUCK_DAYS=5,f.MULTI_DAY_STUCK_THRESHOLD=3,f.MULTI_DAY_STUCK_MIN_CHALLENGE=3,f.CONTINUOUS_NO_WIN_MAX_CHECK_DAYS=5,f.NO_AD_WATCH_MIN_LEVEL=10,f.LOW_AD_WATCH_MIN_LEVEL=6,f._noAdTypeAdjustPercent=0,f._noAdMaxTypeCount=30,f.NO_AD_TYPE_ADJUST_MAX=.2,f._normalAdTypeAdjustPercent=0,f._normalAdMaxTypeCount=30,f.NORMAL_AD_WATCH_CHECK_DAYS=5,f.DEDUCT_TYPE_COUNT=3,cc._RF.pop()
;

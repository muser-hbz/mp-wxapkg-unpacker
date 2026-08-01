_RF.push(t,"fc9e6uT4EJFx6nKE2tep5zf","GameHelper"),Object.defineProperty(i,"__esModule",{
value:!0
})
;var o=e("../../game/cosnt/FK_EventDefine"),n=e("../../game/cosnt/FK_ResDefine"),s=e("../../dataMgr/FK_UserDataMgr"),r=e("../../platform/Platform"),a=e("../const/EventConst"),l=e("../utils/DynamicLevel_Utils"),c=e("../utils/FK_Utils"),u=e("../utils/FlowStrategy_Utils"),d=e("../utils/NormalCfg_Utils"),h=e("../utils/GameShakeUtils"),f=e("../utils/Level_Utils"),g=e("../utils/TimeUtil"),p=e("./EventMgr"),m=e("./LoadMgr"),_=e("./StorageMgr"),v=e("../utils/Task_Utils"),y=e("../utils/ActivityModule_Utils"),C=e("../../platform/sdk/IAd"),T=e("../../config/FK_AdCfg"),I=e("../../game/fruit/view/activity/ActivityConfig")
;var S=/*#__PURE__*/function(){
function S(){
_classCallCheck2(this,S)
;this.serverTime=0
;
}_createClass2(S,[{
key:"init",value:function init(){
this.clear(),this.addEventListener(),this.initGameCfg()
;
}
},{
key:"initGameCfg",value:function initGameCfg(){
cc.game.setFrameRate(60)
;var e=cc.director.getPhysicsManager()
;e.enabled=!0,e.enabledAccumulator=!0,cc.PhysicsManager.FIXED_TIME_STEP=1/60,cc.PhysicsManager.VELOCITY_ITERATIONS=8,cc.PhysicsManager.POSITION_ITERATIONS=8,cc.sys.platform===cc.sys.BYTEDANCE_GAME?(e.gravity=cc.v2(0,-3e3),console.log("\u6296\u97F3\u91CD\u529B\u52A0\u901F\u5EA6",e.gravity)):e.gravity=cc.v2(0,-5e3),cc.director.getCollisionManager().enabled=!0,S.isShowFPS&&cc.debug.setDisplayStats(!0)
;
}
},{
key:"clear",value:function clear(){
this.removeEventListener()
;
}
},{
key:"addEventListener",value:function addEventListener(){
p.default.on(a.default.LOGIN_SUCCESS,this.onGameSuccess,this),p.default.on(a.default.DATA_LOADED_FINISHED,this.onDataFinished,this),p.default.on(o.default.Stop_Shaking_Effect,this.onStopShaking,this),p.default.on(o.default.GM_ServerTime_Update,this.onServerTimeUpdate,this),p.default.on(o.default.FK_ACROSS_DAY,this.onCrossDay,this),p.default.on(o.default.Task_Update,this.onTaskUpdate,this),p.default.on(o.default.Level_Update,this.onLevelUpdate,this),p.default.on(a.default.AD_EVENT,this.onAdEvent,this)
;
}
},{
key:"removeEventListener",value:function removeEventListener(){
p.default.off(a.default.LOGIN_SUCCESS,this.onGameSuccess,this),p.default.off(a.default.DATA_LOADED_FINISHED,this.onDataFinished,this),p.default.off(o.default.Stop_Shaking_Effect,this.onStopShaking,this),p.default.off(o.default.GM_ServerTime_Update,this.onServerTimeUpdate,this),p.default.off(o.default.FK_ACROSS_DAY,this.onCrossDay,this),p.default.off(o.default.Task_Update,this.onTaskUpdate,this),p.default.off(o.default.Level_Update,this.onLevelUpdate,this),p.default.off(a.default.AD_EVENT,this.onAdEvent,this)
;
}
},{
key:"onGameSuccess",value:function onGameSuccess(){
this.preLoadThemeRes(),r.default.platform!==r.PlatformType.H5&&this.onDataFinished(),v.default.recordTodayLoginGame(y.EActivityId.Candy),v.default.recordTodayLoginGame(y.EActivityId.Cosmetics),u.default.checkAndResetAllDailyCounters()
;
}
},{
key:"onDataFinished",value:function onDataFinished(){
this.updateStayDays(),this.updateTotalLoginDays(),v.default.recordTodayLoginGame(y.EActivityId.Candy),v.default.recordTodayLoginGame(y.EActivityId.Cosmetics)
;
}
},{
key:"onServerTimeUpdate",value:function onServerTimeUpdate(){
var e=this.serverTime
;cc.log("[GameHelper] onServerTimeUpdate: GM\u65F6\u95F4=".concat(g.TimeUtil.dateFormat("yyyy-mm-dd HH:MM:SS",e))),this.updateStayDays(),this.updateTotalLoginDays(),e>0&&(this.serverTime=e,cc.log("[GameHelper] \u6062\u590DGM\u65F6\u95F4: serverTime=".concat(g.TimeUtil.dateFormat("yyyy-mm-dd HH:MM:SS",this.serverTime)))),v.default.checkAndResetDataOnGMTimeUpdate(),cc.log("[GameHelper] serverTime=".concat(g.TimeUtil.dateFormat("yyyy-mm-dd HH:MM:SS",this.serverTime),", getCurrentTime=").concat(g.TimeUtil.dateFormat("yyyy-mm-dd HH:MM:SS",S.getCurrentTime())))
;
}
},{
key:"updateStayDays",value:function updateStayDays(){
var e=f.default.getCurLevelId()
;if(e>1){
var _t107=0
;if(e!==parseInt(_.default.getItem("historyLevel")||"0")?(_t107=Date.now(),_.default.setItem("historyLevel",e.toString()),_.default.setItem("histroyTime",_t107.toString())):_t107=_.default.getItem("histroyTime")?parseInt(_.default.getItem("histroyTime")):Date.now(),_t107>0){
var _e139=this.serverTime>0?this.serverTime:Date.now(),_i94=d.default.getCrossDayTime()
;if(_i94){
var _o68=_i94.hour,_n43=_i94.minute,_s32=_i94.second,_r25=864e5,_a15=new Date(_t107),_c7=new Date(_a15.getFullYear(),_a15.getMonth(),_a15.getDate()).getTime()+36e5*_o68+6e4*_n43+1e3*_s32
;var _u5
;var _d10=_e139-(_u5=_t107>=_c7?_c7+_r25:_c7)
;var _h3=0
;_d10>0&&(_h3=Math.floor(_d10/_r25)),l.DynamicLevel_Utils.stayDays=_h3
;
}
}
}
}
},{
key:"updateTotalLoginDays",value:function updateTotalLoginDays(){
var e=this.serverTime>0?this.serverTime:Date.now()
;var t=parseInt(_.default.getItem("lastLoginTime")||"0")
;if(t){
var _i95=new Date(t),_o69=new Date(e)
;if("".concat(_i95.getFullYear(),"-").concat(_i95.getMonth(),"-").concat(_i95.getDate())!=="".concat(_o69.getFullYear(),"-").concat(_o69.getMonth(),"-").concat(_o69.getDate())){
var _t108=parseInt(_.default.getItem("themeTotalLoginDays")||"1")
;s.default.themeTotalLoginDays=_t108+1,_.default.setItem("lastLoginTime",e.toString()),_.default.setItem("themeTotalLoginDays",s.default.themeTotalLoginDays.toString())
;
}else s.default.themeTotalLoginDays=parseInt(_.default.getItem("themeTotalLoginDays")||"1")
;
}else _.default.setItem("lastLoginTime",e.toString()),_.default.setItem("themeTotalLoginDays","1"),s.default.themeTotalLoginDays=1
;
}
},{
key:"onTaskUpdate",value:function onTaskUpdate(e){
I.ActivityConfigBtn&&0!==I.ActivityConfigBtn.length&&(I.ActivityConfigBtn.forEach(function(t){
var i
;if(v.default.checkAndRecordSignInByActivityId(t.id,null!==(i=t.taskType)&&void 0!==i?i:v.ETaskType.DailySignIn)&&e){
var _e140=y.default.getConfigById(t.id)
;if(_e140){
var _i96=v.default.getDayOffsetFromStart(_e140.startTime)
;v.default.reportDailyTaskSignInSuccess(t.id,_i96+1),v.default.setSignInDataByKey()
;
}
}
}),p.default.emit(o.default.UpdateThemeRedot))
;
}
},{
key:"onAdEvent",value:function onAdEvent(e,t,i,n){
i===C.AdEvent.Reward&&(u.default.addAdCount(),v.default.shouldRecordWatchAdsTask(t)&&(v.default.addTodayWatchAdsCount(y.EActivityId.Candy,1,!1),v.default.addTodayWatchAdsCount(y.EActivityId.Cosmetics,1,!1)),v.default.shouldRecordCollectTask(t)&&(v.default.addTodayCollectCount(y.EActivityId.Candy,1,!1),v.default.addTodayCollectCount(y.EActivityId.Cosmetics,1,!1)),v.default.shouldRecordRefreshTask(t)&&(v.default.addTodayRefreshCount(y.EActivityId.Candy,1,!1),v.default.addTodayRefreshCount(y.EActivityId.Cosmetics,1,!1)),t===T.E_Ad.VideoDailyTaskSignIn&&p.default.emit(o.default.SignIn_MakeUp_Success),p.default.emit(o.default.Task_Update,t!==T.E_Ad.VideoDailyTaskSignIn))
;
}
},{
key:"onCrossDay",value:function onCrossDay(){
u.default.checkAndResetAllDailyCounters()
;
}
},{
key:"preLoadThemeRes",value:function preLoadThemeRes(){
var e=f.default.getCurTheme()
;if(f.ThemeTypeNum>0){
var _loop16=function _loop16(){
var i="item_".concat(e,"_").concat(_t109),o=c.default.format(n.default.FruitItemResPath,e,i)
;m.default.resCache&&!m.default.resCache.get(o)&&m.default.loadRes(o,cc.SpriteFrame).then(function(e){
e&&m.default.resCache.set(o,e)
;
})
;
}
;for(var _t109=1
;_t109<=f.ThemeTypeNum
;_t109++){
_loop16()
;
}
}
}
},{
key:"onStopShaking",value:function onStopShaking(){
S.isClickShaking=!1,h.default.stopAllShake()
;
}
},{
key:"onLevelUpdate",value:function onLevelUpdate(){

}
}],[{
key:"Instance",get:function get(){
return this._instance||(this._instance=new S()),this._instance
;
}
},{
key:"hasUsedBeginBooster",get:function get(){
return this._hasUsedBeginBooster
;
},set:function set(e){
this._hasUsedBeginBooster=e
;
}
},{
key:"isClickShaking",get:function get(){
return this._isClickShaking
;
},set:function set(e){
this._isClickShaking=e
;
}
},{
key:"getCurrentTime",value:function getCurrentTime(){
return this.Instance.serverTime>0?this.Instance.serverTime:Date.now()
;
}
},{
key:"getCurrentTimeSeconds",value:function getCurrentTimeSeconds(){
return Math.floor(this.getCurrentTime()/1e3)
;
}
}])
;return S
;
}()
;i.default=S,S.boosterCloseCounts=0,S._isClickShaking=!1,S.isShowFPS=!1,S.isOpenServerDebug=!1,cc._RF.pop()
;

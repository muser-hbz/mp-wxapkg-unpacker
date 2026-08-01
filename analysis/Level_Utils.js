_RF.push(t,"ba7e1Xg7cZLypuPnbl7RUe3","Level_Utils"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.ThemeTypeNum=i.ThemeTypeName=i.ThemeType=void 0
;var o=e("../../config/FK_Cfg"),n=e("../../dataMgr/FK_ABTestMgr"),s=e("../../dataMgr/FK_UserDataMgr"),r=e("../../platform/Platform"),a=e("../mgr/StorageMgr"),l=e("./DynamicLevel_Utils"),c=e("./NormalCfg_Utils"),u=e("./ExpertChallenge_Utils"),d=e("./TimeUtil"),h=e("./GameSpread_Utils"),f=e("./FlowStrategy_Utils"),g=e("./Theme_Utils")
;var p
;(function(e){
e[e.Hotpop=1]="Hotpop",e[e.Fruit=2]="Fruit",e[e.Store=3]="Store",e[e.Animals=4]="Animals",e[e.Cow=101]="Cow",e[e.FruitSlice=102]="FruitSlice",e[e.Flower=10001]="Flower",e[e.Barbecue=10002]="Barbecue",e[e.Candy=10003]="Candy",e[e.Cosmetics=10004]="Cosmetics"
;
})(p=i.ThemeType||(i.ThemeType={

})),i.ThemeTypeName=(_i$ThemeTypeName={

},_defineProperty2(_i$ThemeTypeName,p.Hotpop,"\u706B\u9505"),_defineProperty2(_i$ThemeTypeName,p.Fruit,"\u6C34\u679C"),_defineProperty2(_i$ThemeTypeName,p.Store,"\u767E\u8D27"),_defineProperty2(_i$ThemeTypeName,p.Animals,"\u52A8\u7269"),_defineProperty2(_i$ThemeTypeName,p.Cow,"\u8349\u5730\u725B"),_defineProperty2(_i$ThemeTypeName,p.FruitSlice,"\u6C34\u679C\u5207\u7247"),_defineProperty2(_i$ThemeTypeName,p.Flower,"\u82B1\u5349"),_defineProperty2(_i$ThemeTypeName,p.Barbecue,"\u70E4\u8089"),_defineProperty2(_i$ThemeTypeName,p.Candy,"\u7CD6\u679C"),_defineProperty2(_i$ThemeTypeName,p.Cosmetics,"\u5316\u5986\u54C1"),_i$ThemeTypeName),i.ThemeTypeNum=30
;var m=/*#__PURE__*/function(){
function m(){
_classCallCheck2(this,m)
;
}_createClass2(m,null,[{
key:"hotPotThemeId",get:function get(){
return this._hotPotThemeId||(this._hotPotThemeId=c.default.getHotPotThemeId()),this._hotPotThemeId
;
}
},{
key:"getActiveId",value:function getActiveId(){
return this._activeId
;
}
},{
key:"setActiveId",value:function setActiveId(e){
this._activeId=e
;
}
},{
key:"isActivityTheme",value:function isActivityTheme(e){
return e>100&&e!==p.Barbecue||e===p.Animals
;
}
},{
key:"setLevelId",value:function setLevelId(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0
;if(0===t)a.default.setItem("level",e.toString())
;else{
var _i152=this.getActiveLvKey(t)
;a.default.setItem(_i152,e.toString())
;
}
}
},{
key:"getLevelId",value:function getLevelId(){
var e=parseInt(a.default.getItem("level")||"1")
;return e<=0&&(e=1,a.default.setItem("level",e.toString())),e
;
}
},{
key:"getActiveAdvKey",value:function getActiveAdvKey(e){
return"advTime"+e
;
}
},{
key:"getActiveLvKey",value:function getActiveLvKey(e){
var t="activeLv"
;return e!==p.Cow&&(t="activeLv"+e),t
;
}
},{
key:"getActiveChallengeKey",value:function getActiveChallengeKey(e){
return"activeChallenge"+e
;
}
},{
key:"getActiveLv",value:function getActiveLv(e){
var t=this.getActiveLvKey(e),i=parseInt(a.default.getItem(t)||"1")
;return i<=0&&(i=1,a.default.setItem(t,i.toString())),i
;
}
},{
key:"getCurLevelId",value:function getCurLevelId(){
return 0!==this._activeId?this.getActiveLv(this._activeId):this.getLevelId()
;
}
},{
key:"addCurLevelId",value:function addCurLevelId(){
var e=this.getCurLevelId(),t=0!==this._activeId?this.getActiveLvKey(this._activeId):"level"
;a.default.setItem(t,(e+1).toString()),this.resetAdvCount()
;
}
},{
key:"getAdvCount",value:function getAdvCount(){
return parseInt(a.default.getItem("advCount")||"0")
;
}
},{
key:"addAdvCount",value:function addAdvCount(){
var e=this.getAdvCount()
;a.default.setItem("advCount",(e+1).toString())
;
}
},{
key:"resetAdvCount",value:function resetAdvCount(){
a.default.setItem("advCount","0")
;
}
},{
key:"getCurTheme",value:function getCurTheme(){
return 0===this._activeId?parseInt(a.default.getItem("theme")||"1"):this._activeId
;
}
},{
key:"isHotPot",value:function isHotPot(){
return this.getCurTheme()===this.hotPotThemeId
;
}
},{
key:"getCurChellengeCount",value:function getCurChellengeCount(){
var e=0!==this._activeId?this.getActiveChallengeKey(this._activeId):"chellenge"
;return parseInt(a.default.getItem(e)||"0")
;
}
},{
key:"addChellengeCount",value:function addChellengeCount(){
var e=0!==this._activeId?this.getActiveChallengeKey(this._activeId):"chellenge",t=this.getCurChellengeCount()
;0==t&&this.resetFristBeginTime(),a.default.setItem(e,(t+1).toString())
;
}
},{
key:"getFristBeginTime",value:function getFristBeginTime(){
var e=parseInt(a.default.getItem("fristBeginTime")||"0")
;return e<=0&&(e=d.TimeUtil.getNewData1(),a.default.setItem("fristBeginTime",e.toString())),e
;
}
},{
key:"resetFristBeginTime",value:function resetFristBeginTime(){
a.default.setItem("fristBeginTime",d.TimeUtil.getNewData1().toString())
;
}
},{
key:"resetChellengeCount",value:function resetChellengeCount(){
var e=0!==this._activeId?this.getActiveChallengeKey(this._activeId):"chellenge"
;a.default.setItem(e,"0")
;
}
},{
key:"getLevelData",value:function getLevelData(){
var e=this.getCurLevelId()
;return this._activeId===p.Cow?o.FK_Cfg.LevelCowData.get(e):this._activeId===p.FruitSlice?o.FK_Cfg.LevelSliceData.get(e):n.default.getLevelDataAB(e)
;
}
},{
key:"getTargetCount",value:function getTargetCount(){
return this.getLevelData().targetCount
;
}
},{
key:"getFruitTypeCount",value:function getFruitTypeCount(){
var e=this.getLevelData().fruitTypeCount
;if(e>0){
e+=l.DynamicLevel_Utils.getFruitTypeCount()
;var _t193=c.default.getMaxFruitTypeCount()
;e>_t193&&(e=_t193)
;
}return e
;
}
},{
key:"getDownType",value:function getDownType(){
return this.getLevelData().downType
;
}
},{
key:"getQuistFlowerCount",value:function getQuistFlowerCount(){
var e=this.getLevelData().quistFlowerCount
;return e>0&&(e+=l.DynamicLevel_Utils.getQuistFlowerCount()),e<0?0:e
;
}
},{
key:"getRopeCount",value:function getRopeCount(){
var e=this.getLevelData().ropeCount
;return e>0&&(e+=l.DynamicLevel_Utils.getRopeCount()),e<0?0:e
;
}
},{
key:"getHoleData",value:function getHoleData(){
var e=this.getLevelData(),t=e.holeCount,i=e.holeFruit
;return t>0&&(t+=l.DynamicLevel_Utils.getHoleCount(),i+=l.DynamicLevel_Utils.getHoleFruit()),cc.v2(i,t)
;
}
},{
key:"getIceCount",value:function getIceCount(){
var e=this.getLevelData().iceCount
;return e>0&&(e+=l.DynamicLevel_Utils.getIceCount()),e<0?0:e
;
}
},{
key:"getScatterType",value:function getScatterType(){
return this.getLevelData().scatterType
;
}
},{
key:"getBlockCount",value:function getBlockCount(){
var e=this.getLevelData().blockCount
;return e>0&&(e+=l.DynamicLevel_Utils.getBlockCount()),e<0?0:e
;
}
},{
key:"getFireCount",value:function getFireCount(){
var e=this.getLevelData().fireCount
;return e>0&&(e+=l.DynamicLevel_Utils.getFireCount()),e<0?0:e
;
}
},{
key:"getLevelMechanismKey",value:function getLevelMechanismKey(){
var e=""
;var t=this.getLevelData()
;return o.FK_Cfg.mechanism.forEach(function(i){
t[i.id]>0&&(e=i.id)
;
}),e
;
}
},{
key:"getFruitData",value:function getFruitData(e,t){
if(g.default.isContainSecret(t,e))return this.getFruitDataById(e)
;var i=1e3*t+e
;return o.FK_Cfg.FruitData.get(i)
;
}
},{
key:"getFruitDataById",value:function getFruitDataById(e){
return o.FK_Cfg.FruitData.get(e)
;
}
},{
key:"getRewardThemeNew",value:function getRewardThemeNew(e){
if(0===this._activeId){
var _t194=(Math.floor((e-1)/27)+1-1)%4+1
;return 1===_t194?p.Hotpop:2===_t194?p.Fruit:3===_t194?p.Store:p.Barbecue
;
}return o.FK_Cfg.ActivityList.get(this._activeId).rewardTheme
;
}
},{
key:"getThemeName",value:function getThemeName(e){
return p[e]
;
}
},{
key:"getThemeTypeName",value:function getThemeTypeName(e){
return i.ThemeTypeName[e]
;
}
},{
key:"isSliceFruitActive",value:function isSliceFruitActive(){
return this._activeId===p.FruitSlice
;
}
},{
key:"getCityConfig",value:function getCityConfig(e){
var t
;if(1===e)return o.FK_Cfg.CityConfig.get(e)
;var i=o.FK_Cfg.CityConfig.getAll(),n=Object.keys(o.FK_Cfg.CityConfig.getAll())
;n.sort(function(e,t){
return Number(e)-Number(t)
;
})
;for(var _o102=1
;_o102<n.length
;_o102++)if(e<=i[n[_o102]].level){
t=i[n[_o102-1]]
;break
;
}return t||(t=i[n[n.length-1]]),t
;
}
},{
key:"reportBeginGame",value:function reportBeginGame(){
var e=s.default.registerTime,t=d.TimeUtil.intervalDayTime(e,d.TimeUtil.getNewData1()),i=d.TimeUtil.intervalDayTime(m.getFristBeginTime(),d.TimeUtil.getNewData1())
;l.DynamicLevel_Utils.getCurLevelCondCfg()
;var o=n.default.getAllOpenABValues()
;l.DynamicLevel_Utils.getCurStayDayCfg()
;var a=Object.assign({
levelId:m.getCurLevelId(),challengeCount:m.getCurChellengeCount(),advCount:m.getAdvCount(),createDay:t,crossDay:i,densitySpread:h.default.isOpenNewSpread()?1:0
},o)
;console.log("reportBeginGame",JSON.stringify(a)),r.default.st.sendEvent("beginGameData",a)
;
}
},{
key:"reportEndGame",value:function reportEndGame(e,t,i,o,c,g,p,_){
var v,y,C,T
;var I=s.default.registerTime
;if(r.default.platform==r.PlatformType.H5){
var _e270=a.default.getItem("registerTime")
;_e270?I=Number(_e270):(I=d.TimeUtil.getNewData(),a.default.setItem("registerTime",I.toString()))
;
}var S=d.TimeUtil.intervalDayTime(I,d.TimeUtil.getNewData1())
;l.DynamicLevel_Utils.getCurLevelCondCfg()
;var b=n.default.getAllOpenABValues()
;l.DynamicLevel_Utils.getCurStayDayCfg()
;var F=Object.assign({
levelId:m.getCurLevelId(),isWin:e?1:0,createDay:S,progress:Math.floor(t),lookAdCount:i,eliminateCount:o,popBoosterCount:g,refreshCount:c,unlockBoxCount:p,reviveCount:_,challengeCount:m.getCurChellengeCount(),expertLevel:null!==(y=null===(v=u.default.currentLevelCfg)||void 0===v?void 0:v.id)&&void 0!==y?y:0,densitySpread:h.default.isOpenNewSpread()?1:0,newProgressSpread:h.default.isOpenNewSpread4_0()?1:0,ddaPlayerType:f.default.getCurUserType(),ddaSpreadType:null!==(C=null===h.default||void 0===h.default?void 0:h.default.spreadType)&&void 0!==C?C:-1,ddaFruitAdjust:null!==(T=null===h.default||void 0===h.default?void 0:h.default.fruitAdjustPercent)&&void 0!==T?T:-1,ddaCurChallenge:f.default.getChallengeCount(),ddaCurAdy:f.default.getAdCount(),ddaAverageAdv:f.default.getRecentDaysAvgAdCount(),ddaAverageChallenge:f.default.getRecentDaysAvgChallengeCount(),addDayAgo:f.default.getDailyChallengeHistory().length
},b)
;console.log("reportEndGame",JSON.stringify(F)),r.default.st.sendEvent("endGameData",F)
;
}
}])
;return m
;
}()
;i.default=m,m._activeId=0,cc._RF.pop()
;

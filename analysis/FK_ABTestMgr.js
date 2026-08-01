_RF.push(t,"dfd86AfbINHipJOTc2G/XKK","FK_ABTestMgr"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.FK_ABType=void 0
;var o=e("../config/FK_Cfg"),n=e("../platform/Platform"),s=e("./BaseDataMgr")
;var r
;(function(e){
e[e.A=0]="A",e[e.B=1]="B",e[e.C=2]="C"
;
})(r=i.FK_ABType||(i.FK_ABType={

})),i.default=new(/*#__PURE__*/function(_s$default12){
_inherits2(_class21,_s$default12)
;var _super47=_createSuper2(_class21)
;function _class21(){
var _this43
;_classCallCheck2(this,_class21)
;_this43=_super47.apply(this,arguments),_this43.name="FK_ABTestMgr",_this43.data={

},_this43.dataCache={

}
;return _this43
;
}_createClass2(_class21,[{
key:"getAllOpenABValues",value:function getAllOpenABValues(){
var e=Object.create(null)
;var t=o.FK_Cfg.ABTest.getAll(),i=Object.keys(t)
;for(var _n12=0
;_n12<i.length
;_n12++){
var _t31=o.FK_Cfg.MappingKeyName.get(i[_n12])
;if(_t31){
var _o17=_t31.key
;if(_o17){
var _t32=this.getABVal1(i[_n12])
;null!=_t32&&(e[_o17]=_t32)
;
}
}
}return e
;
}
},{
key:"getLevelDataAB",value:function getLevelDataAB(e){
var t=this.getABVal("levelDiffcultyAB")
;if(t==r.B){
if(e>o.FK_Cfg.LevelBData.count){
var _t33=e%o.FK_Cfg.LevelBData.count
;return _t33<=10&&(_t33+=10),o.FK_Cfg.LevelBData.get(_t33)
;
}return o.FK_Cfg.LevelBData.get(e)
;
}if(t==r.C){
if(e>o.FK_Cfg.LevelCData.count){
var _t34=e%o.FK_Cfg.LevelCData.count
;return _t34<=10&&(_t34+=10),o.FK_Cfg.LevelCData.get(_t34)
;
}return o.FK_Cfg.LevelCData.get(e)
;
}if(e>o.FK_Cfg.LevelData.count){
var _t35=e%o.FK_Cfg.LevelData.count
;return _t35<=10&&(_t35+=10),o.FK_Cfg.LevelData.get(_t35)
;
}return o.FK_Cfg.LevelData.get(e)
;
}
},{
key:"getInviteFlowerAB",value:function getInviteFlowerAB(){
return this.getABVal("unlockInviteFlowerAB")
;
}
},{
key:"getReviveCountAB",value:function getReviveCountAB(){
return this.getABVal("reviveCountAB")
;
}
},{
key:"getDynamicLevelAB",value:function getDynamicLevelAB(){
return this.getABVal("dynamicLevelAB")
;
}
},{
key:"getComboSystemAB",value:function getComboSystemAB(){
return this.getABVal("ComboSystemAB")
;
}
},{
key:"getAnimalAB",value:function getAnimalAB(){
return this.getABVal("AnimalAB")
;
}
},{
key:"getExpertChallengeAB",value:function getExpertChallengeAB(){
return this.getABVal("ExpertChallengeAB")
;
}
},{
key:"getDensitySpreadVertical",value:function getDensitySpreadVertical(){
return this.getABVal("densitySpreadVertical")
;
}
},{
key:"getDailyTask",value:function getDailyTask(){
return this.getABVal("dailyTask")
;
}
},{
key:"getFlowStrategy",value:function getFlowStrategy(){
return this.getABVal("ddaFlowStrategy")
;
}
},{
key:"getProgressSpreadWeight",value:function getProgressSpreadWeight(){
return this.getABVal("progressSpreadVertical")
;
}
},{
key:"getABVal",value:function getABVal(e){
var t,i
;var s=r.A,a=null!==(i=null===(t=o.FK_Cfg.ABTest.get(e))||void 0===t?void 0:t.key)&&void 0!==i?i:""
;return a?(void 0!==this.dataCache[a]?s=this.dataCache[a]:(s=n.default.device.abTest(a)||r.A,this.dataCache[a]=s,console.log("getABVal: abKey = "+a,"this.dataCache = ",this.dataCache)),s):s
;
}
},{
key:"getABVal1",value:function getABVal1(e){
var t=o.FK_Cfg.ABTest.get(e).key
;if(this.dataCache[t])return this.dataCache[t]
;var i=n.default.device.abTest(t)
;return null!=i?(this.dataCache[t]=i,i):(console.log("getABVal: abKey = "+t,"this.dataCache = ",this.dataCache),null)
;
}
}])
;return _class21
;
}(s.default))(),cc._RF.pop()
;

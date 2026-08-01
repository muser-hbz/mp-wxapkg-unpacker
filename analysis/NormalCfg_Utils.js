_RF.push(t,"9b0602bGIxO2rqNF8kUxegN","NormalCfg_Utils"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.NormalCfgKey=void 0
;var o=e("../../config/FK_Cfg")
;var n
;(function(e){
e.CrossDayTime="CrossDayTime",e.HotPotThemeId="HotPotThemeId",e.MaxFruitTypeCount="MaxFruitTypeCount",e.HitCD="HitCD",e.HitCDAttenuation="HitCDAttenuation",e.HitLeast="HitLeast",e.HitCount="HitCount",e.HitShowLabCounts="HitShowLabCounts",e.HitShowLabOpacity="HitShowLabOpacity",e.FallingRate="FallingRate",e.SlotBubbleText1="SlotBubbleText1",e.SlotBubbleText2="SlotBubbleText2",e.EliminateCount="EliminateCount",e.RefreshCount="RefreshCount",e.EliminateCorrect="EliminateCorrect",e.DoNothingTime="DoNothingTime",e.FullSlotHalfPrgTime="FullSlotHalfPrgTime",e.GameProgressStage="GameProgressStage",e.EveryDayShareCounts="EveryDayShareCounts",e.BackGroundInterval="BackGroundInterval",e.TotalLoginDays="TotalLoginDays",e.ExpertChallengeThemeId="ExpertChallengeThemeId",e.ExpertChallengelevelCond="ExpertChallengelevelCond",e.ExpertChallengeFreeCounts="ExpertChallengeFreeCounts",e.DensitySpreadVertical="DensitySpreadWeight",e.ProgressSpreadWeight="ProgressSpreadWeight",e.SecretBeginLevel="SecretBeginLevel",e.SecretGetRate="SecretGetRate",e.SecretShowRate="SecretShowRate"
;
})(n=i.NormalCfgKey||(i.NormalCfgKey={

})),i.default=/*#__PURE__*/function(){
function _class99(){
_classCallCheck2(this,_class99)
;
}_createClass2(_class99,null,[{
key:"getCrossDayTime",value:function getCrossDayTime(){
var e,t,i,s,r
;var a=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.CrossDayTime))||void 0===e?void 0:e.parameter)&&void 0!==t?t:"",l=a?a.split(":").map(function(e){
return parseInt(e)
;
}):[]
;return{
hour:null!==(i=l[0])&&void 0!==i?i:0,minute:null!==(s=l[1])&&void 0!==s?s:0,second:null!==(r=l[2])&&void 0!==r?r:0
}
;
}
},{
key:"getHotPotThemeId",value:function getHotPotThemeId(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.HotPotThemeId))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseFloat(s):e
;
}
},{
key:"getMaxFruitTypeCount",value:function getMaxFruitTypeCount(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.MaxFruitTypeCount))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getHitCD",value:function getHitCD(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.HitCD))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getHitCDAttenuation",value:function getHitCDAttenuation(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.HitCDAttenuation))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseFloat(s):e
;
}
},{
key:"getHitLeast",value:function getHitLeast(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.HitLeast))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getHitCounts",value:function getHitCounts(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.HitCount))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;return i?i.split("|").map(function(e){
return parseInt(e)
;
}):[]
;
}
},{
key:"getHitShowLabCounts",value:function getHitShowLabCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.HitShowLabCounts))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getHitShowLabOpacity",value:function getHitShowLabOpacity(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.HitShowLabOpacity))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;return i?JSON.parse(i).map(function(e){
return parseFloat(e)
;
}):[]
;
}
},{
key:"getFallingRate",value:function getFallingRate(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.FallingRate))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseFloat(s):e
;
}
},{
key:"getSlotBubbleText1",value:function getSlotBubbleText1(){
var e,t
;return null!==(t=null===(e=o.FK_Cfg.Normal.get(n.SlotBubbleText1))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;
}
},{
key:"getSlotBubbleText2",value:function getSlotBubbleText2(){
var e,t
;return null!==(t=null===(e=o.FK_Cfg.Normal.get(n.SlotBubbleText2))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;
}
},{
key:"getEliminateCount",value:function getEliminateCount(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.EliminateCount))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getRefreshCount",value:function getRefreshCount(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.RefreshCount))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getEliminateCorrect",value:function getEliminateCorrect(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.EliminateCorrect))||void 0===e?void 0:e.parameter)&&void 0!==t?t:"[]"
;return JSON.parse(i)
;
}
},{
key:"getEliminateCorrectByIndex",value:function getEliminateCorrectByIndex(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:1
;var i=this.getEliminateCorrect()
;return 0===i.length?t:e<i.length?i[e]:i[i.length-1]
;
}
},{
key:"getDoNothingTime",value:function getDoNothingTime(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:25
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.DoNothingTime))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getFullSlotHalfPrgTime",value:function getFullSlotHalfPrgTime(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:3
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.FullSlotHalfPrgTime))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getGameProgressStage",value:function getGameProgressStage(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.GameProgressStage))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;return i?JSON.parse(i):[]
;
}
},{
key:"getEveryDayShareCounts",value:function getEveryDayShareCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:3
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.EveryDayShareCounts))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getBackGroundInterval",value:function getBackGroundInterval(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.BackGroundInterval))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseFloat(s):e
;
}
},{
key:"getTotalLoginDays",value:function getTotalLoginDays(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.TotalLoginDays))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getExpertChallengeThemeId",value:function getExpertChallengeThemeId(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.ExpertChallengeThemeId))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getExpertChallengeLevelCond",value:function getExpertChallengeLevelCond(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.ExpertChallengelevelCond))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getExpertChallengeFreeCounts",value:function getExpertChallengeFreeCounts(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.ExpertChallengeFreeCounts))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getDensitySpreadVertical",value:function getDensitySpreadVertical(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.DensitySpreadVertical))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;return i?JSON.parse(i):[]
;
}
},{
key:"getProgressSpreadWeight",value:function getProgressSpreadWeight(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.ProgressSpreadWeight))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;return i?JSON.parse(i):[]
;
}
},{
key:"getSecretBeginLevel",value:function getSecretBeginLevel(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.SecretBeginLevel))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseInt(s):e
;
}
},{
key:"getSecretGetRate",value:function getSecretGetRate(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0
;var t,i
;var s=null!==(i=null===(t=o.FK_Cfg.Normal.get(n.SecretGetRate))||void 0===t?void 0:t.parameter)&&void 0!==i?i:""
;return s?parseFloat(s):e
;
}
},{
key:"getSecretShowRate",value:function getSecretShowRate(){
var e,t
;var i=null!==(t=null===(e=o.FK_Cfg.Normal.get(n.SecretShowRate))||void 0===e?void 0:e.parameter)&&void 0!==t?t:""
;return i?JSON.parse(i):[]
;
}
}])
;return _class99
;
}(),cc._RF.pop()
;

_RF.push(t,"f3338onYnBGq4/mT5KVETqE","GameMgr")
;var o=this&&this.__decorate||function(e,t,i,o){
var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o
;if("object"==(typeof Reflect==="undefined"?"undefined":_typeof2(Reflect))&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o)
;else for(var a=e.length-1
;a>=0
;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r)
;return s>3&&r&&Object.defineProperty(t,i,r),r
;
}
;Object.defineProperty(i,"__esModule",{
value:!0
})
;var n=e("../../game/cosnt/FK_EventDefine"),s=e("../../core/mgr/EventMgr"),r=e("../../core/utils/Level_Utils"),a=e("../../core/mgr/UIMgr"),l=e("./GameScene"),c=e("./view/BoosterPanel"),u=e("../../core/utils/TimeUtil"),d=e("../../core/utils/ExpertChallenge_Utils"),_cc$_decorator48=cc._decorator,h=_cc$_decorator48.ccclass,f=_cc$_decorator48.property
;var g=/*#__PURE__*/function(_cc$Component41){
_inherits2(g,_cc$Component41)
;var _super156=_createSuper2(g)
;function g(){
var _this195
;_classCallCheck2(this,g)
;_this195=_super156.apply(this,arguments),_this195.configTargetCount=0,_this195.targetCount=0,_this195.groudItems=[],_this195.collectItems=[],_this195.isLose=!1,_this195.curLevel=1,_this195.collectCount=3,_this195.progressMax=100,_this195.collectPosY=540,_this195.threeFull=!1,_this195.fourFull=!1,_this195.boosterSinglePopCloseFlag=!1,_this195.boosterPopTime=0,_this195.boosterPopTween=null
;return _this195
;
}_createClass2(g,[{
key:"onLoad",value:function onLoad(){
this.addListerner()
;
}
},{
key:"start",value:function start(){
this.initLevel()
;
}
},{
key:"onDestroy",value:function onDestroy(){
this.removeListerner()
;
}
},{
key:"setTargetCount",value:function setTargetCount(e){
this.targetCount=e,s.default.emit(n.default.Match_Update_Progress,this.targetCount)
;
}
},{
key:"minusTargetCount",value:function minusTargetCount(){
this.targetCount--,this.setTargetCount(this.targetCount),this.targetCount<=0&&this.playWin()
;
}
},{
key:"playWin",value:function playWin(){
console.log("Game Win"),s.default.emit(n.default.Match_Win)
;
}
},{
key:"playLose",value:function playLose(){
this.isLose||(a.default.closeViewByType(c.default),this.isLose=!0,s.default.emit(n.default.Match_Lose,this.targetCount),console.log("Game Over"))
;
}
},{
key:"addListerner",value:function addListerner(){
s.default.on(n.default.FallItem_InFloor,this.checkItemInFloor,this),s.default.on(n.default.FallItem_Collect,this.onCollectItem,this),s.default.on(n.default.Match_Advance_Win,this.playWin,this),s.default.on(n.default.Match_Again,this.onMatchAgain,this),s.default.on(n.default.Match_Revive,this.onMatchRevive,this),s.default.on(n.default.Match_Unlock_Place,this.onMatchOnlockPlace,this),s.default.on(n.default.FallItem_Contact,this.onCheckItemContact,this),s.default.on(n.default.Match_Win_Finish,this.onWinFinish,this),s.default.on(n.default.Match_Play_Lose,this.playLose,this),s.default.on(n.default.Match_Check_Fall_All,this.checkFallAllFinished,this),s.default.on(n.default.Match_Booster_Pop,this.onBoosterPop,this),s.default.on(n.default.Match_Booster_Panel_Close,this.onBoosterPanelClose,this)
;
}
},{
key:"removeListerner",value:function removeListerner(){
s.default.off(n.default.FallItem_InFloor,this.checkItemInFloor,this),s.default.off(n.default.FallItem_Collect,this.onCollectItem,this),s.default.off(n.default.Match_Again,this.onMatchAgain,this),s.default.off(n.default.Match_Revive,this.onMatchRevive,this),s.default.off(n.default.Match_Unlock_Place,this.onMatchOnlockPlace,this),s.default.off(n.default.FallItem_Contact,this.onCheckItemContact,this),s.default.off(n.default.Match_Win_Finish,this.onWinFinish,this),s.default.off(n.default.Match_Check_Fall_All,this.checkFallAllFinished,this),s.default.off(n.default.Match_Booster_Pop,this.onBoosterPop,this),s.default.off(n.default.Match_Booster_Panel_Close,this.onBoosterPanelClose,this)
;
}
},{
key:"onCollectItem",value:function onCollectItem(e){
this.removeGroudItem(e),this.removeCollectItem(e),this.minusTargetCount()
;
}
},{
key:"checkFallAllFinished",value:function checkFallAllFinished(e){
e==this.groudItems.length&&this.playLose()
;
}
},{
key:"onCheckItemContact",value:function onCheckItemContact(e,t){
this.isLose||e.isCollect()||t.isCollect()||(e.getId()==t.getId()?(e.node.y<=this.collectPosY||t.node.y<=this.collectPosY)&&(this.collectItems.push(e),this.collectItems.push(t),e.setCollectState(!0),t.setCollectState(!0),this.stopBoosterPopTween()):-1!==this.groudItems.indexOf(e)&&(this.pushGroudItem(t),this.checkGroudSameItem(),this.groudItems.length>this.collectCount?this.playLose():(this.groudItems.length==this.collectCount&&(this.groudItems.forEach(function(e){
e.colorShake(!1)
;
}),this.checkBoosterPopClose()),s.default.emit(n.default.Match_Contact_Unsame_Item))))
;
}
},{
key:"removeCollectItem",value:function removeCollectItem(e){
var t=this.collectItems.indexOf(e)
;-1!==t&&this.collectItems.splice(t,1)
;
}
},{
key:"removeGroudItem",value:function removeGroudItem(e){
var t=this.groudItems.indexOf(e)
;-1!==t&&(this.groudItems.splice(t,1),this.stopGroudItemShake())
;
}
},{
key:"pushGroudItem",value:function pushGroudItem(e){
-1===this.groudItems.indexOf(e)&&this.groudItems.push(e)
;
}
},{
key:"checkGroudSameItem",value:function checkGroudSameItem(){
this.groudItems.sort(function(e,t){
return e.node.position.y-t.node.position.y
;
})
;for(var _e146=this.groudItems.length-1
;_e146>=0
;_e146--)this.groudItems[_e146].isCollect()&&this.groudItems.splice(_e146,1)
;for(var _e147=this.groudItems.length-2
;_e147>=0
;_e147--){
if(_e147+1>=this.groudItems.length)continue
;var _t112=this.groudItems[_e147+1],_i99=this.groudItems[_e147]
;_t112.getId()==_i99.getId()&&(this.collectItems.push(_t112),this.collectItems.push(_i99),_t112.setCollectState(!0),_i99.setCollectState(!0),this.groudItems.splice(_e147+1,1),this.groudItems.splice(_e147,1))
;
}
}
},{
key:"initLevel",value:function initLevel(){
d.default.isExpertChallenge?(this.curLevel=0,this.configTargetCount=d.default.getTargetCount()):(this.curLevel=r.default.getCurLevelId(),this.configTargetCount=r.default.getTargetCount()),this.setTargetCount(this.configTargetCount)
;
}
},{
key:"onMatchAgain",value:function onMatchAgain(){
this.collectCount=3,this.groudItems=[],this.collectItems=[],this.isLose=!1,this.threeFull=!1,this.fourFull=!1,this.boosterSinglePopCloseFlag=!1,this.boosterPopTime=0,this.initLevel()
;
}
},{
key:"stopGroudItemShake",value:function stopGroudItemShake(){
this.groudItems.forEach(function(e){
e.stopShake()
;
})
;
}
},{
key:"onMatchRevive",value:function onMatchRevive(){
this.stopGroudItemShake(),this.groudItems=[],this.isLose=!1
;
}
},{
key:"onMatchOnlockPlace",value:function onMatchOnlockPlace(){
this.collectCount++,this.stopGroudItemShake()
;
}
},{
key:"checkItemInFloor",value:function checkItemInFloor(e){
0==this.groudItems.length&&e.node.y<=this.collectPosY&&this.pushGroudItem(e)
;
}
},{
key:"onWinFinish",value:function onWinFinish(){
a.default.Scene instanceof l.default&&this.onMatchAgain()
;
}
},{
key:"onBoosterPop",value:function onBoosterPop(){
this.boosterPopTime=u.TimeUtil.getNewData()
;
}
},{
key:"onBoosterPanelClose",value:function onBoosterPanelClose(e,t,i){
i&&e==c.BoosterType.UnlockSingleBox&&!i[0]&&(this.boosterSinglePopCloseFlag=!0)
;
}
},{
key:"checkBoosterPopClose",value:function checkBoosterPopClose(){
var _this196=this
;if(this.boosterSinglePopCloseFlag)return
;var e=this.targetCount/this.configTargetCount
;if(e>.5)return
;if(console.log("getNewData - boosterPopTime",u.TimeUtil.getNewData()-this.boosterPopTime),this.groudItems.length>4)return
;if(3==this.groudItems.length&&this.threeFull||4==this.groudItems.length&&this.fourFull||u.TimeUtil.getNewData()-this.boosterPopTime<25e3)return
;var t=this.groudItems.length
;this.stopBoosterPopTween(),this.boosterPopTween=cc.tween(this.node).delay(.7).call(function(){
_this196.boosterPopTween=null,_this196.isLose||(a.default.openView(c.default,!1,c.BoosterType.UnlockSingleBox,100*(1-e)),3!=t||_this196.threeFull?4!=t||_this196.fourFull||(_this196.fourFull=!0):_this196.threeFull=!0)
;
}).start()
;
}
},{
key:"stopBoosterPopTween",value:function stopBoosterPopTween(){
this.boosterPopTween&&(this.boosterPopTween.stop(),this.boosterPopTween=null)
;
}
}])
;return g
;
}(cc.Component)
;g=o([h],g),i.default=g,cc._RF.pop()
;

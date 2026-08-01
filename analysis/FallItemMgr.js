_RF.push(t,"73eb6YkI0hOEYy8YVGv8IrR","FallItemMgr")
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
;var n=e("../../game/cosnt/FK_EventDefine"),s=e("./view/FallItem"),r=e("../../core/mgr/EventMgr"),a=e("./view/HoleItem"),l=e("./view/BlockItem"),c=e("../../dataMgr/SoundMgr"),u=e("../../config/FK_SoundCfg"),d=e("../../core/mgr/UIMgr"),h=e("../../core/utils/Level_Utils"),f=e("../../config/FK_Cfg"),g=e("./GameScene"),p=e("../../platform/Platform"),m=e("./view/WinPanel"),_=e("../../core/utils/DynamicLevel_Utils"),v=e("../../core/mgr/GameHelper"),y=e("../../core/utils/ExpertChallenge_Utils"),C=e("./view/ExpertChallengeResultPanel"),T=e("../../core/utils/Game_Utils"),I=e("../../core/utils/GameSpread_Utils"),_cc$_decorator44=cc._decorator,S=_cc$_decorator44.ccclass,b=_cc$_decorator44.property
;var F=/*#__PURE__*/function(_cc$Component37){
_inherits2(F,_cc$Component37)
;var _super152=_createSuper2(F)
;function F(){
var _this172
;_classCallCheck2(this,F)
;_this172=_super152.apply(this,arguments),_this172.fallItemPrefab=null,_this172.holeItemPrefab=null,_this172.stumpItemPrefab=null,_this172.blockItemPrefab=null,_this172.fallRoot=null,_this172.fallTree=null,_this172.fallTreeBeginPosY=0,_this172.fallTreeTargetPos=cc.Vec3.ZERO,_this172.fallItemParent=null,_this172.lineLeft=null,_this172.lineRight=null,_this172.holdGroundNode=null,_this172.holdNumNode=null,_this172.difficultyNode=null,_this172.difficultyLabel=null,_this172.guideNode=null,_this172.guideFingerNode=null,_this172.guideFingerAnim=!1,_this172.guideTipsNode=null,_this172.downType=0,_this172.itemTouched=[],_this172.itemPool=[],_this172.itemFloor=[],_this172.itemDestory=[],_this172.holePool=[],_this172.holeMap=new Map(),_this172.blockPool=[],_this172.stumpPool=[],_this172.lowestItem=null,_this172.lowestPosY=750,_this172.lowestPosX=240,_this172.totalCount=0,_this172.minDistance=80,_this172.curLevel=1,_this172.isReadyState=!1,_this172.fallAction=null,_this172.fruitTypeCount=0,_this172.isPlayResultAnim=!1,_this172.curPassDt=0,_this172.resultAnimIndex=0,_this172.RESULT_ITEM_INTERVAL=.03,_this172.RESULT_SCALE_DURATION=.15,_this172.RESULT_BATCH_SIZE=2,_this172.RESULT_PANEL_DELAY=.5,_this172.resultAnimFinishedCount=0,_this172.resultAnimParent=null,_this172.resultAnimProcessingStart=0
;return _this172
;
}_createClass2(F,[{
key:"maxItemCounts",get:function get(){
return Math.min(this.itemDestory.length,80)
;
}
},{
key:"onLoad",value:function onLoad(){
this.addListerner()
;
}
},{
key:"start",value:function start(){
var _this173=this
;this.initLevel(),cc.tween(this.node).to(.5,{
opacity:255
}).call(function(){
_this173.fallTreeBeginPosY=_this173.fallTree.position.y,_this173.fallTreeTargetPos=_this173.fallTree.position
;
}).start(),cc.tween(this.fallTree).to(.1,{
scale:1
}).call(function(){
_this173.loadLevel()
;
}).start(),this.showDifficulty()
;
}
},{
key:"update",value:function update(e){
0==this.fallTreeTargetPos.x&&0==this.fallTreeTargetPos.y||(this.fallTree.position=this.fallTree.position.lerp(this.fallTreeTargetPos,.1))
;
}
},{
key:"onUpdate",value:function onUpdate(e){
if(this.isPlayResultAnim){
this.curPassDt+=e
;var _t67=this.maxItemCounts
;for(
;this.resultAnimIndex<_t67
;){
var _e86=this.resultAnimIndex*this.RESULT_ITEM_INTERVAL
;if(this.curPassDt<_e86)break
;var _i57=Math.min(this.resultAnimIndex+this.RESULT_BATCH_SIZE,_t67)
;for(var _t68=this.resultAnimIndex
;_t68<_i57
;_t68++){
var _e87=this.itemDestory[_t68]
;_e87&&_e87.node&&(_e87.node.active=!0,_e87.node.rotation=0,_e87.node.scale=0,_e87.node.opacity=255,_e87.node.parent=this.resultAnimParent,_e87.node.setPosition(cc.v3(0,this.node.height/2,0)),_e87.hideCollectSprite(),_e87.rigidBody&&_e87.rigidBody.type!==cc.RigidBodyType.Dynamic&&(_e87.rigidBody.bullet=!1,_e87.setRigidBodyActive(!0),_e87.setRigidBodyType(cc.RigidBodyType.Dynamic),_e87.rigidBody.enabledContactListener=!1))
;
}this.resultAnimIndex=_i57
;
}var _i58=!0
;var _o35=Math.min(this.resultAnimIndex,_t67)
;for(var _n19=this.resultAnimProcessingStart
;_n19<_o35
;_n19++){
var _t69=this.itemDestory[_n19]
;_t69&&_t69.node&&_t69.node.scale<1&&(_i58=!1,_t69.node.scale=Math.min(_t69.node.scale+e/this.RESULT_SCALE_DURATION,1),_t69.node.scale>=1&&(this.resultAnimProcessingStart=_n19+1))
;
}_i58&&this.resultAnimIndex>=_t67&&this.curPassDt>=_t67*this.RESULT_ITEM_INTERVAL+this.RESULT_SCALE_DURATION+this.RESULT_PANEL_DELAY&&(this.isPlayResultAnim=!1,this.curPassDt=0,this.resultAnimIndex=0,this.resultAnimFinishedCount=0,this.resultAnimProcessingStart=0,this.resultAnimParent=null,y.default.isExpertChallenge?d.default.openView(C.default,C.ResultType.Win):d.default.openView(m.default,h.default.getCurChellengeCount()),c.default.playEffect(u.E_Sound.Success))
;
}
}
},{
key:"onDestroy",value:function onDestroy(){
this.removeListerner()
;
}
},{
key:"addListerner",value:function addListerner(){
r.default.on(n.default.FallItem_InFloor,this.onFallInFloor,this),r.default.on(n.default.FallItem_Touch,this.onTouchItem,this),r.default.on(n.default.FallItem_Collect,this.onCollectItem,this),r.default.on(n.default.Match_Again,this.onMatchAgain,this),r.default.on(n.default.Match_Revive,this.onMatchRevive,this),r.default.on(n.default.Match_Use_Booster_Refresh,this.onMatchBoosterRefresh,this),r.default.on(n.default.Match_Use_Booster_Collect,this.onMatchBoosterCollect,this),r.default.on(n.default.Match_Use_Booster_Collect_OneKey,this.onMatchBoosterCollectOneKey,this),r.default.on(n.default.Match_Win_Finish,this.onWinFinish,this),r.default.on(n.default.FallItem_Contact,this.onCheckItemContact,this),r.default.on(n.default.Match_Debug_Update,this.onMatchDebug,this),r.default.on(n.default.FallItem_Collect_Finish,this.onCollectItemFinish,this),r.default.on(n.default.Match_Play_Result_Anim,this.onMatchPlayResultAnim,this),r.default.on(n.default.Match_Contact_Unsame_Item,this.onMatchContactUnsameItem,this),r.default.on(n.default.Match_Play_HotPot_Anim,this.hotPotDropEffect,this)
;
}
},{
key:"removeListerner",value:function removeListerner(){
r.default.off(n.default.FallItem_Touch,this.onTouchItem,this),r.default.off(n.default.FallItem_Collect,this.onCollectItem,this),r.default.off(n.default.Match_Again,this.onMatchAgain,this),r.default.off(n.default.FallItem_InFloor,this.onFallInFloor,this),r.default.off(n.default.Match_Revive,this.onMatchRevive,this),r.default.off(n.default.Match_Use_Booster_Refresh,this.onMatchBoosterRefresh,this),r.default.off(n.default.Match_Use_Booster_Collect,this.onMatchBoosterCollect,this),r.default.on(n.default.Match_Use_Booster_Collect_OneKey,this.onMatchBoosterCollectOneKey,this),r.default.off(n.default.Match_Win_Finish,this.onWinFinish,this),r.default.off(n.default.FallItem_Contact,this.onCheckItemContact,this),r.default.off(n.default.Match_Debug_Update,this.onMatchDebug,this),r.default.off(n.default.FallItem_Collect_Finish,this.onCollectItemFinish,this),r.default.off(n.default.Match_Play_Result_Anim,this.onMatchPlayResultAnim,this),r.default.off(n.default.Match_Contact_Unsame_Item,this.onMatchContactUnsameItem,this),r.default.off(n.default.Match_Play_HotPot_Anim,this.hotPotDropEffect,this)
;
}
},{
key:"createFallItem",value:function createFallItem(e,t){
var i=!y.default.isExpertChallenge&&h.default.isSliceFruitActive(),o=cc.instantiate(this.fallItemPrefab).getComponent(s.default)
;return o.node.parent=this.fallItemParent,o.node.angle=i?45:360*Math.random(),o.node.setPosition(t),o.setSprite(e,i),o.setOriginPosition(cc.v3(t.x,t.y,0)),o.setDownType(this.downType),o
;
}
},{
key:"createHoleItem",value:function createHoleItem(e,t,i,o){
var n=cc.instantiate(this.holeItemPrefab).getComponent(a.default)
;return n.setNum(e),n.setHoleId(i),n.node.parent=this.holdGroundNode,n.node.setPosition(t),n.node.active=!1,n.setBindFallItem(o),this.holePool.push(n),this.holeMap.set(i,[]),n
;
}
},{
key:"createStumpItem",value:function createStumpItem(e){
var t=cc.instantiate(this.stumpItemPrefab)
;return t.parent=this.fallRoot,t.setPosition(e),this.stumpPool.push(t),t
;
}
},{
key:"createBlockItem",value:function createBlockItem(e,t){
var i=cc.instantiate(this.blockItemPrefab).getComponent(l.default)
;return i.node.parent=this.fallTree,i.node.setPosition(t),i.setBlockType(e),this.blockPool.push(i.node),i
;
}
},{
key:"level1",value:function level1(){
var e=[cc.v2(0,800),cc.v2(80,860),cc.v2(0,920),cc.v2(-80,860),cc.v2(-230,1860),cc.v2(-70,1860),cc.v2(-150,1920),cc.v2(-150,1800),cc.v2(230,1860),cc.v2(70,1860),cc.v2(150,1920),cc.v2(150,1800)]
;this.addItemPool(e,[1,1,1,1,1,1,1,1,4,4,4,4])
;
}
},{
key:"fruitScliceLevel1",value:function fruitScliceLevel1(){
var e=[cc.v2(-52,800),cc.v2(52,800),cc.v2(-104,854),cc.v2(0,854),cc.v2(104,854),cc.v2(-52,908),cc.v2(52,908),cc.v2(0,962)]
;this.addItemPool(e,[1,1,3,3,2,2,3,3]),this.itemPool[0].setSliceState(!1),this.itemPool[1].setSliceState(!1)
;
}
},{
key:"scatterFruits1",value:function scatterFruits1(){
var e=[],t=this.lowestPosY
;for(var _o36=0
;_o36<this.totalCount
;_o36++){
var _i59=_o36%13,_n20=0,_s16=t+170*Math.floor(_o36/13)
;_o36%13<6?_n20=85*(_i59-3)+42.5:(_n20=85*(_i59-6-3),_s16+=85),e.push(cc.v2(_n20,_s16))
;
}var i=I.default.getVerticalIds(this.totalCount)
;this.addItemPool(e,i)
;
}
},{
key:"scatterFruits2",value:function scatterFruits2(){
var e=[],t=-this.node.getContentSize().width/2+40,i=this.lowestPosY
;for(var _n21=0
;_n21<this.totalCount
;_n21++){
var _o37=Math.floor(_n21/7),_s17=0
;_s17=_o37%9<=4?t+_o37%9*42.5:t+42.5*(9-_o37%9-1),_s17+=_n21%7*85
;var _r11=i+85*_o37
;e.push(cc.v2(_s17,_r11))
;
}var o=I.default.getVerticalIds(this.totalCount)
;this.addItemPool(e,o)
;
}
},{
key:"scatterFruits3",value:function scatterFruits3(){
var e=[],t=this.lowestPosY
;for(var _o38=0
;_o38<this.totalCount
;_o38++){
var _i60=Math.floor(_o38/24),_n22=_o38%24,_s18=0,_r12=0,_a7=0
;_n22<7?(_r12=85*((_s18=_n22%7)-3),_a7=t+340*_i60):_n22<13?(_r12=85*((_s18=_n22%13-7)-3)+42.5,_a7=t+340*_i60+85):_n22<18?(_r12=85*((_s18=_n22%18-13)-2),_a7=t+340*_i60+170):(_r12=85*((_s18=_n22%24-18)-3)+42.5,_a7=t+340*_i60+255),e.push(cc.v2(_r12,_a7))
;
}var i=I.default.getVerticalIds(this.totalCount)
;this.addItemPool(e,i)
;
}
},{
key:"scatterFruits4",value:function scatterFruits4(){
var e=[],t=this.lowestPosY
;for(var _o39=0
;_o39<this.totalCount
;_o39++){
var _i61=Math.floor(_o39/18),_n23=_o39%18,_s19=0,_r13=0
;_n23<7?(_s19=85*(_n23-3),_r13=t+255*_i61):_n23<13?(_s19=85*(_n23-7-3)+42.5,_r13=t+255*_i61+85):(_s19=85*(_n23-13-2),_r13=t+255*_i61+170),e.push(cc.v2(_s19,_r13))
;
}var i=I.default.getVerticalIds(this.totalCount)
;this.addItemPool(e,i)
;
}
},{
key:"centerStumpLevel",value:function centerStumpLevel(){
var e=this.getVerticalWidth(),t=this.totalCount,i=Math.ceil(t/2/Math.floor(e/80)*96),o=I.default.getVerticalIds(t),n=this.generatePoints(e,i,80,t)
;for(var _a8=0
;_a8<n.length
;_a8++)n[_a8].x=n[_a8].x-this.node.getContentSize().width/2+40,n[_a8].y+=this.lowestPosY
;var s=this.generatePoints(e,i,80,t)
;for(var _a9=0
;_a9<s.length
;_a9++)s[_a9].x+=70,s[_a9].y+=this.lowestPosY
;var r=n.concat(s)
;r.sort(function(e,t){
return e.y-t.y
;
}),this.addItemPool(r,o)
;
}
},{
key:"addItemPool",value:function addItemPool(e,t){
for(var _i62=0
;_i62<t.length
;_i62++){
var _o40=this.createFallItem(t[_i62],e[_i62])
;_o40.node.setScale(0),this.itemPool.push(_o40)
;
}
}
},{
key:"spawnFruitsVertical",value:function spawnFruitsVertical(){
var e=this.getVerticalWidth(),t=this.totalCount,i=Math.ceil(t/Math.floor(e/81)*121.5),o=y.default.isExpertChallenge?y.default.getHoleData():h.default.getHoleData(),n=I.default.getVerticalIds(t+o.x),s=this.generatePoints(e,i,81,t)
;s.sort(function(e,t){
return e.y-t.y
;
})
;var r=n.length-o.x
;if(s.length<r){
console.error("\u7EB5\u5411\u6389\u843D \u9700\u8981\u8865\u5145 "+(r-s.length)+" \u4E2A\u68CB\u5B50")
;var _t70=cc.v2(0,s[s.length-1].y+81)
;for(var _i63=s.length
;_i63<r
;_i63++)s.push(_t70),_t70.x+81<=e-50?_t70.x+=81:(_t70.x=0,_t70.y+=81),console.error("\u8865\u5145\u5750\u6807 "+(_t70.x-e/2)+", "+(this.lowestPosY+_t70.y))
;
}console.log("width: "+e+", height: "+i+", radius: 81, count: "+t+", points: "+s.length+", ids: "+n.length)
;var a=n.length-o.x
;for(var _l3=0
;_l3<a
;_l3++){
var _t71=cc.v2(s[_l3].x-e/2,this.lowestPosY+s[_l3].y),_i64=this.createFallItem(n[_l3],_t71)
;_i64.node.setScale(0),this.itemPool.push(_i64)
;
}if(console.log("this.totalCount = "+this.totalCount),o.x>0){
var _e88=this.getItemToBindHole(o.y),_t72=this.getHoleCountArr(),_i65=n.length-o.x
;for(var _o41=0
;_o41<_e88.length
;_o41++){
var _s20=_e88[_o41],_r14=_t72[_o41],_a10=_s20.node.position,_l4=_o41+1
;this.createHoleItem(_r14,_a10,_l4,_s20)
;var _c3=[]
;for(var _e89=_i65
;_e89<_i65+_r14
;_e89++){
var _t73=this.createFallItem(n[_e89],cc.v2(_a10.x,_a10.y))
;_t73.node.active=!1,_c3.push(_t73)
;
}this.holeMap.set(_l4,_c3),_i65+=_r14
;
}
}
}
},{
key:"spawnFruitsHorizontal",value:function spawnFruitsHorizontal(){
var _this174=this
;var e=this.node.getContentSize().height-650-300,t=this.totalCount,i=Math.ceil(t/Math.floor(e/81)*121.5),o=I.default.getHorIds(t),n=this.generatePoints(i,e,81,t)
;n.sort(function(e,t){
return 1===_this174.downType?t.x-e.x:e.x-t.x
;
})
;var s=this.node.getContentSize().width/2-this.lowestPosX,r=1===this.downType?-i+s:-s
;if(n.length<o.length){
console.error("\u6A2A\u5411\u6389\u843D \u9700\u8981\u8865\u5145 "+(o.length-n.length)+" \u4E2A\u68CB\u5B50")
;var _t74=1===this.downType?-81:81,_i66=cc.v2(n[n.length-1].x+_t74,0)
;for(var _s21=n.length
;_s21<o.length
;_s21++)n.push(_i66),_i66.y+81<=e?_i66.y+=81:(_i66.y+=_t74,_i66.x+=0),console.error("\u8865\u5145\u5750\u6807 "+(r+_i66.x)+", "+(_i66.y+this.lowestPosY))
;
}console.log("spawnFruitsHorizontal width: "+i+", height: "+e+", radius: 81, count: "+t+", points: "+n.length+", ids: "+o.length)
;for(var _a11=0
;_a11<o.length
;_a11++){
var _e90=cc.v2(r+n[_a11].x,n[_a11].y+this.lowestPosY),_t75=this.createFallItem(o[_a11],_e90)
;_t75.node.setScale(0),this.itemPool.push(_t75)
;
}
}
},{
key:"sliceSpreadLevel",value:function sliceSpreadLevel(){
var e=[],t=this.lowestPosY
;for(var _o42=0
;_o42<this.totalCount
;_o42++){
var _i67=Math.floor(_o42/11),_n24=_o42%11,_s22=0,_r15=0
;_n24<5?(_s22=104*(_n24-2),_r15=t+108*_i67):(_s22=104*(_n24-5-3)+52,_r15=t+108*_i67+54),e.push(cc.v2(_s22,_r15))
;
}var i=I.default.getIds(this.totalCount)
;for(var _o43=2
;_o43<i.length
;_o43++)if(i[_o43]===i[1]){
if(3==_o43)break
;var _e91=i[3]
;i[3]=i[_o43],i[_o43]=_e91
;break
;
}this.addItemPool(e,i),this.itemPool[1].setSliceState(!1),this.itemPool[3].setSliceState(!1)
;
}
},{
key:"generatePoints",value:function generatePoints(e,t,i,o){
var n=i/Math.sqrt(2),s=Math.ceil(e/n),r=Math.ceil(t/n),a=new Array(s*r).fill(-1),l=[],c=[],u=new cc.Vec2(Math.random()*e,Math.random()*t)
;for(this.addPoint(u,a,l,c,n,s)
;c.length>0
;){
var _u=Math.floor(Math.random()*c.length),_d5=c[_u]
;var _h2=!1
;for(var _f2=0
;_f2<o
;_f2++){
var _o44=Math.random()*Math.PI*2,_u2=Math.random()*i+i,_f3=new cc.Vec2(_d5.x+Math.cos(_o44)*_u2,_d5.y+Math.sin(_o44)*_u2)
;if(_f3.x>=0&&_f3.x<e&&_f3.y>=0&&_f3.y<t&&this.isPointValid(_f3,a,l,n,s,r,i)){
this.addPoint(_f3,a,l,c,n,s),_h2=!0
;break
;
}
}_h2||c.splice(_u,1)
;
}return l
;
}
},{
key:"addPoint",value:function addPoint(e,t,i,o,n,s){
t[Math.floor(e.x/n)+Math.floor(e.y/n)*s]=i.length,i.push(e),o.push(e)
;
}
},{
key:"isPointValid",value:function isPointValid(e,t,i,o,n,s,r){
var a=Math.floor(e.x/o),l=Math.floor(e.y/o),c=r*r
;for(var _u3=-1
;_u3<=1
;_u3++)for(var _o45=-1
;_o45<=1
;_o45++){
var _r16=a+_u3,_d6=l+_o45
;if(_r16>=0&&_r16<n&&_d6>=0&&_d6<s){
var _o46=t[_r16+_d6*n]
;if(-1!==_o46&&cc.Vec2.squaredDistance(e,i[_o46])<c)return!1
;
}
}return!0
;
}
},{
key:"onTouchItem",value:function onTouchItem(e){
e.node.parent=this.fallRoot
;var t=this.itemPool.indexOf(e)
;-1!==t&&(this.checkSliceShow(e),this.itemPool.splice(t,1),T.default.addToArray(e,this.itemTouched),this.itemPool.length<=0||(1==this.curLevel?8==this.itemPool.length&&(this.fallTreeTargetPos=cc.v3(0,this.fallTreeBeginPosY-1e3,0)):this.checkLowestItem(e),this.checkGuideNext()))
;
}
},{
key:"checkSliceShow",value:function checkSliceShow(e){
if(y.default.isExpertChallenge)return
;if(!h.default.isSliceFruitActive())return
;var t=this.itemPool.indexOf(e),i=Math.max(0,t-20),o=Math.min(this.itemPool.length-1,t+20)
;for(var _n25=i
;_n25<=o
;_n25++){
if(_n25==t)continue
;var _i68=this.itemPool[_n25],_o47=e.node.position,_s23=_i68.node.position
;Math.abs(_o47.x-_s23.x)<=65&&Math.abs(_o47.y-_s23.y)<=65&&_i68.setSliceState(!1,!0)
;
}
}
},{
key:"checkLowestItem",value:function checkLowestItem(e){
if(1===this.curLevel)return
;if(this.itemPool.length<=0)return void(this.lowestItem=null)
;var t=this.itemPool[this.itemPool.length-1],i=t.node.parent.convertToWorldSpaceAR(t.node.position)
;if(!(0===this.downType&&i.y<this.node.getContentSize().height-200)&&this.lowestItem==e&&this.itemPool.length>0){
if(this.lowestItem=this.itemPool[0],0===this.downType){
var _e92=this.getLowestHoleItem()
;null!=_e92&&_e92.node.position.y<this.lowestItem.node.position.y&&(this.lowestItem=_e92)
;
}var _e93=this.lowestItem.node.parent.convertToWorldSpaceAR(this.lowestItem.node.position),_t76=cc.v2(cc.winSize.width/2-375,0)
;if(1===this.downType){
if(_e93.x-=_t76.x,console.log("beginPos = "+_t76.toString()),_e93.x<this.node.getContentSize().width-this.lowestPosX){
v.default.isClickShaking&&r.default.emit(n.default.Stop_Shaking_Effect)
;var _t77=this.node.getContentSize().width-this.lowestPosX-_e93.x
;this.fallTreeTargetPos=cc.v3(this.fallTree.position.x+_t77,this.fallTreeBeginPosY,0)
;
}
}else if(2===this.downType){
if(_e93.x-=_t76.x,_e93.x>this.lowestPosX){
v.default.isClickShaking&&r.default.emit(n.default.Stop_Shaking_Effect)
;var _t78=_e93.x-this.lowestPosX
;this.fallTreeTargetPos=cc.v3(this.fallTree.position.x-_t78,this.fallTreeBeginPosY,0)
;
}
}else{
v.default.isClickShaking&&r.default.emit(n.default.Stop_Shaking_Effect)
;var _t79=_e93.y-this.lowestPosY
;this.fallTreeTargetPos=cc.v3(0,this.fallTree.position.y-_t79,0)
;
}
}
}
},{
key:"hotPotDropEffect",value:function hotPotDropEffect(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:1
;if(!this.itemPool||0===this.itemPool.length||e<=0)return
;var t=[],i=cc.view.getVisibleSize().height
;for(var _n26=0
;_n26<this.fallItemParent.childrenCount
;_n26++){
var _e94=this.fallItemParent.children[_n26]
;if(_e94){
if(_e94.y>i)break
;_e94.y>=120+this.lowestPosY&&_e94.y<i-300&&t.push(_e94)
;
}
}t.sort(function(){
return Math.random()-.5
;
})
;var o=t.slice(0,Math.min(e,t.length))
;var _loop2=function _loop2(){
var e=o[_n27]
;cc.tween(e).repeat(3,cc.tween().to(.1,{
angle:e.angle-10
}).to(.1,{
angle:e.angle+10
})).call(function(){
var t=e.getComponent(s.default)
;t&&(t.setContactStartCallBack(function(){
t.setContactStartCallBack(null),t.colorShake(!0,3)
;
}),t.onClickItem())
;
}).start()
;
}
;for(var _n27=0
;_n27<o.length
;_n27++){
_loop2()
;
}
}
},{
key:"getLowestHoleItem",value:function getLowestHoleItem(){
var e=null
;var _iterator10=_createForOfIteratorHelper2(this.holePool),_step10
;try{
for(_iterator10.s()
;!(_step10=_iterator10.n()).done
;){
var _t80=_step10.value
;var _i69=this.holeMap.get(_t80.getHoleId()),_o48=null
;for(var _e95=0
;_e95<_i69.length
;_e95++){
var _t81=_i69[_e95]
;if(!_t81.getTouchState()){
_o48=_t81
;break
;
}
}null!=_o48&&(null==e?e=_o48:_o48.node.position.y<e.node.position.y&&(e=_o48))
;
}
}catch(err){
_iterator10.e(err)
;
}finally{
_iterator10.f()
;
}return e
;
}
},{
key:"onCollectItem",value:function onCollectItem(e){
this.checkHoleBindItemFall(e),T.default.removeFromArray(e,this.itemTouched),T.default.removeFromArray(e,this.itemFloor),1===this.downType?this.fallTreeTargetPos.x+=5:2===this.downType&&(this.fallTreeTargetPos.x-=5),this.checkLowestItem(e),I.default.updateChangeItemListPos()
;
}
},{
key:"setTotalCount",value:function setTotalCount(e){
this.totalCount=e
;
}
},{
key:"initLevel",value:function initLevel(){
if(this.curLevel=h.default.getCurLevelId(),y.default.isExpertChallenge){
this.downType=y.default.getDownType(),this.fruitTypeCount=y.default.getFruitTypeCount(),console.log("ExpertChallenge fruitTypeCount:",this.fruitTypeCount)
;var _e96=y.default.getHoleData(),_t82=y.default.getTargetCount(),_i70=Math.max(0,_t82-_e96.x)
;return console.log("ExpertChallenge targetCount:",_t82,"holeFruit:",_e96.x,"totalCount:",_i70),this.setTotalCount(_i70),this.isReadyState=!1,this.lineLeft.active=2===this.downType,void(this.lineRight.active=1===this.downType)
;
}this.downType=h.default.getDownType(),this.fruitTypeCount=h.default.getFruitTypeCount(),console.log("fruitTypeCount:",this.fruitTypeCount)
;var e=h.default.getHoleData()
;var t=h.default.getTargetCount(),i=Math.max(0,t-e.x)
;this.setTotalCount(i),this.isReadyState=!1,this.lineLeft.active=2===this.downType,this.lineRight.active=1===this.downType,h.default.isSliceFruitActive()&&(this.lowestPosY=800)
;
}
},{
key:"loadLevel",value:function loadLevel(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!0
;if(y.default.isExpertChallenge){
if(0===this.downType){
var _e97=y.default.getScatterType()
;1===_e97?this.scatterFruits1():2===_e97?this.scatterFruits2():3===_e97?this.scatterFruits3():4===_e97?this.scatterFruits4():this.spawnFruitsVertical()
;
}else this.spawnFruitsHorizontal()
;return this.updateFlowerCount(),this.beginShow(!0),this.checkIce(),this.checkBlock(),this.checkStumpItem(),void this.setupExpertChallengeSpine()
;
}h.default.isSliceFruitActive()?1==this.curLevel?this.fruitScliceLevel1():this.sliceSpreadLevel():1==this.curLevel?this.level1():this.curLevel>10&&this.curLevel%10==2&&Math.floor(this.curLevel/10)%2==0?this.centerStumpLevel():0===this.downType?1===h.default.getScatterType()?this.scatterFruits1():2===h.default.getScatterType()?this.scatterFruits2():3===h.default.getScatterType()?this.scatterFruits3():4===h.default.getScatterType()?this.scatterFruits4():this.spawnFruitsVertical():this.spawnFruitsHorizontal(),this.updateFlowerCount(),this.beginShow(1!==this.curLevel),this.checkIce(),this.checkBlock(),this.checkStumpItem()
;
}
},{
key:"setupExpertChallengeSpine",value:function setupExpertChallengeSpine(){
if(!y.default.isExpertChallenge)return
;var e=y.default.getHoodCount()
;if(e<=0)return
;var t=[]
;var _iterator11=_createForOfIteratorHelper2(this.itemPool),_step11
;try{
for(_iterator11.s()
;!(_step11=_iterator11.n()).done
;){
var _c4=_step11.value
;_c4.iceCount<=0&&!_c4.isSlice&&t.push(_c4)
;
}
}catch(err){
_iterator11.e(err)
;
}finally{
_iterator11.f()
;
}console.log("\u52A8\u7269spine----------------------------start"),console.log("\u603B\u666E\u901A\u7269\u54C1\u6570\u91CF: ".concat(t.length,", \u603B\u5C0F\u52A8\u7269\u6570\u91CF: ").concat(e))
;var i=function i(e,t){
for(var _i71=0
;_i71<t
;_i71++)e[_i71].showExpertSpine()
;
},o=t.slice(0,Math.floor(.2*t.length))
;T.default.shuffleArray(o)
;var n=Math.ceil(.1*e)
;console.log("\u8FDB\u5EA60-20%\u5206\u5E0310%\u7684\u5C0F\u52A8\u7269: \u7269\u54C1\u6570\u91CF=".concat(o.length,", \u5206\u5E03\u5C0F\u52A8\u7269\u6570\u91CF=").concat(n)),i(o,n)
;var s=t.slice(o.length,Math.floor(.5*t.length))
;T.default.shuffleArray(s)
;var r=Math.ceil(.2*e)
;console.log("\u8FDB\u5EA620-50%\u5206\u5E0320%\u7684\u5C0F\u52A8\u7269: \u7269\u54C1\u6570\u91CF=".concat(s.length,", \u5206\u5E03\u5C0F\u52A8\u7269\u6570\u91CF=").concat(r)),i(s,r)
;var a=t.slice(o.length+s.length)
;T.default.shuffleArray(a)
;var l=e-r-n
;console.log("\u8FDB\u5EA650-100%\u5206\u5E03\u767E\u5206\u4E4B70\u7684\u5C0F\u52A8\u7269: \u7269\u54C1\u6570\u91CF=".concat(a.length,", \u5206\u5E03\u5C0F\u52A8\u7269\u6570\u91CF=").concat(l)),i(a,l),console.log("\u52A8\u7269spine----------------------------end")
;
}
},{
key:"onMatchAgain",value:function onMatchAgain(){
var _this175=this
;var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;for(var _t83=0
;_t83<this.itemTouched.length
;_t83++)this.itemTouched[_t83].node.destroy()
;for(var _t84=0
;_t84<this.itemPool.length
;_t84++)this.itemPool[_t84].node.destroy()
;for(var _t85=0
;_t85<this.holePool.length
;_t85++)this.holePool[_t85].destroySelf()
;for(var _t86=0
;_t86<this.itemFloor.length
;_t86++)this.itemFloor[_t86].node.destroy()
;for(var _t87=0
;_t87<this.itemDestory.length
;_t87++)this.itemDestory[_t87].node.destroy()
;for(var _t88=0
;_t88<this.blockPool.length
;_t88++)this.blockPool[_t88].destroy()
;for(var _t89=0
;_t89<this.stumpPool.length
;_t89++)this.stumpPool[_t89].destroy()
;this.itemTouched=[],this.itemPool=[],this.itemFloor=[],this.holePool=[],this.itemDestory=[],this.blockPool=[],this.stumpPool=[],this.lowestItem=null,this.fallTreeTargetPos=cc.v3(0,this.fallTreeBeginPosY,0),this.fallTree.setPosition(0,this.fallTreeBeginPosY),cc.tween(this.node).delay(.1).call(function(){
_this175.initLevel(),_this175.loadLevel(e),_this175.showDifficulty()
;
}).start()
;
}
},{
key:"onFallInFloor",value:function onFallInFloor(e){
T.default.addToArray(e,this.itemFloor),this.checkHoleBindItemFall(e)
;
}
},{
key:"onMatchRevive",value:function onMatchRevive(){
y.default.isExpertChallenge?this.reviveNormal():h.default.isSliceFruitActive()?this.reviveSliceFruit():this.reviveNormal()
;
}
},{
key:"reviveSliceFruit",value:function reviveSliceFruit(){
var _this176=this
;this.isReadyState=!0
;for(var _t90=0
;_t90<this.itemFloor.length
;_t90++)T.default.removeFromArray(this.itemFloor[_t90],this.itemTouched)
;var e=this.getSliceRevivePosList()
;var _loop3=function _loop3(){
var i=_t91===_this176.itemFloor.length-1,o=0===_t91,s=_this176.itemFloor[_t91]
;s.resetState(),s.node.parent=_this176.fallItemParent,_this176.itemPool.push(s)
;var a=Math.floor(Math.random()*e.length),l=e[a]
;e.splice(a,1),cc.tween(s.node).delay(.3).to(.5,{
position:cc.v3(l.x,l.y,0),angle:45
}).call(function(){
o&&c.default.playEffect(u.E_Sound.DropChange),_this176.itemPool.forEach(function(e){
e.setOriginPosition(e.node.position)
;
}),_this176.itemTouched.forEach(function(e){
e.setOriginPosition(e.node.position)
;
})
;
}).delay(.5).call(function(){
i&&(_this176.sortItemPool(),_this176.lowestItem=_this176.itemPool[0],console.log("onMatchRevive lowestItem: "+_this176.lowestItem.getId()),r.default.emit(n.default.Match_Revive_Finish))
;
}).start()
;
}
;for(var _t91=0
;_t91<this.itemFloor.length
;_t91++){
_loop3()
;
}this.itemFloor=[]
;
}
},{
key:"reviveNormal",value:function reviveNormal(){
var _this177=this
;this.isReadyState=!0
;for(var _n28=0
;_n28<this.itemFloor.length
;_n28++)T.default.removeFromArray(this.itemFloor[_n28],this.itemTouched)
;var e=this.getCurReviveArea(),t=e[1].x-e[0].x,i=e[1].y-e[0].y,o=[]
;this.itemPool.forEach(function(e){
o.push(cc.v3(e.node.position.x,e.node.position.y,0))
;
}),this.itemTouched.forEach(function(e){
o.push(cc.v3(e.node.position.x,e.node.position.y,0))
;
})
;var _loop4=function _loop4(){
var a=_s24===_this177.itemFloor.length-1,l=0===_s24,d=_this177.itemFloor[_s24]
;d.resetState(),d.node.parent=_this177.fallItemParent,_this177.itemPool.push(d)
;var h=_this177.getSafeReviveTargetPos(e,t,i,o,78)
;o.push(cc.v3(h.x,h.y,0)),cc.tween(d.node).to(.3,{
scale:1
}).to(.5,{
position:cc.v3(h.x,h.y,0)
}).call(function(){
l&&c.default.playEffect(u.E_Sound.DropChange),a&&(_this177.itemPool.forEach(function(e){
e.setRigidBodyType(cc.RigidBodyType.Dynamic,0),e.setOriginPosition(e.node.position)
;
}),_this177.itemTouched.forEach(function(e){
e.setRigidBodyType(cc.RigidBodyType.Dynamic,0),e.setOriginPosition(e.node.position)
;
}))
;
}).to(.5,{
scale:1
}).call(function(){
a&&(_this177.sortItemPool(),_this177.itemPool.forEach(function(e){
e.setRigidBodyType(cc.RigidBodyType.Static,1),e.setOriginPosition(e.node.position)
;
}),_this177.itemTouched.forEach(function(e){
e.setRigidBodyType(cc.RigidBodyType.Dynamic),e.setOriginPosition(e.node.position)
;
}),_this177.lowestItem=_this177.itemPool[0],console.log("onMatchRevive lowestItem: "+_this177.lowestItem.getId()),r.default.emit(n.default.Match_Revive_Finish))
;
}).start()
;
}
;for(var _s24=0
;_s24<this.itemFloor.length
;_s24++){
_loop4()
;
}this.itemFloor=[]
;
}
},{
key:"getSafeReviveTargetPos",value:function getSafeReviveTargetPos(e,t,i,o,n){
var s=e[0].x,r=e[0].y
;var a=function a(e){
for(var _t92=0
;_t92<o.length
;_t92++)if(cc.Vec3.distance(e,o[_t92])<n)return!1
;return!0
;
}
;for(var _d7=0
;_d7<40
;_d7++){
var _e98=Math.random()*t+s,_o49=Math.random()*i+r,_n29=this.fallItemParent.convertToNodeSpaceAR(cc.v3(_e98,_o49,0))
;if(a(_n29))return _n29
;
}var l=Math.random()*t+s,c=Math.random()*i+r,u=this.fallItemParent.convertToNodeSpaceAR(cc.v3(l,c,0))
;for(var _d8=0
;_d8<8
;_d8++){
if(a(u))return u
;u=cc.v3(u.x,u.y+n,u.z)
;
}return u
;
}
},{
key:"getSliceRevivePosList",value:function getSliceRevivePosList(){
if(!h.default.isSliceFruitActive())return[]
;var e=[],t=[]
;for(var _i72=0
;_i72<this.itemPool.length&&(t.push(this.itemPool[_i72].node.position),!(_i72>=50))
;_i72++)
;for(var _i73=t.length-1
;_i73>=0
;_i73--){
var _o50=cc.v3(t[_i73].x-52,t[_i73].y-54,0),_n30=cc.v3(t[_i73].x+52,t[_i73].y-54,0),_s25=_o50.x>=this.node.getContentSize().width/2+30,_r17=_n30.x<=this.node.getContentSize().width/2-30
;for(var _e99=0
;_e99<t.length
;_e99++){
if(_e99==_i73)continue
;var _a12=cc.Vec3.distance(_o50,t[_e99]),_l5=cc.Vec3.distance(_n30,t[_e99])
;_a12<30&&(_s25=!1),_l5<30&&(_r17=!1)
;
}_s25&&e.push(_o50),_r17&&e.push(_n30)
;
}if(console.log("revivePosList: "+e),e.length<this.itemFloor.length){
var _t93=this.itemFloor[0].node.position,_i74=_t93.y-64,_o51=_t93.x%104==0?50:102
;for(var _n31=0
;_n31<this.itemFloor.length-e.length
;_n31++)e.push(cc.v3(_o51+104*_n31,_i74,0))
;
}return e
;
}
},{
key:"onMatchBoosterRefresh",value:function onMatchBoosterRefresh(){
var _this178=this
;var e=[],t=new Map()
;var _loop5=function _loop5(_n32){
var i=_this178.itemPool[_n32]
;e.push(i.node.position),_this178.holePool.forEach(function(e){
i==e.getBindFallItem()&&t.set(i,_n32)
;
})
;
}
;for(var _n32=0
;_n32<this.itemPool.length
;_n32++){
_loop5(_n32)
;
}var i=this.itemPool.map(function(e){
return e.getId()
;
}),o=this.itemPool.length
;if(0==this.downType){
var _e100=this.totalCount,_t94=2*Math.ceil(Math.floor(.1*_e100)/2),_i75=2*Math.ceil(Math.floor(.2*_e100)/2),_n33=2*Math.ceil(Math.floor(.2*_e100)/2),_s26=_e100-_t94-_i75-_n33
;_s26=2*Math.ceil(_s26/2)
;var _r18=12
;console.log("count4: "+_s26,"count3: "+_n33,"count2: "+_i75,"count1: "+_t94)
;var _a13=[],_l6=[],_c5=[],_u4=[],_d9=[]
;o>_s26+_n33+_i75?(_a13=this.itemPool.slice(o-_s26,o-_s26+_r18),_l6=this.itemPool.slice(o-_s26+_r18,o),_c5=this.itemPool.slice(o-_n33-_s26,o-_s26),_u4=this.itemPool.slice(o-_i75-_n33-_s26,o-_n33-_s26),_d9=this.itemPool.slice(0,o-_i75-_n33-_s26)):o>_s26+_n33?(_a13=this.itemPool.slice(o-_s26,o-_s26+_r18),_l6=this.itemPool.slice(o-_s26+_r18,o),_c5=this.itemPool.slice(o-_n33-_s26,o-_s26),_u4=this.itemPool.slice(0,o-_n33-_s26)):o>_s26&&(_a13=this.itemPool.slice(o-_s26,o-_s26+_r18),_l6=this.itemPool.slice(o-_s26+_r18,o),_c5=this.itemPool.slice(0,o-_s26)),console.log("\u5237\u65B0\u524D 50%-100%\u7684\u524D12\u4E2A items4_1: "+_a13.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u524D 50%-100% items4: "+_l6.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u524D 30%-50% items3: "+_c5.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u524D 10%-30% items2: "+_u4.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u524D \u524D10% items1: "+_d9.map(function(e){
return e.getId()
;
})),T.default.shuffleArray(_a13),T.default.shuffleArray(_l6),T.default.shuffleArray(_c5),T.default.shuffleArray(_u4),T.default.shuffleArray(_d9),console.log("\u5237\u65B0\u540E 50%-100%\u7684\u524D12\u4E2A items4_1: "+_a13.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u540E items4: "+_l6.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u540E items3: "+_c5.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u540E items2: "+_u4.map(function(e){
return e.getId()
;
})),console.log("\u5237\u65B0\u540E items1: "+_d9.map(function(e){
return e.getId()
;
})),_d9.length+_u4.length+_c5.length+_a13.length+_l6.length==this.itemPool.length?this.itemPool=[].concat(_d9,_u4,_c5,_a13,_l6):T.default.shuffleArray(this.itemPool)
;
}else{
var _e101=this.totalCount,_t95=2*Math.ceil(Math.floor(.2*_e101)/2),_i76=2*Math.ceil(Math.floor(.4*_e101)/2),_n34=18,_s27=_e101-_t95-_i76,_r19=[],_a14=[],_l7=[],_c6=[]
;if(o>_i76+(_s27=2*Math.ceil(_s27/2))){
_r19=this.itemPool.slice(o-_s27,o)
;var _e102=this.itemPool.slice(o-_i76-_s27,o-_s27)
;_a14=_e102.slice(0,_n34),_l7=_e102.slice(_n34,_i76),_c6=this.itemPool.slice(0,o-_i76-_s27)
;
}else if(this.itemPool.length>_s27){
_r19=this.itemPool.slice(o-_s27,o)
;var _e103=this.itemPool.slice(0,o-_s27)
;_l7=_e103.slice(_e103.length-_i76,_i76),_a14=_e103.slice(0,_e103.length-_i76)
;
}else _r19=_toConsumableArray2(this.itemPool)
;T.default.shuffleArray(_c6),T.default.shuffleArray(_a14),T.default.shuffleArray(_l7),T.default.shuffleArray(_r19),this.itemPool=[].concat(_c6,_a14,_l7,_r19)
;
}console.log("this.itemPool: "+this.itemPool.length),i=this.itemPool.map(function(e){
return e.getId()
;
})
;for(var _n35=0
;_n35<this.itemPool.length
;_n35++){
var _i77=this.itemPool[_n35]
;if(t.has(_i77)){
var _o52=t.get(_i77),_s28=e[_n35]
;e[_n35]=e[_o52],e[_o52]=_s28
;
}
}this.itemTouched.forEach(function(e){
e.setOriginPosition(e.node.position),e.setRigidBodyType(cc.RigidBodyType.Static)
;
})
;var _loop6=function _loop6(){
var t=_s29,i=_this178.itemPool[_s29]
;cc.tween(i.node).to(.5,{
position:e[t]
}).call(function(){
i.updateDownTypeState(),t==_this178.itemPool.length-1&&(_this178.itemPool.forEach(function(e){
e.setOriginPosition(e.node.position)
;
}),_this178.itemTouched.forEach(function(e){
e.setRigidBodyType(cc.RigidBodyType.Dynamic)
;
}),_this178.lowestItem=_this178.itemPool[0],r.default.emit(n.default.Match_Unlock_Touch))
;
}).start()
;
}
;for(var _s29=0
;_s29<this.itemPool.length
;_s29++){
_loop6()
;
}
}
},{
key:"onMatchBoosterCollect",value:function onMatchBoosterCollect(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;var t=[]
;if(this.itemFloor.length>0){
var _e104=new Map()
;var _iterator12=_createForOfIteratorHelper2(this.itemFloor),_step12
;try{
for(_iterator12.s()
;!(_step12=_iterator12.n()).done
;){
var _t96=_step12.value
;_e104.get(_t96.getId())?_e104.get(_t96.getId()).push(_t96):_e104.set(_t96.getId(),[_t96])
;
}
}catch(err){
_iterator12.e(err)
;
}finally{
_iterator12.f()
;
}var _iterator13=_createForOfIteratorHelper2(_e104.keys()),_step13
;try{
for(_iterator13.s()
;!(_step13=_iterator13.n()).done
;){
var _i78=_step13.value
;var _o53=_e104.get(_i78)
;if(_o53.length>=2){
for(var _e106=0
;_e106<2
;_e106++){
var _i79=_o53[_o53.length-1-_e106]
;t.push(_i79),this.itemFloor.splice(this.itemFloor.indexOf(_i79),1)
;
}break
;
}
}
}catch(err){
_iterator13.e(err)
;
}finally{
_iterator13.f()
;
}if(0==t.length){
var _e105=this.itemFloor[this.itemFloor.length-1]
;t.push(_e105),this.itemFloor.splice(this.itemFloor.length-1,1)
;
}
}else if(this.itemPool.length<=0&&this.itemTouched.length<=0)return
;if(0==t.length&&(this.itemPool.length>0?(t.push(this.itemPool[0]),this.itemPool.splice(0,1)):this.itemTouched.length>0&&(t.push(this.itemTouched[0]),this.itemTouched.splice(0,1))),1==t.length)for(var _i80=0
;_i80<this.itemPool.length
;_i80++){
var _e107=this.itemPool[_i80]
;if(_e107!=t[0]&&_e107.getId()==t[0].getId()){
t.push(_e107),this.itemPool.splice(_i80,1)
;break
;
}
}if(1==t.length)for(var _i81=0
;_i81<this.itemTouched.length
;_i81++){
var _e108=this.itemTouched[_i81]
;if(_e108!=t[0]&&_e108.getId()==t[0].getId()){
t.push(_e108),this.itemTouched.splice(_i81,1)
;break
;
}
}if(1==t.length)for(var _i82=this.holePool.length-1
;_i82>=0
;_i82--){
var _e109=!1,_o54=this.holePool[_i82],_n36=this.holeMap.get(_o54.getHoleId())
;for(var _i83=0
;_i83<_n36.length
;_i83++){
var _s30=_n36[_i83]
;if(_s30!=t[0]&&_s30.getId()==t[0].getId()){
t.push(_s30),_n36.splice(_i83,1),_s30.node.active=!0,_s30.setOriginPosition(_o54.node.position),_e109=!0,_o54.setNum(_n36.length),this.checkHoleShow(_o54)
;break
;
}
}if(_e109)break
;
}2!==t.length&&console.error("\u6536\u96C6\u9053\u5177\u6709bug\uFF0C\u6536\u96C6\u6570\u91CF\u4E3A\uFF1A "+t.length)
;for(var _i84=0
;_i84<t.length
;_i84++){
var _o55=t[_i84]
;this.checkSliceShow(_o55),_o55.collectSelf(e),_o55.node.parent=this.fallRoot,_o55.isChanged&&I.default.clearLevelChangeDataById(_o55.getId())
;
}
}
},{
key:"onMatchBoosterCollectOneKey",value:function onMatchBoosterCollectOneKey(){
var _this179=this
;var e=function e(){
var e=_this179.itemFloor?_this179.itemFloor.length:0,t=_this179.itemPool?_this179.itemPool.length:0,i=_this179.itemTouched?_this179.itemTouched.length:0
;return 0===e&&0===t&&0===i
;
}
;if(!e())for(
;!e()
;)this.onMatchBoosterCollect()
;
}
},{
key:"beginShow",value:function beginShow(){
var _this180=this
;var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!0
;var t=2===this.curLevel?2.5:1,i=y.default.isExpertChallenge?y.default.getScatterType():h.default.getScatterType()
;var _loop7=function _loop7(){
var e=_o56===_this180.itemPool.length-1,s=_this180.itemPool[_o56]
;s.node.scale=0!==i?0:1.1,s.setItemShow(!1),s.setRigidBodyType(cc.RigidBodyType.Dynamic,0),cc.tween(s.node).delay(t).call(function(){
s.setItemShow(!0),s.node.scale=0,s.setOriginPosition(s.node.position),s.setRigidBodyType(cc.RigidBodyType.Static)
;
}).to(.2,{
scale:1
}).call(function(){
e&&(_this180.showGuide(),r.default.emit(n.default.Match_Begin_Finish),I.default.initChangeItemList(_this180.itemPool))
;
}).start()
;
}
;for(var _o56=0
;_o56<this.itemPool.length
;_o56++){
_loop7()
;
}this.holePool.forEach(function(e){
cc.tween(e.node).to(t,{
scale:1
}).call(function(){
e.node.active=!0
;var t=e.getNumbgNode(),i=e.node.position
;t.setParent(_this180.holdNumNode),t.setPosition(i.x,i.y),e.node.scale=0,t.scale=0,cc.tween(t).to(.2,{
scale:1
}).start()
;
}).to(.2,{
scale:1
}).start()
;
}),e&&(this.lowestItem=this.itemPool[0])
;
}
},{
key:"getCurReviveArea",value:function getCurReviveArea(){
var e=[],t=this.node.getContentSize()
;return 0===this.downType?(e.push(cc.v3(50,this.lowestPosY)),e.push(cc.v3(t.width-50,t.height-200))):1===this.downType?(e.push(cc.v3(50,this.lowestPosY)),e.push(cc.v3(t.width-this.lowestPosX,t.height-200))):2===this.downType&&(e.push(cc.v3(this.lowestPosX,this.lowestPosY)),e.push(cc.v3(t.width-50,t.height-200))),e
;
}
},{
key:"sortItemPool",value:function sortItemPool(){
var _this181=this
;this.itemPool.sort(function(e,t){
return 0===_this181.downType?e.node.position.y-t.node.position.y:1===_this181.downType?t.node.x-e.node.x:e.node.x-t.node.x
;
})
;
}
},{
key:"updateFlowerCount",value:function updateFlowerCount(){
var e=y.default.isExpertChallenge?y.default.getQuistFlowerCount():h.default.getQuistFlowerCount()
;for(var _t97=0
;_t97<e
;_t97++){
var _e110=Math.floor(Math.random()*this.itemPool.length)
;this.itemPool[_e110].setQuestShow(!0)
;
}
}
},{
key:"getHoleCountArr",value:function getHoleCountArr(){
var e=y.default.isExpertChallenge?y.default.getHoleData():h.default.getHoleData()
;if(e.x<=0)return
;var t=[],i=Math.floor(e.x/(e.y+1)),o=e.x-e.y*i
;console.log("baseCount: "+i+" lastCount: "+o)
;for(var _n37=0
;_n37<e.y
;_n37++)if(_n37==e.y-1)t.push(i+o)
;else{
var _e111=Math.floor(Math.random()*o)
;console.log("randomCount: "+_e111),t.push(i+_e111),o-=_e111
;
}return t
;
}
},{
key:"getItemToBindHole",value:function getItemToBindHole(e){
var t=[],i=[],o=[]
;return 2==e?(i.push(cc.v3(-175,this.lowestPosY+300,0)),i.push(cc.v3(175,this.lowestPosY+300,0)),o.push(300),o.push(300)):3==e&&(i.push(cc.v3(-175,this.lowestPosY+300,0)),i.push(cc.v3(175,this.lowestPosY+300,0)),i.push(cc.v3(0,this.lowestPosY+500,0)),o.push(300),o.push(300),o.push(300)),this.itemPool.forEach(function(e){
for(var _n38=0
;_n38<i.length
;_n38++){
var _s31=cc.Vec3.distance(e.node.position,i[_n38])
;_s31<o[_n38]&&(o[_n38]=_s31,t[_n38]=e)
;
}
}),t
;
}
},{
key:"checkHoleBindItemFall",value:function checkHoleBindItemFall(e){
var _this182=this
;var _loop8=function _loop8(){
var i=_this182.holePool[_t98]
;if(i.getBindFallItem()===e){
var _e112=i.getHoleId(),_t99=_this182.holeMap.get(_e112)
;if(_t99){
var _e113=_t99[0]
;_e113.resetState(),_e113.node.setPosition(i.node.position),_e113.node.parent=_this182.fallItemParent,_e113.setOriginPosition(_e113.node.position),_e113.node.active=!0,_e113.node.scale=0,cc.tween(_e113.node).to(.2,{
scale:1
}).call(function(){
y.default.isExpertChallenge&&_this182.setupHoleItemExpertSpine(_e113)
;
}).start(),i.setBindFallItem(_e113),i.setNum(_t99.length-1),_t99.shift(),_this182.itemPool.push(_e113),_this182.sortItemPool()
;
}_this182.checkHoleShow(i)
;
}
}
;for(var _t98=this.holePool.length-1
;_t98>=0
;_t98--){
_loop8()
;
}
}
},{
key:"setupHoleItemExpertSpine",value:function setupHoleItemExpertSpine(e){
if(!y.default.isExpertChallenge)return
;var t=y.default.getHoodCount()
;if(t<=0)return
;var i=0
;var _iterator14=_createForOfIteratorHelper2(this.itemPool),_step14
;try{
for(_iterator14.s()
;!(_step14=_iterator14.n()).done
;){
var _o57=_step14.value
;_o57.hasExpertSpine()&&i++
;
}
}catch(err){
_iterator14.e(err)
;
}finally{
_iterator14.f()
;
}i<t&&!e.hasExpertSpine()&&e.showExpertSpine()
;
}
},{
key:"checkHoleShow",value:function checkHoleShow(e){
var t=e.getHoleId(),i=this.holeMap.get(t)
;i&&0!=i.length||(this.holePool.splice(this.holePool.indexOf(e),1),this.holeMap.delete(t),e.destroySelf())
;
}
},{
key:"checkStumpItem",value:function checkStumpItem(){
if(y.default.isExpertChallenge)return
;if(h.default.isSliceFruitActive())return
;if(this.curLevel<10||this.curLevel%10!=2)return
;var e=this.node.getContentSize(),t=this.lowestPosY
;Math.floor(this.curLevel/10)%2==0?(this.createStumpItem(cc.v2(0,t)),this.createStumpItem(cc.v2(0,t+300))):(this.createStumpItem(cc.v2(-e.width/2,t)),this.createStumpItem(cc.v2(e.width/2,t)),this.createStumpItem(cc.v2(-e.width/2,t+300)),this.createStumpItem(cc.v2(e.width/2,t+300)),this.createStumpItem(cc.v2(-e.width/2,t+600)),this.createStumpItem(cc.v2(e.width/2,t+600)))
;
}
},{
key:"getVerticalWidth",value:function getVerticalWidth(){
return y.default.isExpertChallenge?650:this.curLevel>10&&this.curLevel%10==2?Math.floor(this.curLevel/10)%2==1?550:270:650
;
}
},{
key:"checkIce",value:function checkIce(){
var e=y.default.isExpertChallenge?y.default.getIceCount():h.default.getIceCount()
;if(e<=0)return
;var t=[],i=new Map(),o=[]
;for(var _r20=0
;_r20<e
;_r20++){
if(0==_r20)t.push(30)
;else{
var _e114=Math.floor(Math.random()*(this.itemPool.length-30)+30)
;t.push(_e114)
;
}o.push(0)
;
}t.sort(function(e,t){
return e-t
;
})
;var n=0
;for(var _r21=0
;_r21<this.itemPool.length
;_r21++)if(_r21==t[n]){
var _e115=0
;if(i.forEach(function(t){
_e115+=Math.floor(t/2)
;
}),o[n]=_e115,++n>=t.length)break
;
}else{
var _e116=this.itemPool[_r21].getId()
;i.has(_e116)?i.set(_e116,i.get(_e116)+1):i.set(_e116,1)
;
}var s=y.default.isExpertChallenge?0:_.DynamicLevel_Utils.getIceLog()
;for(var _r22=0
;_r22<t.length
;_r22++){
var _e117=t[_r22],_i85=o[_r22],_n39=this.itemPool[_e117]
;console.log("ice count: "+_i85),_n39.setIceCount(_i85+s)
;
}
}
},{
key:"checkBlock",value:function checkBlock(){
var e=y.default.isExpertChallenge?y.default.getBlockCount():h.default.getBlockCount()
;if(e<=0)return
;var t=this.lowestPosY+300
;console.log("checkBlock blockCount: "+e)
;for(var _i86=0
;_i86<e
;_i86++){
var _e118=_i86%2==0?cc.v2(-100,t+500*_i86):cc.v2(100,t+500*_i86)
;console.log("checkBlock pos: "+_e118.toString())
;var _o58=Math.min(2,_i86)
;this.createBlockItem(_o58,_e118)
;
}
}
},{
key:"showDifficulty",value:function showDifficulty(){
var _this183=this
;2===this.curLevel&&(this.difficultyNode.active=!0,this.difficultyLabel.node.setPosition(-this.node.getContentSize().width/2-300,0),cc.tween(this.difficultyLabel.node).delay(.3).to(.7,{
position:cc.v3(0,0,0)
},{
easing:"backOut"
}).delay(.7).to(.7,{
position:cc.v3(this.node.getContentSize().width/2+300,0,0)
},{
easing:"backIn"
}).call(function(){
_this183.difficultyNode.active=!1
;
}).start())
;
}
},{
key:"showGuide",value:function showGuide(){
if(y.default.isExpertChallenge)return
;if(1!==this.curLevel||h.default.isSliceFruitActive())return
;this.guideFingerAnim||cc.tween(this.guideFingerNode).repeatForever(cc.tween().to(.5,{
scale:1.2
}).to(.5,{
scale:1
})).start(),this.guideNode.active=!0
;var e=this.node.getContentSize(),t=this.itemPool[0],i=t.node.parent.convertToWorldSpaceAR(t.node.position)
;this.guideFingerNode.setPosition(i.x-e.width/2,i.y-e.height/2),p.default.device.sendNewGuideLog({
guide_id:1,guide_step:1
})
;
}
},{
key:"checkGuideNext",value:function checkGuideNext(){
var _this184=this
;if(!y.default.isExpertChallenge&&1===this.curLevel&&!h.default.isSliceFruitActive())if(11===this.itemPool.length){
var _e119=this.node.getContentSize(),_t100=this.itemPool[0],_i87=_t100.node.parent.convertToWorldSpaceAR(_t100.node.position)
;this.guideFingerNode.setPosition(_i87.x-_e119.width/2,_i87.y-_e119.height/2)
;
}else if(10===this.itemPool.length){
this.guideFingerNode.active=!1,this.guideTipsNode.active=!0,cc.tween(this.guideTipsNode).delay(5).call(function(){
_this184.guideTipsNode.active=!1,_this184.guideNode.active=!0
;
}).start()
;for(var _e120=0
;_e120<this.guideTipsNode.children.length
;_e120++){
var _t101=this.guideTipsNode.children[_e120].getComponent(cc.RichText),_i88=h.ThemeType[h.default.getCurTheme()],_o59=f.FK_Cfg.ThemeData.get(_i88).itemName
;_t101.string="<color=##51566D>2\u4E2A</c><color=#F37532>\u76F8\u540C</color><color=##51566D>\u7684"+_o59+"\u4F1A\u6D88\u9664</c>"
;
}p.default.device.sendNewGuideLog({
guide_id:1,guide_step:2
})
;
}
}
},{
key:"onWinFinish",value:function onWinFinish(){
if(d.default.Scene instanceof g.default){
var _iterator15=_createForOfIteratorHelper2(this.stumpPool),_step15
;try{
for(_iterator15.s()
;!(_step15=_iterator15.n()).done
;){
var _e121=_step15.value
;_e121.destroy()
;
}
}catch(err){
_iterator15.e(err)
;
}finally{
_iterator15.f()
;
}var _iterator16=_createForOfIteratorHelper2(this.blockPool),_step16
;try{
for(_iterator16.s()
;!(_step16=_iterator16.n()).done
;){
var _e122=_step16.value
;_e122.destroy()
;
}
}catch(err){
_iterator16.e(err)
;
}finally{
_iterator16.f()
;
}this.stumpPool=[],this.blockPool=[],this.onMatchAgain(!0)
;
}
}
},{
key:"onCheckItemContact",value:function onCheckItemContact(e,t){
e.getTouchState()&&e.node.position.y<=this.lowestPosY&&(T.default.addToArray(e,this.itemFloor),this.itemFloor.length>10&&r.default.emit(n.default.Match_Play_Lose))
;
}
},{
key:"onMatchDebug",value:function onMatchDebug(e){
if("holeTest"==e&&this.holePool.length>0){
var _e123=cc.v3(0,700,0),_t102=this.holePool[0]
;_t102.node.setPosition(_e123),_t102.getNumbgNode().setPosition(_e123)
;var _i89=_t102.getBindFallItem()
;_i89&&(_i89.setOriginPosition(_e123),_i89.node.setPosition(_e123))
;
}
}
},{
key:"onCollectItemFinish",value:function onCollectItemFinish(e){
if(this.lowestItem&&this.lowestItem.colorShake(!0),T.default.addToArray(e,this.itemDestory),this.holePool.length>0)return
;var t=this.itemPool.length+this.itemTouched.length
;if(1==t)this.advanceWin()
;else if(2==t){
var _e124=null,_t103=null
;if(2==this.itemPool.length?(_e124=this.itemPool[0],_t103=this.itemPool[1]):2==this.itemTouched.length?(_e124=this.itemTouched[0],_t103=this.itemTouched[1]):1==this.itemPool.length&&1==this.itemTouched.length&&(_e124=this.itemPool[0],_t103=this.itemTouched[0]),null==_e124||null==_t103)return
;if(_e124.getId()!=_t103.getId())this.advanceWin()
;else{
var _i90=_e124.node.parent.convertToWorldSpaceAR(_e124.node.getPosition()),_o60=_t103.node.parent.convertToWorldSpaceAR(_t103.node.getPosition())
;(_i90.x<0||_i90.x>this.node.getContentSize().width||_i90.y<0||_i90.y>this.node.getContentSize().height||_o60.x<0||_o60.x>this.node.getContentSize().width||_o60.y<0||_o60.y>this.node.getContentSize().height)&&this.advanceWin()
;
}
}
}
},{
key:"advanceWin",value:function advanceWin(){
for(var _e125=0
;_e125<this.itemTouched.length
;_e125++)this.itemTouched[_e125].node.destroy()
;for(var _e126=0
;_e126<this.itemPool.length
;_e126++)this.itemPool[_e126].node.destroy()
;this.itemPool=[],this.itemTouched=[],this.lowestItem=null,r.default.emit(n.default.Match_Advance_Win)
;
}
},{
key:"onMatchPlayResultAnim",value:function onMatchPlayResultAnim(e){
e&&(this.resultAnimParent=e,this.curPassDt=0,this.resultAnimIndex=0,this.resultAnimFinishedCount=0,this.isPlayResultAnim=!0)
;
}
},{
key:"onMatchContactUnsameItem",value:function onMatchContactUnsameItem(){
0==this.itemPool.length&&this.itemFloor.length==this.itemTouched.length&&r.default.emit(n.default.Match_Check_Fall_All,this.itemFloor.length)
;
}
}])
;return F
;
}(cc.Component)
;o([b(cc.Prefab)],F.prototype,"fallItemPrefab",void 0),o([b(cc.Prefab)],F.prototype,"holeItemPrefab",void 0),o([b(cc.Prefab)],F.prototype,"stumpItemPrefab",void 0),o([b(cc.Prefab)],F.prototype,"blockItemPrefab",void 0),o([b(cc.Node)],F.prototype,"fallRoot",void 0),o([b(cc.Node)],F.prototype,"fallTree",void 0),o([b(cc.Node)],F.prototype,"fallItemParent",void 0),o([b(cc.Node)],F.prototype,"lineLeft",void 0),o([b(cc.Node)],F.prototype,"lineRight",void 0),o([b(cc.Node)],F.prototype,"holdGroundNode",void 0),o([b(cc.Node)],F.prototype,"holdNumNode",void 0),o([b(cc.Node)],F.prototype,"difficultyNode",void 0),o([b(cc.Label)],F.prototype,"difficultyLabel",void 0),o([b(cc.Node)],F.prototype,"guideNode",void 0),o([b(cc.Node)],F.prototype,"guideFingerNode",void 0),o([b(cc.Node)],F.prototype,"guideTipsNode",void 0),F=o([S],F),i.default=F,cc._RF.pop()
;

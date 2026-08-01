_RF.push(t,"77c33T19LROkqL41u10rylt","FallItem")
;var _o61,n=this&&this.__decorate||function(e,t,i,o){
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
;var s=e("../../../game/cosnt/FK_EventDefine"),r=e("../../../core/mgr/EventMgr"),a=e("../../../core/utils/FK_Utils"),l=e("../../cosnt/FK_ResDefine"),c=e("../../../dataMgr/SoundMgr"),u=e("../../../config/FK_SoundCfg"),d=e("../../../core/utils/Level_Utils"),h=e("../../../core/mgr/GameHelper"),f=e("../../../core/utils/ExpertChallenge_Utils"),g=e("../../../core/utils/NormalCfg_Utils"),p=e("../../../core/mgr/LoadMgr"),m=e("../../../core/utils/GameSpread_Utils"),_cc$_decorator45=cc._decorator,_=_cc$_decorator45.ccclass,v=_cc$_decorator45.property
;var y=_o61=/*#__PURE__*/function(_cc$Component38){
_inherits2(o,_cc$Component38)
;var _super153=_createSuper2(o)
;function o(){
var _this185
;_classCallCheck2(this,o)
;_this185=_super153.apply(this,arguments),_this185.sprite=null,_this185.collectSprite=null,_this185.button=null,_this185.questionSprite=null,_this185.iceNode=null,_this185.iceLabel=null,_this185.iceCount=0,_this185.ropePrefab=null,_this185.ropeParent=null,_this185.ropeNodeArr=[],_this185.ropeOtherItem=null,_this185.sliceNode=null,_this185.isSlice=!1,_this185.showNode=null,_this185.expertSpine=null,_this185.changeFlag=null,_this185._hasExpertSpine=!1,_this185.rigidBody=null,_this185.collider=null,_this185.isInGround=!1,_this185.collectState=!1,_this185.isPlayCollectAnim=!1,_this185.originPosX=0,_this185.originPosY=0,_this185.id=0,_this185.touchState=!1,_this185.downType=0,_this185.isShakeRoad=!1,_this185.isShakeGroud=!1,_this185.inGroundY=510,_this185.shakeTween=null,_this185.shakeBlackColor=new cc.Color(128,128,128,255),_this185.shakeRedColor=new cc.Color(255,100,100,255),_this185.curShakeColor=null,_this185.changeFlagTween=null,_this185.originAngle=0,_this185._isChanged=!1,_this185.contactStartCallBack=null,_this185.contactEndCallBack=null
;return _this185
;
}_createClass2(o,[{
key:"setContactStartCallBack",value:function setContactStartCallBack(e){
this.contactStartCallBack=e
;
}
},{
key:"setContactEndCallBack",value:function setContactEndCallBack(e){
this.contactEndCallBack=e
;
}
},{
key:"isChanged",get:function get(){
return this._isChanged
;
},set:function set(e){
this._isChanged=e
;
}
},{
key:"update",value:function update(e){
"default"!=this.node.group&&(this.collectState?(this.setRigidBodyActive(!1),this.isPlayCollectAnim||this.playCollectAnim()):(0==this.originPosX&&0==this.originPosY||this.rigidBody.type!=cc.RigidBodyType.Static?this.isSlice&&this.rigidBody.type==cc.RigidBodyType.Dynamic&&Math.abs(this.node.x)<5&&this.node.y<this.inGroundY&&(this.node.x=0,this.node.angle=0):(Math.abs(this.node.x-this.originPosX)>.1||Math.abs(this.node.y-this.originPosY)>.1)&&(this.node.setPosition(this.originPosX,this.originPosY),this.updateDownTypeState()),this.touchState&&!this.isShakeGroud&&this.node.y<this.inGroundY&&(this.isShakeGroud=!0,c.default.shake(),r.default.emit(s.default.FallItem_InFloor,this,"Ground")),this.touchState&&(this.rigidBody.bullet=this.rigidBody.linearVelocity.y>100)))
;
}
},{
key:"onLoad",value:function onLoad(){
this.initRigidBody(),this.isChanged=!1,this.setChangeFlag(!1,!1)
;
}
},{
key:"start",value:function start(){
this.addListerner()
;
}
},{
key:"onDestroy",value:function onDestroy(){
this.removeListerner()
;
}
},{
key:"addListerner",value:function addListerner(){
r.default.on(s.default.FallItem_Collect,this.onCollectItem,this)
;
}
},{
key:"removeListerner",value:function removeListerner(){
r.default.off(s.default.FallItem_Collect,this.onCollectItem,this)
;
}
},{
key:"initRigidBody",value:function initRigidBody(){
this.rigidBody=this.node.getComponent(cc.RigidBody),this.rigidBody.syncPosition(!1)
;
}
},{
key:"onClickItem",value:function onClickItem(e){
this.sliceNode.active||"default"==this.node.group||0!=this.rigidBody.active&&this.showNode.active&&(h.default.isClickShaking&&r.default.emit(s.default.Stop_Shaking_Effect),this.rigidBody.type==cc.RigidBodyType.Static&&c.default.playEffect(u.E_Sound.Click),this.setRigidBodyType(cc.RigidBodyType.Dynamic),this.touchState=!0,this.applyForceToCenter(cc.v2(0,-1e3)),this.setGravityScale(),this.isChanged&&this.updateChangeFlag(!1),m.default.isChangeItemList=!1,r.default.emit(s.default.FallItem_Touch,this,e))
;
}
},{
key:"onBeginContact",value:function onBeginContact(e,t,i){
if("default"!=t.node.group&&this.touchState&&!this.collectState&&(this.contactStartCallBack&&this.contactStartCallBack(),"Road"!=i.node.group&&"Ground"!=i.node.group||(this.setQuestShow(!1),r.default.emit(s.default.FallItem_InFloor,this,i.node.group),"Road"!=i.node.group||this.isShakeRoad?"Ground"!=i.node.group||this.isShakeGroud||(this.isShakeGroud=!0,c.default.shake()):(this.isShakeRoad=!0,c.default.shake(),r.default.emit(s.default.Match_Roll_Item,this.node))),"FallItem"==i.node.group)){
var _e127=i.node.getComponent(_o61)
;r.default.emit(s.default.FallItem_Contact,this,_e127)
;
}
}
},{
key:"clearRope",value:function clearRope(){
if(null!=this.ropeOtherItem){
for(var _e128=0
;_e128<this.ropeNodeArr.length
;_e128++)this.ropeNodeArr[_e128].destroy()
;this.ropeNodeArr=[],this.ropeOtherItem=null
;
}
}
},{
key:"getRopeOtherItem",value:function getRopeOtherItem(){
return this.ropeOtherItem
;
}
},{
key:"onEndContact",value:function onEndContact(e,t,i){
this.contactEndCallBack&&this.contactEndCallBack({
selfCollider:t,otherCollider:i
})
;
}
},{
key:"setGravityScale",value:function setGravityScale(){
this.rigidBody.gravityScale=g.default.getFallingRate()
;
}
},{
key:"hideCollectSprite",value:function hideCollectSprite(){
this.collectSprite.node.active=!1
;
}
},{
key:"playCollectAnim",value:function playCollectAnim(){
var _this186=this
;var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;c.default.playEffect(u.E_Sound.PuzzleRemoveBlock1),this.setQuestShow(!1),this.isPlayCollectAnim=!0,this.collectSprite.node.active=!0,cc.tween(this.node).delay(.1).call(function(){
_this186.node.runAction(cc.sequence(cc.spawn(cc.scaleTo(.3,1.2),cc.moveTo(.5,cc.v2(0,0)).easing(cc.easeBackIn())),cc.callFunc(function(){
_this186.node.active=!1,_this186.node.group="default",r.default.emit(s.default.FallItem_Collect_Finish,_this186)
;
})))
;
}).start(),this.rigidBody.bullet=!1,r.default.emit(s.default.FallItem_Collect,this,e)
;
}
},{
key:"setSprite",value:function setSprite(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!1
;this.id=e
;var i=f.default.isExpertChallenge?f.default.getExpertChallengeThemeId():d.default.getCurTheme(),_o62=a.default.format(l.default.FruitItemResPath,i,"item_".concat(i,"_").concat(e))
;a.default.setSpriteImg(this.sprite,_o62),a.default.setSpriteImg(this.collectSprite,_o62)
;var n=d.default.getFruitData(e,i),s=[]
;if(null!=n.points)if(n.points.length<3)console.error("\u6389\u843D\u7269\u54C1\u9519\u8BEF\uFF0C\u78B0\u649E\u70B9\u5FC5\u987B >= 3  id = ",e)
;else for(var _r23=0
;_r23<n.points.length
;_r23++){
var _t104=n.points[_r23]
;if(_t104.length<2){
console.error("\u6389\u843D\u7269\u54C1\u9519\u8BEF, \u5750\u6807\u4FE1\u606F\u9519\u8BEF, id = ",e," \u5750\u6807 = ",_t104),s=[]
;break
;
}s.push(cc.v2(n.points[_r23][0],n.points[_r23][1]))
;
}if(t)this.node.addComponent(cc.PhysicsBoxCollider),this.collider=this.node.getComponent(cc.PhysicsBoxCollider),this.collider.size=cc.size(65,65),this.randomIceMaskIcon()
;else{
var _e129=this.node.getComponent(cc.PhysicsCircleCollider),_t105=this.node.getComponent(cc.PhysicsPolygonCollider)
;s.length>0?(_e129&&(_e129.enabled=!1),_t105&&(_t105.enabled=!0,this.collider=_t105,this.collider.points=s)):(_t105&&(_t105.enabled=!1),_e129&&(_e129.enabled=!0,this.collider=_e129,this.collider.radius=n.radius,this.collider.offset=cc.v2(n.offsetX,n.offsetY))),this.collider&&this.collider.apply()
;
}this.isSlice=t,this.setSliceState(t)
;
}
},{
key:"resetState",value:function resetState(){
this.collectState=!1,this.touchState=!1,this.isShakeRoad=!1,this.isShakeGroud=!1,this.isInGround=!1,this.setOriginPosition(cc.Vec3.ZERO),this.rigidBody.type=cc.RigidBodyType.Static
;
}
},{
key:"setRigidBodyActive",value:function setRigidBodyActive(e){
this.rigidBody.active=e
;
}
},{
key:"getId",value:function getId(){
return this.id
;
}
},{
key:"setOriginPosition",value:function setOriginPosition(e){
this.originPosX=e.x,this.originPosY=e.y
;
}
},{
key:"applyForceToCenter",value:function applyForceToCenter(e){
this.rigidBody.applyForceToCenter(e,!0)
;
}
},{
key:"getRigidBody",value:function getRigidBody(){
return this.rigidBody
;
}
},{
key:"setRigidBodyType",value:function setRigidBodyType(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:1
;this.rigidBody||this.initRigidBody(),this.rigidBody.type=e,this.rigidBody.gravityScale=t,this.rigidBody.allowSleep=e!==cc.RigidBodyType.Dynamic
;
}
},{
key:"setDownType",value:function setDownType(e){
this.downType=e
;
}
},{
key:"updateDownTypeState",value:function updateDownTypeState(){
if(0==this.downType)return
;var e=cc.v2(cc.winSize.width/2-375,0),t=this.node.parent.convertToWorldSpaceAR(this.node.getPosition())
;if(1==this.downType){
var _i91=cc.v2(e.x+30,e.x+750-120)
;t.x<_i91.x?(this.node.opacity=120,this.button.interactable=!1):t.x>=_i91.x&&t.x<=_i91.y?(this.node.opacity=255,this.button.interactable=!0):h.default.isClickShaking||this.onClickItem()
;
}else if(2==this.downType){
var _i92=cc.v2(e.x+120,e.x+750-30)
;t.x<_i92.x?h.default.isClickShaking||this.onClickItem():t.x>=_i92.x&&t.x<=_i92.y?(this.node.opacity=255,this.button.interactable=!0):(this.node.opacity=120,this.button.interactable=!1)
;
}
}
},{
key:"setQuestShow",value:function setQuestShow(e){
this.questionSprite.node.active=e
;
}
},{
key:"setIceCount",value:function setIceCount(e){
this.iceCount=e,this.iceLabel.string=Math.ceil(e).toString(),this.iceNode.active=e>0
;
}
},{
key:"onCollectItem",value:function onCollectItem(e){
0!=this.iceCount&&(this.iceCount-=.5,this.setIceCount(this.iceCount))
;
}
},{
key:"collectSelf",value:function collectSelf(){
var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;this.setCollectState(!0),this.setRigidBodyActive(!1),this.isPlayCollectAnim||this.playCollectAnim(e)
;
}
},{
key:"getIsInGround",value:function getIsInGround(){
return this.isInGround
;
}
},{
key:"setCollectState",value:function setCollectState(e){
this.collectState=e,e&&this.isChanged&&(this.updateChangeFlag(!1),m.default.isChangeItemList=!1)
;
}
},{
key:"isCollect",value:function isCollect(){
return this.collectState
;
}
},{
key:"setRopeAnchorItem",value:function setRopeAnchorItem(e,t){
var i=this.node.getComponent(cc.RopeJoint)
;i.connectedBody=t.getComponent(cc.RigidBody),i.maxLength=this.node.getContentSize().width/4,i.apply(),this.ropeOtherItem=e
;
}
},{
key:"setLinkItem",value:function setLinkItem(e){
if(null==this.ropePrefab)return
;this.ropeParent.angle=-this.node.angle
;var t=cc.Vec3.distance(e.node.position,this.node.position),i=Math.ceil((t-this.node.getContentSize().width/2)/4),_o63=e.node.position.sub(this.node.position).normalize(),n=_o63.mul(this.node.getContentSize().width/4),s=(t-this.node.getContentSize().width/2)/(i+1)
;for(var _r24=0
;_r24<i
;_r24++){
var _e130=cc.instantiate(this.ropePrefab)
;_e130.parent=this.ropeParent,this.ropeNodeArr.push(_e130)
;var _t106=n.add(_o63.mul(s*_r24))
;_e130.setPosition(_t106)
;var _i93=_e130.getComponent(cc.RopeJoint)
;0==_r24?(_i93.connectedBody=this.node.getComponent(cc.RigidBody),_i93.maxLength=this.node.width/4):(_i93.connectedBody=this.ropeNodeArr[_r24-1].getComponent(cc.RigidBody),_i93.maxLength=4),_i93.apply()
;
}this.ropeOtherItem=e,e.setRopeAnchorItem(this,this.ropeNodeArr[i-1])
;
}
},{
key:"setSliceState",value:function setSliceState(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!1
;var i=this.node.getComponent(cc.Button)
;e?(i.transition=cc.Button.Transition.SCALE,i.duration=.1,i.zoomScale=.9):(i.transition=cc.Button.Transition.NONE,this.sliceNode.active&&t&&r.default.emit(s.default.Match_Ice_Break,this)),this.sliceNode.active=e
;
}
},{
key:"randomIceMaskIcon",value:function randomIceMaskIcon(){
var e=Math.random()<.5?8:9,t=this.sliceNode.getComponent(cc.Sprite),i=a.default.format(l.default.IceMaskSp,e)
;a.default.setSpriteImg(t,i)
;
}
},{
key:"stopShake",value:function stopShake(){
null!=this.shakeTween&&(this.shakeTween.stop(),this.shakeTween=null,this.curShakeColor=null,this.sprite.node.color=cc.Color.WHITE)
;
}
},{
key:"colorShake",value:function colorShake(){
var _this187=this
;var e=arguments.length>0&&arguments[0]!==undefined?arguments[0]:!1
;var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0
;var i=e?this.shakeBlackColor:this.shakeRedColor
;if(i==this.curShakeColor)return
;this.curShakeColor=i,null!=this.shakeTween&&this.shakeTween.stop()
;var _o64=this.curShakeColor==this.shakeRedColor?.6:.7
;this.curShakeColor==this.shakeRedColor?this.shakeTween=cc.tween(this.sprite.node).repeatForever(cc.tween().to(_o64,{
color:i
}).to(_o64,{
color:cc.Color.WHITE
}).delay(3)).start():this.shakeTween=t>0?cc.tween(this.sprite.node).repeat(t,cc.tween().to(_o64,{
color:i
}).to(_o64,{
color:cc.Color.WHITE
})).call(function(){
_this187.curShakeColor=null,_this187.shakeTween=null
;
}).start():cc.tween(this.sprite.node).to(_o64,{
color:i
}).to(_o64,{
color:cc.Color.WHITE
}).call(function(){
_this187.curShakeColor=null,_this187.shakeTween=null
;
}).start()
;
}
},{
key:"getTouchState",value:function getTouchState(){
return this.touchState
;
}
},{
key:"setItemShow",value:function setItemShow(e){
this.showNode.active=e
;
}
},{
key:"showExpertSpine",value:function showExpertSpine(){
var _this188=this
;f.default.isExpertChallenge&&(this._hasExpertSpine=!0,this.expertSpine&&(this.expertSpine.node.active=!0,p.default.loadRes("res/fruit/spine/tt/tt",sp.SkeletonData).then(function(e){
if(!_this188.expertSpine||!_this188.expertSpine.node.active)return
;_this188.expertSpine.skeletonData=e
;var t=f.default.getSpineName()
;_this188.expertSpine.setAnimation(0,t,!0)
;
})))
;
}
},{
key:"hideExpertSpine",value:function hideExpertSpine(){
this._hasExpertSpine=!1,this.expertSpine&&(this.expertSpine.node.active=!1)
;
}
},{
key:"hasExpertSpine",value:function hasExpertSpine(){
return this._hasExpertSpine
;
}
},{
key:"setChangeFlag",value:function setChangeFlag(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!0
;if(this.changeFlag.active=e,t&&this.isChanged)if(e){
if(m.default.levelChangeItemList&&m.default.levelChangeItemList.length<=1)return void(this.changeFlag.active=!1)
;this.originAngle=this.node.angle,this.startChangeFlagAnim()
;
}else this.stopChangeFlagAnim()
;
}
},{
key:"updateChangeFlag",value:function updateChangeFlag(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:!0
;this.setChangeFlag(e,t),!e&&this.isChanged&&(m.default.clearLevelChangeDataById(this.id),m.default.hideAllChangeItemList())
;
}
},{
key:"startChangeFlagAnim",value:function startChangeFlagAnim(e){
this.stopChangeFlagAnim(),m.default.levelChangeItemList&&m.default.levelChangeItemList.length<=1?this.changeFlag.active=!1:this.changeFlagTween=cc.tween(this.node).parallel(cc.tween().by(.8,{
angle:360
}),cc.tween().to(.4,{
scale:0
},{
easing:"sineInOut"
}).call(function(){
e&&e()
;
}).to(.4,{
scale:1
},{
easing:"sineInOut"
})).start()
;
}
},{
key:"stopChangeFlagAnim",value:function stopChangeFlagAnim(){
this.changeFlagTween&&(this.changeFlagTween.stop(),this.changeFlagTween=null,this.node.angle=this.originAngle,this.node.scale=1)
;
}
}])
;return o
;
}(cc.Component)
;n([v(cc.Sprite)],y.prototype,"sprite",void 0),n([v(cc.Sprite)],y.prototype,"collectSprite",void 0),n([v(cc.Button)],y.prototype,"button",void 0),n([v(cc.Sprite)],y.prototype,"questionSprite",void 0),n([v(cc.Node)],y.prototype,"iceNode",void 0),n([v(cc.Label)],y.prototype,"iceLabel",void 0),n([v(cc.Prefab)],y.prototype,"ropePrefab",void 0),n([v(cc.Node)],y.prototype,"ropeParent",void 0),n([v(cc.Node)],y.prototype,"sliceNode",void 0),n([v(cc.Node)],y.prototype,"showNode",void 0),n([v(sp.Skeleton)],y.prototype,"expertSpine",void 0),n([v(cc.Node)],y.prototype,"changeFlag",void 0),y=_o61=n([_],y),i.default=y,cc._RF.pop()
;

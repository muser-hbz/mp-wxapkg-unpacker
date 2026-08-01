_RF.push(t,"ac79bl3ZLFC1IIF63iwLrut","FK_ClickHold")
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
;var _cc$_decorator15=cc._decorator,n=_cc$_decorator15.ccclass,s=_cc$_decorator15.property
;var r=/*#__PURE__*/function(_cc$Component15){
_inherits2(r,_cc$Component15)
;var _super77=_createSuper2(r)
;function r(){
var _this79
;_classCallCheck2(this,r)
;_this79=_super77.apply(this,arguments),_this79.touching=!1,_this79.sericeTime=0
;return _this79
;
}_createClass2(r,[{
key:"onLoad",value:function onLoad(){
this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this),this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this)
;
}
},{
key:"update",value:function update(e){
this.touching&&(this.sericeTime+=e,this.sericeTime>=.2)&&(this.node.getComponent(cc.Button).clickEvents[0].emit([]),this.sericeTime=0)
;
}
},{
key:"onTouchStart",value:function onTouchStart(e){
this.touching=!0,this.sericeTime=0
;
}
},{
key:"onTouchMove",value:function onTouchMove(e){

}
},{
key:"onTouchCancel",value:function onTouchCancel(e){
this.onTouchEnd(e)
;
}
},{
key:"onTouchEnd",value:function onTouchEnd(e){
this.touching=!1,this.sericeTime=0
;
}
}])
;return r
;
}(cc.Component)
;r=o([n],r),i.default=r,cc._RF.pop()
;

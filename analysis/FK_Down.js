_RF.push(t,"e2b71fWX0VHA5hDs0HHDTRC","FK_Down")
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
;var n=e("../../../core/utils/TimeUtil"),s=e("../../cosnt/TetrisUtils"),_cc$_decorator21=cc._decorator,r=_cc$_decorator21.ccclass,a=_cc$_decorator21.property
;var l=/*#__PURE__*/function(_cc$Component19){
_inherits2(l,_cc$Component19)
;var _super84=_createSuper2(l)
;function l(){
var _this87
;_classCallCheck2(this,l)
;_this87=_super84.apply(this,arguments),_this87._start=!1,_this87.call=null,_this87._speed=-10,_this87._target=null,_this87._layer=null,_this87._destory=!1,_this87._endPos=null
;return _this87
;
}_createClass2(l,[{
key:"onLoad",value:function onLoad(){

}
},{
key:"initData",value:function initData(e,t,i){
var o=arguments.length>3&&arguments[3]!==undefined?arguments[3]:!1
;var n=arguments.length>4?arguments[4]:undefined
;this._speed=e,this._target=t,this._layer=i,this._destory=o,this.call=n,this._start=!0,this.schedule(this.move1)
;
}
},{
key:"initData2",value:function initData2(e,t,i){
var o=arguments.length>3&&arguments[3]!==undefined?arguments[3]:!1
;var n=arguments.length>4?arguments[4]:undefined
;this._speed=e,this._layer=i,this._destory=o,this.call=n,this._endPos=t,this._start=!0,this.schedule(this.move2)
;
}
},{
key:"move1",value:function move1(e){
if(!this._start)return
;var t=n.TimeUtil.frameTime,i=this._speed*t,o=this.node.y+=i,r=s.default.convertNodePos(this.node.parent,this._layer,cc.v2(this.node.x,o))
;if(s.default.convertNodePos(this._target,this._layer).y>=r.y){
var _e68=s.default.convertNodePos(this._target,this.node.parent)
;this.node.y=_e68.y,this.unschedule(this.move1),this.doEnd()
;
}else this.node.y=o
;
}
},{
key:"move2",value:function move2(e){
if(!this._start)return
;var t=n.TimeUtil.frameTime,i=this._speed*t,o=this.node.y+i,s=(this.node.position,this._endPos)
;s.y>=o?(this.node.y=s.y,this.unschedule(this.move2),this.doEnd()):this.node.y=o
;
}
},{
key:"update",value:function update(e){

}
},{
key:"doEnd",value:function doEnd(){
this._start=!1,this.call&&this.call(),this._destory&&(this.node.active=!1,this.node.destroy())
;
}
},{
key:"start",value:function start(){

}
}])
;return l
;
}(cc.Component)
;l=o([r],l),i.default=l,cc._RF.pop()
;

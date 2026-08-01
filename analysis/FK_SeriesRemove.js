_RF.push(t,"7517aUseV5K4rBeivt3140U","FK_SeriesRemove")
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
;var n=e("../../cosnt/TetrisUtils"),_cc$_decorator38=cc._decorator,s=_cc$_decorator38.ccclass,r=_cc$_decorator38.property
;var a=/*#__PURE__*/function(_cc$Component32){
_inherits2(a,_cc$Component32)
;var _super126=_createSuper2(a)
;function a(){
var _this137
;_classCallCheck2(this,a)
;_this137=_super126.apply(this,arguments),_this137.sk=null,_this137.numLab=null,_this137.img=null,_this137.call=null
;return _this137
;
}_createClass2(a,[{
key:"onLoad",value:function onLoad(){

}
},{
key:"start",value:function start(){

}
},{
key:"initData",value:function initData(e){
var _this138=this
;var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null
;this.numLab.string=e+"",this.numLab.node.parent.getComponent(cc.Layout).updateLayout()
;var i=n.default.convertNodePos(this.numLab.node,this.node)
;this.sk.node.setPosition(i),this.img.scale=0,this.numLab.node.scale=0,cc.tween(this.img).to(.15,{
scale:2.2
}).to(.09,{
scale:1.5
}).delay(0).call(function(){
_this138.sk.setAnimation(0,"lianxiao",!1),_this138.sk.setCompleteListener(function(){
_this138.onEndShow()
;
})
;
}).start(),cc.tween(this.numLab.node).to(.15,{
scale:5
}).to(.1,{
scale:2.5
}).start(),this.call=t
;
}
},{
key:"onEndShow",value:function onEndShow(){
var _this139=this
;cc.tween(this.node).to(.1,{
scale:1.5
}).to(.15,{
scale:0
}).call(function(){
_this139.call&&_this139.call(),_this139.node.destroy()
;
}).start()
;
}
}])
;return a
;
}(cc.Component)
;o([r(sp.Skeleton)],a.prototype,"sk",void 0),o([r(cc.Label)],a.prototype,"numLab",void 0),o([r(cc.Node)],a.prototype,"img",void 0),a=o([s],a),i.default=a,cc._RF.pop()
;

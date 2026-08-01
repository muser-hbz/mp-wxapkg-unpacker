_RF.push(t,"0fe6fdji81OlomzpcV7EtIK","FK_Float")
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
;var _cc$_decorator24=cc._decorator,n=_cc$_decorator24.ccclass,s=_cc$_decorator24.property
;var r=/*#__PURE__*/function(_cc$Component21){
_inherits2(r,_cc$Component21)
;var _super91=_createSuper2(r)
;function r(){
var _this100
;_classCallCheck2(this,r)
;_this100=_super91.apply(this,arguments),_this100.upDis=20,_this100.downDis=20,_this100.floatTime=.25,_this100.tw=null,_this100.org_y=0
;return _this100
;
}_createClass2(r,[{
key:"onLoad",value:function onLoad(){
this.org_y=this.node.y
;
}
},{
key:"start",value:function start(){
this.tw=cc.tween(this.node).to(this.floatTime,{
y:this.org_y+this.upDis
}).to(this.floatTime,{
y:this.org_y
}).to(this.floatTime,{
y:this.org_y-this.downDis
}).to(this.floatTime,{
y:this.org_y
}).union().repeatForever().start()
;
}
}])
;return r
;
}(cc.Component)
;o([s({
displayName:"\u4E0A\u8DDD\u79BB"
})],r.prototype,"upDis",void 0),o([s({
displayName:"\u4E0B\u8DDD\u79BB"
})],r.prototype,"downDis",void 0),o([s({
displayName:"\u6BCF\u6BB5\u65F6\u95F4"
})],r.prototype,"floatTime",void 0),r=o([n],r),i.default=r,cc._RF.pop()
;

_RF.push(t,"f18eeB97v9IGZD5toz9xoOk","FK_PerfectPos")
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
;var _cc$_decorator30=cc._decorator,n=_cc$_decorator30.ccclass,s=_cc$_decorator30.property
;var r=/*#__PURE__*/function(_cc$Component26){
_inherits2(r,_cc$Component26)
;var _super112=_createSuper2(r)
;function r(){
var _this119
;_classCallCheck2(this,r)
;_this119=_super112.apply(this,arguments),_this119.sk=null
;return _this119
;
}_createClass2(r,[{
key:"onLoad",value:function onLoad(){

}
},{
key:"start",value:function start(){

}
},{
key:"onInitData",value:function onInitData(e){
var _this120=this
;this.sk.setAnimation(0,"animation",!1),this.sk.setCompleteListener(function(){
_this120.node.destroy()
;
})
;
}
}])
;return r
;
}(cc.Component)
;o([s(sp.Skeleton)],r.prototype,"sk",void 0),r=o([n],r),i.default=r,cc._RF.pop()
;

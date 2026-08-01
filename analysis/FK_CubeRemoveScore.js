_RF.push(t,"8082eZ6HO5Bg7zTRuZqQsy6","FK_CubeRemoveScore")
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
;var _cc$_decorator19=cc._decorator,n=_cc$_decorator19.ccclass,s=_cc$_decorator19.property
;var r=/*#__PURE__*/function(_cc$Component17){
_inherits2(r,_cc$Component17)
;var _super82=_createSuper2(r)
;function r(){
var _this84
;_classCallCheck2(this,r)
;_this84=_super82.apply(this,arguments),_this84.normal=null,_this84.reward=null,_this84.rewardSk=null
;return _this84
;
}_createClass2(r,[{
key:"start",value:function start(){

}
},{
key:"setScore",value:function setScore(e,t){
var _this85=this
;this.normal.node.active=this.reward.node.active=!1,this.node.opacity=0,1==e?(this.normal.node.active=!0,this.normal.string=t+""):2==e&&(this.reward.node.active=!0,this.reward.string=t+"x",this.rewardSk.setAnimation(0,"animation",!0)),cc.tween(this.node).to(.2,{
opacity:255
}).delay(.5).to(.2,{
opacity:0
}).call(function(){
_this85.node.destroy()
;
}).start()
;
}
}])
;return r
;
}(cc.Component)
;o([s(cc.Label)],r.prototype,"normal",void 0),o([s(cc.Label)],r.prototype,"reward",void 0),o([s(sp.Skeleton)],r.prototype,"rewardSk",void 0),r=o([n],r),i.default=r,cc._RF.pop()
;

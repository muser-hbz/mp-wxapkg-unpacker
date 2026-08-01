_RF.push(t,"e219c0WkXdFqY+6A6etcwFf","BlockItem")
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
;var _cc$_decorator3=cc._decorator,n=_cc$_decorator3.ccclass,s=_cc$_decorator3.property
;var r=/*#__PURE__*/function(_cc$Component4){
_inherits2(r,_cc$Component4)
;var _super24=_createSuper2(r)
;function r(){
var _this19
;_classCallCheck2(this,r)
;_this19=_super24.apply(this,arguments),_this19.squareNode=null,_this19.trangleNode=null,_this19.circleNode=null,_this19.curRigidNode=null
;return _this19
;
}_createClass2(r,[{
key:"start",value:function start(){

}
},{
key:"update",value:function update(e){
!this.curRigidNode||0==this.curRigidNode.x&&0==this.curRigidNode.y||(this.curRigidNode.setPosition(0,0),this.node.parent.convertToWorldSpaceAR(this.node.getPosition()).y<=720&&this.node.destroy())
;
}
},{
key:"setBlockType",value:function setBlockType(e){
var _this20=this
;this.curRigidNode=1===e?this.squareNode:2===e?this.circleNode:this.trangleNode,cc.tween(this.squareNode).delay(.1).call(function(){
_this20.trangleNode.active=0===e,_this20.squareNode.active=1===e,_this20.circleNode.active=2===e
;
}).start()
;
}
}])
;return r
;
}(cc.Component)
;o([s(cc.Node)],r.prototype,"squareNode",void 0),o([s(cc.Node)],r.prototype,"trangleNode",void 0),o([s(cc.Node)],r.prototype,"circleNode",void 0),r=o([n],r),i.default=r,cc._RF.pop()
;

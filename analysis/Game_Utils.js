_RF.push(t,"8b782/0ldZGPaGdtxCYw62d","Game_Utils"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.default=/*#__PURE__*/function(){
function _class92(){
_classCallCheck2(this,_class92)
;
}_createClass2(_class92,null,[{
key:"shuffleArray",value:function shuffleArray(e){
for(var _t145=e.length-1
;_t145>0
;_t145--){
var _i119=Math.floor(Math.random()*(_t145+1)),o=e[_t145]
;e[_t145]=e[_i119],e[_i119]=o
;
}
}
},{
key:"getRandomId",value:function getRandomId(e){
var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null
;var i=arguments.length>2&&arguments[2]!==undefined?arguments[2]:!0
;var o=[],n=1
;for(
;o.length<e
;)-1===o.indexOf(n)&&(o.push(n),n++)
;i&&this.shuffleArray(o)
;var s=[]
;for(var r=0
;r<e
;r++)null!=t&&null!=t&&-1!==t.indexOf(o[r])||s.push(o[r])
;return s
;
}
},{
key:"addToArray",value:function addToArray(e,t){
-1===t.indexOf(e)&&t.push(e)
;
}
},{
key:"removeFromArray",value:function removeFromArray(e,t){
var i=t.indexOf(e)
;-1!==i&&t.splice(i,1)
;
}
}])
;return _class92
;
}(),cc._RF.pop()
;

_RF.push(t,"5b8c3Dxa5xOK7TbjcBR85gp","TetrisUtils"),Object.defineProperty(i,"__esModule",{
value:!0
})
;var o=e("../../config/FK_Cfg"),n=e("../../config/FK_GameCfg"),s=e("../../core/utils/FK_Utils"),r=e("../../dataMgr/FK_TraditionMgr"),a=e("./GameConst")
;var l=/*#__PURE__*/function(){
function l(){
_classCallCheck2(this,l)
;
}_createClass2(l,null,[{
key:"calcCube",value:function calcCube(e){
return{
x:Math.floor(e.x/this.size.x),y:Math.floor(e.y/this.size.y)
}
;
}
},{
key:"calcCubeId",value:function calcCubeId(e){
var t=this.calcCube(e)
;return"".concat(t.x,"_").concat(t.y)
;
}
},{
key:"calcCubeIdData",value:function calcCubeIdData(e){
var t=e.split("_")
;return{
x:parseInt(t[0]),y:parseInt(t[1])
}
;
}
},{
key:"calcCubePos",value:function calcCubePos(e){
var t=e.split("_"),i=parseInt(t[0]),o=parseInt(t[1])
;return cc.v2(i*this.size.x+this.size.x/2,o*this.size.y+this.size.y/2)
;
}
},{
key:"calcCubeDrop",value:function calcCubeDrop(e){

}
},{
key:"calcCubeIdDrop",value:function calcCubeIdDrop(e){

}
},{
key:"calcCubePosDrop",value:function calcCubePosDrop(e){

}
},{
key:"calcCubeCommon",value:function calcCubeCommon(e,t){
return{
x:Math.floor(e.x/t.x),y:Math.floor(e.y/t.y)
}
;
}
},{
key:"calcCubeIdCommon",value:function calcCubeIdCommon(e,t){
var i=this.calcCubeCommon(e,t)
;return"".concat(i.x,"_").concat(i.y)
;
}
},{
key:"calcCubePosCommon",value:function calcCubePosCommon(e,t){
var i=e.split("_"),o=parseInt(i[0]),n=parseInt(i[1])
;return cc.v2(o*t.x+t.x/2,n*t.y+t.y/2)
;
}
},{
key:"calcCubePosByV2",value:function calcCubePosByV2(e,t){
var i=e.x,o=e.y
;return cc.v2(i*t.x+t.x/2,o*t.y+t.y/2)
;
}
},{
key:"getRandomElement",value:function getRandomElement(e){
if(0!==e.length)return e[Math.floor(Math.random()*e.length)]
;
}
},{
key:"getRandomCfgByWeight",value:function getRandomCfgByWeight(e,t){
if(0===Object.keys(e).length||0===t.length)throw new Error("Input map or ids array must not be empty")
;var i=t.map(function(t){
return e[t]
;
}).filter(function(e){
return void 0!==e
;
}),o=i.reduce(function(e,t){
return e+t.rate
;
},0),n=Math.random()*o
;var s=0
;var _iterator42=_createForOfIteratorHelper2(i),_step42
;try{
for(_iterator42.s()
;!(_step42=_iterator42.n()).done
;){
var _r44=_step42.value
;if((s+=_r44.rate)>=n)return _r44.id
;
}
}catch(err){
_iterator42.e(err)
;
}finally{
_iterator42.f()
;
}throw new Error("Unable to determine a configuration by weight")
;
}
},{
key:"getRandomDataByWeight",value:function getRandomDataByWeight(e){
var t=0
;for(var _o117=0
;_o117<e.length
;_o117++)t+=e[_o117].weight
;var i=s.default.random(1,t)
;console.log("\u603B\u6743\u91CD",i,t,e)
;for(var _o118=0
;_o118<e.length
;_o118++)if((i-=e[_o118].weight)<=0)return _o118
;return 0
;
}
},{
key:"removeAllElements",value:function removeAllElements(e,t){
var i=arguments.length>2&&arguments[2]!==undefined?arguments[2]:function(e,t){
return e===t
;
}
;return e.filter(function(e){
return!i(e,t)
;
})
;
}
},{
key:"removeElementsByIndices",value:function removeElementsByIndices(e,t){
t.sort(function(e,t){
return t-e
;
})
;var _iterator43=_createForOfIteratorHelper2(t),_step43
;try{
for(_iterator43.s()
;!(_step43=_iterator43.n()).done
;){
var _i165=_step43.value
;_i165>=0&&_i165<e.length&&e.splice(_i165,1)
;
}
}catch(err){
_iterator43.e(err)
;
}finally{
_iterator43.f()
;
}return e
;
}
},{
key:"sumToN",value:function sumToN(e){
return e*(e+1)/2
;
}
},{
key:"getBlockColor",value:function getBlockColor(e){
if(e>0&&e<100)return a.CubeColrRgb[e]
;
}
},{
key:"getBlockColorDrop",value:function getBlockColorDrop(e){

}
},{
key:"tweenPromise",value:function tweenPromise(e){
if(e)return new Promise(function(t){
e.call(function(){
t()
;
}).start()
;
})
;
}
},{
key:"tweenLabNum",value:function tweenLabNum(e,t,i){
var o=arguments.length>3&&arguments[3]!==undefined?arguments[3]:.5
;var n={
num:t
},s=cc.tween(n).to(o,{
num:i
},{
progress:function progress(t,i,o,n){
if(cc.isValid(e.node))return e.string=Math.round(t+(i-t)*n)+"",t+(i-t)*n
;s.stop()
;
}
}).start()
;return s
;
}
},{
key:"getMapLast",value:function getMapLast(e){
var t=null
;for(var _i166 in e)t=e[_i166]
;return t
;
}
},{
key:"convertNodePos",value:function convertNodePos(e,t){
var i=arguments.length>2&&arguments[2]!==undefined?arguments[2]:cc.v2(0,0)
;var o=e.convertToWorldSpaceAR(i)
;return t.convertToNodeSpaceAR(o)
;
}
},{
key:"copyV2arr",value:function copyV2arr(e){
var t=[]
;var _iterator44=_createForOfIteratorHelper2(e),_step44
;try{
for(_iterator44.s()
;!(_step44=_iterator44.n()).done
;){
var _i167=_step44.value
;t.push(_i167.concat())
;
}
}catch(err){
_iterator44.e(err)
;
}finally{
_iterator44.f()
;
}return t
;
}
},{
key:"getColor",value:function getColor(e){
return cc.Color.BLACK.fromHEX(e)
;
}
},{
key:"getTraditionCubeDownSpeed",value:function getTraditionCubeDownSpeed(){
var e=o.FK_Cfg.Game.get(n.E_Game.ClassicQuicklyDropTime).value
;return Math.floor(1e3/e)*r.default.size.y
;
}
},{
key:"calConnectedCmpInMap",value:function calConnectedCmpInMap(e){
var t=0
;for(var _i168=0
;_i168<e.length
;_i168++)for(var _o119=0
;_o119<e[_i168].length
;_o119++)e[_i168][_o119]>0&&(t++,l.dfs(_i168,_o119,e))
;return t
;
}
},{
key:"dfs",value:function dfs(e,t,i){
var o=[[0,1],[1,0],[0,-1],[-1,0]]
;if(!(e<0||e>=i.length||t<0||t>=i[0].length||i[e][t]<=0)){
i[e][t]=-10
;for(var _n67=0
;_n67<o.length
;_n67++){
var _s91=e+o[_n67][0],_r45=t+o[_n67][1]
;l.dfs(_s91,_r45,i)
;
}
}
}
},{
key:"getMapRemoveHV",value:function getMapRemoveHV(e){
var t=0
;for(var _i169=0
;_i169<e.length
;_i169++){
var _o120=!0
;for(var _t213=0
;_t213<e[_i169].length
;_t213++)if(e[_i169][_t213]<=0){
_o120=!1
;break
;
}_o120&&t++
;
}for(var _i170=0
;_i170<e[0].length
;_i170++){
var _o121=!0
;for(var _t214=0
;_t214<e.length
;_t214++)if(e[_t214][_i170]<=0){
_o121=!1
;break
;
}_o121&&t++
;
}return t
;
}
},{
key:"removeMapHV",value:function removeMapHV(e){
for(var _t215=0
;_t215<e.length
;_t215++){
var _i171=!0
;for(var _o122=0
;_o122<e[_t215].length
;_o122++)if(e[_t215][_o122]<=0){
_i171=!1
;break
;
}if(_i171)for(var _o123=0
;_o123<e[_t215].length
;_o123++)e[_t215][_o123]=0
;
}for(var _t216=0
;_t216<e[0].length
;_t216++){
var _i172=!0
;for(var _o124=0
;_o124<e.length
;_o124++)if(e[_o124][_t216]<=0){
_i172=!1
;break
;
}if(_i172)for(var _o125=0
;_o125<e.length
;_o125++)e[_o125][_t216]=0
;
}return e
;
}
}])
;return l
;
}()
;i.default=l,l.size=cc.v2(43.5,43.5),cc._RF.pop()
;

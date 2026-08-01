_RF.push(t,"c6577rsUc9JI5nG4geqyWsP","GameScene")
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
;var n=e("../../config/FK_SoundCfg"),s=e("../../core/base/BaseScene"),r=e("../../core/mgr/UIMgr"),a=e("../../core/mgr/EventMgr"),l=e("../../core/mgr/GameHelper"),c=e("../../core/ui/UIConfig"),u=e("../../core/utils/Level_Utils"),d=e("../../core/utils/TimeUtil"),h=e("../../dataMgr/SoundMgr"),f=e("../cosnt/FK_EventDefine"),g=e("./view/GamePanel"),p=e("./view/LobbyPanel")
;var m=/*#__PURE__*/function(_s$default19){
_inherits2(m,_s$default19)
;var _super159=_createSuper2(m)
;function m(){
var _this210
;_classCallCheck2(this,m)
;_this210=_super159.apply(this,arguments),_this210._lastCheckTime=0
;return _this210
;
}_createClass2(m,[{
key:"onLoad",value:function onLoad(){
_get2(_getPrototypeOf2(m.prototype),"onLoad",this).call(this),this.checkResolution()
;
}
},{
key:"start",value:function start(){
this._lastCheckTime=l.default.getCurrentTime(),1===u.default.getCurLevelId()?r.default.openView(g.default):(h.default.playMusic(n.E_Sound.BGMLobby),r.default.openView(p.default))
;
}
},{
key:"update",value:function update(e){
var t=l.default.getCurrentTime()
;t-this._lastCheckTime>=1e3&&(this._lastCheckTime=t,d.TimeUtil.isSameDay(this._lastCheckTime-1e3,t)||(cc.log("[GameScene] \u68C0\u6D4B\u5230\u8DE8\u5929\uFF0C\u6D3E\u53D1\u8DE8\u5929\u4E8B\u4EF6"),a.default.emit(f.default.FK_ACROSS_DAY)))
;
}
},{
key:"checkResolution",value:function checkResolution(){
var e=cc.view.getVisibleSize()
;if(e.width/e.height>=.65){
var _e169=this.node.getComponent(cc.Canvas)
;_e169&&(_e169.fitHeight=!0,_e169.fitWidth=!1),r.default.setRootSize(cc.winSize)
;
}
}
}])
;return m
;
}(s.default)
;m=o([c.regUI("ui/GameScene")],m),i.default=m,cc._RF.pop()
;

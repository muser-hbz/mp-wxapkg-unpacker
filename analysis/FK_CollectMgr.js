_RF.push(t,"c603c6DdI1LCJ8fw9jpYSgR","FK_CollectMgr"),Object.defineProperty(i,"__esModule",{
value:!0
})
;var o=e("../core/mgr/EventMgr"),n=e("../core/mgr/ToastMgr"),s=e("../game/cosnt/FK_EventDefine"),r=e("../game/cosnt/FK_TextDefine"),a=e("../platform/Platform"),l=e("./BaseDataMgr"),c=e("./SidebarMgr")
;i.default=new(/*#__PURE__*/function(_l$default4){
_inherits2(_class41,_l$default4)
;var _super80=_createSuper2(_class41)
;function _class41(){
var _this82
;_classCallCheck2(this,_class41)
;_this82=_super80.apply(this,arguments),_this82.name="FK_Collect",_this82.data={
reward:0
}
;return _this82
;
}_createClass2(_class41,[{
key:"onDataLoaded",value:function onDataLoaded(){
this.data.reward||(this.data.reward=0,this.uploadData())
;
}
},{
key:"checkCollect",value:function checkCollect(){
return this.data.reward>0
;
}
},{
key:"onCollect",value:function onCollect(){
this.isCollectScene()?(this.addReward(),o.default.emit(s.default.FK_COLLECT_UPDATE)):n.default.show(r.FK_TextDefine.edgeMsg)
;
}
},{
key:"isCollectScene",value:function isCollectScene(){
var e=c.default.getScene()
;if(a.default.platform==a.PlatformType.WxMini){
if(1037==e)return!0
;var _t44=a.default.device.getEnterOptions()
;return!(!_t44||1089!=_t44.scene&&1001!=_t44.scene&&1103!=_t44.scene)
;
}if(a.default.platform==a.PlatformType.TtMini){
if("021036"==e)return!0
;var _t45=a.default.device.getEnterOptions()
;return!(!_t45||"021036"!=_t45.scene)
;
}if(a.default.platform==a.PlatformType.H5)return!0
;
}
},{
key:"addReward",value:function addReward(){

}
}])
;return _class41
;
}(l.default))(),cc._RF.pop()
;

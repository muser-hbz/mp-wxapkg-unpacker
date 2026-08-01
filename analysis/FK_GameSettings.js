_RF.push(t,"d4b43BzCuNBO4eNiAP+7FBj","FK_GameSettings"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.Publish=void 0,e("./game/preload/LoadSubPack"),e("./game/preload/InitData"),function(e){
e[e.Debug=0]="Debug",e[e.Release=1]="Release"
;
}(o=i.Publish||(i.Publish={

}))
;var n=/*#__PURE__*/function(){
function n(){
_classCallCheck2(this,n)
;
}_createClass2(n,null,[{
key:"init",value:function init(){
cc.macro.ENABLE_MULTI_TOUCH=!1,this.publish==o.Release&&(this.Debug=!1,this.localCfg=!1)
;
}
},{
key:"API",get:function get(){
return this.API_URL[this.publish]
;
}
}])
;return n
;
}()
;i.default=n,n.publish=o.Debug,n.Version="1.8.23",n.Debug=!0,n.DebugData={

},n.configVer=1,n.configDir=n.configVer+"/",n.localCfg=!0,n.FirstScene="GameScene",n.isAutoLogin=!0,n.isGM=!1,n.app_id="1770631744",n.tt_app_id="1770631744",n.channel_id="1003",n.app_key="oU55Ot7oPF30yKSQUwYPO8hDQ1jRD9Pj",n.serverUrl="https://leyou-static.game.jingyougz.com/matchfruit/weixin/hotpopb599/",n.subscribeIdWx="JMzAf3Fh6z9aLDLSywK7aluEgwIhrgTWxV5QlpXeN5IsGzDvB33nZq3xfeWfhBgk",n.subscribeIdTt="9aa914471d7daede53017ad80e63dfd82e59f9a2",n.shareId="1",n.API_URL=["https://dev-fishisland-dy.game.jingyougz.com","https://fishisland-dy.game.jingyougz.com"],n.init(),cc._RF.pop()
;

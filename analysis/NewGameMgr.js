_RF.push(t,"e4e59Isz/dOS4/Ahee/bNyO","NewGameMgr"),Object.defineProperty(i,"__esModule",{
value:!0
}),i.GameLogicByType=void 0
;var o=e("../config/FK_Cfg"),n=e("../config/FK_GameCfg"),s=e("../core/mgr/UIMgr"),r=e("../game/cosnt/GameConst")
;i.GameLogicByType={

},i.default=new(/*#__PURE__*/function(){
function _class98(){
_classCallCheck2(this,_class98)
;this._data=null
;
}_createClass2(_class98,[{
key:"data",get:function get(){
return this._data
;
}
},{
key:"gameId",get:function get(){
return this._data.gameId
;
}
},{
key:"gameTime",get:function get(){
return this._data.gameTime
;
}
},{
key:"isInGame",get:function get(){
return this._data.isInGame
;
}
},{
key:"reviveTimes",get:function get(){
return this._data.reviveTime
;
},set:function set(e){
this._data.reviveTime=e,console.log("\u6E38\u620F\u590D\u6D3B\u6B21\u6570",this._data.reviveTime)
;
}
},{
key:"initGame",value:function initGame(e){
this._data={
gameId:e,gameTime:0,isInGame:!1
},e==r.GameType.Puzzle?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.PuzzleRebornNum).value:e==r.GameType.Adventurous?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.AdventureRebornNum).value:this.gameId==r.GameType.Day?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.AdventureRebornNum).value:this.gameId==r.GameType.Drop?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.DropRebornNum).value:this.gameId==r.GameType.Tradition&&(this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.ClassicRebornNum).value),s.default.openView(i.GameLogicByType[e])
;
}
},{
key:"initData",value:function initData(e){
this._data={
gameId:e,gameTime:0,isInGame:!1
},e==r.GameType.Puzzle?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.PuzzleRebornNum).value:e==r.GameType.Adventurous?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.AdventureRebornNum).value:this.gameId==r.GameType.Drop?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.DropRebornNum).value:this.gameId==r.GameType.Day?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.AdventureRebornNum).value:this.gameId==r.GameType.Tradition&&(this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.ClassicRebornNum).value)
;
}
},{
key:"addTime",value:function addTime(e){
this._data.gameTime+=e
;
}
},{
key:"startGame",value:function startGame(){
this._data.isInGame=!0
;
}
},{
key:"endGame",value:function endGame(){
this._data.isInGame=!1
;
}
},{
key:"restartGame",value:function restartGame(){
this.gameId==r.GameType.Puzzle?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.PuzzleRebornNum).value:this.gameId==r.GameType.Adventurous?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.AdventureRebornNum).value:this.gameId==r.GameType.Drop?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.DropRebornNum).value:this.gameId==r.GameType.Day?this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.AdventureRebornNum).value:this.gameId==r.GameType.Tradition&&(this.reviveTimes=o.FK_Cfg.Game.get(n.E_Game.ClassicRebornNum).value)
;
}
},{
key:"revive",value:function revive(e){

}
}])
;return _class98
;
}())(),cc._RF.pop()
;

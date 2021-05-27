var lobbyEvents;
(function (lobbyEvents) {
    lobbyEvents["joinLobby"] = "join-lobby";
    lobbyEvents["play"] = "play";
})(lobbyEvents || (lobbyEvents = {}));
var gameEvents;
(function (gameEvents) {
    gameEvents["connected"] = "connected";
    gameEvents["start"] = "start";
    gameEvents["notReady"] = "not-ready";
    gameEvents["moveFinished"] = "move-finished";
    gameEvents["updateBoard"] = "update-board";
})(gameEvents || (gameEvents = {}));

"use strict";

var connectionTH = new signalR.HubConnectionBuilder()
    .withUrl("/messagehub")
    .configureLogging("error")
    .build();

connectionTH.on("SuccessMessage", function (msg) {
    awem.notif(msg, 15 * 1000);
});

connectionTH.start().catch(function (err) {
    return console.error(err.toString());
});

function stopMessageHubConnection() {
    connectionTH.stop();
} 
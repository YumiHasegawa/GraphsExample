"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/sourcedetailshub" + window.location.search)
    .configureLogging("error")
    .build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

function stopSourceDetailsHub() {
    connection.stop();
}

connection.on("UpdateSourceDetails", function (record) {
    updateName(record);
    updateInfo(record);
});

function updateName(record) {
    if (record.name == undefined)
        return;
    var element = document.getElementById("Name");
    if (element) {
        element.innerHTML = record.name;
    }
};

function updateInfo(record) {
    const element = document.getElementById("Info");
    if (element) {
        element.innerHTML = record.info;
    }
};
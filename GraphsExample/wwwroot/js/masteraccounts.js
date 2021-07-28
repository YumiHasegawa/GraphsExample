"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/masteraccountshub")
    .configureLogging("error")
    .build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

function stopMasterAccountsHub() {
    connection.stop();
}

connection.on("UpdateMasterAccounts", function (record) {
    updateBalance(record);
    updateCurrency(record);
    updatePerformanceFeeValue(record);
    updatePerformanceFeePeriod(record);
    updateInfo(record);
});

function updateBalance(record) {
    if (record.balance == undefined)
        return;
    var element = document.getElementById(record.id + "-Balance");
    if (element)
        element.innerHTML = record.balance;
};

function updateCurrency(record) {
    if (record.currency == undefined)
        return;
    var element = document.getElementById(record.id + "-Currency");
    if (element)
        element.innerHTML = record.currency;
};

function updatePerformanceFeeValue(record) {
    const element = document.getElementById(record.id + "-PerformanceFeeValue");
    if (element) {
        element.innerHTML = record.performanceFeeValue + "%";
    }
};

function updatePerformanceFeePeriod(record) {
    getPerformanceFeePeriodStr(record);
};

function setPerformanceFeePeriod(id, str) {
    const element = document.getElementById(id + "-PerformanceFeePeriod");
    if (element) {
        element.innerHTML = str === "" ? "never" : str;
    }
};

function updateInfo(record) {
    const element = document.getElementById(record.id + "-Info");
    if (element) {
        element.innerHTML = record.info;
    }
};
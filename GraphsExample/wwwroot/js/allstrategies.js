"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/allstrategieshub")
    .configureLogging("error")
    .build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

function stopAllStrategiesHub() {
    connection.stop();
}

connection.on("UpdateAllStrategies", function (record) {
    updateName(record);
    updatePerformanceFeeValue(record);
    updatePerformanceFeePeriod(record);

    updateRegistrationDate(record);
    updateFollowers(record);
    updateRoiAllTime(record);
    updateProfitAllTime(record);
    updateDealsWonCount(record);
    updateDealsLostCount(record);
    updateClosedTradesCount(record);
    updateAverageDealsDaily(record);
    updateLargestTradeInVolume(record);
    updateInstruments(record);
});

function updateName(record) {
    var element = document.getElementById(record.id + "-Name");
    if (element)
        element.innerHTML = record.name;
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

function updateRegistrationDate(record) {
    var element = document.getElementById(record.id + "-RegistrationDateUTC");
    if (element) {
        if (record.registrationDateTimeUTC != undefined) {
            var date = new Date(record.registrationDateTimeUTC);
            element.innerHTML = date.yyyymmdd();
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateFollowers(record) {
    var element = document.getElementById(record.id + "-FollowersCount");
    if (element) {
        if (record.followersCount != undefined) {
            element.innerHTML = record.followersCount;
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateRoiAllTime(record) {
    var element = document.getElementById(record.id + "-Roi_AllTime");
    if (element) {
        if (record.roi_AllTime != undefined) {
            element.innerHTML = record.roi_AllTime.toFixed(2) + "%";
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateProfitAllTime(record) {
    var element = document.getElementById(record.id + "-Profit_AllTime");
    if (element) {
        if (record.profit_AllTime != undefined) {
            element.innerHTML = record.profit_AllTime.toFixed(2);
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateDealsWonCount(record) {
    var element = document.getElementById(record.id + "-DealsWonCount");
    if (element) {
        if (record.dealsWonCount != undefined) {
            element.innerHTML = record.dealsWonCount;
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateDealsLostCount(record) {
    var element = document.getElementById(record.id + "-DealsLostCount");
    if (element) {
        if (record.dealsLostCount != undefined) {
            element.innerHTML = record.dealsLostCount;
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateClosedTradesCount(record) {
    var element = document.getElementById(record.id + "-ClosedTradesCount");
    if (element) {
        if (record.closedTradesCount != undefined) {
            element.innerHTML = record.closedTradesCount;
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateAverageDealsDaily(record) {
    var element = document.getElementById(record.id + "-AverageDealsDaily");
    if (element) {
        if (record.averageDealsDaily != undefined) {
            element.innerHTML = record.averageDealsDaily.toFixed(2);
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateLargestTradeInVolume(record) {
    var element = document.getElementById(record.id + "-LargestTradeInVolume");
    if (element) {
        if (record.largestTradeInVolume != undefined) {
            element.innerHTML = record.largestTradeInVolume;
        }
        else {
            element.innerHTML = "";
        }
    }
};

function updateInstruments(record) {
    var element = document.getElementById(record.id + "-Instruments");
    if (element) {
        if (record.instruments != undefined) {
            element.innerHTML = record.instruments.join("\n");
        }
        else {
            element.innerHTML = "";
        }
    }
};

Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('.');
};
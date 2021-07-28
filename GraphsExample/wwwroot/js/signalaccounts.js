"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/signalaccountshub")
    .configureLogging("error")
    .build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

function stopSignalAccountsHub() {
    connection.stop();
}

connection.on("UpdateSignalAccounts", function (record) {
    updateTargetBalance(record);
    updateTargetCurrency(record);
    updateStatus(record);
    updateConnectionTime(record);
    updateButtons(record);
    updateSourceLogin(record);
    updateCopyingMode(record);
    updatePerformanceFeeValue(record);
    updatePerformanceFeePeriod(record);
    updateSourceBalance(record);
    updateSourceEquity(record);
    updateROI(record);    
});

function updateTargetBalance(record) {
    if (record.targetBalance == undefined)
        return;
    var element = document.getElementById(record.targetId + "-TargetBalance");
    if (element)
        element.innerHTML = record.targetBalance;
};

function updateTargetCurrency(record) {
    if (record.targetCurrency == undefined)
        return;
    var element = document.getElementById(record.targetId + "-TargetCurrency");
    if (element)
        element.innerHTML = record.targetCurrency;
};

function updateStatus(record) {
    var element = document.getElementById(record.targetId + "-Status");
    if (element) {
        if (record.status == undefined) {
            element.innerHTML = "Not Copying";
        }
        else {
            element.innerHTML = record.status;
        }
    }
};

function updateButtons(record) {
    var element = document.getElementById(record.targetId + "-Actions");
    if (element) {
        if (record.status == undefined) {
            element.innerHTML = "-";
        }
        else if (record.status != "Stopping") {
            element.innerHTML = getButtonsHtml(false, record.targetId, record.strategyId);
        }
        else {
            element.innerHTML = getButtonsHtml(true, record.targetId, record.strategyId);
        }
    }
}

function updateSourceLogin(record) {
    var element = document.getElementById(record.targetId + "-SourceLogin");
    if (element) {
        if (record.sourceLogin == undefined) {
            element.innerHTML = "-";
        }
        else {
            element.innerHTML = record.sourceLogin;
        }
    }
};

function updateCopyingMode(record) {
    const element = document.getElementById(record.targetId + "-CopyingMode");
    if (element) {
        if (record.allocationMode == undefined || record.allocationModeParameter == undefined) {
            element.innerHTML = "-";
        }
        else {
            return $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: {
                    "mode": record.allocationMode,
                    "value": record.allocationModeParameter,
                },
                url: '/SignalAccounts/GetCopyingMode',
                success: function (response) {
                    element.innerHTML = response;
                }
            });
        }
    }
};

function updatePerformanceFeeValue(record) {
    const element = document.getElementById(record.targetId + "-PerformanceFeeValue");
    if (element) {
        if (record.performanceFeeValue == null) {
            element.innerHTML = "-";
        }
        else {
            element.innerHTML = record.performanceFeeValue + "%";
        }
    }
};

function updatePerformanceFeePeriod(record) {
    const element = document.getElementById(record.targetId + "-PerformanceFeePeriod");
    if (element) {
        if (record.targetId == undefined || record.performanceFeePeriod == undefined) {
            element.innerHTML = "-";
        }
        else {
            return $.ajax({
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: {
                    "period": record.performanceFeePeriod,
                },
                url: '/SignalAccounts/GetPerformanceFeePeriodStr',
                success: function (response) {
                    element.innerHTML = response === "" ? "never" : response;
                }
            });
        }
    }
};

function updateSourceBalance(record) {
    var element = document.getElementById(record.targetId + "-SourceBalance");
    if (element) {
        if (record.sourceBalance == undefined) {
            element.innerHTML = "-";
        }
        else {
            element.innerHTML = record.sourceBalance;
        }
    }
};

function updateSourceEquity(record) {
    var element = document.getElementById(record.targetId + "-SourceEquity");
    if (element) {
        if (record.sourceEquity == undefined) {
            element.innerHTML = "-";
        }
        else {
            element.innerHTML = record.sourceEquity;
        }
    }
};

function updateROI(record) {
    var element = document.getElementById(record.targetId + "-Roi");
    if (element) {
        if (record.roi == undefined) {
            element.innerHTML = "-";
        }
        else {
            element.innerHTML = record.roi.toFixed(2) + '%';
        }
    }
};

function updateConnectionTime(record) {
    var element = document.getElementById(record.targetId + "-ConnectionTime");
    if (element) {
        if (record.connectionTime == undefined) {
            element.innerHTML = "-";
        }
        else {
            var date = new Date(record.connectionTime);
            element.innerHTML = date.toTimeString();
        }
    }
};

Date.prototype.toTimeString = function () {
    var MM = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var date = [this.getFullYear(),
        (MM > 9 ? '' : '0') + MM,
        (dd > 9 ? '' : '0') + dd
    ].join('.');

    var hh = this.getHours();
    var mm = this.getMinutes();
    var ss = this.getSeconds();

    var time = [
    (hh > 9 ? '' : '0') + hh,
    (mm > 9 ? '' : '0') + mm,
    (ss > 9 ? '' : '0') + ss
    ].join(':');

    return date + ' ' + time;
};
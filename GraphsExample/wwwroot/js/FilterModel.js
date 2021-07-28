class FilterModel {

    constructor(model, gridId) {
        this.model = model;
        this.gridId = gridId; 
    }

    reloadGrid() {
        return $('#' + this.gridId.id).data('api').load({ params: this.model });
    }

    reloadGridForPopup() {
        var _this = this;
        return function (res) {
            _this.model = res;
            return $('#' + _this.gridId.id).data('api').load({ params: _this.model });
        };
    }

    redirect() {
        var _this = this;
        return function (res) {
            _this.model = res;

            var cleanModel = _this.model;
            for (var propName in cleanModel) {
                if (cleanModel[propName] === null || cleanModel[propName] === undefined) {
                    delete cleanModel[propName];
                }
            }

            var str = $.param(cleanModel).split("%5B%5D").join("");
            window.location.search = str; 
        };
    }

    clearFilter() {
        this.model = {};
        window.location.href = window.location.href.split('?')[0];
    }

    getParams() {
        var _this = this;
        return function () {
            return { objects: JSON.stringify(_this.model) }
        }
    }

    showStats(data, id) {
        return $(id).html('Showing ' + data.tg.showedElements + ' of ' + data.tg.totalSize);
    }

    showTradeVolumeStats(data, id) {
        return $(id).html("USD volume by " + data.tg.totalSize + " deals is " + data.tg.tradeVolume);
    }
};
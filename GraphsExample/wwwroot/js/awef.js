var awef = function () {
    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        '"': '&quot;',
        "'": '&#39;',
        ">": '&gt;'
    };

    function isNull(val) {
        return val === undefined || val === null;
    }

    function loop(arr, f) {
        if (arr) {
            for (var i = 0, ln = len(arr); i < ln; i++) {
                var col = arr[i];
                if (f(col, i) === false) {
                    break;
                };
            }
        }
    }

    function len(o) {
        return !o ? 0 : o.length;
    }

    function isNullOrEmp(val) {
        return awef.isNull(val) || len(val.toString()) === 0;
    }

    function strEquals(x, y) {
        if (isNull(x) || isNull(y)) {
            return x === y;
        }

        return x.toString() === y.toString();
    }

    function select(list, func) {
        var res = [];
        loop(list, function (el) {
            res.push(func(el));
        });

        return res;
    }

    return {
        seq: strEquals,
        len: len,
        vcont: function (v, vals) {
            for (var i = 0; i < len(vals); i++) {
                if (strEquals(v, vals[i])) {
                    return 1;
                }
            }

            return 0;
        },
        scont: function (str, src) {
            return isNullOrEmp(src) || str.toLowerCase().indexOf(src.toLowerCase()) > -1;
        },
        loop: loop,
        isNotNull: function (val) {
            return !awef.isNull(val);
        },
        isNull: isNull,
        isNullOrEmp: isNullOrEmp,
        encode: function (str) {
            return String(str).replace(/[&<>"']/g, function (s) {
                return entityMap[s];
            });
        },
        //arr = [1,2,3] k="hi" -> {name:hi, value: 1} ...
        serlArr: function (arr, k) {
            var res = [];

            if (!Array.isArray(arr)) arr = [arr];

            awef.loop(arr,
                function (v) {
                    res.push({ name: k, value: v });
                });

            return res;
        },
        select: select,
        where: function (list, func) {
            var res = [];
            loop(list,
                function (el) {
                    if (func(el)) {
                        res.push(el);
                    }
                });

            return res;
        }
    };
}();

//export {awef};

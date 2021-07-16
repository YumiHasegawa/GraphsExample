//import * as jQuery from 'jquery';
//import { awef, awem, utils } from './aweui/all.js';

var sideMenu = function ($) {
    var loop = awef.loop;

    function getSideMenu(opt) {
        var sctrl;
        var gid = opt.id;
        var grid = $('#' + gid);
        var gapi = grid.data('api');
        var cont = grid.find('.awe-content');
        var lastClicked = -1;

        function initMenuSeach() {
            var txt = $('#' + opt.src);

            function onenter(e, item) {
                e.preventDefault();

                if (item.length) {
                    item[0].click();
                }

                txt.data('noaf', 1);
                txt.focus();
            }

            function topFunc() {
                $(window).scrollTop($(window).scrollTop() - 10);
            }

            function botFunc() {
                if ((cont.offset().top + cont.height() + 50) > ($(window).scrollTop() + $(window).height())) {
                    $(window).scrollTop($(window).scrollTop() + 10);
                }
            }

            var sctrl = awem.slist(cont, { sel: '.awe-row', enter: onenter, fcls: 'awe-selected', sc: 'n', topf: topFunc, botf: botFunc });

            grid.on('click', 'a', function (e) {
                lastClicked = $(e.target).data('k');
            });

            var keyHandled;
            txt.keydown(function (e) {
                if (sctrl.keyh(e)) {
                    keyHandled = 1;
                }
            })
            .keyup(function () {
                if (!keyHandled) {
                    opt.keyupf && opt.keyupf();
                    gapi.load();
                    sctrl.autofocus();
                }

                keyHandled = 0;
            })
            .on('focusin',
                function () {
                    // can't send event data, jquerybug
                    if (!txt.data('noaf')) {
                        sctrl.autofocus();
                    }

                    txt.data('noaf', 0);
            })
            .on('blur', function () {
                    if (txt.data('brf')) {
                        sctrl.remf();
                    }
            });

            return sctrl;
        }

        function scrollToSel() {
            var menuc = cont;
            var sel = menuc.find('.selected');
            if (sel.length) {
                sctrl.scrollTo(menuc.find('.selected'));
            } else {
                sctrl.scrollTo(menuc.find('.awe-row'));
            }
        }

        function seth() {
            awem.setgh(grid, 0);
        }

        return {
            init: function () {
                sctrl = initMenuSeach();

                seth();
                var skey = gid + 'menust';
                var st = sessionStorage && sessionStorage.getItem(skey);
                if (st) {
                    cont.scrollTop(st);
                }

                grid.one('awerender', function () {
                    scrollToSel();
                });

                cont.on('scroll', function () {
                    sessionStorage && sessionStorage.setItem(skey, cont.scrollTop());
                });
            },
            setHeight: seth,
            getLastClicked: function () {
                return lastClicked;
            },
            selectById: function (id) {
                var sel = gapi.select(id);
                if (sel.length) {
                    sel = sel[0];
                    sctrl.focus(sel);

                    sctrl.scrollToFocused();
                }
            }
        };
    }

    var lnodes = null;
    function getMenuGridFunc(nodesOrXhr, grido) {

        function addParentsTo(res, node, all) {
            if (node.ParentId) {
                var isFound;
                loop(res, function (o) {
                    if (o.Id === node.ParentId) {
                        isFound = true;
                        return false;
                    }
                });

                if (!isFound) {
                    var parent = $.grep(all, function (o) { return o.Id === node.ParentId; })[0];
                    res.push(parent);
                    addParentsTo(res, parent, all);
                }
            }
        }

        function equals(a, b) {
            return new RegExp("^" + a + "$", "i").test(b);
        }

        function buildMenuGridModel(gp) {
            gp.paging = false;
            var search = (gp.search || '').trim();
            // find selected
            var selectedItems = $.grep(lnodes, function (o) {
                o.Selected = '';
                return equals(gp.action, o.Action) &&
                    equals(gp.controller, o.Controller);
            });

            if (selectedItems.length > 1) {
                var anch = window.location.hash.substr(0);

                var anchsli = $.grep(selectedItems, function (o) {
                    return equals(anch, o.Anchor);
                });

                if (anchsli.length) {
                    selectedItems = anchsli.slice(0);
                }
            }

            if (selectedItems.length) {
                selectedItems[0].Selected = "selected";
                loop(selectedItems, function (item) {
                    addParentsTo(selectedItems, item, lnodes);
                });
            }

            loop(selectedItems, function (o) {
                o.IsNodeSelected = true;
            });

            var words = search.split(" ");

            var regs = $.map(words, function (w) {
                return new RegExp(w, "i");
            });

            var regsl = regs.length;

            var result = $.grep(lnodes, function (node) {
                var matches = 0;
                var s = node.Keywords + ' ' + node.Name;

                loop(regs, function (reg) {
                    reg.test(s) && matches++;
                });

                return regsl === matches && (!node.NoMenu || search);
            });

            var searchResult = result.slice(0);

            loop(searchResult, function (o) {
                addParentsTo(result, o, lnodes);
            });

            var rootNodes = $.grep(result, function (o) { return !o.ParentId; });

            var getChildren = function (node, nodeLevel) {
                return $.grep(result, function (o) { return o.ParentId === node.Id; });
            };

            function makeHeader(info) {
                var isNodeSelected = info.NodeItem.IsNodeSelected;
                var collapsed = !search && !isNodeSelected && info.NodeItem.Collapsed;
                return {
                    Item: info.NodeItem,
                    Collapsed: collapsed,
                    IgnorePersistence: search || isNodeSelected
                };
            }
            
            return utils.gridModelBuilder({
                key: "Id",
                gp: gp, 
                items: rootNodes, 
                getChildren: getChildren, 
                defaultKeySort: utils.Sort.Asc,
                makeHeader: makeHeader
            });
        }

        return function (sgp) {
            var gp = utils.getGridParams(sgp);

            if (lnodes) {
                return buildMenuGridModel(gp);
            }

            return $.when(nodesOrXhr).then(function (res) {
                lnodes = res;
                if (lnodes) {
                    return buildMenuGridModel(gp);
                }
            });
        };
    }

    function menutree(o) {
        o.alt = 0; // no alt row css
        var api = o.api;
        // render row
        api.itmf = function (opt) {
            var content = '';
            var itm = opt.itm;
            if (opt.ceb) content += api.ceb();
            content += itm.Name;

            if (opt.ceb) {
                opt.clss += ' mnitm awe-ceb';
            } else {
                opt.clss += ' mnitm ';
            }

            var attr = opt.attr;
            attr += ' class="' + opt.clss + '"';
            var style = opt.style || '';

            if (opt.ind) {
                style += 'padding-left:' + opt.ind / 2 + 'em;';
            }

            style && (attr += ' style="' + style + '"');

            return itm.Url ?
                '<a href="' + itm.Url + '" ' + attr + ' >' + content + '</a>' :
                '<div ' + attr + '>' + content + '</div>';
        };
    }

    return {
        getSideMenu: getSideMenu,
        getMenuGridFunc: getMenuGridFunc,
        menutree: menutree
    };
}(jQuery);

//export { sideMenu };
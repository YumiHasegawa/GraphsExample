/* eslint-disable */
//import * as jQuery from 'jquery';
//import { sideMenu } from './sidemenu';
//import { awef, awe, aweui, utils } from './aweui/all.js';

var site = function ($) {
    var encode = awef.encode;
    var menu;
    function documentReady() {
        setupSideMenu();

        handleAnchors();

        site.parseCode && site.parseCode();

        handleTabs();

        $(document).on('aweload', 'table.awe-ajaxlist', wrapLists);
    }

    function setupSideMenu() {
        menu = sideMenu.getSideMenu({ id: 'Menu', src: 'msearch', keyupf: srckup });
        menu.init();

        site.sideMenuSync && site.sideMenuSync();

        function srckup() {
        }
    }

    var tabid = 0;
    function handleTabs() {
        $('.tabs').each(function (i, item) {
            var tabs = $(item);
            if (!tabs.data('tabsh')) {
                tabs.data('tabsh', 1);

                var id = 'mytab' + tabid++;
                tabs.attr('id', id).addClass('awe-tabs');
                tabs.children().wrapAll('<div class="awe-tabscontent"/>').addClass('awe-tab');

                $('<div class="awe-tabsbar"></div>').prependTo(tabs);
                awe.tabs({ i: id });
            }
        });
    }

    function getAnchorName(a) {
        var name = a.data('name');
        if (!name) name = $.trim(a.html()).replace(/ /g, '-').replace(/\(|\)|:|\.|\;|\\|\/|\?|,/g, '');
        name = name.replace('&lt', '').replace('&gt', '');
        return name;
    }

    function handleAnchors() {
        var anchor = window.location.hash.replace('#', '').replace(/\(|\)|:|\.|\;|\\|\/|\?|,/g, '');
        $('h3,h2').each(function (_, e) {
            var a = $(e);
            if (!a.data('ah')) {
                a.data('ah', 1);
                var name = a.data('name');
                var url = a.data('u') || '';
                if (!name) name = $.trim(a.html()).replace(/ /g, '-').replace(/\(|\)|:|\.|\;|\\|\/|\?|,/g, '');
                name = name.replace('&lt', '').replace('&gt', '').replace('\'', '');
                a.append("<a class='anchor' name='" + name + "' href='" + url + "#" + name + "' tabIndex='-1'>&nbsp;<i class='ico-link'></i></a>");

                if (name === anchor) {
                    window.location.href = "#" + name;
                    awe.flash(a);
                }
            }
        });
    }

    // wrap ajaxlists for horizontal scrolling on small screens
    function wrapLists() {
        $('table.awe-ajaxlist:not([wrapped])').each(function () {
            var columns = $(this).find('thead th').length;
            var mw = $(this).data('mw');
            if (columns || mw) {
                mw = mw || columns * 120;

                $(this).wrap('<div style="width:100%; overflow:auto;"></div>')
                    .wrap('<div style="min-width:' + mw + 'px;padding-bottom:2px;"></div>')
                    .attr('wrapped', 'wrapped');
            }
        });
    }

    function menuToggle(hide) {
        var page = $('#tptPage').show();
        var menu = $('#tptMenu').css('width', '').css('position', '');

        if (hide) {
            menu.hide();
            page.css('margin-left', "0");
            $('#btnMenuToggle').show().removeClass('on');
            $('body').trigger('domlay');
        } else {
            menu.show();

            page.css('margin-left', "14.5em");

            if (page.width() < 200) {
                page.hide();
                menu.css('width', '100%');
                menu.css('position', 'static');
            }

            $('#btnMenuToggle').addClass('on');

            $('body').trigger('domlay');
        }
    }
    
    function slide(popup) {
        var o = popup.data('o');
        var maxtop = $(window).height();
        var div = popup.closest('.o-pmc');

        o.p.nolay = 1;

        div.css('transform', 'translateY(' + maxtop + 'px)');

        setTimeout(function () {
            div.css('transition', '.5s');
            div.css('transform', 'translateY(0)');
            setTimeout(function () {
                o.p.nolay = 0;
                div.css('transition', '');
                div.css('transform', '');
                o.cx.api.lay();
            }, 500);
        }, 30);
    }

    return {
        documentReady: documentReady,
        getAnchorName: getAnchorName,
        handleAnchors: handleAnchors,
        handleTabs: handleTabs,
        slide: slide,
        getFormattedTime: function () {
            var d = new Date();
            return ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
        },
        getThemes: function () {
            return $.map(["wui", "mui", "bts", "met", "gui", "gui3", "start", "black-cab"], function (v) { return { k: v, c: v } });
        },
        parseCode: function () {
            $('pre').addClass('prettyprint');

            // show code 
            $('.code').each(function (i, el) {
                var codediv = $(el);
                if (!codediv.data('h')) {
                    codediv.data('h', 1);

                    var scbtn = $('<span class="shcode">show code</span>')
                        .click(function () {
                            var btn = $(this);
                            btn.toggleClass("hideCode showCode");
                            var parent = $(this).parent();
                            var div = parent.next();

                            div.find('.srccode').each(function () {
                                var d = $(this);
                                if (d.data('handled')) return;
                                d.data('handled', 1);
                                var name = d.data('name');

                                var backbtn = $('<button class="awe-btn backbtn" type="button">go back</button>').click(setMain);

                                d.append(strUtil.wrapCode(''));

                                var main = d.find('pre');

                                function setMain() {
                                    var code = strUtil.getCode(name);
                                    main.html(code).removeClass('prettyprinted');
                                    site.prettyPrint();
                                    backbtn.hide();
                                }

                                d.find('.codeWrap').prepend(backbtn);
                                setMain();
                            });

                            if (div.closest('.cbl').length) {
                                aweui.initPopup({
                                    id: 'showCode',
                                    setCont: function (sp, o) {
                                        o.scon.html(div);
                                        div.show();
                                    },
                                    close: function () {
                                        parent.after(div.hide());
                                    },
                                    modal: true,
                                    width: 900,
                                    outClickClose: true
                                });

                                awe.open('showCode');
                            }
                            else if (btn.hasClass("hideCode")) {
                                btn.html("hide code");
                                div.fadeIn();
                            } else {
                                btn.html("show code");
                                div.fadeOut();
                            }
                        });

                    var wrp = $('<div/>').append(scbtn);
                    codediv.wrap('<div/>')
                        .parent()
                        .hide()
                        .before(wrp);
                }
            });
        },
        prettyPrint: function () {
            try {
                PR && PR.prettyPrint();
            } catch (ex) {
                //ignore
            }
        },
        loadWhenSeen: function (el, url, indx, callback) {
            var started = 0;
            if (!loadIfVis()) {
                $(window).on('scroll resize', loadIfVis);
            }

            function loadIfVis() {
                if (el.offset().top + el.outerHeight() < $(window).height() + $(window).scrollTop() + 300) {
                    if (started) return 1;
                    started = 1;

                    $(window).off('scroll resize', loadIfVis);
                    $.get(url, { v: indx }, function (res) {
                        callback(res);
                    });

                    return 1;
                }
            }
        },
        getSideMenuData: function (url) {
            return $.get(url);
        },
        getCaretWord: function (el) {
            // textarea autocomplete 
            function getWordAtPos(s, pos) {
                var preText = s.substring(0, pos);
                if (preText.indexOf(" ") > 0 || preText.indexOf("\n") > 0) {
                    var words = preText.split(" ");
                    words = words[words.length - 1].split("\n");
                    return words[words.length - 1]; // return last word
                }
                else {
                    return preText;
                }
            }

            function getCaretPos(ctrl) {
                var caretPos = 0;
                if (document.selection) {
                    ctrl.focus();
                    var sel = document.selection.createRange();
                    sel.moveStart('character', -ctrl.value.length);
                    caretPos = sel.text.length;
                }
                else if (ctrl.selectionStart || ctrl.selectionStart === '0') {
                    caretPos = ctrl.selectionStart;
                }

                return caretPos;
            }

            var pos = getCaretPos(el);
            return getWordAtPos(el.value, pos);
        },
        replaceInTexarea: function (t, text, word) {
            if (t.setSelectionRange) {
                var sS = t.selectionStart - word.length;
                var sE = t.selectionEnd;
                t.value = t.value.substring(0, sS) + text + t.value.substr(sE);
                t.setSelectionRange(sS + text.length, sS + text.length);
                t.focus();
            }
            else if (t.createTextRange) {
                document.selection.createRange().text = text;
            }
        },
        gitCaption: function (item) {
            return '<img class="cthumb" src="' + encode(item.avatar) + '&s=40" />' + encode(item.c);
        },
        gitItem: function (item) {
            var res = "<div class='content'>" + '<div class="title">' + encode(item.c) + '<img class="thumb" src="' + encode(item.avatar) + '&s=40" />' + '</div>';
            if (item.desc) res += '<p class="desc">' + encode(item.desc) + '</p>';
            res += '</div>';
            return res;
        },
        gitRepoSearch: function (o, info) {
            var term = info.term;
            var c = info.cache;
            c.termsUsed = c.termsUsed || {};
            c.nrterms = c.nrterms || []; // no result terms

            if (c.termsUsed[term]) return [];
            c.termsUsed[term] = 1;

            var nores = 0;
            // don't search terms that contain nrterms
            $.each(c.nrterms, function (i, val) {
                if (term.indexOf(val) >= 0) {
                    nores = 1;
                    return false;
                }
            });

            if (nores) {
                return [];
            }

            return $.get('https://api.github.com/search/repositories', { q: term })
                .then(function (data) {
                    if (!data || !data.items.length) {
                        c.nrterms.push(term);
                    }

                    return $.map(data.items, function (item) { return { k: item.id, c: item.full_name, avatar: item.owner.avatar_url, desc: item.description }; });
                })
                .fail(function () { c.termsUsed[term] = 0; });
        },
    };
}(jQuery);

//export {site};
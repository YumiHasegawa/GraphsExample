$(document).on('focusout', '.einput', function () {
    const hasValidation = $(this).find('input[data-val=true]');
    if (hasValidation.length !== 0) {
        hasValidation.valid();
    }
});


$(document).on('click', 'tr.selectableRows', function (e) {
    const isButtonOrLink = $(e.target).closest('button, a').length;

    if (isButtonOrLink) {
        return;
    }

    const $tr = $(this);
    const className = 'selectedRow';
    if ($tr.hasClass(className)) {
        $tr.removeClass(className);
    } else {
        $tr.addClass(className);
    }
});

// Resizing popups
$(document).on('change', '.o-pmc.o-pu', function (e) {
    const viewportTop = $(window).scrollTop();
    const popupTop = $(this).offset().top;
    const popupBottom = popupTop + $(this).outerHeight();
    const viewportBottom = viewportTop + $(window).height();
    const pageHeight = $(window).height();
    const popupHeight = $(this).height();
    const minTopOffset = (pageHeight - popupHeight) / 2;

    if ((viewportBottom - popupBottom) < minTopOffset) {
        const newTop = Math.max(0, viewportTop + minTopOffset);
        $(this).offset({ top: newTop });
    }
});


$(document).bind('awebeginload', function () {
    $("form").each(function () {
        var validator = $(this).validate();
        if (validator === undefined || validator === null) {
            return;
        }
        validator.settings.ignore = "*";
        setTimeout(function () {
            validator.settings.ignore = ".ignore";
        }, 500);
    });
});
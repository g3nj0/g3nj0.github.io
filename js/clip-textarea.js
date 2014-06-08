$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        $('#rightside').css('top', $(window).scrollTop());
    }
}
);
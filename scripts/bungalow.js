var Bungalow = function () {

};

var REALM = 'bungalow';

Bungalow.prototype.navigate = function (uri) {
    var parts = uri.split(/\:/g);
    var arguments = parts.slice(2);
    if (uri.match(/^bungalow:start/)) {
        this.loadView('start', arguments);
    } else if (uri.match(/^bungalow:foot:care/)) {
        this.loadView('fungi', arguments);
    } else {
        alert("View not found");
        return;
    }
    $('.menu li').removeClass('active');
    $('.menu li[data-uri="' + uri + "']").addClass('active');
    var viewUrl = uri.substr((REALM + ':').length).replace(':', '/');
    window.history.pushState({'action': 'navigate', 'uri': uri}, 'View', '/' + viewUrl);
}

window.onload = function () {
    var path = window.location.pathname;
    var uri = REALM + path.replace(/\//g, ':');
    bungalow.navigate(uri);
}

Bungalow.prototype.search = function (event) {
    var $search = $('#search');
    var q = $search.val();
    this.navigate(q);
}

Bungalow.prototype.loadView = function (viewId, parameters) {
    var view = document.querySelector('.sp-app#view_' + viewId);
    if (view) {
        $('.sp-app').hide();
        $(view).show();
        view.contentWindow.postMessage({'action': 'navigate', 'arguments': parameters}, '*');
    } else {
        var view = document.createElement('iframe');
        $(view).addClass('sp-app');
        view.setAttribute('id', 'view_' + viewId);
        view.setAttribute("frameborder", "0");
        view.setAttribute('src', 'apps/' + viewId + '/index.html');
        view.onload = function () {
            view.contentWindow.postMessage({'action': 'navigate', 'arguments': parameters}, '*');
        }
        $('#viewstack').append(view);
        this.resizeApps();

    }
}

window.alert = function (msg) {
    $('info-bar').show();
    console.log(msg);
    $('info-bar').html('<description>' + msg + '</description>');
}

Bungalow.prototype.resizeApps = function () {
     $('iframe').each(function (i, element) {
        //alert($(this).parent().width());
        $(this).attr('width', $(this).parent().width());
        $(this).attr('height', $(this).parent().height());
    });
}
var bungalow = new Bungalow();


$(window).resize(function () {
    bungalow.resizeApps();
})
$(document).on('click', '*[data-uri]', function (event) {
    var target = event.target;
    bungalow.navigate(target.dataset['uri']);
});

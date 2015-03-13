var Bungalow = function () {

};

var REALM = 'bungalow';

Bungalow.prototype.navigate = function (uri, noHistory) {
    var fragments = uri.split(/#/g);
    var parts = fragments[0].split(/\:/g);
    var section = fragments[1];
    if (!section) {
        section = "overview";
    }
    var arguments = parts.slice(2);

    if (uri.match(/^bungalow:start/)) {
        this.loadView('start', arguments, section);
    } else if (uri.match(/^bungalow:foot:care/)) {
        this.loadView('fungi', arguments, section);
    } else if (uri.match(/^bungalow:user:(.*)/)) {
        this.loadView('user', arguments, section);
    } else if (uri.match(/^bungalow:artist:(.*)/)) {
        this.loadView('artist', arguments, section);
    } else {
        alert("View not found");
        return;
    }
    $('.menu li').removeClass('active');
    $('.menu li[data-uri="' + uri + "']").addClass('active');
    var viewUrl = uri.substr((REALM + ':').length).replace(':', '/');
    if (!noHistory)
    window.history.pushState({'action': 'navigate', 'uri': uri}, 'View', '/' + viewUrl);
}

window.addEventListener('message', function (event) {
    console.log(event.data);
    if ('uri' in event.data) {
        if (event.data.action === 'navigate') {
            if (event.data.uri.match(/#(.*)/g)) {
                window.location.hash = event.data.uri;
            }
        }
    }
});

window.addEventListener("popstate", function(e) {
    var pathname = location.pathname;
    var uri = REALM + pathname.replace(/\//g, ':');
    console.log(uri);
    bungalow.navigate(uri, true);
});

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

Bungalow.prototype.loadView = function (viewId, parameters, section) {
    var view = document.querySelector('.sp-app#view_' + viewId);
    if (view) {
        $('.sp-app').hide();
        $(view).show();
        view.contentWindow.postMessage({'action': 'navigate', 'arguments': parameters}, '*');
            view.contentWindow.location.hash = section;
            console.log(view.contentWindow.location.hash);
    } else {
        $('.sp-app').hide();
        var view = document.createElement('iframe');
        $(view).addClass('sp-app');
        view.setAttribute('id', 'view_' + viewId);

        view.setAttribute("frameborder", "0");
        view.setAttribute('src', 'apps/' + viewId + '/index.html');
        view.onload = function () {
            view.contentWindow.postMessage({'action': 'navigate', 'arguments': parameters}, '*');
            view.contentWindow.location.hash = section;
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

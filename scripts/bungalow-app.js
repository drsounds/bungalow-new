window.addEventListener('message', function (event) {
    var data = event.data;
    if (data.action == 'navigate') {
        if ('arguments' in data) {
            var event = new CustomEvent('argumentchanged');
            event.data = data.arguments;
            if (window.onargumentschanged instanceof Function)
                window.onargumentschanged(event);
        } 
        if ('uri' in data) {
            var uri = data.uri;
            if (uri.match(/#(.*)/g)) {
                self.location.hash = uri.substr(1);
            } else {
                var arguments = uri.split(/\:/g).slice(1);
                var event = new CustomEvent('argumentchanged');
                event.data = arguments;
                if (window.onargumentschanged instanceof Function)
                    window.onargumentschanged(event);
            }
        }
    }
});
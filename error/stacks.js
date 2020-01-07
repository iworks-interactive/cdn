try {
    window.onerror = function (eventOrMessage, url, lineNumber, colNumber, error) {
        try {
            var protocol = document.location.protocol;
            var host = document.location.hostname;
            var port = document.location.port;
            var path = document.location.pathname;
            var search = document.location.search;
            var hash = document.location.hash;
            var everntMessage = "";
            if (typeof eventOrMessage !== 'string') {
                everntMessage = eventOrMessage.type + " " + eventOrMessage.target + " " + eventOrMessage.eventPhase + " " + eventOrMessage.composedPath();
            }
            else {
                everntMessage = eventOrMessage;
            }
            var eventUrl = url ? url : "";
            var eventLineNumber = lineNumber ? lineNumber : 0;
            var eventColNumber = colNumber ? colNumber : 0;
            var eventStack = (error && error.stack) ? (function () { return error.stack.split("\n").map(function (x) { return x.trim(); }).join(" "); })() : "";
            var data = {
                protocol: protocol,
                host: host,
                port: port,
                path: path,
                search: search,
                hash: hash,
                everntMessage: everntMessage,
                eventUrl: eventUrl,
                eventLineNumber: eventLineNumber,
                eventColNumber: eventColNumber,
                eventStack: eventStack
            };
            if (typeof ($) === "function" || typeof (jQuery) === "function") {
                $.post("//error.iwi.co.kr/api/Error/stack", data);
            }
            else if (typeof (fetch) === "function") {
                fetch("//error.iwi.co.kr/api/Error/stack", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    mode: "cors",
                    cache: "no-cache",
                    body: JSON.stringify(data)
                });
            }
            else {
                var query = "protocol=" + protocol + "&host=" + encodeURIComponent(host) + "&port=" + port + "&path=" + encodeURIComponent(path) + "&search=" + encodeURIComponent(search) + "&hash=" + encodeURIComponent(hash) + "&everntMessage=" + encodeURIComponent(everntMessage) + "&eventUrl=" + encodeURIComponent(eventUrl) + "&eventLineNumber=" + eventLineNumber + "&eventColNumber=" + eventColNumber + "&eventStack=" + encodeURIComponent(eventStack);
                new Image().src = "//error.iwi.co.kr/api/Error/stack?" + query;
            }
        }
        catch (_a) {
        }
    };
}
catch (_a) {
}

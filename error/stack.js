window.onerror = function (eventOrMessage, url, lineNumber, colNumber, error) {
    if (typeof eventOrMessage !== 'string') {
        error = eventOrMessage.error;
        url = eventOrMessage.filename || eventOrMessage.fileName;
        lineNumber = eventOrMessage.lineno || eventOrMessage.lineNumber;
        colNumber = eventOrMessage.colno || eventOrMessage.columnNumber;
        eventOrMessage = eventOrMessage.message || eventOrMessage.name || error.message || error.name;
    }
    var stack = (error && error.stack) ? (function () { return error.stack.split("\n").map(function (x) { return x.trim(); }).join(" "); })() : "";
    var userAgent = window.navigator.userAgent;
    if (typeof ($) === "function" || typeof (jQuery) === "function") {
        $.get("http://localhost:8000/api/Error/stack", { "e": eventOrMessage, "j": url, "l": lineNumber, "c": colNumber, "s": stack });
    }
    else if (typeof (fetch) === "function") {
        fetch("http://localhost:8000/api/Error/stack", { "e": eventOrMessage, "j": url, "l": lineNumber, "c": colNumber, "s": stack });
    }
    else {
        new Image().src = "http://localhost:8000/api/Error/stack?e=" + encodeURIComponent(eventOrMessage) + "&j=" + encodeURIComponent(url) + "&l=" + encodeURIComponent(lineNumber) + "&c=" + encodeURIComponent(colNumber) + "&s=" + encodeURIComponent(stack);
    }
};

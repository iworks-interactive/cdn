try {
    window.onerror = function (eventOrMessage, url, lineNumber, colNumber, error) {
        try {
            var everntMessage = "";
            if (typeof eventOrMessage !== 'string') {
                everntMessage = eventOrMessage.type + " " + eventOrMessage.target + " " + eventOrMessage.eventPhase + " " + eventOrMessage.composedPath();
            }
            else {
                everntMessage = eventOrMessage;
            }
            var stack = (error && error.stack) ? (function () { return error.stack.split("\n").map(function (x) { return x.trim(); }).join(" "); })() : "";
            var userAgent = window.navigator.userAgent;
            if (typeof ($) === "function" || typeof (jQuery) === "function") {
                $.post("//error.iwi.co.kr/api/Error/stack", { "e": everntMessage, "j": url, "l": lineNumber, "c": colNumber, "s": stack });
            }
            else if (typeof (fetch) === "function") {
                fetch("//error.iwi.co.kr/api/Error/stack", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    mode: "cors",
                    cache: "no-cache",
                    body: JSON.stringify({ "e": everntMessage, "j": url, "l": lineNumber, "c": colNumber, "s": stack })
                });
            }
            else {
                new Image().src = "//error.iwi.co.kr/api/Error/stack?e=" + encodeURIComponent(everntMessage) + "&j=" + encodeURIComponent(url) + "&l=" + encodeURIComponent(lineNumber) + "&c=" + encodeURIComponent(colNumber) + "&s=" + encodeURIComponent(stack);
            }
        }
        catch (_a) {
        }
    };
}
catch (_a) {
}

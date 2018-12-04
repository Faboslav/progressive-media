"use strict";

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var progressiveMediaOptions = Object.assign(
    {
        viewportOffset: window.innerHeight / 2,
        throttleTime: 50,
        debounceTime: 100
    },
    typeof progressiveMediaOptions !== "undefined" ? progressiveMediaOptions : {}
);

var ProgressiveMedia = (function() {
    function ProgressiveMedia(options) {
        _classCallCheck(this, ProgressiveMedia);

        if (!ProgressiveMedia.instance) {
            this.init(options);
            ProgressiveMedia.instance = this;
        }

        return ProgressiveMedia.instance;
    }

    _createClass(ProgressiveMedia, [
        {
            key: "init",
            value: function init(options) {
                this.viewportOffset = options.viewportOffset;
                this.throttleTime = options.throttleTime;
                this.debounceTime = options.debounceTime;
            }
        },
        {
            key: "_isInViewport",
            value: function _isInViewport(element) {
                var scrollTop =
                    (window.pageYOffset || document.documentElement.scrollTop) -
                    this.viewportOffset;
                var scrollBottom =
                    (window.pageYOffset || document.documentElement.scrollTop) +
                    window.innerHeight +
                    this.viewportOffset;

                var rect = element.getBoundingClientRect();
                var elementTop = rect.top + scrollTop;
                var elementBottom = elementTop + element.clientHeight;

                return (
                    (elementTop > scrollTop && elementTop < scrollBottom) ||
                    (elementBottom > scrollTop && elementBottom < scrollBottom)
                );
            }
        },
        {
            key: "_supportPassive",
            value: function _supportPassive() {
                var supportsPassive = false;

                try {
                    var opts = Object.defineProperty({}, "passive", {
                        get: function get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassive", null, opts);
                    window.removeEventListener("testPassive", null, opts);
                } catch (e) {}

                return supportsPassive;
            }
        },
        {
            key: "_throttle",
            value: function _throttle(fn, wait) {
                var time = Date.now();
                return function() {
                    if (time + wait - Date.now() < 0) {
                        fn();
                        time = Date.now();
                    }
                };
            }
        },
        {
            key: "_debounce",
            value: function _debounce(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this,
                        args = arguments;
                    var later = function later() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            }
        },
        {
            key: "loadProgressiveMedia",
            value: function loadProgressiveMedia() {
                var progressiveMediaElements = document.querySelectorAll(
                    ".progressive-media:not(.progressive-media-loaded):not(.progressive-media-loading)"
                );
                var i;

                for (i = 0; i < progressiveMediaElements.length; ++i) {
                    if (progressiveMedia._isInViewport(progressiveMediaElements[i])) {
                        progressiveMedia.loadProgressiveMedium(progressiveMediaElements[i]);
                    }
                }
            }
        },
        {
            key: "loadProgressiveMedium",
            value: function loadProgressiveMedium(progressiveMedium) {
                progressiveMedium.classList.remove("progressive-media-unloaded");
                progressiveMedium.classList.add("progressive-media-loading");

                if (progressiveMedium.classList.contains("progressive-media-image")) {
                    var image = new Image();
                    image.src = progressiveMedium.getAttribute("data-img-src");
                    image.className =
                        "progressive-media-image-original progressive-media-content";
                    image.onload = function() {
                        progressiveMedium
                            .querySelector(".progressive-media-aspect-inner")
                            .insertAdjacentElement("beforeend", image);
                        progressiveMedium.classList.remove("progressive-media-loading");
                        progressiveMedium.classList.add("progressive-media-loaded");
                    };
                } else if (
                    progressiveMedium.classList.contains("progressive-media-iframe")
                ) {
                    progressiveMedium
                        .querySelector(".progressive-media-aspect-inner")
                        .insertAdjacentHTML(
                            "beforeend",
                            progressiveMedium.querySelector("noscript").innerText.trim()
                        );
                    progressiveMedium.classList.remove("progressive-media-loading");
                    progressiveMedium.classList.add("progressive-media-loaded");
                }
            }
        }
    ]);

    return ProgressiveMedia;
})();

var progressiveMedia = new ProgressiveMedia(progressiveMediaOptions);
Object.freeze(progressiveMedia);

progressiveMedia.loadProgressiveMedia();
window.addEventListener(
    "DOMContentLoaded",
    progressiveMedia.loadProgressiveMedia()
);
window.addEventListener(
    "scroll",
    progressiveMedia._throttle(
        progressiveMedia.loadProgressiveMedia,
        progressiveMedia.throttleTime
    ),
    progressiveMedia._supportsPassive ? { capture: true, passive: true } : false
);
window.addEventListener(
    "scroll",
    progressiveMedia._debounce(
        progressiveMedia.loadProgressiveMedia,
        progressiveMedia.debounceTime
    ),
    progressiveMedia._supportsPassive ? { capture: true, passive: true } : false
);
window.addEventListener(
    "resize",
    progressiveMedia._debounce(
        progressiveMedia.loadProgressiveMedia,
        progressiveMedia.debounceTime
    ),
    progressiveMedia._supportsPassive ? { capture: true, passive: true } : false
);

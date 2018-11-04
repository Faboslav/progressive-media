var progressiveMediaOptions = Object.assign((progressiveMediaOptions = typeof progressiveMediaOptions !== 'undefined')?progressiveMediaOptions:{}, {
    viewportOffset: (window.innerHeight / 2),
    throttleTime: 50,
    debounceTime: 100
});

class ProgressiveMedia {
    constructor(options) {
        if (!ProgressiveMedia.instance) {
            this.init(options);
            ProgressiveMedia.instance = this;
        }

        return ProgressiveMedia.instance;
    }

    init(options) {
        this.viewportOffset = options.viewportOffset;
        this.throttleTime = options.throttleTime;
        this.debounceTime = options.debounceTime;
    }

    _isInViewport(element) {
        var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) - this.viewportOffset;
        var scrollBottom = (window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight + this.viewportOffset;

        var rect = element.getBoundingClientRect();
        var elementTop = rect.top + scrollTop;
        var elementBottom = elementTop + element.clientHeight;

        return (elementTop > scrollTop && elementTop < scrollBottom) || (elementBottom > scrollTop && elementBottom < scrollBottom);
    }

    _supportPassive() {
        var supportsPassive = false;

        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                }
            });
            window.addEventListener("testPassive", null, opts);
            window.removeEventListener("testPassive", null, opts);
        } catch (e) {
        }

        return supportsPassive;
    }

    _throttle(fn, wait) {
        var time = Date.now();
        return function () {
            if ((time + wait - Date.now()) < 0) {
                fn();
                time = Date.now();
            }
        }
    }

    _debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    loadProgressiveMedia() {
        var progressiveMediaElements = document.querySelectorAll('.progressive-media:not(.progressive-media-loaded):not(.progressive-media-loading)');
        var i;

        for (i = 0; i < progressiveMediaElements.length; ++i) {
            if (progressiveMedia._isInViewport(progressiveMediaElements[i])) {
                progressiveMedia.loadProgressiveMedium(progressiveMediaElements[i]);
            }
        }
    }

    loadProgressiveMedium(progressiveMedium) {
        progressiveMedium.classList.remove('progressive-media-unloaded');
        progressiveMedium.classList.add('progressive-media-loading');

        if (progressiveMedium.classList.contains('progressive-media-image')) {
            var image = new Image();
            image.src = progressiveMedium.getAttribute('data-img-src');
            image.className = 'progressive-media-image-original progressive-media-content';
            image.onload = function () {
                progressiveMedium.querySelector('.progressive-media-aspect-inner').insertAdjacentElement('beforeend', image);
                progressiveMedium.classList.remove('progressive-media-loading');
                progressiveMedium.classList.add('progressive-media-loaded');
            };
        } else if (progressiveMedium.classList.contains('progressive-media-iframe')) {
            progressiveMedium.querySelector('.progressive-media-aspect-inner').insertAdjacentHTML('beforeend', progressiveMedium.querySelector('noscript').innerText.trim());
            progressiveMedium.classList.remove('progressive-media-loading');
            progressiveMedium.classList.add('progressive-media-loaded');
        }
    }
}

var progressiveMedia = new ProgressiveMedia(progressiveMediaOptions);
Object.freeze(progressiveMedia);

progressiveMedia.loadProgressiveMedia();
window.addEventListener('DOMContentLoaded', progressiveMedia.loadProgressiveMedia());
window.addEventListener('scroll', progressiveMedia._throttle(progressiveMedia.loadProgressiveMedia, progressiveMedia.throttleTime), progressiveMedia._supportsPassive ? {capture: true, passive: true} : false);
window.addEventListener('scroll', progressiveMedia._debounce(progressiveMedia.loadProgressiveMedia, progressiveMedia.debounceTime), progressiveMedia._supportsPassive ? {capture: true, passive: true} : false);
window.addEventListener("resize", progressiveMedia._debounce(progressiveMedia.loadProgressiveMedia, progressiveMedia.debounceTime), progressiveMedia._supportsPassive ? {capture: true, passive: true} : false);
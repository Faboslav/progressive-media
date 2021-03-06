![npm](https://img.shields.io/npm/v/progressive-media.svg)
![npm](https://img.shields.io/npm/dt/progressive-media.svg)

ProgressiveMedia is a fast, optimalized and lightweight library written in plain vanilla javascript. 

It eliminates unnecessary loading of non visible images and iframes and thus speeding up the web application.

Only images and iframes which are visible in the viewport and it's configured offset are smoothly loaded, loading is also considered in the resize event.

Progressive media is always auto initialized and used based on the [options](#options). It also has fallback for disabled javascript.
You can [configure](#usage) ProgressiveMedia by setting up the `progressiveMediaOptions` variable. 

You can also easily override strength of the blur and transition(animation) for lazy load with overriding progressive media CSS attributes.

Loading process of images is heavely inspired by the [Medium](https://medium.com/) website. Here is a preview:

![Yii2 Progressive Media Preview](https://i.imgur.com/rg3fBtT.gif)

**Demo:** [Check out the example](https://faboslav.github.io/progressive-media-demo/)

## Install
```
npm install progressive-media
```

## Usage
Include the following style at the start of your HTML page, right before closing the head tag.
```html
<link href="https://.../progressive-media.min.css" rel="stylesheet">
```

Include the following scripts at the end of your HTML page, right before closing the body tag.
```html
<script>
var progressiveMediaOptions = {
    /* your progressive media options */
};
</script>

<!-- Download the script and execute it after progressiveMediaOptions is defined -->
<script async src="https://.../progressive-media.min.js"></script>
```

As said Progressive Media library is automatically initialized and used, but you can always trigger lazy load by code:
```javascript
progressiveMedia.loadProgressiveMedia();
```

### Rendering images
Recommended resolution for image placeholders is maximum of 44x44px.
 
```html
<div class="progressive-media progressive-media-image progressive-media-unloaded" style="max-width: {WIDTH}px; max-height: {HEIGHT}px;" data-img-src="{IMG_URL}">
    <div class="progressive-media-aspect" style="padding-bottom: {WIDTH_x_HEIGHT_ASPECT_RATIO}%;">
        <div class="progressive-media-aspect-inner">
            <img class="progressive-media-image-placeholder progressive-media-content progressive-media-blur" src="{PLACEHOLDER_IMG_URL}">
            <img class="progressive-media-image-placeholder progressive-media-image-placeholder-edge progressive-media-content" src="{PLACEHOLDER_IMG_URL}">
            <noscript>
                <img src="{IMG_URL}" class="progressive-media-image-original progressive-media-content">
            </noscript>
        </div>
    </div>
</div>
```


### Example of working image
```html
<div class="progressive-media progressive-media-image progressive-media-unloaded" style="max-width: 392px; max-height: 260px;" data-img-src="https://source.unsplash.com/WLUHO9A_xik/392x260">
    <div class="progressive-media-aspect" style="padding-bottom: 66.32653061%;">
        <div class="progressive-media-aspect-inner">
            <img class="progressive-media-image-placeholder progressive-media-content progressive-media-blur" src="https://source.unsplash.com/WLUHO9A_xik/44x44">
            <img class="progressive-media-image-placeholder progressive-media-image-placeholder-edge progressive-media-content" src="https://source.unsplash.com/WLUHO9A_xik/44x44">
            <noscript>
                <img src="https://source.unsplash.com/WLUHO9A_xik/392x260" class="progressive-media-image-original progressive-media-content">
            </noscript>
        </div>
    </div>
</div>
```

### Rendering iframes
```html
<div class="progressive-media progressive-media-iframe progressive-media-unloaded" style="max-width: {WIDTH}px; max-height: {HEIGHT}px;" data-src="{IFRAME_URL}">
    <div class="progressive-media-aspect" style="padding-bottom: {WIDTH_x_HEIGHT_ASPECT_RATIO}%;">
        <div class="progressive-media-aspect-inner">
            <noscript>
                <iframe src="{IFRAME_URL}" class="progressive-media-content"></iframe>
            </noscript>
         </div>
    </div>
</div>
```

### Example of working iframe
```html
<div class="progressive-media progressive-media-iframe progressive-media-unloaded" style="max-width: 500px; max-height: 408px;" data-src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/facebook/&tabs=timeline&width=500&height=408&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId">
    <div class="progressive-media-aspect" style="padding-bottom: 81.6%;">
        <div class="progressive-media-aspect-inner">
            <noscript>
                <iframe src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/facebook/&tabs=timeline&width=500&height=408&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" class="progressive-media-content"></iframe>
            </noscript>
        </div>
    </div>
</div>
```

## Options
- `viewportOffset` - offset as number of px to top and bottom in addition to the original viewport (default is half of the viewport)
- `throttleTime` - number in ms how often is the progressiveMedia load triggered when scrolling (throttle is used) (default is 50ms)
- `debounceTime` - number in ms when is the progressiveMedia load after the very last resize event (debounce is used) (default is 100ms)


## License
MIT
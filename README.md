# juicerjs
JavaScript API for juicer (http://juicer.io)[asd]

## use example

### define templates
```javascript
var templates = {
	Instagram: '<a href="{{full_url}}" target="_blank" class="social-tile social-tile--instagram js-swiper-slide"> \
		<div class="social-tile-inner"> \
			<div class="social-tile-content" style="background-image: url(\'{{image}}\')"> \
				<div class="social-tile-info"> \
					<p class="social-tile-user"><i class="icon-svg-instagram-small"></i>{{poster_name}}</p> \
				</div> \
			</div> \
		</div> \
	</a>',
	Facebook: '<a href="{{full_url}}" target="_blank" class="social-tile social-tile--facebook js-swiper-slide"> \
		<div class="social-tile-inner"> \
			<div class="social-tile-content"> \
				<div class="social-tile-text"> \
					<div class="social-tile-text-inner"><p class="js-ellipsis">{{unformatted_message}}</p></div> \
				</div> \
				<div class="social-tile-info"> \
					<time datetime="{{datetime}}">{{datetime_parsed}}</time> \
				</div> \
			</div> \
		</div> \
	</a>'
};
```

### call juicerjs
```javascript
var social = juicerjs({
	feed: 'follow-loop',
	templates: templates,
	onSuccess: function(newPosts) {
		$wrapper.append(newPosts);
	}
});

social.load();
```

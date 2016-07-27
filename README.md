# juicerjs
JavaScript API for juicer http://juicer.io
- requires jQuery
- simple demo: [codepen](http://codepen.io/jsnanigans/pen/EyRaoN)

## use example
### install or download
```bash
bower install juicerjs --save
```

### init juicerjs
```javascript
var social = juicerjs({
	feed: 'follow-loop',
	templates: templates,
	onSuccess: function(newPosts) {
		// callback
		$wrapper.append(newPosts);
	}
});
```
### options
```javascript
opject = {
	page: integer | 1,
	limit: integer | 10,
	feed: string | 'follow-loop',
	onError: function | function(data) { console.log('error', data) },
	onSuccess: function | function(data) { console.log('success', data) },
	templates: object
}
```
### load posts
```javascript
social.load();
```

### templates example
```javascript
var templates = {
	Instagram: '\
		<a href="{{full_url}}" target="_blank" class="post--instagram"> \
			{{poster_name}}<br>\
			<img src="{{image}}" />\
		</a>',
	Facebook: '\
		<a href="{{full_url}}" target="_blank" class="post--facebook"> \
			<b>poster_name: </b> <br>\
			{{unformatted_message}}\
		</a>'
};
```

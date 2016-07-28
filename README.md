# juicerjs
JavaScript API for juicer http://juicer.io

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
### load posts
```javascript
social.load();

// load more posts:
social.more();
```

## options
### options | default
```javascript
var options = {
	page: integer | 1,
	limit: integer | 10,
	feed: string | 'follow-loop',
	onError: function | function(data) { console.log('error', data) },
	onSuccess: function | function(data) { console.log('success', data) },
	templates: object
}
```

### Success Callback
```javascript
onSuccess: function(array_strings, posts_array, is_there_more, ajax_response) {
	// ...
	// array_strings = array with strings of parsed templates
	// posts_array = array with original post objects from response
	// is_there_more = boolean if there are more posts
	// ajax_response = raw ajax response from XMLHttpRequest parsed to object
}
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
### or get template from html
#### html
```html
<script type="text/template" class="instagram_template">
	<a href="{{full_url}}" target="_blank">
		{{poster_name}}
		<img src="{{image}}" />
	</a>
</script>
```
#### js
```javascript
// with jQuery:
var templates = {
	Instagram: $('.instagram_template')[0]
}
// no jQuery:
var templates = {
	Instagram: document.querySelector('.instagram_template')
}
```

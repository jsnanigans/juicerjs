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
	// human_time: {
	// 	day: ['Tag', 'Tage'],
	// 	hour: ['Stunde', 'Stunden'],
	// 	minute: ['Minute', 'Minuten'],
	// 	second: ['Sekunde', 'Sekunden']
	// },
	// human_words: {
	//	like: ['like', 'likes'],
	//	comment: ['comment', 'comments'],
	// },
	// human_wrap: ['(', ')'],
	// human_divider: 'and',
	onSuccess: function(newPosts) {
		// callback
		$('.wrapper').append(newPosts);
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
	Default: '\
		<a href="{{full_url}}" target="_blank" class="post"> \
			{{poster_name}}<br>\
			<img src="{{image}}" />\
		</a>'
};
```
### or get template from html
#### html
```html
<script type="text/template" class="default_template">
	<a href="{{full_url}}" target="_blank">
		{{poster_name}} - {{date_full}}
		<img src="{{image}}" />
	</a>
</script>
```
#### js
```javascript
// with jQuery:
var templates = {
	Default: $('.default_template')[0]
}
// no jQuery:
var templates = {
	Default: document.querySelector('.default_template')
}
```

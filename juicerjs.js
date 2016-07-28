var juicerjs = function(opts) {
	if (typeof opts !== 'object') {
		opts = {};
	}

	var t = this;
	t.posts = [];
	t.newPosts = [];

	t.page = opts.page || 1;
	t.limit = opts.limit || 10;
	t.feed = opts.feed || 'follow-loop';
	t.is_there_more = true;
	t.error_cb = opts.onError || function(data) {
		console.log('error', data);
	};
	t.success_cb = opts.onSuccess || function(data) {
		console.log('success', data);
	};
	t.templates = opts.templates || {};

	t.loadXML = function(opts) {
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == XMLHttpRequest.DONE) {
				if (xmlhttp.status == 200) {
					if (typeof opts.success === 'function') {
						opts.success(JSON.parse(xmlhttp.response));
					}
				} else if (xmlhttp.status == 400) {
					if (typeof opts.error === 'function') {
						opts.error(xmlhttp)
					}
				} else {
					if (typeof opts.error === 'function') {
						opts.error(xmlhttp)
					}
				}
			}
		};

		xmlhttp.open("GET", opts.url, true);
		xmlhttp.send();
	}

	t.load = function() {
		var url = 'https://www.juicer.io/api/feeds/' + t.feed + '?per=' + t.limit + '&page=' + t.page;

		t.loadXML({
			url: url,
			success: function(data) {
				if (data.slug === 'error') {
					t.error_cb(data);
				}
				if (data.slug === t.feed) {
					t.newPosts = data.posts.items;
					if (data.posts.items.length !== t.limit) {
						t.is_there_more = false;
					}
					t.build();
					t.posts.concat(t.newPosts);
				}
			}
		});
	};

	t.build = function() {
		var newPostsHTML = [];
		for (var i = 0; i < t.newPosts.length; i++) {
			var post = t.newPosts[i]
			var channel = post.source.source;

			if (typeof t.templates[channel] !== 'undefined') {
				var html = t.templates[channel];
				if (typeof html === 'object') {
					html = html.innerHTML;
				}
				for (var key in post) {
					if (html.indexOf('{{' + key + '}}') !== -1) {
						var search = new RegExp('{{' + key + '}}', 'g');
						html = html.replace(search, post[key]);
					}
				}
				newPostsHTML.push(html);
			}
		};

		t.more = function() {
			t.page++;
			t.load();
		};

		// console.log(newPostsHTML);
		t.success_cb(newPostsHTML, t.newPosts, t.is_there_more, t.ajaxResponse);
	};

	return t;
};

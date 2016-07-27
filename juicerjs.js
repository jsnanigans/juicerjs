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
	t.error_cb = opts.onError || function(data) {
		console.log('error', data)
	};
	t.success_cb = opts.onSuccess || function(data) {
		console.log('success', data)
	};

	t.templates = opts.templates || {};


	t.load = function() {
		var url = 'https://www.juicer.io/api/feeds/' + t.feed + '?per=' + t.limit + '&page=' + t.page;

		$.get(url, function(data) {
			t.newPosts.length = 0;

			if (data.slug === 'error') {
				error_cb(data);
			}
			if (data.slug === t.feed) {
				t.newPosts = data.posts.items;
				t.build();
				t.posts.concat(t.newPosts);
			}
		});
	};

	t.build = function() {
		var newPostsHTML = [];
		for (var i = 0; i < t.newPosts.length; i++) {
			// for (var i = 0; i < 1; i++) {
			var post = t.newPosts[i]
			var channel = post.source.source;

			if (typeof t.templates[channel] !== 'undefined') {
				var html = t.templates[channel];
				for (var key in post) {
					if (html.indexOf('{{' + key + '}}') !== -1) {
						var search = new RegExp('{{' + key + '}}', 'g');
						html = html.replace(search, post[key]);
					}
				}

				newPostsHTML.push(html);
			}
		}

		// console.log(newPostsHTML);
		success_cb(newPostsHTML.join(''));
	};

	return t;
};

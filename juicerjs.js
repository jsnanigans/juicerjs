/* global XMLHttpRequest */
var juicerjs = function(opts) {
	if (typeof opts !== 'object') {
		opts = {};
	}

	var t = {};
	t.posts = [];
	t.newPosts = [];

	t.page = opts.page || 1;
	t.limit = opts.limit || 10;
	t.feed = opts.feed || 'follow-loop';
	t.filter = opts.filter || 'all';
	t.is_there_more = true;
	t.human_time = opts.human_time || {
		day: ['day', 'days'],
		hour: ['hour', 'hours'],
		minute: ['minute', 'minutes'],
		second: ['second', 'seconds']
	};
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
			if (xmlhttp.readyState === XMLHttpRequest.DONE) {
				if (xmlhttp.status === 200) {
					if (typeof opts.success === 'function') {
						opts.success(JSON.parse(xmlhttp.response));
					}
				} else if (xmlhttp.status === 400) {
					if (typeof opts.error === 'function') {
						opts.error(xmlhttp);
					}
				} else {
					if (typeof opts.error === 'function') {
						opts.error(xmlhttp);
					}
				}
			}
		};

		xmlhttp.open('GET', opts.url, true);
		xmlhttp.send();
	};

	t.human_time_diff = function(datetime) {
		// console.log(datetime);
		var postTime = new Date(datetime);
		var diff = t.now - postTime;

		var msec = diff;
		var dd = Math.floor(msec / 1000 / 60 / 60 / 24);
		msec -= dd * 1000 * 60 * 60 * 24;
		var hh = Math.floor(msec / 1000 / 60 / 60);
		msec -= hh * 1000 * 60 * 60;
		var mm = Math.floor(msec / 1000 / 60);
		msec -= mm * 1000 * 60;
		var ss = Math.floor(msec / 1000);
		msec -= ss * 1000;

		var dd_text = t.human_time.day[1];
		if (dd === 1) {
			dd_text = t.human_time.day[0];
		}
		var hh_text = t.human_time.hour[1];
		if (hh === 1) {
			hh_text = t.human_time.hour[0];
		}
		var mm_text = t.human_time.minute[1];
		if (mm === 1) {
			mm_text = t.human_time.minute[0];
		}
		var ss_text = t.human_time.second[1];
		if (ss === 1) {
			ss_text = t.human_time.second[0];
		}

		var text = '';
		if (dd !== 0) {
			text = dd + ' ' + dd_text + ', ' + hh + ' ' + hh_text;
		} else if (hh !== 0) {
			text = hh + ' ' + hh_text + ', ' + mm + ' ' + mm_text;
		} else {
			text = mm + ' ' + mm_text + ', ' + ss + ' ' + ss_text;
		}

		return text;
	};

	t.datefull = function(date) {
		var date_obj = new Date(date);
		var str = {
			day: date_obj.getDay(),
			month: date_obj.getMonth(),
			year: date_obj.getFullYear()
		};
		if (str.day < 10) {
			str.day = '0' + str.day;
		}
		if (str.month < 10) {
			str.month = '0' + str.month;
		}
		return str.day + '.' + str.month + '.' + str.year;
	};

	t.load = function() {
		var url = 'https://www.juicer.io/api/feeds/' + t.feed + '?per=' + t.limit + '&page=' + t.page;
		if (t.filter !== 'all') {
			url += '&filter=' + t.filter;
		}
		t.now = new Date();

		t.loadXML({
			url: url,
			success: function(data) {
				if (data.slug === 'error') {
					t.error_cb(data);
				}
				if (data.slug === t.feed) {
					t.newPosts = data.posts.items;

					for (var i = 0; i < data.posts.items.length; i++) {

						// put source stuff into outer scope.
						for (var key in data.posts.items[i].source) {
							data.posts.items[i]['source_' + key] = data.posts.items[i].source[key];
						}

						// add human_time_diff
						data.posts.items[i].human_time_diff = t.human_time_diff(data.posts.items[i].external_created_at);
						data.posts.items[i].date_full = t.datefull(data.posts.items[i].external_created_at);
					}

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
			var post = t.newPosts[i];
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

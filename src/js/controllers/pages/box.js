/**
 * Box Page Controller
 */
define([
	'jquery',
	'can',
	'model_box',
	'scheduler',
	'register!view_box'
], function ($, can, Box, Scheduler) {
	'use strict';

	//var feed_url = 'http://www.yankeecrossfit.com/feed/';

	return can.Control.extend({
		scheduler: null,
		box: null,
		init: function (element, options) {
			this.box = options.box;
			element.html(can.view('view_box', options));
			this.scheduler = new Scheduler('#signup', {box: this.box});
			// Init page
			this.updateClock();
			setInterval(can.proxy(function () { this.updateClock(); }, this), 1000);
			this.getFeed();
		},
		getFeed: function () {
			var backup = document.write;
			document.write = function (data) {
				$('#feed').append(data);
			};
			$.getScript('http://feed2js.org//feed2js.php?src=http%3A%2F%2Fwww.yankeecrossfit.com%2Ffeed%2F&num=1&desc=1&date=y&utf=y', function () {
				document.write = backup;
			});
			/*
			$.get(feed_url, function (data) {
				var feed_markup = '';
			    $(data).find('item').each(function () {
			        var el = $(this);
			        if (el.find('category').text() === 'WOD') {
						feed_markup += $('<div class="title"></div>').html(el.find('title').text());
						feed_markup += $('<div class="desc"></div>').html(el.find('description').text());
						return false; // break out
				    }
			    });
			    $('#feed').html(feed_markup);
			});
			*/
		},
		updateClock: function () {
			var currentTime = new Date();

			var currentHours = currentTime.getHours();
			var currentMinutes = currentTime.getMinutes();
			var currentSeconds = currentTime.getSeconds();

			// Pad the minutes and seconds with leading zeros, if required
			currentMinutes = (currentMinutes < 10 ? '0' : '') + currentMinutes;
			currentSeconds = (currentSeconds < 10 ? '0' : '') + currentSeconds;

			// Choose either "AM" or "PM" as appropriate
			var timeOfDay = (currentHours < 12) ? 'AM' : 'PM';

			// Convert the hours component to 12-hour format if needed
			currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

			// Convert an hours component of "0" to "12"
			currentHours = (currentHours === 0) ? 12 : currentHours;

			// Compose the string for display
			var currentTimeString = currentHours + ':' + currentMinutes + ':' + currentSeconds + ' ' + timeOfDay;

			// Update the time display
			$('#clock').html(currentTimeString);
		}
	});
});

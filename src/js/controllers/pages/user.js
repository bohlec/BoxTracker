/**
 * User Page Controller
 */
define([
	'jquery',
	'can',
	'model_user',
	'user_selector',
	'register!view_user'
], function ($, can, User, UserSelector) {
	'use strict';

	window.Mustache.registerHelper('pastReservationCount', function (user) {
		var past = user.getPastReservations();
		return (past.length) ? past.length.toString() : '0';
	});

	window.Mustache.registerHelper('futureReservationCount', function (user) {
		var futures = user.getFutureReservations();
		return (futures.length) ? futures.length.toString() : '0';
	});

	return can.Control.extend({
		user: null,
		userSelector: null,
		init: function (element, options) {
			this.user = options.user;
			if (!this.user) {
				this.userSelector = new UserSelector('body');
				var promise = new can.Deferred();
				promise.then(can.proxy(function (user) {
					can.route.attr('user', user._id.$oid);
				}, this));
				this.userSelector.open(promise);
			} else {
				element.html(can.view('view_user', options));
			}
		}
	});
});

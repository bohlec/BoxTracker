/**
 * User Selector Controller
 */
define([
	'jquery',
	'can',
	'model_user',
	'colorbox',
	'register!view_user_selector'
], function ($, can, User) {
	'use strict';

	return can.Control.extend({
		element: null,
		promise: null,
		init: function (element) {
			this.element = element;
		},
		'.cancel.ui-btn click': function () {
			this.promise.reject();
			this.remove();
		},
		'.select.ui-btn click': function (el, ev) {
			window.console.log(ev);
			ev.preventDefault();
			User.findOne({id: el.attr('data-id')}).then(can.proxy(function (user) {
				this.promise.resolve(user);
				this.remove();
			}, this));
		},
		open: function (promise) {
			this.promise = promise;
			User.findAll({}).then(can.proxy(function (users) {
				//this.element.toggleClass('active').append(can.view('view_user_selector', {users: users}));
				$.colorbox({html: can.view('view_user_selector', {users: users})});
			}, this));
		},
		remove: function () {
			//this.element.toggleClass('active');
			//$('#user_selector').remove();
			$.colorbox.close();
		}
	});
});

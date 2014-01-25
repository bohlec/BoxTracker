/**
 * Scheduler Controller
 */
define([
	'jquery',
	'can',
	'model_box',
	'model_user',
	'user_selector',
	'register!view_scheduler'
], function ($, can, Box, User, UserSelector) {
	'use strict';

	window.Mustache.registerHelper('emptyUserList', function (users, slots, options) {
		var markup = '';
		for (var i = 0; i < (slots() - users.length); i++) {
			markup += options.fn();
		}
		return markup;
	});

	window.Mustache.registerHelper('formatdate', function (klass) {
		return window.moment(klass.date_time).utc().format('dddd, MMMM Do, YYYY h:mm A');
	});

	return can.Control.extend({
		box: null,
		element: null,
		currentClass: null,
		currentUsers: null,
		userSelector: null,
		init: function (element, options) {
			this.box = options.box;
			this.element = element;
			this.currentClass = this.getNextClass();
			this.showBoxClass(this.currentClass);
		},
		'.register.ui-btn click': function (el, ev) {
			ev.preventDefault();
			var _this = this;
			var promise = new can.Deferred();
			promise.then(function (user) {
				_this.registerUser(user);
			});
			this.userSelector.open(promise);
		},
		'.remove.ui-btn click': function (el, ev) {
			ev.preventDefault();
			User.findOne({_id: el.attr('data-id')}).then(can.proxy(function (user) {
				this.cancelUser(user);
			}, this));
		},
		'.next_class.ui-btn click': function (el, ev) {
			ev.preventDefault();
			this.showBoxClass(this.getNextClass(this.currentClass));
		},
		'.previous_class.ui-btn click': function (el, ev) {
			ev.preventDefault();
			this.showBoxClass(this.getNextClass(this.currentClass, -1));
		},
		cancelUser: function (user) {
			// TODO - need to verify that cancellation has taken place in DB
			User.cancelReservation(user, this.currentClass);
			can.each(this.currentUsers, can.proxy(function (el, index) {
				if (el._id.$oid === user._id.$oid) {
					this.currentUsers.splice(index, 1);
				}
			}, this));
		},
		getNextClass: function (_class, delta) {
			// If a class is passed in, return next class - else add delta to find class chronologically
			delta = typeof delta !== 'undefined' ? delta : 1;
			if (_class) {
				var index = $.inArray(_class, this.box.classes);
				if (index !== -1) {
					// TODO - what happens at last class?
					return this.box.classes[index + delta];
				}
			} else {
				var futureClasses = $.grep(this.box.classes, function (elem) {
					return (new Date(elem.date_time) <= new Date());
				});
				return futureClasses[0];
			}
		},
		registerUser: function (user) {
			// TODO: need to verify that reservation has taken place in DB
			User.makeReservation(user, this.currentClass);
			this.currentUsers.push(user);  // auto-updates the UI
		},
		showBoxClass: function (_class) {
			this.currentClass = _class;
			User.findAll({'reservations.classId': _class.id}).then(can.proxy(function (users) {
				this.currentUsers = users;
				this.element.html(can.view('view_scheduler', {classReservation: _class, users: users}));
				this.userSelector = new UserSelector('div.schedule_wrapper');
			}, this));
		}
	});
});

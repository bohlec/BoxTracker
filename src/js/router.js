/*
 * router.js
 */
define([
	'jquery',
	'can',
	'model_box',
	'model_user',
	'page_box',
	'page_user'
], function ($, can, Box, User, BoxPage, UserPage) {

	'use strict';

	var Router = can.Control.extend({
		pages: null,
		element: null,
		'route': function () {
			// Default route
			can.route.attr('box', '52d2fbc2e4b0340755009f9b');
		},
		'users route': function () {
			new UserPage(this.element, {});
		},
		'user/:user route': function (data) {
			User.findOne({id: data.user}).then(can.proxy(function (user) {
				new UserPage(this.element, {user: user});
			}, this));
		},
		'box/:box route': function (data) {
			Box.findOne({id: data.box}).then(can.proxy(function (box) {
				new BoxPage(this.element, {box: box});
			}, this));
		},
		'box/:box&user/:user route': function (data) {
			var _this = this;
			$.when(Box.findOne({id: data.box}), User.findOne({id: data.user})).done(
				function (box, user) {
					new BoxPage(_this.element, {box: box, user: user});
				}
			);
		}
	});

	return Router;

});

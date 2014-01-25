/*
 * router.js
 */
define([
	'jquery',
	'can',
	'model_box',
	'page_box'
], function ($, can, Box, BoxPage) {

	'use strict';

	var Router = can.Control.extend({
		pages: null,
		element: null,
		'route': function () {
			// Default route
			can.route.attr('box', '52d2fbc2e4b0340755009f9b');
		},
		'box=:box route': function (data) {
			Box.findOne({id: data.box}).then(can.proxy(function (box) {
				new BoxPage(this.element, {box: box});
			}, this));
		}
	});

	return Router;

});

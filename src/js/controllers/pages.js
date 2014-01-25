/**
 * Pages Controller
 * Controller to manage static pages
 */
define([
	'jquery',
	'can',
	'page_box',
	'register!view_content',
	'register!view_footer'
], function ($, can, page_box) {
	'use strict';

	return can.Control.extend({}, {
		// Initialize
		init: function (element, options) {

			// Set the contents of the main div wrapper.
			this.element.html(can.view('view_content', options));

			// Timing issue: game.dictionary has not been populated yet.
			// TODO: Put this into its own controllers.
			$('#footer').html(can.view('view_footer'));

			// Initialize the navigation bar.
			//new Navigation('#nav', options);
		},

		// Page functions passed to routes.
		box: page_box
		//group: page_group,
		//leader: page_leader

	});

});

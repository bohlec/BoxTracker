/**
 * Streak main.js
 * This is the main starting point of the javascript execution stack.
 */

/**
 * Associate files with a name to be referred to by require. This way we only need to manage with
 * locations in one place, rather than in each individual file.
 */
requirejs.config({

	baseUrl: '../../',

	// This is where paths for every file to be consumed is defined.
	paths: {
		/* 3rd Pary Libraries */
		//  Note: Use AMD libraries when available, otherwise we will need to use a shim, and that gets ugly.
		almond: 'js/lib/almond/almond',
		can: 'js/lib/canjs-2.0.0/amd/can',
		can_fixture: 'js/lib/canjs-2.0.0/amd/can/util/fixture',
		colorbox: 'js/lib/colorbox/jquery.colorbox-min',
		datejs: 'js/lib/datejs/date',
		moment: 'js/lib/moment/moment.min',
		jquery: 'js/lib/jquery/1.10.2/jquery',
		//jqueryui: 'js/lib/jquery-ui/jquery.mobile-1.3.2',
		json: 'js/lib/json/json2',
		text: 'js/lib/requirejs-text/text',
		register: 'js/lib/requirejs-view/register',
		underscore: 'js/lib/underscore/underscore',

		/* Modules */
		//game: 'games/streak/js/game',
		//navigation: 'games/streak/js/controllers/navigation',
		pages: 'js/controllers/pages',
		router: 'js/router',

		/* Contollers */
		scheduler: 'js/controllers/scheduler',
		user_selector: 'js/controllers/user_selector',

		/* Pages */
		page_box: 'js/controllers/pages/box',

		/* Models */
		model_user: 'js/models/user',
		model_box: 'js/models/box',
		//model_schedule: 'js/models/schedule',
		//model_reservation: 'js/models/reservation',

		/* Views */
		view_content: 'views/content.mustache',
		view_footer: 'views/footer.mustache',
		view_box: 'views/box.mustache',
		view_scheduler: 'views/scheduler.mustache',
		view_user_selector: 'views/user_selector.mustache'
	}
});

/**
 * Note: In main.js we are calling require, rather than define. This is because main.js is our
 * starting point and not being ingested elsewhere.
 */
require([
	'can',
	'router',
	'jquery',
	'moment'
], function (can, Router, $) {

	'use strict';

	$(document).on('mobileinit',
		// Set up the "mobileinit" handler before requiring jQuery Mobile's module
		function () {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;

			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;

			$.mobile.ajaxEnabled = false;
			$.mobile.pushStateEnabled = false;
		}
	);

	//require(['jqueryui'], function () {
		// Instantiates a new Mobile Router
	new Router('#content');
	can.route.ready();
	//});
});

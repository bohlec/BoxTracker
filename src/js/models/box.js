/**
 * Box Model
 */
define([
	'can',
	'can_fixture'
], function (can) {
	'use strict';

	var Box = can.Model.extend({
		findOne: 'GET https://api.mongolab.com/api/1/databases/boxtracker/collections/boxes/{id}?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
		findAll: 'GET https://api.mongolab.com/api/1/databases/boxtracker/collections/boxes?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF'
	}, {});

	return Box;

});

/*

	can.fixture('GET /boxes/{id}', function (request) {
		return {
			id: request.data.id,
			name: 'Yankee Crossfit',
			url: 'http://www.yankeecrossfit.com',
			classes: [
				{
					id: 1,
					date_time: new Date(),
					slots: 15
				},
				{
					id: 2,
					date_time: new Date(),
					slots: 15
				}
			]
		};
	});

*/

/**
 * User Model
 */
define([
	'can'
], function (can) {
	'use strict';

	var User = can.Model.extend({
		findOne: 'GET https://api.mongolab.com/api/1/databases/boxtracker/collections/users/{_id}?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
		findAll: function (params) {
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users?q=' + JSON.stringify(params) + '&apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				type: 'GET'
			});
		},
		cancelReservation: function (user, klass) {
			can.each(user.reservations, function (element, index) {
				if (element.classId === klass.id) {
					user.reservations.splice(index, 1);
				}
			});
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users/' + user._id.$oid + '?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				data: JSON.stringify({'$set': {'reservations': user.reservations.serialize()}}),
				type: 'PUT',
				contentType: 'application/json'
			});
		},
		makeReservation: function (user, klass) {
			user.reservations.push({
				dateCreated: new Date(),
				dateUpdated: new Date(),
				classId: klass.id
			});
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users/' + user._id.$oid + '?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				data: JSON.stringify({'$set': {'reservations': user.reservations.serialize()}}),
				type: 'PUT',
				contentType: 'application/json'
			});
		}
	}, {});

	return User;

});


/*
	can.fixture('GET /users/{id}', function (request) {
		return {
			id: request.data.id,
			name: 'Test User ' + request.data.id,
			box: {id: 1, name: 'Yankee Crossfit'},
			userType: 1,
			subscriptionType: {
				id: 1,
				description: 'Three Classes per Week',
				subscription: {
					value: 3,
					unit: 'week'
				}
			},
			reservations: {
				id: 1,
				dateCreated: new Date(),
				dateUpdated: new Date(),
				classId: 1
			}
		};
	});
	can.fixture('GET /users', function (request) {
		return [
			{
				id: 1,
				name: 'Test User 1',
				box: {id: 1, name: 'Yankee Crossfit'},
				userType: 1,
				subscriptionType: {
					id: 1,
					description: 'Three Classes per Week',
					subscription: {
						value: 3,
						unit: 'week'
					}
				},
				reservations: {
					id: 1,
					dateCreated: new Date(),
					dateUpdated: new Date(),
					classId: request.data.classId
				}
			},
			{
				id: 2,
				name: 'Test User 2',
				box: {id: 1, name: 'Yankee Crossfit'},
				userType: 1,
				subscriptionType: {
					id: 2,
					description: 'Unlimited',
					subscription: {
						unit: 'unlimited'
					}
				},
				reservations: {
					id: 2,
					dateCreated: new Date(),
					dateUpdated: new Date(),
					classId: request.data.classId
				}
			}
		];
	});
*/

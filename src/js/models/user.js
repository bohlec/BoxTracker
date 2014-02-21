/**
 * User Model
 */
define([
	'can'
], function (can) {
	'use strict';

	var User = can.Model.extend({
		findOne: function (params) {
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users/' + params.id + '?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				type: 'GET'
			});
		},
		findAll: function (params) {
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users?q=' + JSON.stringify(params) + '&apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				type: 'GET'
			});
		}
	},
	// Instance methods
	{
		cancelReservation: function (klass) {
			var idx;
			can.each(this.reservations, function (element, index) {
				if (element.classId === klass.id) {
					idx = index;
					return false;
				}
			});
			if (idx) {
				this.reservations.splice(idx, 1);
			}
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users/' + this._id.$oid + '?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				data: JSON.stringify({'$set': {'reservations': this.reservations.serialize()}}),
				type: 'PUT',
				contentType: 'application/json'
			});
		},
		getFutureReservations: function () {
			var futures = [];
			for (var i = 0; i < this.reservations.length; i++) {
				if (new Date(this.reservations[i].date_time) >= new Date()) {
					futures.push(this.reservations[i]);
				}
			}
			return futures;
		},
		getPastReservations: function () {
			var past = [];
			for (var i = 0; i < this.reservations.length; i++) {
				if (new Date(this.reservations[i].date_time) <= new Date() && this.reservations[i].isConfirmed) {
					past.push(this.reservations[i]);
				}
			}
			return past;
		},
		getReservation: function (klass) {
			for (var i = 0; i < this.reservations.length; i++) {
				if (this.reservations[i].classId === klass.id) {
					return this.reservations[i];
				}
			}
		},
		makeReservation: function (klass, isConfirmed) {
			this.reservations.push({
				dateCreated: new Date(),
				dateUpdated: new Date(),
				classId: klass.id,
				classDate: klass.date_time,
				isConfirmed: (typeof(isConfirmed) !== 'undefined' && isConfirmed)
			});
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users/' + this._id.$oid + '?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				data: JSON.stringify({'$set': {'reservations': this.reservations.serialize()}}),
				type: 'PUT',
				contentType: 'application/json'
			});
		},
		updateReservation: function (reservation) {
			for (var i = 0; i < this.reservations.length; i++) {
				if (this.reservations[i].classId === reservation.classId) {
					this.reservations[i].attr('dateUpdated', new Date());
				}
			}
			return can.ajax({
				url: 'https://api.mongolab.com/api/1/databases/boxtracker/collections/users/' + this._id.$oid + '?apiKey=cCxWbdpuy2PFLqrTd1EsiV_NnljB0_GF',
				data: JSON.stringify({'$set': {'reservations': this.reservations.serialize()}}),
				type: 'PUT',
				contentType: 'application/json'
			});
		}
	});

	User.List = can.Model.List({
		'change': function (e) {
			window.console.log('List changed: ' + e);
		}
	});

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

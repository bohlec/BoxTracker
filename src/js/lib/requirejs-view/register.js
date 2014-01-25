define(['module'], function (module) {
	'use strict';

	var register,
		_config = (module.config && module.config()) || {},
		buildMap = {},
		registered = [],
		partials = [],
		regex = {
			partial: /(?:\{\{\>[\s]*)(\w*)(?:\}\})/gi
		};

	register = {

		version: '0.1.0',

		fetch: function (url, callback) {

			if (typeof window !== 'undefined' && window.navigator && window.document && !window.navigator.userAgent.match(/Node.js/)) {

				var xhr = new XMLHttpRequest();
				xhr.open('GET', url, true);
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						callback(xhr.responseText);
					}
				};
				xhr.send(null);

			} else if (typeof process !== 'undefined' && process.versions && !!process.versions.node) {
				var fs = require.nodeRequire('fs'),
					body = fs.readFileSync(url, 'utf8') || '';

				body = body.replace(/^\uFEFF/, '');
				callback(body);
			}
		},

		load: function (name, req, onLoad, config) {

			_config.isBuild = config.isBuild;

			register.fetch(req.toUrl(name), function (content) {

				var count = [],
					partial;

				partials[name] = register.getPartials(content);

				if (partials[name].length === 0) {

					register.registerView(name, content, req, function (){

						onLoad(content);

					});

				} else {

					register.registerView(name, content, req);

					count[name] = partials[name].length;

					for (partial in partials[name]) {

						if (partials[name].hasOwnProperty(partial)) {

							register.getPartialContent(partials[name][partial], req, function (partial_name, content) {
								count[name]--;

								if (count[name] === 0) {
									onLoad(content);
								}
							});
						}
					}
				}
			});
		},

		write: function (pluginName, moduleName, write, config) {

			var text =
				'define([\'can\'], function (can) {' +
					register.getPartialWrites(moduleName) +
				'});';

			write.asModule(pluginName + '!' + moduleName, text);

		},

		getPartialWrites: function (name) {
			var content, partial,
				text = '';

			if (buildMap.hasOwnProperty(name)) {

				content = register.jsEscape(buildMap[name]);

				text += 'can.view.mustache(\'' + name + '\', \'' + content + '\');';

				if (partials.hasOwnProperty(name) && partials[name].length > 0) {

					for (partial in partials[name]) {

						if (partials[name].hasOwnProperty(partial)) {

							var _partial = partials[name][partial];

							text += register.getPartialWrites(_partial);
						}
					}
				}
			}

			return text;
		},

		getPartialContent: function (partial, req, callback) {

			register.load(partial, req, function(content) {

				register.registerView(partial, content, req, function (){

					if (typeof callback === "function") {

						callback(name, content);
					}
				});
			}, _config);

		},

		jsEscape: function (content) {
			return content.replace(/(['\\])/g, '\\$1')
				.replace(/[\f]/g, "\\f")
				.replace(/[\b]/g, "\\b")
				.replace(/[\n]/g, "\\n")
				.replace(/[\t]/g, "\\t")
				.replace(/[\r]/g, "\\r")
				.replace(/[\u2028]/g, "\\u2028")
				.replace(/[\u2029]/g, "\\u2029");
		},

		registerView: function (name, content, req, callback) {

			if (registered.indexOf(name) !== -1) {
				if (typeof callback === "function") {
					callback(name, content);
				}
				return;
			}

			registered.push(name);

			if (_config.isBuild) {

				buildMap[name] = content;

				if (typeof callback === "function") {
					callback(name, content);
				}

			} else {

				req(['can'], function (can) {

					can.view.mustache(name, content);

					if (typeof callback === "function") {
						callback(name, content);
					}
				});
			}
		},

		getPartials: function (content) {
			var matches,
				partial,
				partials = [];

			while (matches = regex.partial.exec(content)) {
				partials.push(matches[1]);
			}

			return partials;
		}
	};


	return register;
});

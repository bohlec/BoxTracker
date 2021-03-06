/*!
 * CanJS - 2.0.0
 * http://canjs.us/
 * Copyright (c) 2013 Bitovi
 * Wed, 16 Oct 2013 20:40:41 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
steal('can/util','can/route','can/control', function(can){
	
	// ## control/route.js  
	// _Controller route integration._
	
	can.Control.processors.route = function( el, event, selector, funcName, controller ) {
		selector = selector || "";
		if ( !can.route.routes[selector] ) {
			can.route( selector );
		}
		var batchNum,
			check = function( ev, attr, how ) {
				if ( can.route.attr('route') === ( selector ) && 
					( ev.batchNum === undefined || ev.batchNum !== batchNum ) ) {
					
					batchNum = ev.batchNum;
					
					var d = can.route.attr();
					delete d.route;
					if ( can.isFunction( controller[ funcName ] )) {
						controller[funcName]( d );
					} else {
						controller[controller[funcName]](d);
					}
					
				}
			};
		can.route.bind( 'change', check );
		return function() {
			can.route.unbind( 'change', check );
		};
	};

	return can;
});

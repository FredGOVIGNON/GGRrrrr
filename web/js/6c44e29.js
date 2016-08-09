Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).ready(function(){
	//////// global endpoints and settings /////////
	var rounds = new Object();
	var currentRound = 1;
	var geocoder;
	var map;
	var sv = new google.maps.StreetViewService();
	
	//////// initialize the map /////////
	var initMap = function() {
		var loc = new google.maps.LatLng(48.4458301, 1.4864982);
		var mapOptions = { zoom: 14, center: loc, mapTypeId: google.maps.MapTypeId.ROADMAP };
		map = new google.maps.Map(document.getElementById('map-container'), mapOptions);
		new google.maps.StreetViewCoverageLayer().setMap(map); // overlay street view coverage
		
		google.maps.event.addListener(map.getStreetView(), 'visible_changed', function() {
			svObject = map.getStreetView();
				if ( svObject.getVisible() == true ) { 
					$("button.go-to").fadeIn();
				} else {
					$("button.go-to").fadeOut();
				}	
		});
	};
	
	google.maps.event.addDomListener(window, 'load', initMap);
	
	//////// helpers /////////
	var displayError = function(message) {
		errorVisible = $(".error-box").length > 0;
		if ( !errorVisible ) { 
			$("#form-container").append("<div class=\"error-box\"></div>");
		}
		$(".error-box").fadeIn().html(message);
		$(".error-box").delay(2000).fadeOut();
	};
	
	//////// event handlers: textbox focus /////////
	$(".step input").focus(function(){
		var address = $(this).val();
		var round = $(this).id;
		
		if ( address != "" ) {
			// switch map to location (geocoded) in box
			new google.maps.Geocoder().geocode( {'address': address}, function(results, status) {
				if ( status == google.maps.GeocoderStatus.OK ) {
					var center = results[0].geometry.location;
					console.log(results);
					map.setCenter(center);
					var marker = new google.maps.Marker( {map: map, position: center} );
				} else { 
					displayError('The location you entered was not valid. [' + status + ']');
				}
			}); 
		}
	}); 

	//////// event handlers: goto button /////////
	$("button.go-to").click(function() {
		thisround = $(this).attr('class')[0];
		addressBox = $("input#" + thisround)
		address = addressBox.val();
		
		new google.maps.Geocoder().geocode( {'address': address}, function(results, status) {
			if ( status == google.maps.GeocoderStatus.OK ) {
				var searchResult = results[0].geometry.location;
				
				sv.getPanoramaByLocation(searchResult, 250, function(data, svStatus) {
					if ( svStatus == google.maps.StreetViewStatus.OK ) {
						// we're good, street view exists here
						svSnapLocation = data.location.latLng;
						
						// if street view is open, move the streetview there
						if ( map.getStreetView().getVisible() ) {
							map.getStreetView().setPosition(svSnapLocation);
						}
										
					} else {
						displayError('Oops! No street view at this location. Please try somewhere else.');
						addressBox.val("");
					}
				});
			} else if ( status != google.maps.GeocoderStatus.OK && address != "" ) {
				displayError('The location you entered was not valid. [' + status + ']');
			}
		});
		
	});
	
	//////// event handlers: set button /////////
	$("button.set").click(function(){
		thisround = $(this).attr('class')[0];
		addressBox = $("input#" + thisround)
		address = addressBox.val();
		svObj = map.getStreetView()
		
		if ( svObj.getVisible() == true ) {
			// if you're in a streetview and hit set, grab the location from there
			streetLat = svObj.position.lat()
			streetLng = svObj.position.lng()
			rounds[thisround-1] = [thisround, streetLat, streetLng];
			addressBox.val(streetLat + "," + streetLng);
			
			// and add it; no validation or coding needed since SV active
			var marker = new google.maps.Marker( {map: map, position: map.getStreetView().position } );
			map.setCenter( map.getStreetView());

		} else {
			// geocode address, check if SV available, add
			new google.maps.Geocoder().geocode( {'address': address}, function(results, status) {
				if ( status == google.maps.GeocoderStatus.OK ) {
					var searchResult = results[0].geometry.location;

					sv.getPanoramaByLocation(searchResult, 250, function(data, svStatus) {
						if ( svStatus == google.maps.StreetViewStatus.OK ) {
							// we're good, street view exists here
							svSnapLocation = data.location.latLng;

							// show it on the map and add it to the round queue
							map.setCenter(svSnapLocation);
							var marker = new google.maps.Marker( {map: map, position: searchResult} );

							// add to rounds queue
							rounds[thisround-1] = [thisround, svSnapLocation.lat(), svSnapLocation.lng()];				
						} else {
							displayError('Oops! No street view at this location. Please try somewhere else.');
							addressBox.val("");
						}
					});

				} else if ( status != google.maps.GeocoderStatus.OK && address != "" ) {
					displayError('The location you entered was not valid. [' + status + ']');
				}
			}); // end geocode function			
		}
	});

});

"use strict";jQuery.base64=(function($){var _PADCHAR="=",_ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_VERSION="1.0";function _getbyte64(s,i){var idx=_ALPHA.indexOf(s.charAt(i));if(idx===-1){throw"Cannot decode base64"}return idx}function _decode(s){var pads=0,i,b10,imax=s.length,x=[];s=String(s);if(imax===0){return s}if(imax%4!==0){throw"Cannot decode base64"}if(s.charAt(imax-1)===_PADCHAR){pads=1;if(s.charAt(imax-2)===_PADCHAR){pads=2}imax-=4}for(i=0;i<imax;i+=4){b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6)|_getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&255,b10&255))}switch(pads){case 1:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&255));break;case 2:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join("")}function _getbyte(s,i){var x=s.charCodeAt(i);if(x>255){throw"INVALID_CHARACTER_ERR: DOM Exception 5"}return x}function _encode(s){if(arguments.length!==1){throw"SyntaxError: exactly one argument required"}s=String(s);var i,b10,x=[],imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8)|_getbyte(s,i+2);x.push(_ALPHA.charAt(b10>>18));x.push(_ALPHA.charAt((b10>>12)&63));x.push(_ALPHA.charAt((b10>>6)&63));x.push(_ALPHA.charAt(b10&63))}switch(s.length-imax){case 1:b10=_getbyte(s,i)<<16;x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_PADCHAR+_PADCHAR);break;case 2:b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8);x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_ALPHA.charAt((b10>>6)&63)+_PADCHAR);break}return x.join("")}return{decode:_decode,encode:_encode,VERSION:_VERSION}}(jQuery));
/*!
* jQuery URL Shortener v@VERSION
* https://github.com/hayageek/jQuery-URL-shortener
*
*
* Date: @DATE
*/
(function($) {

	$.urlShortener = function(options) 
	{
		var settings ={};
		$.extend(settings,$.urlShortener.settings, options);
		 
		var requestUrl = settings.requestUrl;
		
		if(settings.apiKey.length > 1)
		{
			requestUrl += "key="+settings.apiKey;
		}
	
		if(settings.longUrl != undefined)
		{
			var data = {longUrl: settings.longUrl};
			var shortUrl=undefined;
			
			return $.urlShortener.shortUrl(requestUrl,data);
		}
		else if(settings.shortUrl != undefined) //URL info
		{
			requestUrl += "&shortUrl="+settings.shortUrl;
			return $.urlShortener.urlInfo(requestUrl,settings.projection);
		}
		
	
		return undefined;
	};
	
	$.urlShortener.shortUrl = function(requestUrl,data)
	{
		var shortUrl =undefined;
		$.ajax({
		async:false,
		type: "POST",
		url: requestUrl,
		data: JSON.stringify(data),
		contentType:"application/json; charset=utf-8",
		dataType:"json",
	  	}).done(function( info ) 
		{
			shortUrl=info.id;
		}).fail(function(jqXHR, textStatus, errorThrown) 
		{ 
			
		});
		
		return shortUrl;
		
	}
	$.urlShortener.urlInfo = function(requestUrl,projection)
	{
		if(projection != undefined)
		{
			requestUrl += "&projection="+projection;
		}
		var urlInfo =undefined;
		$.ajax({
		async:false,
		type: "GET",
		url: requestUrl,
		contentType:"application/json; charset=utf-8",
		dataType:"json",
	  	}).done(function( info ) 
		{
			if(projection == undefined)
			{
				urlInfo=info.longUrl; //return long URL;
			}
			else
			{
				urlInfo = info; //return full info;
			}
			
		}).fail(function(jqXHR, textStatus, errorThrown) 
		{ 
			
		});
		
		return urlInfo;
		
	}

	$.urlShortener.settings = {
		apiKey : '',
		version : 'v1',
		requestUrl : 'https://www.googleapis.com/urlshortener/v1/url?'
	};


}(jQuery));

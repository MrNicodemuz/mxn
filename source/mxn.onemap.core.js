/*
MAPSTRACTION   v2.0.17   http://www.mapstraction.com

Copyright (c) 2011 Tom Carden, Steve Coast, Mikel Maron, Andrew Turner, Henri Bergius, Rob Moran, Derek Fowler, Gary Gale
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the Mapstraction nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var _oneMapInstance;

mxn.register('onemap', {	

	Mapstraction: {

		// These methods can be called anytime but will only execute
		// once the map has loaded. 
		deferrable: {
			applyOptions: true,
			resizeTo: true,
			addControls: true,
			addSmallControls: true,
			addLargeControls: true,
			addMapTypeControls: true,
			dragging: true,
			setCenterAndZoom: true,
			getCenter: true,
			setCenter: true,
			setZoom: true,
			getZoom: true,
			getZoomLevelForBoundingBox: true,
			setMapType: true,
			getMapType: true,
			getBounds: true,
			setBounds: true,
			addTileLayer: true,
			toggleTileLayer: true,
			getPixelRatio: true,
			mousePosition: true
		},
		
		init: function(element, api) {
			
			console.log('OneMap: init()');
			
			var me = this;
			me.loaded = false;
			
			if (typeof GetOneMap === 'function') {
			
				var centerPoint = "28968.103,33560.969";
				var levelNumber = 2;
				var map = new GetOneMap(element,'SM');
				
				_oneMapInstance = map;
				
				this.element = element;
				this.maps[api] = map;
				
				dojo.addOnLoad(function() {
					
					dojo.connect(_oneMapInstance.map, "onClick", function(evt) {
						me.click.fire({'location': 
							new mxn.LatLonPoint(0, 0)
						});
					});
					
					dojo.connect(_oneMapInstance.map, "onPanEnd", function(extent, endPoint) {
						me.moveendHandler(me);
						me.endPan.fire();
					});
					
					dojo.connect(_oneMapInstance.map, "onZoomEnd", function(extent, zoomFactor, anchor, level) {
						me.moveendHandler(me);
						me.endPan.fire();
					});
					
					me.loaded = true;
					
					me.endPan.fire();
					
					console.log('OneMap: events registered');
					
				});
				
			} else {
				
				alert('Unable to load OneMap javascript. Please try again later.');
				
			}
			
			console.log('OneMap: init() end');
			
		},

		applyOptions: function(){
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		resizeTo: function(width, height){	
			
			var map = this.maps[this.api];
			
			if(map.map) {
				map.map.resize();
			}
			
			//console.log(map);
			//map.setSize(width,height);
			
		},

		addControls: function( args ) {
			var map = this.maps[this.api];
			map.showControl("Zoom", args.zoom || false);
			map.showControl("Layers", args.layers || false);
			map.showControl("Styles", args.styles || false); 
			map.showControl("Basemap", args.map_type || false);
			map.showControl("Legend", args.legend || false, "open"); 
			// showControl("Legend", true, "close"); 
		},

		addSmallControls: function() {
			var map = this.maps[this.api];
			this.addControls({
				zoom:   'small',
				legend: "open"
			});
			// showControl("Zoom", args.zoom);
			// showControl("Legend", args.legend, "open"); 
		},

		addLargeControls: function() {
			var map = this.maps[this.api];
			this.addControls({
				zoom:   'large',
				layers: true,
				legend: "open"
			});
		},

		addMapTypeControls: function() {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		dragging: function(on) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		setCenterAndZoom: function(point, zoom) { 
			var map = this.maps[this.api];
			if(map.map) {
				
				//var center_xy = CnvLL2EN(point.lat, point.lon, 3).split(',');				
				//map.map.centerAndZoom(new esri.geometry.Point(center_xy[0], center_xy[1], new esri.SpatialReference({ wkid: 3414 })), zoom);
				//map.map.centerAndZoom(new esri.geometry.Point(point.lat, point.lon, new esri.SpatialReference({ wkid: 4326 })), zoom);
				
			}
		},

		getCenter: function() {
			var map = this.maps[this.api];
			var point = map.getCenterZoom()[0];
			return new mxn.LatLonPoint(point.lat,point.lon);
		},

		setCenter: function(point, options) {
			var map = this.maps[this.api];
			map.setCenter(point.lat, point.lon);			
		},

		setZoom: function(zoom) {
			var map = this.maps[this.api];
			map.setZoom(zoom);
		},

		getZoom: function() {
			var map = this.maps[this.api];
			return map.getZoom();
		},

		getZoomLevelForBoundingBox: function( bbox ) {
			var map = this.maps[this.api];
			// NE and SW points from the bounding box.
			var ne = bbox.getNorthEast();
			var sw = bbox.getSouthWest();
			var zoom;

			// TODO: Add provider code

			return zoom;
		},

		setMapType: function(type) {
			var map = this.maps[this.api];
			switch(type) {
				case mxn.Mapstraction.ROAD:
				map.setMapProvider("OpenStreetMap (road)");
				break;
				case mxn.Mapstraction.SATELLITE:
				map.setMapProvider("BlueMarble");
				break;
				case mxn.Mapstraction.HYBRID:
				map.setMapProvider("Google Hybrid");
				break;
				default:
				map.setMapProvider(type);
			}	 
		},

		getMapType: function() {
			var map = this.maps[this.api];
			
			// TODO: I don't thick this is correct -Derek
			switch(map.getMapProvider()) {
				case "OpenStreetMap (road)":
					return mxn.Mapstraction.ROAD;
				case "BlueMarble":
					return mxn.Mapstraction.SATELLITE;
				case "Google Hybrid":
					return mxn.Mapstraction.HYBRID;
				default:
					return null;
			}	

		},

		getBounds: function () {
			
			var map = this.maps[this.api];
			
			var northWest = CnvEN2LL(map.map.extent.xmin, map.map.extent.ymax, 5).split(',');
			var southEast = CnvEN2LL(map.map.extent.xmax, map.map.extent.ymin, 5).split(',');
			
			//console.log(new mxn.BoundingBox(northWest[0], northWest[1], southEast[0], southEast[1]));
			//return console.trace();
			//return 'hello';
			
			this.currentBounds = new mxn.BoundingBox(southEast[0], northWest[1], northWest[0], southEast[1]);
			
			return this.currentBounds;
		},

		setBounds: function(bounds){
			var map = this.maps[this.api];
			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();
			map.setExtent(ne.lat,sw.lat,ne.lon,sw.lon);

		},

		addImageOverlay: function(id, src, opacity, west, south, east, north, oContext) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},
		
		// URL in this case is either a Maker map ID or the full URL to the Maker Map
		addOverlay: function(url, autoCenterAndZoom) {
			var map = this.maps[this.api];
			var match;

			if(typeof(url) === "number") {
				map.loadMap(url);
				return;
			}
			// Try if we've been given either a string of the ID or a URL
			match = url.match(/^(\d+)$/);
			if(match !== null){
				match = url.match(/^.*?maps\/(\d+)(\?\(\[?(.*?)\]?\))?$/);
			}

			map.loadMap(match[1]);
		},

		addTileLayer: function(tile_url, opacity, copyright_text, min_zoom, max_zoom) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		toggleTileLayer: function(tile_url) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		getPixelRatio: function() {
			var map = this.maps[this.api];

			// TODO: Add provider code	
		},

		mousePosition: function(element) {
			var map = this.maps[this.api];

			// TODO: Add provider code	
		},
		addMarker: function(marker, old) {
			
			var map = this.maps[this.api];
			
			// Determine symbol shape
			var pointSymbol;
			if (marker.iconUrl && marker.iconSize) {
				pointSymbol = new esri.symbol.PictureMarkerSymbol(marker.iconUrl, marker.iconSize[0], marker.iconSize[1]);
				pointSymbol.setOffset(0, marker.iconSize[1] / 2);
			} else {
				pointSymbol = new esri.symbol.SimpleMarkerSymbol().setSize(20).setColor(new dojo.Color([255, 0, 0]));   
			}
			
			// Determine marker location
			var marker_xy = CnvLL2EN(marker.location.lat,marker.location.lng,3).split(',');
			var geomPoint = new esri.geometry.Point(marker_xy[0], marker_xy[1], new esri.SpatialReference({ wkid: 4326 }));
			
			// Combine shape and location into graphic
			var graphic = new esri.Graphic(geomPoint, pointSymbol);
			
			// Add graphic onto layer
			var layer = new esri.layers.GraphicsLayer();
			layer.add(graphic);
			
			// Put layer on map
			map.map.addLayer(layer);
			
			dojo.connect(layer, "onClick", function(evt) {
				
				// Do not propagate click to any other events
				dojo.stopEvent(evt);
				
				// Fire marker click event instead
				marker.click.fire();
			});
			
			// Save reference for layer
			marker.layer = layer;
			
			return marker;
			
		},

		removeMarker: function(marker) {
			var map = this.maps[this.api];
			
			map.map.removeLayer(marker.layer);

		},

		declutterMarkers: function(opts) {
			var map = this.maps[this.api];

			// TODO: Add provider code
		},

		addPolyline: function(polyline, old) {
			var map = this.maps[this.api];
			var pl = polyline.toProprietary(this.api);
			// TODO: Add provider code			
			// map.addOverlay(pl);
			return pl;
		},

		removePolyline: function(polyline) {
			var map = this.maps[this.api];
			// TODO: Add provider code
		}
		
	},

	LatLonPoint: {

		toProprietary: function() {
			// TODO: Add provider code
			return {};
		},

		fromProprietary: function(googlePoint) {
			// TODO: Add provider code
		}

	},

	Marker: {

		toProprietary: function() {
			// TODO: Add provider code
			return {};
		},

		openBubble: function() {		
			// TODO: Add provider code
		},

		hide: function() {
			// TODO: Add provider code
		},

		show: function() {
			// TODO: Add provider code
		},

		update: function() {
			// TODO: Add provider code
		}

	},

	Polyline: {

		toProprietary: function() {
			return {};
			// TODO: Add provider code
		},

		show: function() {
			// TODO: Add provider code
		},

		hide: function() {
			// TODO: Add provider code
		}

	}

});


// TODO: Refactor

var ELLIPSOID_SEMIMAJORAXIS=6378137.0;
var ELLIPSOID_ECCENTRICITY=0.0818191908426215;
var ELLIPSOID_FLATTENING=0.00335281066474746;
var PROJ_NATURALORIGINLATITUDE=1.36666666666667;
var PROJ_NATURALORIGINLONGITUDE=103.833333333333;
var PROJ_SCALEFACTOR=1.0;
var PROJ_FALSEEASTINGS=28001.642;
var PROJ_FALSENORTHINGS=38744.572;

function not_empty(value){var re=(value.replace(/^\s+|\s+$/g,'').length>0)?true:false;return re;};

function CnvLL2EN(latDeg,lngDeg,ENFormat){var ret,latRad,lngRad,A,T,C,M,v,M0,easting,northing,e2;e2=SecondEccentricity();latRad=CnvDegToRad(latDeg);lngRad=CnvDegToRad(lngDeg);A=calc_A(latRad,lngRad);T=calc_T(latRad);C=calc_C(latRad);M=calc_M(latRad);v=calc_v(latRad);M0=calc_M(CnvDegToRad(PROJ_NATURALORIGINLATITUDE));easting=A+((1.0-T+C)*Math.pow(A,3)/6.0)+(5.0-18.0*T+T*T+72.0*C-58.0*Math.pow(e2,2))*Math.pow(A,5)/120.0;easting=PROJ_FALSEEASTINGS+PROJ_SCALEFACTOR*v*easting;northing=(A*A/2.0)+((5.0-T+9.0*C+4.0*C*C)*Math.pow(A,4)/24.0)+((61.0-58.0*T+T*T+600.0*C-330.0*Math.pow(e2,2))*Math.pow(A,6)/720.0);northing=(PROJ_FALSENORTHINGS+PROJ_SCALEFACTOR*(M-M0+v*Math.tan(latRad)*northing));if(ENFormat==1){ret=String(easting)+"\t"+String(northing);}else if(ENFormat==2){ret=String(easting)+' '+String(northing);}else if(ENFormat==3){ret=String(easting)+','+String(northing);}return ret;}

function CnvEN2LL(easting,northing,latLngFormat){var e1,M1,u1,lat1,T1,C1,v1,p1,D,latRad,lngRad,e2,lat,lon;var LatDD,LatMM,LatSS,LonDD,LonMM,LonSS,LL;e2=SecondEccentricity();e1=calc_e1();M1=calc_M1(northing);u1=calc_u1(M1);lat1=calc_lat1(u1,e1);T1=calc_T1(lat1);C1=calc_c1(lat1);v1=calc_v1(lat1);p1=calc_p1(lat1);D=(easting-PROJ_FALSEEASTINGS)/(v1*PROJ_SCALEFACTOR);latRad=(D*D/2.0)-(5.0+3.0*T1+10.0*C1-4.0*C1*C1-9.0*Math.pow(e2,2))*(Math.pow(D,4)/24.0)+(61.0+90.0*T1+298.0*C1+45.0*T1*T1-252.0*Math.pow(e2,2)-3.0*C1*C1)*(Math.pow(D,6)/720.0);latRad=lat1-v1*Math.tan(lat1)*latRad/p1;lat=CnvRadToDeg(latRad);lngRad=(D-(1.0+2.0*T1+C1)*Math.pow(D,3)/6.0+(5.0-2.0*C1+28.0*T1-3.0*C1*C1+8.0*Math.pow(e2,2)+24.0*T1*T1)*Math.pow(D,5)/120.0)/Math.cos(lat1);lngRad=CnvDegToRad(PROJ_NATURALORIGINLONGITUDE)+lngRad;lon=CnvRadToDeg(lngRad);LatDD=Math.floor(lat);LatMM=Math.floor((lat-LatDD)*60);LatSS=(Math.round((((lat-LatDD)-(LatMM/60))*60*60)*100)/100);LonDD=Math.floor(lon);LonMM=Math.floor((lon-LonDD)*60);LonSS=(Math.round((((lon-LonDD)-(LonMM/60))*60*60)*100)/100);if(latLngFormat==1){LL=LatDD+'\t'+LatMM+'\t'+LatSS+'\t'+LonDD+'\t'+LonMM+'\t'+LonSS;}else if(latLngFormat==2){LL=LatDD+' '+LatMM+' '+LatSS+' '+LonDD+' '+LonMM+' '+LonSS;}else if(latLngFormat==3){LL=lat+'t'+lon;}else if(latLngFormat==4){LL=lat+' '+lon;}else if(latLngFormat==5){LL=lat+','+lon;}return LL;}

function SecondEccentricity(){return(Math.sqrt(ELLIPSOID_ECCENTRICITY*ELLIPSOID_ECCENTRICITY/(1.0-ELLIPSOID_ECCENTRICITY*ELLIPSOID_ECCENTRICITY)));}

function CnvDeg2DMS(deg){var D,M,S,value;D=Math.floor(deg);M=Math.floor((deg-D)*60);S=Math.round((((deg-D)-(M/60.0))*60.0*60.0)*100.0)/100.0;if(S==60){S=0;M=M+1;}if(M==60){M=0;D=D+1;}value=D+":"+M+":"+S;return value;}

function CnvDMS2Deg(dd,mm,ss){return(dd*1.0)+(mm/60.0)+(ss/3600.0);}

function CnvRadToDeg(rad){return(180.0*rad/Math.PI);}

function CnvDegToRad(deg){return(Math.PI*deg)/180.0;}

function calc_A(latRad,lngRad){return(lngRad-CnvDegToRad(PROJ_NATURALORIGINLONGITUDE))*Math.cos(latRad);}

function calc_T(latRad){return Math.tan(latRad)*Math.tan(latRad);}

function calc_C(latRad){var value;value=Math.cos(latRad)*Math.cos(latRad)*Math.pow(ELLIPSOID_ECCENTRICITY,2.0);return value/(1.0-Math.pow(ELLIPSOID_ECCENTRICITY,2.0));}

function calc_v(latRad){var value;value=1.0-Math.pow(ELLIPSOID_ECCENTRICITY*Math.sin(latRad),2.0);return ELLIPSOID_SEMIMAJORAXIS/Math.sqrt(value);}

function calc_M(latRad){var value,e,term1,term2,term3,term4;e=ELLIPSOID_ECCENTRICITY;term1=1.0-(Math.pow(e,2)/4.0)-(3.0*Math.pow(e,4)/64.0)-(5.0*Math.pow(e,6)/256);term2=(3.0*Math.pow(e,2)/8.0)+(3.0*Math.pow(e,4)/32.0)+(45.0*Math.pow(e,6)/1024.0);term3=(15.0*Math.pow(e,4.0)/256.0)+(45.0*Math.pow(e,6)/1024.0);term4=(35.0*Math.pow(e,6)/3072);value=term1*latRad-term2*Math.sin(2.0*latRad)+term3*Math.sin(4.0*latRad)-term4*Math.sin(6*latRad);return value*ELLIPSOID_SEMIMAJORAXIS;}

function calc_T1(lat1){var value;value=Math.tan(lat1);return value*value;}

function calc_v1(lat1){var value;value=ELLIPSOID_ECCENTRICITY*Math.sin(lat1);value=Math.sqrt(1.0-value*value);return ELLIPSOID_SEMIMAJORAXIS/value;}

function calc_p1(lat1){var value,e;e=ELLIPSOID_ECCENTRICITY;value=1.0-e*e*Math.pow(Math.sin(lat1),2);value=Math.pow(value,3.0/2.0);return ELLIPSOID_SEMIMAJORAXIS*(1.0-e*e)/value;}

function calc_c1(lat1){var value,e2;e2=SecondEccentricity();value=e2*Math.cos(lat1);return value*value;}

function calc_e1(){var value;value=1.0-Math.sqrt(1.0-Math.pow(ELLIPSOID_ECCENTRICITY,2));return value/(1.0+Math.sqrt(1.0-Math.pow(ELLIPSOID_ECCENTRICITY,2)));}

function calc_M1(north){var value,M0;M0=calc_M(CnvDegToRad(PROJ_NATURALORIGINLATITUDE));return(M0+(north-PROJ_FALSENORTHINGS)/PROJ_SCALEFACTOR);}

function calc_u1(M1){var value,e;e=ELLIPSOID_ECCENTRICITY;value=ELLIPSOID_SEMIMAJORAXIS*(1.0-(e*e/4.0)-(3.0*Math.pow(e,4)/64.0)-(5.0*Math.pow(e,6)/256.0));return M1/value;}

function calc_lat1(u1,e1){var value;value=u1+((3.0*e1/2.0)-27.0*e1*e1/32.0)*Math.sin(2.0*u1);value=value+((21.0*e1*e1/16.0)-55.0*Math.pow(e1,4.0)/32.0)*Math.sin(4.0*u1);value=value+(151.0*Math.pow(e1,3)/96.0)*Math.sin(6.0*u1);value=value+(1097.0*Math.pow(e1,4)/512.0)*Math.sin(8.0*u1);return value;}


//write(CnvEN2LL(28968.103, 33560.969, 5));
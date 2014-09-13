
// var files = [
// 	"js/collections/Bus.js",
// 	"js/models/BufferLoader.js",
// 	"js/models/Track.js",
// 	"js/views/BusView.js",
// 	"js/views/TrackView",
// 	"js/router.js"
// ];
// $.each(files, function(key, value){
// 	$.getScript( value, function(){
// 		console.log(value);
// 	} );
// });




$(function(){
	
	MixerApp.start();

	var track1 = new Track({name: "drums", id:"1", src:"audio/drums.mp3"});
	var track2 = new Track({name: "bass", id:"2", src:"audio/bass.mp3"});
	var track3 = new Track({name: "piano", id:"3", src:"audio/Boesendorfer.mp3"});
	var track4 = new Track({name: "brass", id:"4", src:"audio/Brass.mp3"});
	var track5 = new Track({name: "guitar", id:"5", src:"audio/BigDelays.mp3"});


	MixerApp.bus.add([track1, track2, track3, track4, track5]);

	MixerApp.busView.start();

	MixerApp.busView.render();


	// var busView = new BusView({
	// 	collection: bus,
	// 	el: $('.mixerDesk')
	// });

	// var router = new Router();
	// var mixerApp = new MixerApp();
	
	// router.on('route:home', function(){
	// mixerApp.on('route:home', function(){
	// 		busView.render();
	// });




	// mixerApp.on('route:home', function(){
	// 	mixerApp.home();
	// });


});




/* Utils */

$.fn.exists = function () {
	return this.length !== 0;
}


function moveFaderTo(fader, position){
	var id = fader.attr('id');
	var maxTop =  fader.parent().height()-fader.height();
	var newPosition = parseInt(position*maxTop);
	var perOne = newPosition/maxTop;
	fader.css('bottom', newPosition);
//    changeOpacity($('#'+id+'.span.mixer'), perOne);
}




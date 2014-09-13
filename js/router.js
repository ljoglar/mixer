

// var Router = Backbone.Router.extend({
// 	   routes: {
// 		   '': 'home'
// 	   }
// });

// var MixerApp = new ( 

var MixerApp = new( Backbone.Router.extend({
	routes: {
	   '': 'home'
	},
	initialize: function(){
		this.bus = new Bus();
		this.busView = new BusView({
			collection: this.bus,
			el: $('.mixerDesk')
		});
		// this.busView.render();
	},
	start: function(){
		Backbone.history.start();
		// Backbone.history.start({pushState:true});
	},
	home: function(){
		// this.track1 = new Track({name: "drums", id:"1", src:"audio/drums.mp3"});
		// this.track2 = new Track({name: "bass", id:"2", src:"audio/bass.mp3"});
		// this.track3 = new Track({name: "piano", id:"3", src:"audio/Boesendorfer.mp3"});
		// this.track4 = new Track({name: "brass", id:"4", src:"audio/Brass.mp3"});
		// this.track5 = new Track({name: "guitar", id:"5", src:"audio/BigDelays.mp3"});

		// this.bus.add([this.track1, this.track2, this.track3, this.track4, this.track5]);

		// this.busView.render();
	}
}));

// );

/*	MixerApp.on('route:home', function(){
		MixerApp.index();
	});
*/
	// var track1 = new Track({name: "drums", id:"1", src:"audio/drums.mp3"});
	// var track2 = new Track({name: "bass", id:"2", src:"audio/bass.mp3"});
	// var track3 = new Track({name: "piano", id:"3", src:"audio/Boesendorfer.mp3"});
	// var track4 = new Track({name: "brass", id:"4", src:"audio/Brass.mp3"});
	// var track5 = new Track({name: "guitar", id:"5", src:"audio/BigDelays.mp3"});

	// var bus = new Bus([track1, track2, track3, track4, track5]);

	// var busView = new BusView({
	// 	collection: bus,
	// 	el: $('.mixerDesk')
	// });

	// var router = new Router();
	// 	router.on('route:home', function(){
	// 		busView.render();
	// });

	// Backbone.history.start();
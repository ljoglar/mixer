


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
	},
	start: function(){
		Backbone.history.start();
	},
	home: function(){

	}
}));
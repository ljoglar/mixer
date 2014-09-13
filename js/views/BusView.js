

var BusView = Backbone.View.extend({
	initialize: function(){
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		this.context = new AudioContext();
	},

	start:function(){
		this.bufferLoader = new BufferLoader({});
		this.bufferLoader.reset();
		this.collection.forEach(this.addLoaderTrack, this);
		this.bufferLoader.load();
	},
	
	addOne: function(track){
		var trackView = new TrackView({ model : track });		
		trackView.render();
		// Get Processing instance
		this.getPjsInstance(trackView);
		$('.mixerDesk ul').append(trackView.el);
	},

	addLoaderTrack: function(track){
		var loaderTrack = new LoaderTrack({id: track.attributes.id, context: this.context, url:track.attributes.src});
		this.bufferLoader.add(loaderTrack);
	},
	
	render:function(){
		this.$el.empty();
		
		var template = _.template($('#mixer-template').html(), {});
		this.$el.html(template);
		
		this.collection.forEach(this.addOne, this);

	},

	events:{
		'click .audioApiPlay': 'playBufferList',
		'click .btn.mute': 'toogleMute',
		'click .btn.solo': 'toogleSolo',
		'mousedown .faderChannel': 'changeGainTrack'
	},

	playBufferList: function(){
		this.bufferLoader.forEach(function(loaderTrack){
			loaderTrack.attributes.src = this.context.createBufferSource();
			loaderTrack.attributes.gainNode = this.context.createGain();

			loaderTrack.attributes.src.buffer =  loaderTrack.attributes.buffer;

			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(this.context.destination);

			var id = loaderTrack.attributes.id -1;
			loaderTrack.attributes.gainNode.gain.value = this.collection.models[id].attributes.gain;
			loaderTrack.attributes.src.start(0);

			this.collection.models[id].attributes.isSolo = false;
			this.collection.models[id].attributes.isMuted = false;

		}, this);
	},

	getPjsInstance: function(trackView){
		var done = trackView.getPjsInstance();
		while(!done){
			setTimeout(function(){
				done = trackView.getPjsInstance();
			}.bind(trackView), 250);
			done = true;                                //hardCoded!! -> so we
		}
		console.log(trackView.model.attributes);
	},


	processSolos: function(context){
		var anySolo  = _.find(this.collection.models, function(track){
			if(track.attributes.isSolo)	return true;
		});

		if (anySolo){
			this.collection.models.forEach(function(track){
				var id = track.attributes.id - 1;
				this.bufferLoader.models[id].attributes.gainNode.gain.value = (track.attributes.isSolo) ? track.attributes.gain : 0;
			}, this);
		}
		else{
			this.collection.models.forEach(function(track){
				var id = track.attributes.id - 1;
				this.bufferLoader.models[id].attributes.gainNode.gain.value = track.attributes.gain;
			}, this);
		}
	},
	
	toogleSolo: function(context){
	},
	toogleMute: function(context){
	},


// DEPRECATED!!!

	setFaderPosition: function(fader){
		position = 0.5;
		moveFaderTo(fader, position);
		this.collection.models[id].attributes.gain = position;
	},

	setGainValue: function (context, value, mute){
		// value = typeof value !== 'undefined' ? value : false;
		// mute = typeof mute !== 'undefined' ? mute : false;

		// that = this;
		// isMouseDown = true;
		// id = context.currentTarget.id -1;

		// if(mute){
		// 	that.bufferLoader.attributes.gainNodeArray[id].gain.value = 0;
		// }
		// else if(value){
		// 	that.bufferLoader.attributes.gainNodeArray[id].gain.value = value;
		// }
		// else{
		// 	that.bufferLoader.attributes.gainNodeArray[id].gain.value = that.collection.models[id].attributes.gain;
		// }

	},

	changeGainTrack: function(context){					
		that = this;
		isMouseDown = true;
		id = context.currentTarget.id -1;
		isMouseIn = false;
		// $(window).mousemove(function(e) {

		// this.$el.find(".faderChannel").mousedown(function(){
			// console.log(this.$el.find(".faderChannel#"+id));
			// console.log(context.currentTarget);
			// console.log(context);
		// });
		
		this.$el.find(".faderChannel#"+context.currentTarget.id).mousemove(function(){
			if(isMouseDown){
				// console.log("AHORAAAA!!!");
			}
		}).mouseup(function() {
			// console.log("up!");
			isMouseDown = false;
		});

		// this.$el.mouseenter(function(){
		// 		isMouseIn = true;
				
		// 		if(isMouseDown && isMouseIn){
		// 			console.log("ifMouseDown");
		// 			if(that.bufferLoader.attributes.gainNodeArray[id]){
		// 			console.log("ifNode");
		// 				that.bufferLoader.attributes.gainNodeArray[id].gain.value = that.collection.models[id].attributes.gain;
		// 			}
		// 		}

		// }).mouseleave(function(){
		// 		isMouseIn = false;
		// });



		// this.$el.mousemove(function(e) {
		// 	console.log("mouse");

		// 	if(that.$el.find(".faderChannel").hover() ){
		// 		console.log("mouseover");
				
		// 		if(isMouseDown){
		// 			console.log("ifMouseDown");
		// 			if(that.bufferLoader.attributes.gainNodeArray[id]){
		// 			console.log("ifNode");
		// 				that.bufferLoader.attributes.gainNodeArray[id].gain.value = that.collection.models[id].attributes.gain;
		// 			}
		// 		}
		// 	}

		// }).mouseup(function() {
		// 	isMouseDown = false;
		// });
	}

});
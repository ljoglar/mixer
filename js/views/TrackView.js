

var TrackView = Backbone.View.extend({
	tagName: "li",
	className: "channelMixer track",
//            defaults: {
//                pjs: undefined
//            },
	initialize: function(){
               // pjs = Processing.getInstanceById('number'+this.model.attributes.id);
//                var pjs;
               // this.getPjsInstance();
	},

	render: function(){
		var template = _.template($('#track-template').html(), {track:this.model.toJSON()});
		this.$el.html(template);
		// return this;
	},

	events: {
//                'click .btn.mute': 'getPjsInstance',
		'mousedown .faderChannel':'moveFader',
		'click .btn.mute': 'toggleMute',
		'click .btn.solo': 'toggleSolo',
		'click #filterOn' : 'toggleFilter',
		'input #frequency' : 'changeFrequency',
		'input #gain' : 'changeGain',
		'input #Q' : 'changeQ'
	},

	moveFader: function(e) {
		var that = this;
		var fader = this.$('.faderChannel');
		var id = fader[0].id;
		var isMouseDown = false;
		var initialMouseY = 0;
		var initialFaderY = 0;

		initialMouseY = e.clientY;
		initialFaderY = fader.css('bottom');
		isMouseDown = true;

		// $(window).mousemove(function(e) {
		fader.mousemove(function(e) {
			if(isMouseDown){
				// calculate new position (Y)
				var id = that.model.attributes.id - 1;
				var newY = parseInt(initialFaderY) - (e.clientY - initialMouseY);
				//stay in parent
				var maxTop =  fader.parent().height()-fader.height();
				newY = newY<0?0:newY>maxTop?maxTop:newY;

				var perOne = newY/maxTop;

				that.model.attributes.gain = perOne;
				fader.css('bottom', newY );
				that.model.attributes.gainView.changeNumber(that.model.attributes.gain);

				if(!that.model.attributes.isMuted){
					MixerApp.busView.bufferLoader.models[id].attributes.gainNode.gain.value = that.model.attributes.gain;		// is correct doing it here?
				}

			}
		}).mouseup(function() {
			isMouseDown = false;
		});
	},

	toggleSolo: function(context){
		this.$el.toggleClass("soloActive");

		this.model.attributes.isSolo = !this.model.attributes.isSolo;

		MixerApp.busView.processSolos();

//                console.log("this");
//                console.log(this);
//                console.log(this.model.collection);
//                
//                this.model.collection.each(function(track){
//                    console.log(track);
//                    console.log(track.$el);
//                });
//                
//                this.model.collection.toggleSolo();
		
	},

	toggleMute: function(context){
		var id = this.model.attributes.id - 1;
		this.model.attributes.isMuted = !this.model.attributes.isMuted;

		MixerApp.busView.bufferLoader.models[id].attributes.gainNode.gain.value  = (this.model.attributes.isMuted)? 0 : this.model.attributes.gain;
		// this.$el.toggleClass("muteActive");
	},

	toggleFilter: function(context){
		var isChecked = context.currentTarget.checked;
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		if(loaderTrack.attributes.filterNode === undefined){
			loaderTrack.attributes.filterNode = MixerApp.busView.context.createBiquadFilter();
			loaderTrack.attributes.filterNode.type = 5; //peaking
			loaderTrack.attributes.filterNode.frequency.value = 440;
			loaderTrack.attributes.filterNode.gain.value = 6;
			loaderTrack.attributes.filterNode.Q.value = 1;
		}

		if(isChecked){
			loaderTrack.attributes.src.connect(loaderTrack.attributes.filterNode);
			loaderTrack.attributes.filterNode.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}else{
			loaderTrack.attributes.src.disconnect(0);
			loaderTrack.attributes.filterNode.disconnect(0);
			loaderTrack.attributes.gainNode.disconnect(0);

			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}
	},

	changeFrequency: function(context){
		var id = this.model.attributes.id - 1;
		var f = context.currentTarget.value*20000 + 20;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		MixerApp.busView.collection.models[id].attributes.eqView.changeFrequency(f);
		loaderTrack.attributes.filterNode.frequency.value = f;
	},
	
	changeGain: function(context){
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		MixerApp.busView.collection.models[id].attributes.eqView.changeGain(context.currentTarget.value);
		loaderTrack.attributes.filterNode.gain.value = context.currentTarget.value;
	},
	
	changeQ: function(context){
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		MixerApp.busView.collection.models[id].attributes.eqView.changeQ(context.currentTarget.value);
		loaderTrack.attributes.filterNode.Q.value = context.currentTarget.value;
	},

	getPjsInstance: function(type) {
		var id = this.model.attributes.id;
		switch(type){
			case "number":
			console.log("num");
				if(Processing.getInstanceById('number'+id) != undefined){
					this.model.attributes.gainView = Processing.getInstanceById('number'+id);
		//			return true;
				}
		//		else{
		//			return false;
		//		}
				break;
			case "eq":
			console.log("eq");
				if(Processing.getInstanceById('number'+id) != undefined){
					this.model.attributes.eqView = Processing.getInstanceById('eq'+id);
		//			return true;
				}
		//		else{
		//			return false;
		//		}
				break;
		}

	}
});
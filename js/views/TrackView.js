

var TrackView = Backbone.View.extend({
	tagName: "li",
	className: "channelMixer track",
//            defaults: {
//                pjs: undefined
//            },
	initialize: function(){
	},

	render: function(){
		var template = _.template($('#track-template').html(), {track:this.model.toJSON()});
		this.$el.html(template);
	},

	events: {
//      'click .btn.mute': 'getPjsInstance',
		'mousedown .faderChannel':'moveFader',
		'click .btn.mute': 'toggleMute',
		'click .btn.solo': 'toggleSolo',
		'click #filterOn' : 'toggleFilter',
		'input #frequency' : 'changeFrequency',
		'input #gain' : 'changeGain',
		'input #Q' : 'changeQ',
		'click #delayOn' : 'toggleDelay',
		'input #time' : 'changeTimeDelay',
		'input #feedback' : 'changeFeedbackDelay',
		'click .synthOscillator.type input': 'changeOscType',
		'mousedown canvas' : 'canvasClick',
		'click li#noiseConv a': 'selectNoiseConv',
		'input #noiseSec' : 'changeNoiseSec',
		'click li#bitCrusher a': 'selectBitCrusher',
		'click li#reverb a': 'selectReverb',
		'click #FXOn' : 'toggleFX',
		'click .reverbInput' : 'changeImpulse',
		'input #pan' : 'changePanPosition'
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
				// that.model.attributes.gainView.changeNumber(that.model.attributes.gain);

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

	toggleDelay: function(context){
		var isChecked = context.currentTarget.checked;
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		if(loaderTrack.attributes.delayNode === undefined){
			loaderTrack.attributes.delayNode = MixerApp.busView.context.createDelay();
			loaderTrack.attributes.delayNode.delayTime.value = this.model.attributes.delayTime;


			loaderTrack.attributes.feedbackNode = MixerApp.busView.context.createGain();
			loaderTrack.attributes.feedbackNode.gain.value = this.model.attributes.feedback;
		}
		if(isChecked){
			loaderTrack.attributes.delayNode.connect(loaderTrack.attributes.feedbackNode);
			loaderTrack.attributes.feedbackNode.connect(loaderTrack.attributes.delayNode);
			loaderTrack.attributes.src.connect(loaderTrack.attributes.delayNode);
			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.delayNode.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}else{
			// loaderTrack.attributes.src.disconnect(0);
			loaderTrack.attributes.delayNode.disconnect(0);
			loaderTrack.attributes.feedbackNode.disconnect(0);
			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}
	},
	
	changeTimeDelay: function(context){
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		this.model.attributes.delayTime = context.currentTarget.value;
		loaderTrack.attributes.delayNode.delayTime.value = context.currentTarget.value;
	},
	
	changeFeedbackDelay: function(context){
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];

		this.model.attributes.feedback = context.currentTarget.value;
		loaderTrack.attributes.feedbackNode.gain.value = context.currentTarget.value;
	},

	changeOscType: function(context){
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];
		this.model.attributes.type = context.currentTarget.value;
		loaderTrack.attributes.src.type = context.currentTarget.value;
	},

	getPjsInstance: function(type) {
		var id = this.model.attributes.id;
		switch(type){
			case "number":
				if(Processing.getInstanceById('number'+id) != undefined){
					this.model.attributes.gainView = Processing.getInstanceById('number'+id);
				}
				break;
			case "eq":
				if(Processing.getInstanceById('number'+id) != undefined){
					this.model.attributes.eqView = Processing.getInstanceById('eq'+id);
				}
				break;
			case "synth":
				console.log("instanceSynth");
				this.model.attributes.synthEl = document.getElementById("synthCanvas"+this.model.attributes.id);
				if(this.model.attributes.synthEl){
					this.model.attributes.synthView = this.model.attributes.synthEl.getContext("2d");
					if(!this.model.attributes.shapes){
						this.model.attributes.shapes = new Array();
					}
					this.drawScreen();
				}
				break;
		}
	},
	
	drawScreen: function() {
		//bg
		if(this.model.attributes.synthView){
			this.model.attributes.synthView.fillStyle = "#000000";
			this.model.attributes.synthView.fillRect(0,0,this.model.attributes.synthEl.width,this.model.attributes.synthEl.height);
		}

		if(this.model.attributes.shapes){
			var numShapes = this.model.attributes.shapes.length;
			for (var i=0; i < numShapes; i++){
				this.model.attributes.synthView.fillStyle = this.model.attributes.shapes[i].color;
				// A path is a series of commands (moveTo, lineTo, arc etc) that define the
				// boundary of a vector shape

				this.model.attributes.synthView.beginPath();
				this.model.attributes.synthView.fillRect(this.model.attributes.shapes[i].x,this.model.attributes.shapes[i].y,30,20); // top x, top y, size x, size y
				this.model.attributes.synthView.closePath();
			}
		}

	},
	
	newNote: function(mouseX, mouseY){
		var tempX;
		var tempY;
		var tempR;
		var tempG;
		var tempB;
		var tempColor;
		var tempOsc;

		var bRect = this.model.attributes.synthEl.getBoundingClientRect();

		var tempXsize = 30;
		var tempYsize = 20;
		tempX = mouseX;
		tempY = mouseY;
		tempR = Math.floor(Math.random()*255); // Set up the colour (Again, random!)
		tempG = Math.floor(Math.random()*255);
		tempB = Math.floor(Math.random()*255);
		tempColor = "rgb(" + tempR + "," + tempG + "," + tempB +")";
		var tempShape = {x:tempX, y:tempY, color:tempColor}; // Object member name:value

		this.model.attributes.shapes.push(tempShape); // Create an extra array element and add tempShape to it

		this.drawScreen();
	},

	canvasClick: function(e){
		var bRect = this.model.attributes.synthEl.getBoundingClientRect();
		var mouseX = e.clientX - bRect.left;
		var mouseY = e.clientY - bRect.top;
		var hit = false;
		var shapesIndex = 0;

		if(this.model.attributes.shapes.length){
			var numShapes = this.model.attributes.shapes.length;
			for (i=0; i < numShapes; i++) { // Remember the higher indexes are shapes 'on top'
				if	(this.hitTest(this.model.attributes.shapes[i], mouseX, mouseY)) {
					console.log("hit!");
					hit = true;
					shapesIndex = i;
					$(this.model.attributes.synthEl).css( 'cursor', 'all-scroll' );
					this.moveShape(this.model.attributes.shapes[i]);
				}
			}
		}
		if(!hit){
			console.log(this);
			this.newNote(mouseX, mouseY);
		}
	},
		
	moveShape: function(shape){
		console.log("moveShape");
		var that = this;
		var bRect = this.model.attributes.synthEl.getBoundingClientRect();
		var el = $(this.model.attributes.synthEl);
		var isMouseDown = true;

		el.mousemove(function(e){
			if(isMouseDown){
				var mouseX = e.clientX - bRect.left;
				var mouseY = e.clientY - bRect.top;
				if(shape.x != mouseX || shape.y != mouseY){	
					shape.x = mouseX;
					shape.y = mouseY;
				}
				that.drawScreen();
			}
		}).mouseup(function(e) {
			el.css( 'cursor', 'default' );
			isMouseDown = false;
		});
	},

	hitTest: function(shape,mousex,mousey) {
		var hitit;

		if (((mousex>=shape.x)&&(mousex<=shape.x+30))&&((mousey>=shape.y)&&(mousey<=shape.y+20))){
			hitit=true;
		}
		else{
			hitit=false;
		}	
		return (hitit);
	},

	selectNoiseConv: function(context){
		var buttonDiv = $(context.currentTarget).parents()[2],
			buttonNameDiv = $(buttonDiv).children()[0],
			id = $(buttonNameDiv).attr("id"),
			channelMixer = $(context.currentTarget).parents()[3],
			inputFXOn = $(channelMixer).children()[2];
		
		$(buttonNameDiv).html('nConv');
		$(buttonNameDiv).attr("data-target", '#noiseConv'+id);
		$(inputFXOn).attr("target", 'noiseConv');
	},

	selectBitCrusher: function(context){
		var buttonDiv = $(context.currentTarget).parents()[2],
			buttonNameDiv = $(buttonDiv).children()[0],
			id = $(buttonNameDiv).attr("id"),
			channelMixer = $(context.currentTarget).parents()[3],
			inputFXOn = $(channelMixer).children()[2];

		$(buttonNameDiv).html('bCrush');
		$(buttonNameDiv).attr("data-target", '#bitCrusher'+id);
		$(inputFXOn).attr("target", 'bitCrusher');
	},

	selectReverb: function(context){
		var buttonDiv = $(context.currentTarget).parents()[2],
			buttonNameDiv = $(buttonDiv).children()[0],
			id = $(buttonNameDiv).attr("id");
			channelMixer = $(context.currentTarget).parents()[3],
			inputFXOn = $(channelMixer).children()[2];
		
		$(buttonNameDiv).html('reverb');
		$(buttonNameDiv).attr("data-target", '#reverb'+id);
		$(inputFXOn).attr("target", 'reverb');
		
		this.loadImpulseBuffer(MixerApp.busView.bufferLoader.models[id-1]);
	},

	toggleFX:function(context){
		var isChecked = context.currentTarget.checked,
			id = this.model.attributes.id - 1,
			loaderTrack = MixerApp.busView.bufferLoader.models[id],
			target = $(context.currentTarget).attr("target");

		if(target == "noiseConv"){
			this.toggleNoiseConvolver(isChecked, loaderTrack);
		}
		else if(target == "bitCrusher"){
			this.toggleBitCrusher(isChecked, loaderTrack);
		}
		else if(target == "reverb"){
			this.toggleConvReverb(isChecked, loaderTrack);
		}
		
	},
	
	createBitCrusher:function(){
		var bufferSize = 4096;
		var effect = (function() {
		    var node = MixerApp.busView.context.createScriptProcessor(bufferSize, 1, 1);
		    node.bits = 4; // between 1 and 16
		    node.normfreq = 0.1; // between 0.0 and 1.0
		    var step = Math.pow(1/2, node.bits);
		    var phaser = 0;
		    var last = 0;
		    node.onaudioprocess = function(e) {
		        var input = e.inputBuffer.getChannelData(0);
		        var output = e.outputBuffer.getChannelData(0);
		        for (var i = 0; i < bufferSize; i++) {
		            phaser += node.normfreq;
		            if (phaser >= 1.0) {
		                phaser -= 1.0;
		                last = step * Math.floor(input[i] / step + 0.5);
		            }
		            output[i] = last;
		        }
		    };
		    console.log(node);
		    return node;
		})();
	    return effect;
	},

	toggleBitCrusher: function(isChecked, loaderTrack){
		if(loaderTrack.attributes.bitCrusherNode === undefined){
			loaderTrack.attributes.bitCrusherNode = this.createBitCrusher();
			//set parameters (now hard coded in create BitCrusher);
		}
		if(isChecked){
			loaderTrack.attributes.src.connect(loaderTrack.attributes.bitCrusherNode);
			loaderTrack.attributes.bitCrusherNode.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}else{
			loaderTrack.attributes.bitCrusherNode.disconnect(0);
			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}
	},

	createConvReverb:function(loaderTrack){
		var bufferSize = 4096;
		var audioContext = MixerApp.busView.context,
			id = this.model.attributes.id - 1,
			loaderTrack = MixerApp.busView.bufferLoader.models[id];

		var impulseNum = this.model.attributes.impulse;

	    var effect = (function() {
		    var convolver = audioContext.createConvolver();
			loaderTrack.attributes.impulseBuffer.models[impulseNum].attributes.src = audioContext.createBufferSource();
			loaderTrack.attributes.impulseBuffer.models[impulseNum].attributes.src.buffer = loaderTrack.attributes.impulseBuffer.models[impulseNum].attributes.buffer;
		    console.log(loaderTrack.attributes.impulseBuffer.models[impulseNum].attributes.src.buffer);
		    convolver.buffer = loaderTrack.attributes.impulseBuffer.models[impulseNum].attributes.src.buffer;
		    return convolver;
		})();
	    return effect;
	},

	loadImpulseBuffer: function(loaderTrack){
			var audioContext = MixerApp.busView.context;

			var impulseTrack1 = new LoaderTrack({id: 0, context: audioContext, url:"audio/rev1.mp3"}),
		        impulseTrack2 = new LoaderTrack({id: 1, context: audioContext, url:"audio/rev15.mp3"}),
		        impulseTrack3 = new LoaderTrack({id: 2, context: audioContext, url:"audio/rev3.mp3"}),
		        impulseTrack4 = new LoaderTrack({id: 3, context: audioContext, url:"audio/spring.mp3"}),
		        impulseTrack5 = new LoaderTrack({id: 4, context: audioContext, url:"audio/vinyl.mp3"}),
		        impulseTrack6 = new LoaderTrack({id: 5, context: audioContext, url:"audio/stairway.mp3"});

	        loaderTrack.attributes.impulseBuffer = new BufferLoader([impulseTrack1, impulseTrack2, impulseTrack3, impulseTrack4, impulseTrack5, impulseTrack6]);
	        loaderTrack.attributes.impulseBuffer.load();

	},
	
	toggleConvReverb: function(isChecked, loaderTrack){
		if(loaderTrack.attributes.convReverbNode === undefined){
			var audioContext = MixerApp.busView.context;
			loaderTrack.attributes.convReverbNode = this.createConvReverb();
		}
		if(isChecked){
			loaderTrack.attributes.src.connect(loaderTrack.attributes.convReverbNode);
			loaderTrack.attributes.convReverbNode.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}else{
			loaderTrack.attributes.convReverbNode.disconnect(0);
			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}
	},

	changeImpulse:function(context){
		this.model.attributes.impulse = context.currentTarget.value;
		this.createConvReverb();
	},

	createNoiseConvolver:function(){
		var bufferSize = 4096;
		var audioContext = MixerApp.busView.context;
		var noiseSec = this.model.attributes.noiseSec;
	    var effect = (function() {
		    var convolver = audioContext.createConvolver(),
		        noiseBuffer = audioContext.createBuffer(2, noiseSec * audioContext.sampleRate, audioContext.sampleRate),
		        left = noiseBuffer.getChannelData(0),
		        right = noiseBuffer.getChannelData(1);
		    for (var i = 0; i < noiseBuffer.length; i++) {
		        left[i] = Math.random() * 2 - 1;
		        right[i] = Math.random() * 2 - 1;
		    }
		    convolver.buffer = noiseBuffer;
		    return convolver;
		})();
	    return effect;
	},

	toggleNoiseConvolver: function(isChecked, loaderTrack){
		if(loaderTrack.attributes.noiseConvolverNode === undefined){
			loaderTrack.attributes.noiseConvolverNode = this.createNoiseConvolver();
		}
		if(isChecked){
			loaderTrack.attributes.src.connect(loaderTrack.attributes.noiseConvolverNode);
			loaderTrack.attributes.noiseConvolverNode.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}else{
			loaderTrack.attributes.noiseConvolverNode.disconnect(0);
			loaderTrack.attributes.src.connect(loaderTrack.attributes.gainNode);
			loaderTrack.attributes.gainNode.connect(MixerApp.busView.context.destination);
		}
	},

	changeNoiseSec:function(context){
		var id = this.model.attributes.id - 1;
		var loaderTrack = MixerApp.busView.bufferLoader.models[id];
		var isChecked = $("#FXOn"+id)[0].checked;
		this.model.attributes.noiseSec = context.currentTarget.value;

		if(isChecked){
			this.createNoiseConvolver();
			this.toggleNoiseConvolver(isChecked, loaderTrack);
		}
	},

	changePanPosition: function(context){
		var id = this.model.attributes.id - 1;

		this.model.attributes.pan = context.currentTarget.value;
		MixerApp.busView.bufferLoader.models[id].attributes.panNode.pan.value = this.model.attributes.pan;

	}

});
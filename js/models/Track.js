


var Track = Backbone.Model.extend({
	defaults:{
		name: "Empty Track",
		id: 1,
		src: undefined,
		gain: 0.5,
		gainView: undefined,	//processing instance for number
		eqView: undefined,		//processing instance for eq graph
		isMuted: false,
		isSolo: false,
		delayTime:0.5,
		feedback:0.5,
		noiseSec: 0.7,
		impulse: 0,
		pan: 0.5,

		// Midi parameters
		isMidi: false,
		synth: undefined,
		synthView:undefined,
		synthEl:undefined,
		notes: new Array(),
		shapes: undefined,
		freq: 440,
		type:"sine"
	}
});
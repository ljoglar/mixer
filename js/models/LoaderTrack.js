	
var LoaderTrack = Backbone.Model.extend({
	defaults:{
		id: 1,
		url: "",
		context: "",
		src: "",
		// oscNode: undefined,
		buffer: undefined,
		freq: 440,
		type:"sine",
		gainNode: undefined,
		filterNode:undefined,
		delayNode:undefined,
		feedbackNode:undefined,
		bitCrusherNode:undefined,
		noiseConvolverNode:undefined,
		reverbNode:undefined,
		impulseBuffer: undefined,
		panNode:undefined
	},
});
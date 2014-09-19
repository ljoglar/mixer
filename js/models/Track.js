


var Track = Backbone.Model.extend({
	defaults:{
		name: "Empty Track",
		id: 1,
		src: "",
		gain: 0.75,
		gainView: undefined,	//processing instance for number
		eqView: undefined,		//processing instance for eq graph
		isMuted: false,
		isSolo: false
	}
});
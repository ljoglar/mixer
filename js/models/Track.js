


var Track = Backbone.Model.extend({
	defaults:{
		name: "Empty Track",
		id: 1,
		src: "",
		gain: 0.75,
		gainView: undefined,
		isMuted: false,
		isSolo: false
	}
});
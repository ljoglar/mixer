
var BufferLoader = Backbone.Collection.extend({
	


	load: function(){
		this.models.forEach(this.loadBuffer, this);

		// for (var i = 0; i < this.attributes.urlList.length; ++i)			//Each
		// this.loadBuffer(this.attributes.urlList[i], i);
	},
	// loadBuffer: function(url, index){
	loadBuffer: function(loaderTrack){
		// Load buffer asynchronously
		var that = this;
		var request = new XMLHttpRequest();
		var url = loaderTrack.attributes.url;

		request.open("GET", url, true);
		request.responseType = "arraybuffer";

		// var loader = this.attributes;
		request.onload = function() {
			// Asynchronously decode the audio file data in request.response
			
			// loader.context.decodeAudioData(
			loaderTrack.attributes.context.decodeAudioData(
				request.response,
				function(buffer) {
					if (!buffer) {
						alert('error decoding file data: ' + url);
						return;
					}
					// loader.bufferList[index] = buffer;
					loaderTrack.attributes.buffer = buffer;
					// if (++loader.loadCount == loader.urlList.length)
						that.finishedLoading(url);
				},
				function(error) {
					console.error('decodeAudioData error', error);
				}
			);
		};
		request.onerror = function() {
		alert('BufferLoader: XHR error');
		};
		request.send();
	},
	finishedLoading: function(loaderTrackUrl) {
		console.log("Finished Loading: " + loaderTrackUrl);
	}
})
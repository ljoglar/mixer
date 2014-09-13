	
var LoaderTrack = Backbone.Model.extend({
	defaults:{
		// context: "",
		// urlList: new Array(),
		// bufferList: new Array(),
		// loadCount: 0,
		// sourceArray: new Array(),
		// gainNodeArray: new Array()
		id: 1,
		url: "",
		context: "",
		src: "",
		buffer: undefined,
		gainNode: undefined,
		filterNode:undefined
	},
	// load: function(){
	// 	for (var i = 0; i < this.attributes.urlList.length; ++i)			//Each
	// 	this.loadBuffer(this.attributes.urlList[i], i);
	// },
	// loadBuffer: function(url, index){
	// 	// Load buffer asynchronously
	// 	var that = this;
	// 	var request = new XMLHttpRequest();
	// 	request.open("GET", url, true);
	// 	request.responseType = "arraybuffer";

	// 	var loader = this.attributes;

	// 	request.onload = function() {
	// 		// Asynchronously decode the audio file data in request.response
	// 		loader.context.decodeAudioData(
	// 			request.response,
	// 			function(buffer) {
	// 				if (!buffer) {
	// 					alert('error decoding file data: ' + url);
	// 					return;
	// 				}
	// 				loader.bufferList[index] = buffer;
	// 				if (++loader.loadCount == loader.urlList.length)
	// 					that.finishedLoading(loader.bufferList);
	// 			},
	// 			function(error) {
	// 				console.error('decodeAudioData error', error);
	// 			}
	// 		);
	// 	};
	// 	request.onerror = function() {
	// 	alert('BufferLoader: XHR error');
	// 	};
	// 	request.send();
	// },
	// finishedLoading: function(bufferList) {
	// 	console.log("Finished Loading");
	// }
});
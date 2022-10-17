var tracks = new Array();

$(function(){
	
	MixerApp.start();

	tracks[0] = new Track({name: "drums", id:tracks.length+1, src:"audio/drums.mp3"});
	tracks[1] = new Track({name: "bass", id:tracks.length+1, src:"audio/bass.mp3"});
	tracks[2] = new Track({name: "piano", id:tracks.length+1, src:"audio/Boesendorfer.mp3"});
	tracks[3] = new Track({name: "brass", id:tracks.length+1, src:"audio/Brass.mp3"});
	tracks[4] = new Track({name: "guitar", id:tracks.length+1, src:"audio/BigDelays.mp3"});

	tracks.forEach(function(track){
		MixerApp.bus.add([track]);
	});


	MixerApp.busView.start();

	MixerApp.busView.render();

	$(".list-group-item").click(function(){
		$(".list-group-item").removeClass("active");
		$(this).addClass("active");
	});

});

/* Utils */

$.fn.exists = function () {
	return this.length !== 0;
}


function moveFaderTo(fader, position){
	var id = fader.attr('id');
	var maxTop =  fader.parent().height()-fader.height();
	var newPosition = parseInt(position*maxTop);
	var perOne = newPosition/maxTop;
	fader.css('bottom', newPosition);
}

function newTrack(){
	$('#addTrackModal').modal('hide');
	var id = "";

	switch($(".tabTrackModal.active").attr('option')){
		case "audioTab":
			newAudioTrack();
			break;
		case "midiTab":
			newMidiTrack();
			console.log("midiTab");
			break;
	}

	$("#addTrackModal .modal-dialog").load("#addTrackModal .modal-dialog", function(){
		$(".list-group-item").click(function(){
			$(".list-group-item").removeClass("active");
			$(this).addClass("active");
		});
	});

}

function newAudioTrack(e){

/* Tryin to load files from computer
	// var reader = new FileReader();
	// reader.onload = function(e) {
	//   var dataURL = reader.result;
	// }
	// var fileInput = $("#files");
	// var file = fileInput[0].files[0];
	// reader.readAsDataURL(file);
	// if($("#files")[0].value){
	// 	console.log("try");
	// 	tracks.push(new Track({name: "upload"+tracks.length+1, id:tracks.length+1, src:reader.result}));
	// }
	// else{
	// }

*/

	if($(".collapse.in").attr("id") == "collapseSample"){
		id = $(".list-group-item.active").attr('id');
		switch(id){
			case "guitar":
				tracks.push(new Track({name: "guitar", id:tracks.length+1, src:"audio/BigDelays.mp3"}));
				break;
			case "bass":
				tracks.push(new Track({name: "bass", id:tracks.length+1, src:"audio/bass.mp3"}));
				break;
			case "drums":
				tracks.push(new Track({name: "drums", id:tracks.length+1, src:"audio/drums.mp3"}));
				break;
			case "piano":
				tracks.push(new Track({name: "piano", id:tracks.length+1, src:"audio/Boesendorfer.mp3"}));
				break;
			case "brass":
				tracks.push(new Track({name: "brass", id:tracks.length+1, src:"audio/Brass.mp3"}));
				break;
		}
	}
	
	MixerApp.bus.add([tracks[tracks.length-1]]);
	MixerApp.busView.start();
	MixerApp.busView.render();
}

function newMidiTrack(){

	tracks.push(new Track({name: "synth", id:tracks.length+1, isMidi:true}));
	
	MixerApp.bus.add([tracks[tracks.length-1]]);
	MixerApp.busView.start();
	MixerApp.busView.render();
}











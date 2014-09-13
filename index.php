<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
	<head>
		<title>Audio Mixer</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<link rel="icon" type="image/png" href="img/fader30px.png">
		
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<!-- <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">      --> 
		<link rel="stylesheet" href="css/mixer.css">
		
		<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Shadows+Into+Light+Two" />
		<!-- // <script data-main="js/main" src="js/libs/require/require.js"></script> -->


	</head>
	<body> 
		<div class="container">
			<h1>Audio Mixer</h1>
			<hr />
			<div class="page">
				
				<div>
					<div>
						<!--<canvas data-processing-sources="pde/test.pde"></canvas>-->
						<!--<canvas id="number1" data-processing-sources="pde/number.pde"></canvas>-->
					</div>
					<div class="mixerDesk">
						<ul class="mixerTracks">

						</ul>
					</div> <!-- /mixerDesk -->
				</div>
				
				
				
			</div>
		</div>
		
		<?php
		// put your code here
		?>
		
		<script type="text/template" id="track-template">
				
				<div class="input-group">
					<input id="filterOn" type="checkbox" style="float:left; margin: 10px 5px 0 12px;">
					<button class="btn btn-xs btn-default eq" data-toggle="modal" data-target="#eq<%= track.id %>" id="<%= track.id %>" type="button">eq</button>
				</div>
				<button class="btn btn-xs btn-warning solo" id="<%= track.id %>" type="button">solo</button>
				<button class="btn btn-xs btn-success mute" id="<%= track.id %>" type="button">mute</button>
				<canvas id="number<%= track.id %>" data-processing-sources="pde/number.pde"></canvas>
				<div class="faderChannelMixer" id="<%= track.id %>">
					<div class="faderChannel" id="<%= track.id %>"></div>
					<div class="nameChannelMixer strip<%=_.random(1,4)%>"><span><%= track.name %></span></div>
				</div>
				

				<div class="modal fade" id="eq<%= track.id %>" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				  <div class="modal-dialog">
				    <div class="modal-content">
				      <div class="modal-header">
				        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				        <h4 class="modal-title" id="myModalLabel">Equalizer</h4>
				      </div>
				      <div class="modal-body">
				        <div class="eqControls">
							Filter on: <input id="filterOn" type="checkbox"></br></br>
							Frequency: <input id="frequency" type="range" min="0" max="1" step="0.01" value="1"></br>
							Gain: <input id="gain" type="range" min="-40" max="40" step="0.01" value="0"></br>
							Q: <input id="Q" type="range" min="0.0001" max="1000" step="0.01" value="1">
						</div>
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
				        <button type="button" class="btn btn-primary">Save changes</button>
				      </div>
				    </div>
				  </div>
				</div>


		</script>
		
		<script type="text/template" id="mixer-template">
			
				<button class="btn btn-sm btn-danger audioApiPlay" id="play" type="button">play</button>
					<ul class="mixerTracks">
						
					</ul>
		
		</script>
		
		<script src="js/libs/jquery.min.js"></script>
		<!-- // <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script> -->

		<script src="js/libs/underscore-min.js"></script>
		<!-- // <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script> -->

		<script src="js/libs/backbone-min.js"></script>
		<!-- // <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script> -->
		
		<script src="js/libs/processing.min.js"></script>
		<!-- // <script src="//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.8/processing.min.js"></script> -->
		

		<script src="////cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/modal.js"></script>


		<!-- Backbone files -->
		<script src="js/models/LoaderTrack.js"></script>
		<script src="js/models/Track.js"></script>

		<script src="js/collections/BufferLoader.js"></script>
		<script src="js/collections/Bus.js"></script>
		
		<script src="js/views/BusView.js"></script>
		<script src="js/views/TrackView"></script>
		
		<script src="js/router.js"></script>

		<!-- // <script src="templates/mixer-template.js"></script> -->
		<!-- // <script src="templates/track-template.js"></script> -->

		<script src="js/main.js"></script>

		<script>//
//              var pjs;
//
//              $(document).ready(function() {
//                getPjsInstance();
//              });
//
//              // obtain a reference to the processing sketch
//              function getPjsInstance() {
//                var bound = false;
//                pjs = Processing.getInstanceById('number');
//                if(pjs != null)
//                  bound = true;
//                if(!bound)
//                  setTimeout(getPjsInstance, 250);
//              }
//        </script>

	</body>
</html>



		
<script>          
		/* Others? */

		// function getPjsInstance(pjs) {
		//     
		////     console.log("hola");
		////     console.log(pjs);
		//     
		//     
		//    var bound = false;    
		//    if(Processing.getInstanceById('number') != undefined){
		//        pjs =  Processing.getInstanceById('number');
		//        bound = true;
		//    }
		//    if(!bound)
		//      setTimeout(getPjsInstance, 250);
		//}    
		//        
				
				  
		//        var Mixer = Backbone.View.extend({
		//                el: '.page',
		//                initialize: function(){
		////                    var track1 = new Track({name: "drums", src:"google.com"})
		////                    var track2 = new Track({name: "bass", src:"google.com"})
		////                    var tracks = new Tracks([track1, track2]);
		//                },
		////                render:function(tracks){
		//                render:function(){
		//                    var template = _.template($('#mixer-template').html(), {});
		////                    var template = _.template($('#mixer-template').html(), {tracks: tracks.models});
		//                    this.$el.html(template);
		////                    var that = this;
		////                    var users = new Users();
		////                    users.fetch({
		////                        success: function(){
		////                        }
		////                    })
		//                }
		//        });     
</script>

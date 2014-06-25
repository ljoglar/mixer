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
        
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">     
        <!-- mixer css --> 
        <link rel="stylesheet" href="css/mixer.css">
        
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
                
                <button class="btn btn-xs btn-warning solo" id="<%= track.id %>" type="button">solo</button>
                <button class="btn btn-xs btn-success mute" id="<%= track.id %>""type="button">mute</button>
                <canvas id="number<%= track.id %>" data-processing-sources="pde/number.pde"></canvas>
                <div class="faderChannelMixer" id="<%= track.id %>">
                    <div class="faderChannel" id="<%= track.id %>"></div>
                    <div class="nameChannelMixer"><%= track.name %></div>
                </div>
                
        </script>
        
        <script type="text/template" id="mixer-template">
            
                <button class="btn btn-sm btn-danger audioApiPlay" id="play"type="button">play</button>
                    <ul class="mixerTracks">
                        
                    </ul>
        
        </script>
        
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
        
        <script src="//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.8/processing.min.js"></script>
        
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
        
        
        <script>          

        var Track = Backbone.Model.extend({
            defaults:{
                name: "Empty Track",
                id: "1",
                src: "",
                gain: "",
                gainView: undefined
            }
        });

        var BufferLoader = Backbone.Model.extend({
            defaults:{
                context: "",
                urlList: new Array(),
                bufferList: new Array(),
                loadCount: 0,
                sourceArray: new Array(),
                gainNodeArray: new Array()
            },
            load: function(){
                for (var i = 0; i < this.attributes.urlList.length; ++i)
                this.loadBuffer(this.attributes.urlList[i], i);
            },
            loadBuffer: function(url, index){
                // Load buffer asynchronously
                var that = this;
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";

                var loader = this.attributes;

                request.onload = function() {
                    // Asynchronously decode the audio file data in request.response
                    loader.context.decodeAudioData(
                        request.response,
                        function(buffer) {
                            if (!buffer) {
                                alert('error decoding file data: ' + url);
                                return;
                            }
                            loader.bufferList[index] = buffer;
                            if (++loader.loadCount == loader.urlList.length)
                                that.finishedLoading(loader.bufferList);
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
            finishedLoading: function(bufferList) {
                console.log("Finished Loading");
            }
        });
        
        var Bus = Backbone.Collection.extend({
            model: Track,
        });

        var TrackView = Backbone.View.extend({
            tagName: "li",
            className: "channelMixer track",
//            defaults: {
//                pjs: undefined
//            },
            initialize: function(){
//                pjs = Processing.getInstanceById('number'+this.model.attributes.id);
                
//                var pjs;
//                this.getPjsInstance();

//                console.log("pjs");
//                console.log(this.model.attributes.gainView);
            },
            render:function(){
                var template = _.template($('#track-template').html(), {track:this.model.toJSON()});
                this.$el.html(template);
                return this;
            },
            events:{
//                'click .btn.mute': 'getPjsInstance',
                'mousedown':'moveFader',
//                'click .btn.mute': 'toggleMute',
                'click .btn.solo': 'toggleSolo'
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

                $(window).mousemove(function(e) {
                    if(isMouseDown){
                        // calculate new position (Y)
                        var newY = parseInt(initialFaderY) - (e.clientY - initialMouseY);
                        //stay in parent
                        var maxTop =  fader.parent().height()-fader.height();          
                        newY = newY<0?0:newY>maxTop?maxTop:newY;

                        var perOne = newY/maxTop;
                        
                        that.model.attributes.gain = perOne;
                        fader.css('bottom', newY );
//                        console.log(pjs);
                        that.model.attributes.gainView.changeNumber(that.model.attributes.gain);
                    }
                }).mouseup(function() {
                    isMouseDown = false;
                });
            },
            toggleSolo: function(context){
                this.$el.toggleClass("soloActive");

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
                this.$el.toggleClass("muteActive");
            },
            getPjsInstance: function() {
                var that = this;
                var id = that.model.attributes.id;
                  
                if(Processing.getInstanceById('number'+id) != undefined){
                    that.model.attributes.gainView = Processing.getInstanceById('number'+id);
//                    return true;
                }
//                else{
//                  return false;
//                }
            }
        });
        
        var BusView = Backbone.View.extend({
            initialize: function(){
                window.AudioContext = window.AudioContext||window.webkitAudioContext;
                context = new AudioContext();
                var bufferArray = [];

                console.log("this.el");
                console.log(this.el);

                var that = this;
                this._trackViews= [];
                this.collection.each(function(track) {
                  that._trackViews.push(new TrackView({
                    model : track
                  }));
                  bufferArray.push(track.attributes.src);
                });

                this.bufferLoader = new BufferLoader({context: context, urlList: bufferArray});
                this.bufferLoader.load();
                console.log("bufferLoader");
                console.log(this.bufferLoader);
            },
            render:function(){
                var that = this;
                
                $(this.el).empty();
                
                var template = _.template($('#mixer-template').html(), {});
                this.$el.html(template);
                
                _(this._trackViews).each(function(tv){
                    this.$('.mixerDesk ul').append(tv.render().el);
                });
                
                $('.faderChannel').each(function(id){
                    position = Math.random();
                    while (position <= 0.5){
                        position = Math.random();
                    }
                    moveFaderTo($(this), position);
                    that.collection.models[id].attributes.gain = position;
                });

                _(this._trackViews).each(function(tv){
                    var done = tv.getPjsInstance();
                    while(!done){
                        setTimeout(function(){
                            done = tv.getPjsInstance();
                        }.bind(tv), 250);
                        
                        
                        done = true;                                //hardCoded!!
                    }
                    console.log(tv.model.attributes);
                });
            },
            events:{
                'click .audioApiPlay': 'playBufferList',
                'click .btn.mute': 'toogleMute',
                'click .btn.solo': 'toogleSolo',
                'mousedown .faderChannel': 'changeGainTrack'
            },
            playBufferList: function(){
                var TrackList = this.bufferLoader.attributes.bufferList;
                for (var i=0; i< TrackList.length; i++){
                    this.bufferLoader.attributes.sourceArray[i] = context.createBufferSource(); //in initialize?
                    this.bufferLoader.attributes.gainNodeArray[i] = context.createGain();

                    this.bufferLoader.attributes.sourceArray[i].buffer = TrackList[i];

                    this.bufferLoader.attributes.sourceArray[i].connect(this.bufferLoader.attributes.gainNodeArray[i]);
                    this.bufferLoader.attributes.gainNodeArray[i].connect(context.destination);

                    this.bufferLoader.attributes.gainNodeArray[i].gain.value = this.collection.models[i].attributes.gain;
                    this.bufferLoader.attributes.sourceArray[i].start(0);
                }
            },
            changeGainTrack: function(context){
                that = this;
                isMouseDown = true;
                id = context.currentTarget.id -1;

                $(window).mousemove(function(e) {
                    if(isMouseDown){
                        if(that.bufferLoader.attributes.gainNodeArray[id]){
                            that.bufferLoader.attributes.gainNodeArray[id].gain.value = that.collection.models[id].attributes.gain;
                        }
                    }
                }).mouseup(function() {
                    isMouseDown = false;
                });
            },
            toogleSolo: function(context){
                console.log("solo");
//                
//                console.log(this.el);
//                console.log(this.$el('.channelMixer li'));
            }
        });
        
        var Router = Backbone.Router.extend({
               routes: {
                   '': 'home'
               }
        });
        
        var track1 = new Track({name: "drums", id:"1", src:"audio/drums.mp3"});
        var track2 = new Track({name: "bass", id:"2", src:"audio/bass.mp3"});
        var track3 = new Track({name: "piano", id:"3", src:"audio/Boesendorfer.mp3"});
        var track4 = new Track({name: "brass", id:"4", src:"audio/Brass.mp3"});
        var track5 = new Track({name: "guitar", id:"5", src:"audio/BigDelays.mp3"});

        var bus = new Bus([track1, track2, track3, track4, track5]);
        
        var busView = new BusView({
            collection: bus,
            el: $('.mixerDesk')
        });
        
        
        var router = new Router();
            router.on('route:home', function(){
                busView.render();
        });
        
        Backbone.history.start();














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
//    changeOpacity($('#'+id+'.span.mixer'), perOne);
}
        
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
        
    </body>
</html>







<script type="text/template" id="track-template">
		
		<button class="btn btn-xs btn-warning solo" id="<%= track.id %>" type="button">solo</button>
		<button class="btn btn-xs btn-success mute" id="<%= track.id %>" type="button">mute</button>
		<canvas id="number<%= track.id %>" data-processing-sources="pde/number.pde"></canvas>
		<div class="faderChannelMixer" id="<%= track.id %>">
			<div class="faderChannel" id="<%= track.id %>"></div>
			<div class="nameChannelMixer"><%= track.name %></div>
		</div>
		
</script>
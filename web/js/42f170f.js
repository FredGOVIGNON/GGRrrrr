$(document).ready(function() {

	localStorage.clear(); 

	$('.sendCoords').click(function() {
		id = this.id;
		console.log(id);
		var coords = $('#'+id).data('coords');
		console.log(coords);
    	localStorage.setItem('coordinate', coords);
    });

});
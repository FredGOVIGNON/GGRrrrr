$(document).ready(function() {

	localStorage.clear(); 

	$('.sendCoords').click(function() {
		id = this.id;
		console.log(id);
		var coords = $('#'+id).data('coords');
		console.log(coords);
    	localStorage.setItem('coordinate', coords);
    });

    $('#modalChallengeDelete').on('show.bs.modal', function(e) {
        var challengeName = $(e.relatedTarget).data('name');
        var challengeId = $(e.relatedTarget).data('id');
        $('.messageBody b').empty();
        $('.messageBody b').append(challengeName);
        $('a').removeAttr('href');
        $('a').attr('href', Routing.generate('challenge_delete', {'id': challengeId}) );
    });

});
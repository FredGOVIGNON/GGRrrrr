$(document).ready(function() {

    $('#modalDeleteProfile').on('show.bs.modal', function(e) {
        var userId = $(e.relatedTarget).data('id');
        $('a').removeAttr('href');
        $('a').attr('href', Routing.generate('user_delete', {'id': userId}) );
    });

});
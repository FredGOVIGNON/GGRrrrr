 $(document).ready(function() {
    //
    // Setup
    //

    var idRound = 0;
    var round = 1;
    var points = 0;
    var roundScore = 0;
    var totalScore = 0;
    ranOut = true;
    var distance;

    //
    //  Init maps
    //
    
    svinitialize(idRound);
    mminitialize();

    //
    // Scoreboard & Guess button event
    //

    // Init Timer
    resetTimer();

    // Timer
    function timer() {
      count = count-1;
      if (count <= 0) {
        console.log('finished');
        if (round < 5){
          endRound();
        } else if (round >= 5){
          endGame();
        };
        clearInterval(counter);
      }
      $("#timer").html(count);
    };

    // Guess Button
    $('#guessButton').click(function (){
      doGuess();
      rminitialize();
    });

    // End of round continue button click
    $('#roundEnd').on('click', '.closeBtn', function () {
      idRound++;
      $('#roundEnd').fadeOut(500);
      // Reset Timer
      resetTimer();

      // Reload maps to refresh coords
      svinitialize(idRound);
      mminitialize();
      rminitialize();
    });

    // End of game 'play again' button click
    $('#endGame').on('click', '#tretre', function () {
      var dataid = $('#endGame').data('id');
      $.ajax({
        url: Routing.generate('scoreNew'),
        type: 'POST',
        data: {'score': totalScore, 'id': dataid},
        success: function(data){
          if (data == 'empty') {
            $('<h3 style="color: red;">You need to be logged to save your score !</h3></br>').insertBefore('#tretre');
            setInterval(function(){
              window.location.href = Routing.generate('score', {'id': dataid})
            },5000);
          } else {
            setInterval(function(){
              window.location.href = Routing.generate('score', {'id': dataid})
            },2000);
          }
        }
      });
    });

    //
    // Functions
    //

    // Reset Timer
    function resetTimer(){
      count = 120;
      counter = setInterval(timer, 1000);
    }

    // Calculate distance between points function
    function calcDistance(fromLat, fromLng, toLat, toLng) {
      return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
    };

    function doGuess(){
        
      ranOut=false;

      // Stop Counter
      clearInterval(counter);

      // Reset marker function
      function resetMarker() {
          //Reset marker
          if (guessMarker != null) {
              guessMarker.setMap(null);
          }
      };

      // Explode latLng variables into separate variables for calcDistance function
      locLatLongs = window.locLL.toString();
      guessLatLongs = window.guessLatLng.toString();

      // Make arrays and clean from (){} characters
      window.locArray = locLatLongs.replace(/[\])}[{(]/g,'').split(',');
      window.guessArray = guessLatLongs.replace(/[\])}[{(]/g,'').split(',');

      // Calculate distance between points, and convert to kilometers
      distance = Math.ceil(calcDistance(window.locArray[0], window.locArray[1], window.guessArray[0], window.guessArray[1]) / 1000);

      // Calculate points awarded via guess proximity
      function inRange(x, min, max) {
          return (min <= x && x <= max);
      };

      // Real basic point thresholds depending on kilometer distances
      if(inRange(distance, 1, 2)) {
        points = 10000;
      } else if(inRange(distance, 3, 10)) {
        points = 7000;
      } else if(inRange(distance, 11, 50)) {
        points = 4000;
      } else if(inRange(distance, 51, 200)) {
        points = 3000;
      } else if(inRange(distance, 201, 500)) {
        points = 2000;
      } else if(inRange(distance, 501, 800)) {
        points = 1000;
      } else if(inRange(distance, 801, 1300)) {
        points = 500;
      } else if(inRange(distance, 1301, 1600)) {
        points = 400;
      } else if(inRange(distance, 1601, 2300)) {
        points = 300;
      } else if(inRange(distance, 2301, 2800)) {
        points = 200;
      } else if(inRange(distance, 2801, 3200)) {
        points = 100;
      } else if(inRange(distance, 3200, 4500)) {
        points = 50;
      } else if(inRange(distance, 4501, 6000)) {
        points = 25;
      } else {
        points = 0;
      };

      if (round < 5){
        endRound();
      } else if (round >= 5){
        endGame();
      };

      timer();
      window.guessLatLng = '';

    };

    function endRound(){
      round++;
      if(ranOut==true){
        roundScore = 0;
      } else {
        roundScore = points;
        totalScore = totalScore + points;
      }

      $('.round').html('Current Round: <b>'+round+'/5</b>');
      $('.roundScore').html('Last Round Score: <b>'+roundScore+'</b>');
      $('.totalScore').html('Total Score: <b>'+totalScore+'</b>');

      // If distance is undefined, that means they ran out of time and didn't click the guess button
      if(ranOut == true){
        $('#roundEnd').html('<p>Sorry! You took too long!.<br/> You didn\'t score any points this round!<br/><br/><button class="btn btn-primary closeBtn" type="button">Continue</button></p></p>');
        $('#roundEnd').fadeIn();

        // Stop Counter
        clearInterval(counter);

        // Reset marker function
        function resetMarker() {
            //Reset marker
            if (guessMarker != null) {
                guessMarker.setMap(null);
            }
        };

        window.guessLatLng = '';
        ranOut = false;

        points = 0;

      } else {
        $('#roundEnd').html('<p>Your guess was<br/><strong><h1>'+distance+'</strong>km</h1> away from the actual location.<br/><div id="roundMap"></div><br/> You have scored<br/><h1>'+roundScore+' points</h1> this round!<br/><br/><button class="btn btn-primary closeBtn" type="button">Continue</button></p></p>');
        $('#roundEnd').fadeIn();
      };

      // Reset Params
      window.guessLatLng = '';
      ranOut = true;

    };

    function endGame(){
        
      roundScore = points;
      totalScore = totalScore + points;

      $('#miniMap, #pano, #guessButton, #scoreBoard').hide();
      $('#endGame').html('<h1>Congrats!</h1><h2>Your final score was:</h2><h1>'+totalScore+'!</h1><br/><button id="tretre" class="btn btn-large btn-success playAgain" type="button">Go to the scoreboard</button>');
      $('#endGame').fadeIn(500);

      rminitialize();

      // We're done with the game
      window.finished = true;
    }


  });
var triviaData = {},
	    		user = {
  							  	questions: 8,
  							  	asked: 0,
  							  	anstime: 30,
  							  	waittime: 5,
  							  	correct : 0,
  							  	incorrect : 0,
  							  	unanswered : 0
    					   },
	    	currQs = {
	    							quesIndex : 0,
	    							ansIndex : 0,
	    							status : ""
	    						};

$(window).on('load', function () {

	$('#quesqty').val(user.questions);
	$('#ans-t').val(user.anstime);
	$('#wait-t').val(user.waittime);

	$('#startbtn').click(function(){
		setTrivia();
		$('#startdiv').addClass('hide');	
		$('#askdiv').removeClass('hide');
	});

	$('#restartbtn').click(function(){
		$('#resultdiv').addClass('hide');	
		$('#startdiv').removeClass('hide');
	});

	$('.choices').click(function(){
		if($(this).val() === currQs.ansIndex){
			currQs.status = 'correct';
		} else {
			currQs.status = 'incorrect';
		};
		timer.stop();
	});

	$('.container').draggable({
	  create: function( event, ui ) {
	      $(this).css({
	          top: $(this).position().top,
	          bottom: 'auto'
	      });
	  }
	});	

});

var timer = {
  time: 0,
  wait: 0,
  reset: function() {
    timer.time = user.anstime;
    $('#timer').removeClass('red-text');
    $('#timer').html(timer.time);
    timer.start();
  },
  start: function() {
    timerInterval = setInterval(timer.count, 1000);
  },
  stop: function() {
    clearInterval(timerInterval);
    showAnswer(currQs.status);
  },
  count: function() {
    timer.time--;
    $('#timer').html(timer.secondDigit(timer.time));
  },
  secondDigit: function(second) {
    if (second === 0){
    	currQs.status = 'out';
    	timer.stop();
    }else if (second < 10) {
      second = '0' + second;
      if (!$('#timer').hasClass('red-text')){$('#timer').addClass('red-text')};
    }
    return second;
  }
};

function setTrivia(){
	$.getJSON( 'data/trivia.json', function() {
	  console.log( 'success' );
	})
	  .done(function(data) {
	  	triviaData = data;
	  	nextTrivia();
	  })
	  .fail(function() {
	    console.log( 'error' );
	  });	
	user.questions = parseInt($('#quesqty').val());
	user.anstime = parseInt($('#ans-t').val());
	user.waittime = parseInt($('#wait-t').val());
	user.asked = 0;
	user.correct = 0;
	user.incorrect = 0;
	user.unanswered = 0;
};

function nextTrivia(){
	user.asked++;
	if (user.asked > user.questions){
		showResult();
	} else {
		currQs.quesIndex = Math.floor(Math.random() * triviaData.length);
		currQs.ansIndex = triviaData[currQs.quesIndex].answer;
		$('#ques').html(user.asked);
		$('#t-ques').html(user.questions);
		$('#quesRow').html(triviaData[currQs.quesIndex].question);
		$('#q0').html(triviaData[currQs.quesIndex].choices[0]);
		$('#q1').html(triviaData[currQs.quesIndex].choices[1]);
		$('#q2').html(triviaData[currQs.quesIndex].choices[2]);
		$('#q3').html(triviaData[currQs.quesIndex].choices[3]);
		$('#ansdiv').addClass('hide');
		$('#askdiv').removeClass('hide');
		timer.reset(user.anstime);
	}
};

function showAnswer(status){
	$('#askdiv').addClass('hide');
	$('#ansdiv').removeClass('hide');
	
	switch(status){
		case 'out':
			$('#message').html('Out of Time!');
			user.unanswered++;
			break;
		case 'incorrect':
			$('#message').html('Nope!');
			user.incorrect++;
			break;
		case 'correct':
			$('#message').html('Correct!');
			user.correct++;
			break;
		default:
			//o
	}
	$('#quesAns').html($('#quesRow').html());
	var answer = $( '.choices[value=' + currQs.ansIndex + ']' ).html();
	$('#correctans').html(answer);
	$('#ansimg').attr('src','assets/images/' + currQs.quesIndex + '.jpg');
	triviaData.splice(currQs.quesIndex, 1);
	setTimeout(nextTrivia, user.waittime * 1000);
}

function showResult(){
	$('#ansdiv').addClass('hide');
	$('#resultdiv').removeClass('hide');
	$('#correct').html(user.correct);
	$('#incorrect').html(user.incorrect);
	$('#unanswered').html(user.unanswered);
}
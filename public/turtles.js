/*
	Function to get the turtles from the server
*/
function getTurtles() {
	// get request to get the turtles
	// I've rewritten this as an $.ajax call to handle the error state
	$.ajax({
		method: "GET",
		url: '/api/turtles',
		success: function(response){
			// when we get a response, wipe out all of the turtle divs
			$('#output').empty();
			// and rebuild all of them as clones of the turtle template
			for (var i = 0; i < response.length; i++) {
				var turtleDiv = $('#turtleTemplate').children().first().clone();
				turtleDiv.find('.turtle_name').text(response[i].name);
				turtleDiv.find('.turtle_name').attr('data-turtleId', response[i]._id);
				turtleDiv.find('.turtle_link').attr('href', '/details/' + response[i]._id);
				turtleDiv.find('.turtle_pic').attr('src', response[i].pic);
				turtleDiv.find('.turtle_weapon').text(response[i].weapon);
				turtleDiv.find('.turtle_pizza').text("I've had this many pizzas: " + response[i].pizza);
				turtleDiv.find('.buy_pizza').attr('data-turtleId', response[i]._id);
				if (response[i].pizza !== 0) {
					for (var j = 1; j <= response[i].pizza; j++) {
						//add a pizza picture for each number of pizzas. this selector does not seem to select the element with this value as read in the jQuery documentation.
						$("[data-turtleId='"+ response[i]._id + "']").after('<img src="http://www.free-icons-download.net/images/pizza-icon-65951.png">');
					}
				}
				turtleDiv.find('.delete_turtle').data('turtleID', response[i]._id);
				turtleDiv.css({color: response[i].color});
				// If you do this, make sure you actually put the clone into the DOM!
				$('#output').append(turtleDiv);
			}
			addListeners();
		},
		error: function(err) {
			// On an error (unable to get the turtles), show the login form
			$('.login-form').show();
		}
	});
}

/*
	Click listener for adding a new turtle
*/
$('#newTurtleSubmit').click(function() {
	// post the turtle
	// todo: add some validation here, gets checked on the back end
	$.post('/api/newTurtle', {
		name: $('#newTurtleName').val(),
		pic: $('#newTurtleIMG').val(),
		color: $('#newTurtleColor').val(),
		weapon: $('#newTurtleWeapon').val()
	}, function() {
		// on success, clear out the existing turtle inputs
		$('#newTurtleName').val('');
		$('#newTurtleIMG').val('');
		$('#newTurtleColor').val('');
		$('#newTurtleWeapon').val('');
		// and re-build the turtles div from the database
		getTurtles();
	});
});
// get the turtles on page load
$(document).ready(function() {
	// if (document.location.hash) {
	// 	showTurtleDetails(document.location.hash.slice(1));
	// } else {
		getTurtles();
	// }
});
/* some code to run to make user think they are on a new page
$(document).on('click', '.turtle_name', function(event) {
	var turtleId = $(event.target).attr('data-turtleId');
	showTurtleDetails(turtleId);
});

function showTurtleDetails(turtleId) {
	$('.turtles').hide();
	$('.turtle_form').hide();
	document.location.hash = turtleId;
	$.get('/api/turtle/' + turtleId, function(response){
		$('.turtle_details_name').text(response.name);
		$('.turtle_details_submitter').text(response.submittedBy);
		$('.turtle_details').show();
	});
}
*/
/*
	click listeners for the buttons created inside each turtle
*/
function addListeners() {
	//even handler for clicking buy pizza button
	$('.buy_pizza').click(function() {
		var turtle_id = $(this).attr('data-turtleId');
		$.post('/api/buyPizza', {
			_id: turtle_id
		}, function(res) {
			if (res === "error") {
				console.log('500 server error!');
			} else {
				getTurtles();
			}
		});
	});

	//event handler for clicking delete button
	$('.delete_turtle').click(function() {
		var turtle_id = $(this).data("turtleID");
		$.post('/api/deleteTurtle', {
			id: turtle_id
		}, function(res) {
			if (res ==="error"){
				console.log("500 server error!");
			} else {
				alert(res);
				getTurtles();
				
			}
		});
	});
}
/*
	Click listener for the login button
*/
$('#login').click(function() {
	// post to the login api
	$.post('/api/login', {
		username: $('#username').val(),
		password: $('#password').val()
	}, function(res) {
		// If we haven't logged in, display an error
		if (res === "error") {
			$('#login-error').text('Error: Username or password incorrect.');
		} else {
			// Otherwise, hide the login form and get the turtles
			$('.login-form').hide();
			getTurtles();
		}
	});
});

/*
	Click listener for registering a user
*/
$('#register').click(function() {
	// todo: add validation
	$.post('/api/register', {
		username: $('#username').val(),
		password: $('#password').val()
	}, function(res) {
		// Display the result to the user
		if (res === "error") {
			$('#login-error').text('Error: Could not register user.');
		} else {
			$('#login-error').text('Registered! Try logging in...');
		}
	});
});

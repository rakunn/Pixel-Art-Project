//few selector variables...
const userForm = $("#sizePicker button");
const colorPick = $("#colorPicker"); 
const reset = $("#reset");
const heightInput = $("#input_height");
const widthInput = $("#input_width");
const listItems = $("a.item");
const canvas = $("#pixel_canvas");

let currentColorType = 'custom';
let isDraggable = false;

// Select size input
const getSize = () => {
	return [ Number(heightInput.val()), Number(widthInput.val()) ];
}

//Clear paintings
const resetGrid = () => {
	$(".element").css('background-color', 'white');
}

//Start the fun
const makeGrid = () => {
	canvas.find(".row-element").hide(200, () => $(this).remove());

	const [ height, width ] = getSize();

	for (let row = 0; row < height; row++) {
		canvas.append("<div class='row-element'></div>");
		for (let col = 0; col < width; col++) {
			canvas.find(".row-element").last().prepend("<div class='element'></div>");
		}
	}
}

const randomColor = () => {
	let red = Math.floor(Math.random()*256);
	let green = Math.floor(Math.random()*256);
	let blue = Math.floor(Math.random()*256);
	return `rgb(${red},${green},${blue})`;
}

//event listeners...
listItems.on('click', function() {
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
	if(this.dataset.colors) {
		currentColorType = this.dataset.colors;
		if(currentColorType === 'custom') {
			$('#colorInstructions').text('Choose your color');
			$('#colorPicker').show();
		} else {
			$('#colorInstructions').text('Random color enabled. Please proceed with your canvas :-)');
			$('#colorPicker').hide();
		}
	} else {
		isDraggable = this.dataset.brush;
	}
});

// When size is submitted by the user, call makeGrid()
userForm.on('click', () => makeGrid());

reset.on('click', () => resetGrid());

canvas.on('click', '.element', function() {
	if(!isDraggable) {
		switch(currentColorType) {
			case 'custom':
				$(this).css('background-color', colorPick.val());
			break;
			case 'random':
				$(this).css('background-color', randomColor());
			break;
		}
	}
});

canvas.on('mouseenter', '.element', function() {
	if(isDraggable) {
		switch(currentColorType) {
			case 'custom':
				$(this).css('background-color', colorPick.val());
			break;
			case 'random':
				$(this).css('background-color', randomColor());
			break;
		}
	}
});



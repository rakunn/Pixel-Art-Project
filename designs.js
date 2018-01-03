//few selector variables...
const userForm = $("#sizePicker button");
const colorPick = $("#colorPicker"); 
const reset = $("#reset");
const heightInput = $("#input_height");
const widthInput = $("#input_width");
const listItems = $("a.item");
const canvas = $("#pixel_canvas");
const currentBrush = $("#currentBrush");

let currentColorType = 'custom';
let isColor = true;

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
	colorGrid();
}

const randomColor = () => {
	if (isColor) {
		let red = Math.floor(Math.random()*256);
		let green = Math.floor(Math.random()*256);
		let blue = Math.floor(Math.random()*256);
		return `rgb(${red},${green},${blue})`;
		} else {
		return 'rgb(255,255,255';
	}
}

const customColor = () => {
	if (isColor) {
		return colorPick.val();
	} else {
		return 'rgb(255,255,255)';
	}
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
currentBrush.parent().popup();

userForm.on('click', () => makeGrid());

reset.on('click', () => resetGrid());

const colorGrid = function() {
	const element = $('.element');
	let isDraggable = false;

	element.on('click', function(event) {
		event.preventDefault();
		isColor = true;
			switch(currentColorType) {
				case 'custom':
					$(this).css('background-color', customColor());
				break;
				case 'random':
					$(this).css('background-color', randomColor());
				break;
		 }
	});

	element.on('mousemove', function(event) {
		event.preventDefault();
		if(isDraggable) {
			switch(currentColorType) {
				case 'custom':
					$(this).css('background-color', customColor());
				break;
				case 'random':
					$(this).css('background-color', randomColor());
				break;
			}
		}
	});

	element.on('mousedown', function(event){
		event.preventDefault();
		isDraggable = true;
		switch(event.which) {
			case 1:
				isColor = true;
				currentBrush.addClass("paint brush").removeClass("eraser");
				break;
			case 3:
				isColor = false;
				currentBrush.addClass("eraser").removeClass("paint brush");
				break;
		}
	});

	$(document).on('mouseup', function(event){
		event.preventDefault();
		currentBrush.addClass("paint brush").removeClass("eraser")
		isDraggable = false;
	});

	element.on('contextmenu', function(event){
		event.preventDefault();
		isColor = false;

		$(this).css('background-color', customColor());
	});
}
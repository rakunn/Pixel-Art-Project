const PixelArt = {
	currentBrush: $("#currentBrush"),
	currentColorType: 'custom',
	isColor: true,
	init() {
		this.initializeFormsAndMenu();
	},
	initializeFormsAndMenu() {
		const reset = $("#reset");
		const listItems = $("a.item");
		const userForm = $("#start");
		const colorPick = $("#colorPicker");
		// When size is submitted by the user, call makeGrid()
		userForm.on('click', (event) => {
			event.preventDefault();
			PixelArt.makeGrid();
		});

		reset.on('click', () => this.resetGrid());

		listItems.on('click', function() {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			if(this.dataset.colors) {
				PixelArt.currentColorType = this.dataset.colors;
				if(PixelArt.currentColorType === 'custom') {
					$('#colorInstructions').text('Choose your color');
					colorPick.show();
				} else {
					$('#colorInstructions').text('Random color enabled. Please proceed with your canvas :-)');
					colorPick.hide();
				}
			} else {
				isDraggable = this.dataset.brush;
			}
		});
		this.currentBrush.parent().popup();
	},
	makeGrid() {
		const canvas = $("#pixel_canvas");
		const [ height, width ] = PixelArt.getSizeAndSanitizeInput();
		canvas.find(".row-element").hide(200, () => $(this).remove());

		for (let row = 0; row < height; row++) {
			canvas.append("<div class='row-element'></div>");
			for (let col = 0; col < width; col++) {
				canvas.find(".row-element").last().prepend("<div class='element'></div>");
			}
		}
		this.colorGrid();
	},
	resetGrid() {
		$(".element").css('background-color', 'white');
	},
	colorGrid() {
		const colorPick = $("#colorPicker");
		const element = $('.element');
		let isDraggable = false;

		colorPick.on('change', (event) => {
			$('i.square.icon').css('color', colorPick.val());
		});

		element.on('click', function(event) {
			const target = $(event.target);
			event.preventDefault();
			PixelArt.isColor = true;
			PixelArt.colorOrErase(target);
		});

		element.on('mousemove', function(event) {
			const target = $(event.target);
			event.preventDefault();
			if(isDraggable) {
				PixelArt.colorOrErase(target);
			}
		});

		element.on('mousedown', function(event){
			event.preventDefault();
			isDraggable = true;
			switch(event.which) {
				case 1:
					PixelArt.isColor = true;
					PixelArt.currentBrush.addClass("paint brush").removeClass("eraser");
					break;
				case 3:
					PixelArt.isColor = false;
					PixelArt.currentBrush.addClass("eraser").removeClass("paint brush");
					break;
			}
		});

		element.on('contextmenu', function(event){
			event.preventDefault();
			PixelArt.isColor = false;

			$(this).css('background-color', PixelArt.customColor());
		});

		$(document).on('mouseup', function(event){
			event.preventDefault();
			PixelArt.currentBrush.addClass("paint brush").removeClass("eraser")
			isDraggable = false;
		});
	},
	// Select size input
	getSizeAndSanitizeInput() {
		let height = $("#input_height").val();
		let width = $("#input_width").val();

		if (height > 64) {
			height = 64;
			$("#input_height").val('64');
		}
		if (width > 64) {
			width = 64
			$("#input_width").val('64');
		}
		return [ height, width ];
	},
	randomColor() {
		if (this.isColor) {
			let red = Math.floor(Math.random()*256);
			let green = Math.floor(Math.random()*256);
			let blue = Math.floor(Math.random()*256);
			return `rgb(${red},${green},${blue})`;
			} else {
			return 'rgb(255,255,255';
		}
	},
	customColor() {
		if (this.isColor) {
			return $("#colorPicker").val();
		} else {
			return 'rgb(255,255,255)';
		}
	},
	colorOrErase(targetElement) {
		switch(this.currentColorType) {
		case 'custom':
			targetElement.css('background-color', PixelArt.customColor());
		break;
		case 'random':
			targetElement.css('background-color', PixelArt.randomColor());
		break;
		}
	}
}

PixelArt.init()
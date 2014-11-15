"use strict";

var NUMBER_OF_POTENTIAL_TILES = 32; // in Javascript -- not ideal
var BOARD_SIZE = 4;
var TILE_SIZE_PIXELS_DEFAULT = 400;
var BOARD_TO_WINDOW_RATIO = 0.6;
var BORDER_TO_TILE_RATIO = 0.05;

var tilesFlipped = [];
var time;
var timer;

var winTimer;

$(document).ready(function() {
	$(".statsbox").css("display", "none");
	$("#gameboard").css("display", "none");
	$("#startbutton").click(startGame);
	$(window).resize(resizeBoard);
});

function startGame() {
	$("#gameboard").css("display", "");
	// $("#gameboard").css("border-color", "BLACK");
	$(".statsbox").css("display", "");
	$("#win").css("display", "");
	$("#timer").css("color", "");
	$("#startbutton").text("Restart!");
	
	resetBoard();
	
	// timer
	clearInterval(timer); // clear any existing timer
	clearInterval(winTimer);
	var timerDiv = $("#timer");
	timerDiv.css("display", "inherit");
	time = 0;
	timerDiv.text(time + " s"); // set to 0
	timer = setInterval(function() {
		time++;
		timerDiv.text(time + " s");
	}, 1000);
}

function resetBoard() {
	tilesFlipped = []; // clear array
	var tileNumbers = []; // numbers of all possible tiles
	for (var i = 1; i < NUMBER_OF_POTENTIAL_TILES + 1; i++) {
		tileNumbers.push(i);
	}
	
	// randomly choose numbers to be used in game
	var numOfPairs = BOARD_SIZE * 2;
	var iMax = NUMBER_OF_POTENTIAL_TILES - numOfPairs;
	for (var i = 0; i < iMax; i++) {
		var iDel = Math.floor(tileNumbers.length * Math.random()); // get random index
		tileNumbers.splice(iDel, 1); // delete number at that index
	}
	var tileNumsDouble = _.shuffle(tileNumbers.concat(tileNumbers)); // create shuffled pairs of numbers
	$("#stomatch").text(tileNumbers.length);
	$("#smatched").text(0);
	$("#sfails").text(0);
	
	// add the tiles to the board
	var gameboard = $("#gameboard");
	gameboard.empty();
	for (var i = 0; i < tileNumsDouble.length; i++) {
		var tile = document.createElement("img");
		var tileInfo = {
			"isFacedown": true,
			"tilenum" : tileNumsDouble[i],
		};
		$(tile).addClass("tile");
		$(tile).data("tileInfo", tileInfo);
		$(tile).mouseover(function() {
			if ($(this).data("tileInfo").isFacedown) {
				$(this).addClass("tilehover");
			}
		});
		$(tile).mouseout(function() {
			$(this).removeClass("tilehover");
		});

		tile.setFacedown = function() {
			$(this).data("tileInfo").isFacedown = true;
			$(this).attr("src", "./img/tile-back.png");
			$(this).on("click", this.setFaceup);
		}

		tile.setFaceup = function() {
			$(this).off("click");
			$(this).data("tileInfo").isFacedown = false;
			$(this).attr("src", "./img/tile" + $(this).data("tileInfo").tilenum + ".jpg");
			$(this).addClass("tileselected");
			tilesFlipped.push(this);
			var arrLength = tilesFlipped.length;
			if (arrLength % 2 === 0) {
				var tile1 = tilesFlipped[arrLength - 1];
				var tile2 = tilesFlipped[arrLength - 2];
				$(tile1).removeClass("tileselected");
				$(tile2).removeClass("tileselected");
				
				// check if tiles are different (wrong)
				if ($(tile1).data("tileInfo").tilenum !== $(tile2).data("tileInfo").tilenum) {
					var fails = $("#sfails").text();
					$("#sfails").text(parseInt(fails) + 1);
					$(tile1).addClass("incorrect");
					$(tile2).addClass("incorrect");
					tilesFlipped.pop();
					tilesFlipped.pop();
					setTimeout(function() {
						$(tile1).removeClass("incorrect");
						$(tile2).removeClass("incorrect");
						tile1.setFacedown();
						tile2.setFacedown();
					}, 1000); // flip down after one second
				} else { // tiles are same (correct)
					var total = tileNumbers.length;
					var tomatch = parseInt($("#stomatch").text()) - 1;
					var matched = total - tomatch;
					$("#stomatch").text(tomatch);
					$("#smatched").text(matched);
					$(tile1).addClass("solved");
					$(tile2).addClass("solved");
				}
				// board is fully solved
				if (tilesFlipped.length === BOARD_SIZE * 4) {
					win();
				}
			}
		}
		
		
		//console.log(tile);
		tile.setFacedown();
		gameboard.append(tile);
	}
	
	// change size
	resizeBoard();
}

function resizeBoard() {
	var board = $("#gameboard");
	var tiles = $(".tile");
	var windowSize = Math.min(window.innerHeight, window.innerWidth);
	// don't exceed default tile size
	var boardSize = (windowSize * BOARD_TO_WINDOW_RATIO > BOARD_SIZE * TILE_SIZE_PIXELS_DEFAULT) ? 
			(BOARD_SIZE * TILE_SIZE_PIXELS_DEFAULT) : (windowSize * BOARD_TO_WINDOW_RATIO);
	boardSize = boardSize - (boardSize % 4); // round down to multiple of 4
	var tileSize = Math.floor(boardSize / BOARD_SIZE);
	var borderSize = Math.floor(tileSize * BORDER_TO_TILE_RATIO);
	board.css("height", boardSize);
	board.css("width", boardSize);
	for (var i = 0; i < tiles.length; i++) {
		board.css("border-width", borderSize);
		$(tiles[i]).css("border-style", "solid");
		$(tiles[i]).css("border-width", borderSize);
		$(tiles[i]).css("height", tileSize - borderSize * 2);
		$(tiles[i]).css("left", (i % BOARD_SIZE) * tileSize);
		$(tiles[i]).css("top", Math.floor(i / BOARD_SIZE) * tileSize);
		$(tiles[i]).css("width", tileSize - borderSize * 2);
	}
}

function win() {
	clearInterval(timer); // stop timer
	$("#win").css("display", "inherit");
	$("#timer").css("color", "GREEN");
	// var edge = 0;
	// winTimer = setInterval(function() {
		// var board = $("#gameboard");
		// board.css("border-color", "BLACK");
		// switch (edge) {
			// case 0:
				// board.css("border-left-color", "RED");
				// edge++;
				// break;
			// case 1:
				// board.css("border-top-color", "GREEN");
				// edge++;
				// break;
			// case 2:
				// board.css("border-right-color", "YELLOW");
				// edge++;
				// break;
			// case 3:
				// board.css("border-bottom-color", "BLUE");
				// edge = 0;
				// break;
		// }
	// }, 250);
}
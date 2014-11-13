"use strict";

var NUMBER_OF_POTENTIAL_TILES = 32; // in Javascript -- not ideal
var BOARD_SIZE = 4;
var TILE_SIZE_PIXELS_DEFAULT = 400;
var BOARD_TO_WINDOW_RATIO = 0.75;
var BORDER_TO_TILE_RATIO = 0.05;

var tilesFlipped = [];
var time;
var timer;

$(document).ready(function() {
	$("#startbutton").click(startGame);
	$(window).resize(resizeBoard);
});

function startGame() {
	$("#gameboard").css("display", "inherit");
	$("#startbutton").css("display", "none");
	
	resetBoard();
	
	// timer
	var timerDiv = $("#timer");
	timerDiv.css("display", "inherit");
	time = 0;
	timer = setInterval(function() {
		time++;
		timerDiv.html(time);
	}, 1000);
}

function resetBoard() {
	// numbers of all possible tiles
	var tileNumbers = [];
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
	
	// add the tiles to the board
	var gameboard = $("#gameboard");
	for (var i = 0; i < tileNumsDouble.length; i++) {
		var tile = document.createElement("img");
		var tileInfo = {
			"tilenum" : tileNumsDouble[i],
		};
		$(tile).addClass("tile");
		$(tile).data("tileInfo", tileInfo);
		
		

		tile.setFacedown = function() {
			$(this).data("tileInfo").facedown = true;
			$(this).attr("src", "./img/tile-back.png");
			$(this).on("click", this.setFaceup);
		}

		tile.setFaceup = function() {
			$(this).off("click");
			$(this).data("tileInfo").facedown = false;
			$(this).attr("src", "./img/tile" + $(this).data("tileInfo").tilenum + ".jpg");
			tilesFlipped.push(this);
			var arrLength = tilesFlipped.length;
			if (arrLength % 2 === 0) {
				var tile1 = tilesFlipped[arrLength - 1];
				var tile2 = tilesFlipped[arrLength - 2];
				
				// check if tiles are different (wrong)
				if ($(tile1).data("tileInfo").tilenum !== $(tile2).data("tileInfo").tilenum) {
					tilesFlipped.pop();
					tilesFlipped.pop();
					setTimeout(function() {
						tile1.setFacedown();
						tile2.setFacedown();
					}, 1000); // stay flipped for one second
				// tiles are same (correct)
				} else { 
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
	clearInterval(timer);
	alert("hooray");
}
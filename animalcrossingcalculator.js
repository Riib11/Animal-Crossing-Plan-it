var rows = 64;
var cols = 80;

function setupMapSquare() {

	var htmlresult = "";

	for(var y = 0 ; y < rows ; y++) {
		htmlresult += "<tr>";
		for(var x = 0 ; x < cols ; x++) {
			htmlresult += "<td class='map-sqaure' id='" + (y + (x/100)) + "'><img src='assets/squares/green-square.png'></td>";
		}
		htmlresult += "</tr>";
	}
	document.getElementById("map").innerHTML = htmlresult;
}

function placeBuilding() {

	var x = .01;
	var y = 1;

	document.getElementById(y+x).innerHTML = "<img src='assets/squares/building_top.png'>";
	document.getElementById(y+x+1).innerHTML = "<img src='assets/squares/building_bottom.png'>";

}
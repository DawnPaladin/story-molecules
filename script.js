jsPlumb.ready(function(){
	// jsplumb init code
	jsPlumb.setContainer("cellBlock");
	jsPlumb.draggable($('.cell'));
	jsPlumb.importDefaults({
		// override defaults here
		PaintStyle : {
		  lineWidth:13,
		  strokeStyle: 'rgba(200,0,0,0.5)'
		},
		DragOptions : { cursor: "crosshair" },
		Endpoints : [ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
		EndpointStyles : [{ fillStyle:"#225588" }, { fillStyle:"#558822" }]
	});
});

var endpointOptions = {
	endpoint: "Rectangle",
	isSource: true,
	isTarget: true,
	PaintStyle : {
	  lineWidth:13,
	  strokeStyle: 'rgba(200,0,0,0.5)'
	},
	EndpointStyles : [{ fillStyle:"#225588" }, { fillStyle:"#558822" }]
};
function Cell(name, serial) { // class definition
	this.name = name;
	this.serial = serial;
	this.xCoord = 0; // TODO
	this.yCoord = 0; // TODO
	this.remove = function() {}; // TODO
}
var registry = {
	cellCount: 0,
	containerCount: 0,
	addCell: function(name){
		var serial = ++registry.cellCount;
		var cellIndex = "cell" + serial;
		registry[cellIndex] = new Cell(name, serial);
		return cellIndex;
	}
};

function newCell(event) {
	var container = $(event.target).parent();
	var cellIdentifier = $('#newCellIdentifierInput').val();
	var cellIndex = registry.addCell(cellIdentifier);
	$('#cellTemplate').clone().appendTo(container)
		.show()
		.attr('id', cellIndex)
		.removeClass('ui-draggable') // see https://code.google.com/p/jsplumb/issues/detail?id=141
		.find('.tropeIdentifier').text(cellIdentifier).end()
	;
	jsPlumb.draggable(cellIndex, {
		//containment: "parent",
		drag:function(e, ui) { // correct handle position while dragging
			jsPlumb.repaintEverything();
		},
		stop:function(e, ui) { // correct handle position when dragging stops
			jsPlumb.repaintEverything();
			var cellCoords = $(e.target).position();
			$('#xCoord').html(cellCoords.left);
			$('#yCoord').html(cellCoords.top);
		}
	});
	jsPlumb.addEndpoint(cellIndex, {anchor: "Top"}, endpointOptions);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Right"}, endpointOptions);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Bottom"}, endpointOptions);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Left"}, endpointOptions);
}
$('#newCellButton').click(newCell);

var containerRegistry = [];
function newContainer() {
	var containerIndex = "container" + (containerRegistry.length + 1);
	$('#containerTemplate').clone().appendTo('#cellBlock')
		.show()
		.attr('id', containerIndex)
		.removeClass('ui-draggable') // see https://code.google.com/p/jsplumb/issues/detail?id=141
		.resizable({ // correct handle position while/after resizing
			resize:function(e, ui) {
				jsPlumb.repaintEverything();
			}
		})
		.find('.newCellButton').click(newCell).end()
	;
	containerRegistry.push(containerIndex);
	jsPlumb.draggable(containerIndex, {
		drag:function(e, ui) {},
		stop:function(e, ui) {}
	});
	jsPlumb.addEndpoint(containerIndex, {anchor: "Top"}, endpointOptions);
	jsPlumb.addEndpoint(containerIndex, {anchor: "Right"}, endpointOptions);
	jsPlumb.addEndpoint(containerIndex, {anchor: "Bottom"}, endpointOptions);
	jsPlumb.addEndpoint(containerIndex, {anchor: "Left"}, endpointOptions);
}
$('#newContainerButton').click(newContainer);

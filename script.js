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
	this.cellIndex = "cell" + serial;
	this.xCoord = 0;
	this.yCoord = 0;
	this.remove = function() {
		delete registry[this.cellIndex];
	};
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
	$('#'+cellIndex).find('.closeButton').on('click', '', cellIndex, removeCell);
	jsPlumb.draggable(cellIndex, {
		//containment: "parent",
		drag:function(e, ui) { // correct handle position while dragging
			jsPlumb.repaintEverything();
		},
		stop:function(e, ui) { // correct handle position when dragging stops
			jsPlumb.repaintEverything();
			var cellCoords = $(e.target).position();
			registry[cellIndex].xCoord = cellCoords.left;
			registry[cellIndex].yCoord = cellCoords.top;
			$('#xCoord').html(cellCoords.left);
			$('#yCoord').html(cellCoords.top);
		}
	});
	registry[cellIndex].topEndpoint = jsPlumb.addEndpoint(cellIndex, {anchor: "Top"}, endpointOptions);
	registry[cellIndex].rightEndpoint = jsPlumb.addEndpoint(cellIndex, {anchor: "Right"}, endpointOptions);
	registry[cellIndex].bottomEndpoint = jsPlumb.addEndpoint(cellIndex, {anchor: "Bottom"}, endpointOptions);
	registry[cellIndex].leftEndpoint = jsPlumb.addEndpoint(cellIndex, {anchor: "Left"}, endpointOptions);
}
$('#newCellButton').click(newCell);
function removeCell(event) {
	var cellIndex = event.data;
	jsPlumb.detachAllConnections(cellIndex);
	jsPlumb.deleteEndpoint(registry[cellIndex].topEndpoint);
	jsPlumb.deleteEndpoint(registry[cellIndex].rightEndpoint);
	jsPlumb.deleteEndpoint(registry[cellIndex].bottomEndpoint);
	jsPlumb.deleteEndpoint(registry[cellIndex].leftEndpoint);
	$('#'+cellIndex).remove();
	registry[cellIndex].remove();
}

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
	$('#'+containerIndex).find('.closeButton').on('click', '', containerIndex, removeContainer);
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
function removeContainer(event) {
	var containerIndex = event.data;
	jsPlumb.detachAllConnections(containerIndex);
	// TODO: Remove endpoints
	$('#'+containerIndex).remove();
	//registry[containerIndex].remove();
}

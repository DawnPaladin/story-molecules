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
	this.parent = "";
	this.remove = function() {
		delete registry[this.cellIndex];
	};
}
function Container(name, serial) { // class definition 
	this.name = name;
	this.serial = serial;
	this.containerIndex = "container" + serial;
	this.xCoord = 0;
	this.yCoord = 0;
	this.children = [];
	this.remove = function() {
		delete registry[this.containerIndex];
	};
}
var registry = {
	cellCount: 0,
	containerCount: 0,
	addCell: function(name) {
		var serial = ++registry.cellCount;
		var cellIndex = "cell" + serial;
		registry[cellIndex] = new Cell(name, serial);
		return cellIndex;
	},
	addContainer: function() {
		var serial = ++registry.containerCount;
		var containerIndex = "container" + serial;
		registry[containerIndex] = new Container(name, serial);
		return containerIndex;
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
	$('#'+cellIndex).find('.closeButton').on('click', '', cellIndex, domRemoveCell);
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
	if (container.hasClass("container")){ // not a root-level cell. Establish parent/child relationship
		var containerIndex = container.attr("id");
		registry[containerIndex].children.push(cellIndex);
		registry[cellIndex].parent = containerIndex;
	}
}
$('#newCellButton').click(newCell);
function domRemoveCell(event) {
	var cellIndex = event.data;
	dataRemoveCell(cellIndex);
}
function dataRemoveCell(cellIndex) {
	jsPlumb.detachAllConnections(cellIndex);
	jsPlumb.deleteEndpoint(registry[cellIndex].topEndpoint);
	jsPlumb.deleteEndpoint(registry[cellIndex].rightEndpoint);
	jsPlumb.deleteEndpoint(registry[cellIndex].bottomEndpoint);
	jsPlumb.deleteEndpoint(registry[cellIndex].leftEndpoint);
	var containerIndex = registry[cellIndex].parent;
	if (containerIndex.length > 0) { // has a parent
		var childIndex = registry[containerIndex].children.indexOf(cellIndex);
		registry[containerIndex].children.splice(childIndex, 1); // remove child from array
	}
	$('#'+cellIndex).remove();
	registry[cellIndex].remove();
	console.log("Removed " + cellIndex);
}

function newContainer() {
	var containerIndex = registry.addContainer();
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
	$('#'+containerIndex).find('.closeButton').on('click', '', containerIndex, domRemoveContainer);
	jsPlumb.draggable(containerIndex, {
		drag:function(e, ui) {},
		stop:function(e, ui) {
			var containerCoords = $(e.target).position();
			registry[containerIndex].xCoord = containerCoords.left;
			registry[containerIndex].yCoord = containerCoords.top;
			$('#xCoord').html(containerCoords.left);
			$('#yCoord').html(containerCoords.top);
		}
	});
	registry[containerIndex].topEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Top"}, endpointOptions);
	registry[containerIndex].rightEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Right"}, endpointOptions);
	registry[containerIndex].bottomEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Bottom"}, endpointOptions);
	registry[containerIndex].leftEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Left"}, endpointOptions);
}
$('#newContainerButton').click(newContainer);
function domRemoveContainer(event) {
	var containerIndex = event.data;
	dataRemoveContainer(containerIndex);
}
function dataRemoveContainer(containerIndex) {
	jsPlumb.detachAllConnections(containerIndex);
	jsPlumb.deleteEndpoint(registry[containerIndex].topEndpoint);
	jsPlumb.deleteEndpoint(registry[containerIndex].rightEndpoint);
	jsPlumb.deleteEndpoint(registry[containerIndex].bottomEndpoint);
	jsPlumb.deleteEndpoint(registry[containerIndex].leftEndpoint);
	childrenList = registry[containerIndex].children;
	while (childrenList.length > 0) {
		dataRemoveCell(childrenList[0]);
	}
	$('#'+containerIndex).remove();
	registry[containerIndex].remove();
}

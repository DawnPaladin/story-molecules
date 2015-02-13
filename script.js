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
var cellRegistry = [];
var plumbRegistry = {};
function newCell(event) {
	console.log(event);
	var container = $(event.target).parent();
	var containerIndex = $(container).attr('id');
	var cellIndex = "cell" + (cellRegistry.length + 1);
	var cellIdentifier = $('#newCellIdentifierInput').val();
	$('#cellTemplate').clone().appendTo(container)
		.show()
		.attr('id', cellIndex)
		.removeClass('ui-draggable') // see https://code.google.com/p/jsplumb/issues/detail?id=141
		.find('.tropeIdentifier').text(cellIdentifier).end()
	;
	cellRegistry.push(cellIndex);
	plumbRegistry[containerIndex].draggable(cellIndex, {
		containment: "parent",
		drag:function(e, ui) { // correct handle position while dragging
			jsPlumb.repaintEverything();
		},
		stop:function(e, ui) { // correct handle position when dragging stops
			jsPlumb.repaintEverything();
		}
	});
	plumbRegistry[containerIndex].addEndpoint(cellIndex, {anchor: "Top"}, endpointOptions);
	plumbRegistry[containerIndex].addEndpoint(cellIndex, {anchor: "Right"}, endpointOptions);
	plumbRegistry[containerIndex].addEndpoint(cellIndex, {anchor: "Bottom"}, endpointOptions);
	plumbRegistry[containerIndex].addEndpoint(cellIndex, {anchor: "Left"}, endpointOptions);
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
	plumbRegistry[containerIndex] = jsPlumb.getInstance(); // create new jsPlumb instance in plumbRegistry for child cells
}
$('#newContainerButton').click(newContainer);

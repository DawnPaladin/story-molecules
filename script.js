jsPlumb.ready(function(){
	// jsplumb init code
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
function newCell() {
	var cellIndex = "cell" + (cellRegistry.length + 1);
	$('#cellTemplate').clone().appendTo('#cellBlock')
		.show()
		.attr('id', cellIndex)
		.removeClass('ui-draggable') // see https://code.google.com/p/jsplumb/issues/detail?id=141
		.find('.tropeIdentifier').text(cellIndex)
	;
	cellRegistry.push(cellIndex);
	jsPlumb.draggable(cellIndex);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Top"}, endpointOptions);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Right"}, endpointOptions);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Bottom"}, endpointOptions);
	jsPlumb.addEndpoint(cellIndex, {anchor: "Left"}, endpointOptions);
}
$('#newCell').click(newCell);

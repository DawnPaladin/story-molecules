function domNewCell(event) {
	var container = $(event.target).parent().attr('id');
	var cellIdentifier = $('#newCellIdentifierInput').val();
	dataNewCell(cellIdentifier, container);
}
$('#newCellButton').click(domNewCell);

function domRemoveCell(event) {
	var cellIndex = event.data;
	dataRemoveCell(cellIndex);
}

function newContainer() {
	var containerIndex = registry.addContainer();
	$('#containerTemplate').clone().appendTo('#cellBlock')
		.show()
		.attr('id', containerIndex)
		.removeClass('ui-draggable') // see https://code.google.com/p/jsplumb/issues/detail?id=141
		/*.resizable({ // correct handle position while/after resizing
			resize:function(e, ui) {
				jsPlumb.repaintEverything();
			}
		})*/
		.find('.newCellButton').click(domNewCell).end()
	;
	$('#'+containerIndex).find('.closeButton').on('click', '', containerIndex, domRemoveContainer);
	registry[containerIndex].topEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Top"}, endpointOptions);
	registry[containerIndex].rightEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Right"}, endpointOptions);
	registry[containerIndex].bottomEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Bottom"}, endpointOptions);
	registry[containerIndex].leftEndpoint = jsPlumb.addEndpoint(containerIndex, {anchor: "Left"}, endpointOptions);
	jsPlumb.draggable(containerIndex);
}
$('#newContainerButton').click(newContainer);
function domRemoveContainer(event) {
	var containerIndex = event.data;
	dataRemoveContainer(containerIndex);
}

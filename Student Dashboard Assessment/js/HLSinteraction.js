function onclickcall(evt){
    var deleteChartDivs = evt.parentNode.parentNode.parentNode.parentNode;
    var chartDiv = deleteChartDivs.parentNode.getAttribute('id');
    var graphType = evt.parentNode.parentNode.getAttribute('id');
    var theme = evt.getAttribute('theme');
    var height = evt.parentNode.parentNode.getAttribute('height');
    var width = evt.parentNode.parentNode.getAttribute('width');
    var xColumn = evt.getAttribute('xcolumn');
    var yColumn = evt.getAttribute('ycolumn');
    yColumn = "["+yColumn+"]"
    deleteChartDivs.parentNode.removeChild(deleteChartDivs);  
    drawNewChart(chartDiv, width, height, xColumn, yColumn, graphType, theme);
}

function drawNewChart(chartDiv, width, height, xColumn, yColumn, graphType, theme){

    var filename = 'data/jan/test.json';

    var controllerDiv = document.createElement( graphType + 'ControllerDiv' );
        controllerDiv.setAttribute('id', chartDiv + 'controllerDiv');
        controllerDiv.setAttribute('ng-controller', "myController");
        document.getElementById(chartDiv).appendChild(controllerDiv);
    
    var chart = document.createElement(graphType);

        chart.setAttribute('id', graphType + chartDiv );
        chart.setAttribute('filename', filename);
        chart.setAttribute('xColumn', xColumn);
        chart.setAttribute('yColumn', yColumn);
        chart.setAttribute('width', width);
        chart.setAttribute('height', height);
        chart.setAttribute('theme', theme);
    
        document.getElementById(chartDiv + 'controllerDiv').appendChild(chart);
}
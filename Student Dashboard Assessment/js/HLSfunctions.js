
function convertData(data, keys){
    var pts = new Array();
    for (var i = 0; i < data.length; i++){ 
        var temp = {};
        for ( var j = 0; j < keys.length; j++){
            var cur = Number(data[i][keys[j]]);    
                if (isNaN(cur)){
                    cur = [i, data[i][keys[j]]];
                }
            temp[keys[j]]=cur;
        }
        pts.push(temp);
                    
    }
    return pts;
}

function convertArray(value){
	if(value[0] == "[" && value[value.length-1]=="]")
		value = value.slice(1, value.length-1);
    var result = value.split(",");
    for (var i = 0; i < result.length; i++)
        result[i] = Number(result[i]);
	return result;
}

function findMaxMinValue(data, xColumn, yColumn, keys){

    var minX = Number.MAX_VALUE, minY = 0, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
    
    for(var i = 0; i < data.length; i++){
        curX = data[i][keys[xColumn]];
        curX = Array.isArray(curX) ? curX[0] : curX;
        minX = curX < minX ? curX : minX;
        maxX = curX > maxX ? curX : maxX;
        
         for(var j = 0; j < yColumn.length; j++){
             curY = data[i][keys[yColumn[j]]]
             curY = Array.isArray(curY) ? curY[0] : curY;
             minY = curY < minY ? curY : minY;
             maxY = curY > maxY ? curY : maxY;
         }   
    }

    var result = {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
    
    return result;
}

function findMaxminSumValue(data, xColumn, yColumn, keys){

    var minX = Number.MAX_VALUE, minSumY = 0, maxX = Number.MIN_VALUE, maxSumY = Number.MIN_VALUE;
    
    for(var i = 0; i < data.length; i++){
        var curX = data[i][keys[xColumn]];
        curX = Array.isArray(curX) ? curX[0] : curX;
        minX = curX < minX ? curX : minX;
        maxX = curX > maxX ? curX : maxX;
        
        var temp = 0;
         for(var j = 0; j < yColumn.length; j++){
             var curY = data[i][keys[yColumn[j]]]
             curY = Array.isArray(curY) ? curY[0] : curY;
             temp = temp + curY;
         }   
        minSumY = temp < minSumY ? temp : minSumY;
        maxSumY = temp > maxSumY ? temp : maxSumY;
    }

    var result = {minX: minX, minY: minSumY, maxX: maxX, maxY: maxSumY};
    
    return result;
}

function scale(data, xColumn, yColumn, keys, minMax, width, height, logview){
    logview = (logview==="true")
    
    var result = new Array();
    
	if(logview){
			minMax.minY = minMax.minY == 0 ? 0 : Math.log10(minMax.minY);
			var temp = minMax.maxY == 0 ? 0 : parseInt(Math.log10(minMax.maxY));
			minMax.maxY = temp + 1;
	}
    
    for (var i = 0; i < data.length; i++){
        var temp = {};
        var current = data[i];
        var curX = current[keys[xColumn]];
        var Xaxis = Array.isArray(curX)? curX[1]:curX;
        temp["xaxis"]=Xaxis;
        curX  = Array.isArray(curX)? linearlize(curX[0], minMax.minX, minMax.maxX, width): linearlize(curX, minMax.minX, minMax.maxX, width);
        temp[keys[xColumn]] = curX;
        if(logview){
            for(var j = 0; j < yColumn.length; j ++){
                var key = keys[yColumn[j]];
                var curY = current[key];
                curY = Array.isArray(curY)? curY[0] : curY;
                curY = Math.log10(curY);
                curY = linearlize(curY,minMax.minY,minMax.maxY,height*0.95);
                temp[key]=height*0.95 - curY;
            }
        }else{
             for(var j = 0; j < yColumn.length; j ++){
                var key = keys[yColumn[j]];
                var curY = current[key];
                curY = Array.isArray(curY)? curY[0] : curY;
                curY = linearlize(curY,minMax.minY,minMax.maxY,height*0.95);
                temp[key]= height*0.95 - curY;
            }  
        }
        temp['orgdata']=current;
        result.push(temp);
    }
    return result;
}


function scaleForBars(data, xColumn, yColumn, keys, minMax, width, height){
    
    var result = new Array();
    
    for (var i = 0; i < data.length; i++){
        var temp = {};
        var current = data[i];
        var curX = current[keys[xColumn]];
        var xAxis = Array.isArray(curX)? curX[1]: curX;
        curX  = Array.isArray(curX)? linearlize(curX[0], minMax.minX, minMax.maxX, width): linearlize(curX, minMax.minX, minMax.maxX, 100);
        temp[keys[xColumn]] = curX;
        temp["xAxis"] = xAxis;
        for(var j = 0; j < yColumn.length; j ++){
            var key = keys[yColumn[j]];
            var curY = current[key];
            curY = Array.isArray(curY)? curY[0] : curY;
            curY = linearlize(curY,minMax.minY,minMax.maxY,height*0.95);
            temp[key]= height * 0.95 - curY;
            
        }
        temp['data'] = current;
        result.push(temp);
    }
    return result;
}

function scaleStackChart(data, xColumn, yColumn, keys, minMax, width, height){
    
    var result = new Array();
    for (var i = 0; i < data.length; i++){
        var temp = {};
        var current = data[i];
        var curX = current[keys[xColumn]];
        var Xaxis = Array.isArray(curX)? curX[1]:curX;
        temp["xaxis"]=Xaxis;
        curX  = Array.isArray(curX)? linearlize(curX[0], minMax.minX, minMax.maxX, width): linearlize(curX, minMax.minX, minMax.maxX, width);
        temp[keys[xColumn]] = curX;
        var totalY = 0;
        for(var j = 0; j < yColumn.length; j ++){
            var key = keys[yColumn[j]];
            var curY = current[key];
            curY = Array.isArray(curY)? curY[0] : curY;
            totalY = totalY + curY;
            curY = linearlize(totalY,minMax.minY,minMax.maxY,height*0.95);
            temp[key]= height*0.95 - curY;
        } 
        temp['orgdata']=current;
        result.push(temp);
    }
    return result;
}

function makeXTicks(data, minMax, xColumn, keys, width){
    var isStrings = Array.isArray(data[0][keys[xColumn]]);
    var result = new Array();
    if(isStrings){
        for(var i = 0; i < data.length; i++){
            var cur = data[i][keys[xColumn]];
            var pos = linearlize(cur[0],minMax.minX,minMax.maxX,width);
            result.push({
                text: cur[1],
                x: pos
            })
        }
    } else{
        for(var i = 0; i <= 10; i++){
            var curValue = minMax.minX + (minMax.maxX-minMax.minX)*i/10; 
            curValue = parseInt(curValue);
            var pos = linearlize(curValue,minMax.minX,minMax.maxX,width);
            result.push({
                text: curValue,
                x: pos
            })
        }
    } 
    return result;
}

function makeYticks(data, minMax, yColumn, keys, logview, height){
    height = height * 0.95;
    logview = (logview==="true");
    var result = new Array();
    if(logview){
 
        var maxY = minMax.maxY;
        var minY = minMax.minY;
        for(var i = minY; i <= maxY; i++){
            cur = Math.pow(10,i);
            pos = height - linearlize(i, minY, maxY, height);
            result.push({
                text: cur,
                y: pos
            })
        }
    }else{
        for(var i = 0; i <= 10; i++){
            var curValue = minMax.minY + (minMax.maxY-minMax.minY)*i/10;
            curValue = parseInt(curValue);
            var pos = height - linearlize(curValue, minMax.minY, minMax.maxY, height);
            result.push({
              text : curValue,
              y: pos
            })
        }
    }
    return result;
}

function makeBarYticks(data, minMax, yColumn, keys, height){
    var result = new Array();
    for(var i = 0; i <= 10; i++){
        var curValue = minMax.minY + (minMax.maxY-minMax.minY)*i/10;
        curValue = parseInt(curValue);
        var pos = height * 0.95 - linearlize(curValue, minMax.minY, minMax.maxY,height*0.95);
        result.push({
          text : curValue,
          y: pos
        })
    }
    return result;
}

function createPolyLinePts(pts,xColumn, yColumn, keys){

    var result = new Array();
    
    for(var i = 0; i < yColumn.length; i++){
        var tmp = "0,0 "
        var temp = "";
        for(var j = 0; j < pts.length; j++){
            var curX = pts[j][keys[xColumn]];
            var curY = pts[j][keys[yColumn[i]]];
            temp = temp + curX + "," + curY +" ";
            if(j != pts.length-1)
                tmp = tmp + curX + "," + curY +" ";
        }
        result.push({path:temp, animation:tmp});

    }
    return result;
}

function createBarChartPts(pts, xColumn, yColumn, keys, barSize){
    var result = new Array();
    for(var i = 0; i < yColumn.length; i++){
        var temp = new Array();
        var key = keys[yColumn[i]];
        for(var j = 0; j < pts.length; j++){
            var curX = barSize * i + yColumn.length * barSize * j + barSize/2 * j;
            var curY = pts[j][key];
            var curXAxis = pts[j]["xAxis"];
            var orgdata = pts[j]['data'];
            temp.push({
              x:curX,
              y:curY,
              xaxis: curXAxis,
              orgdata: orgdata
            });
        }
        result.push(temp);
    }
    return result;
}

function createStackChartPts(pts,xColumn,keys,barSize){
    var key = keys[xColumn];
    var pos = 0
    for(var i = 0; i < pts.length; i++){
        pts[i][key] = pos;
        pos = pos + barSize + barSize * 0.5;
    }
    return pts;
}
function createXStackTicks(data,pts,xColumn, keys, barSize){
    var result = new Array();
    var key = keys[xColumn];

    var isStrings = Array.isArray(data[0][key]);
    
    if (isStrings){
        for(var i = 0; i < data.length; i++){
            var pos = pts[i][key] + barSize / 2 ;
            result.push({            
                text: data[i][key][1],
                x: pos
            })
        }    
    } else {
        var allX = new Array();
        for (var i = 0; i < data.length; i++) 
            allX.push(Number(data[i][key]));
       allX = allX.sort(CompareForSort);
        
        for (var i = 0; i < pts.length; i++){
            var pos = pts[i][key] + barSize / 2;
            result.push({            
                text: allX[i],
                x: pos
            });   
        } 
    }
    return result;
}


function createXBarTicks(data,pts,xColumn, keys){
    var result = new Array();
    var key = keys[xColumn];

    var isStrings = Array.isArray(data[0][key]);
    if (isStrings){
        for(var i = 0; i < data.length; i++){
            var pos = 0;
            for(var j = 0; j < pts.length; j++){
                pos = pts[j][i].x + pos;
            }
            pos = pos / pts.length;
            result.push({            
                text: data[i][key][1],
                x: pos
            });
        }    
    } else {
        var allX = new Array();
        for (var i = 0; i < data.length; i++)
            allX.push( Number(data[i][key]));
        allX = allX.sort(CompareForSort);
        for(var i = 0; i < allX.length; i++){
            var pos = 0;
            for(var j = 0; j < pts.length; j++){
                pos = pts[j][i].x + pos;
            }
            pos = pos / pts.length;
            result.push({            
                text: allX[i],
                x: pos
            });
        }  
    }
    return result;
}

function linearlize(data, min, max, size){
	return ((data - min) / (max - min)) * size ;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function linearColor(dimension, theme){
    
    var colors = [
                  ["blue", "green", "orange", "brown", "yellow", "red", "pink", "black", "grey"],
                  ['#c98585', '#006a89', '#003300', '#663300', '#999966', '#000066', '#091519'],
                  ['#FF6666', '#FF66FF', '#FF6600', '#FFCC99', '#33CCFF', '#00CC66', '#999966'],
                  ['pink','#c0fdff', 'yellow', '#FF9900', '#33CCCC', '#FF0000', '#CC00CC']
                 ];
    
	var remain = dimension%7;
	return colors[theme][remain];



}

function CompareForSort(first, second)
{
    if (first == second)
        return 0;
    if (first < second)
        return -1;
    else
        return 1; 
}
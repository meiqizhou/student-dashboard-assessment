var app = angular.module('myApp', []);

app.controller('myController', function($scope){
    $scope.filename = '';
    $scope.fileCount = -1;
});

app.directive('stackchart', function(){
    return{
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/stackchart.html',
        scope:{
            filename: '@',
            theme: '=',
            xcolumn: '@',
            ycolumn: '@',
            height: '@'
        },
        controller: function($scope, dataFactory){
                $scope.historyFile = new Array();
            var goback = false;
                $scope.$watch('filename',function(newValue, oldValue){
                    if (oldValue != newValue){ 
                    if(!goback)
                        $scope.historyFile.push(oldValue);
                    else
                        goback=false;
                }
               dataFactory.getData($scope.filename).success(function(d){
                   var keys = Object.keys(d[0]);
                   var xColumn = $scope.xcolumn == "undefined" ? 0 : $scope.xcolumn;
                   xColumn = Number(xColumn); 
                   var yColumn = new Array();
                   if ($scope.ycolumn=="undefined"){
                       for(var i = 0; i <keys.length;i++)
                           if(i!=xColumn)
                               yColumn.push(i);
                   }else    
                       yColumn = convertArray($scope.ycolumn); //
                   var index = yColumn.indexOf(xColumn);
                   if(index > -1) yColumn.splice(index,1);
                   var barSize = window.innerWidth / 15;
                   var width = barSize * d.length + barSize/2 * (d.length - 1) ; 
                   var height = $scope.height;
                   var data = convertData(d,keys);
                   var minMax = findMaxminSumValue(data, xColumn, yColumn, keys);
                   var pts = scaleStackChart(data, xColumn, yColumn, keys, minMax, width, height);
                   pts = sortByKey(pts,keys[xColumn]);
                   pts = createStackChartPts(pts,xColumn,keys,barSize)
                   var xticks = createXStackTicks(data,pts,xColumn,keys, barSize);
                   var yticks = makeBarYticks(data,minMax,yColumn,keys,height);
                   
                   
                   
                   $scope.keys = keys;
                   $scope.yColumn = yColumn;
                   $scope.xColumn = xColumn;
                   $scope.viewbox = "-50 0 "+width*1.25+" "+height;
                   $scope.pts = pts;
                   $scope.color = function(y){return linearColor(y, $scope.theme)};
                   $scope.xticks = xticks;
                   $scope.yticks = yticks;
                   $scope.barSize = barSize; 
                   $scope.width = width;
                   $scope.height = height;
                   var fontsize = parseInt(Math.sqrt((height * width)/1736));
                   fontsize = fontsize > 20 ? 20 : fontsize;
                   $scope.fontsize = fontsize;
                   $scope.xaxisname = keys[xColumn];
                   $scope.cursorstyle = "pointer";
                    //drilldown Location
                  if($scope.historyFile.length!=0){
                      var tmp = $scope.historyFile[$scope.historyFile.length - 1];
                      tmp = tmp.split('/');
                      tmp = tmp[1].split('.');
                      $scope.previousfilename = tmp[0] + " / ";
                  }else{
                      $scope.previousfilename = "";
                  }
                    
                   var words = $scope.filename.split("/");
                   var words2nd = words[1].split('.');
                   $scope.filecurrent = words2nd[0];
                   $scope.onclicks = function($event,pts){
                    var clicked = $event.currentTarget; 
                    var xaxis = clicked.getAttribute('xaxis');
                    var filename = "data/"+ xaxis + "/" + xaxis + ".json";
                     $scope.filename = filename;
                    };
                   
               }) .error(function(data,status,header,config){
                    console.log($scope.filename+ " Not Found");
                    $scope.onclicks = function($event,pts){};
                   $scope.cursorstyle = "null";
                });
                   
                                
                
            })
                $scope.previousclick = function($event){
                  if ($scope.historyFile.length > 0){
                    $scope.filename = $scope.historyFile.pop();  
                      goback = true;
                  }
                  else
                      alert("At the beginning");
                };
                
        }
    };
})

app.directive('barchart',function(){
    return{
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/barchart.html',
        scope:{
            filename: '@',
            theme: '=',
            xcolumn: '@',
            ycolumn: '@',
            height: '='
        },
        controller: function($scope,dataFactory){
            //create variables
            $scope.historyFile = new Array();
            var goback = false;
            $scope.$watch('filename',function(newValue, oldValue){
                //push old filenames
                if (oldValue != newValue){ 
                    if(!goback)
                        $scope.historyFile.push(oldValue);
                    else
                        goback=false;
                }
                
                dataFactory.getData($scope.filename).success(function(d){
                   var keys = Object.keys(d[0]);
                   var xColumn = $scope.xcolumn == "undefined" ? 0 : $scope.xcolumn;
                   xColumn = Number(xColumn); 
                   var yColumn = new Array();
                   if ($scope.ycolumn=="undefined"){
                       for(var i = 0; i <keys.length;i++)
                           if(i!=xColumn)
                               yColumn.push(i);
                   }else    
                       yColumn = convertArray($scope.ycolumn);
                   var index = yColumn.indexOf(xColumn);
                   if(index > -1) yColumn.splice(index,1);
                   var barSize = window.innerWidth / 30; //
                   var height = $scope.height;
                   var width = barSize*d.length*yColumn.length + barSize/2 *(d.length - 1);
                   var data = convertData(d,keys);
                   var minMax = findMaxMinValue(data, xColumn, yColumn, keys);
                   var pts = scaleForBars(data,xColumn,yColumn,keys,minMax,width,height); 
                   
                   pts = sortByKey(pts, keys[xColumn]);
                   var barPts = createBarChartPts(pts, xColumn, yColumn, keys, barSize);
                   var xticks = createXBarTicks(data,barPts,xColumn,keys);
                   var yticks = makeBarYticks(data,minMax,yColumn,keys,height);
                     
                  $scope.cursorstyle = "pointer";
                   $scope.viewbox = "-50 0 "+width*1.25+" "+height*1.1;
                   $scope.pts = barPts;
                   $scope.color = function(y){return linearColor(y, $scope.theme)};
                   $scope.xticks = xticks;
                   $scope.yticks = yticks;
                   $scope.width = width;
                   $scope.height = height;
                   $scope.barSize = barSize;    
                   var fontsize = parseInt(Math.sqrt((height * width)/1736));
                   fontsize = fontsize > 20 ? 20 : fontsize;
                   $scope.fontsize = fontsize;
                   $scope.yColumn = yColumn;
                   $scope.keys = keys;
                   $scope.xaxisname = keys[xColumn];
                    
                   //drilldown Location
                  if($scope.historyFile.length!=0){
                      var tmp = $scope.historyFile[$scope.historyFile.length - 1];
                      tmp = tmp.split('/');
                      tmp = tmp[1].split('.');
                      $scope.previousfilename = tmp[0] + " / ";
                  }else{
                      $scope.previousfilename = "";
                  }
                    
                   var words = $scope.filename.split("/");
                   var words2nd = words[1].split('.');
                   $scope.filecurrent = words2nd[0];
                     //click charts
                    $scope.onclicks = function($event,pts){
                    var clicked = $event.currentTarget; 
                    var xaxis = clicked.getAttribute('xaxis');
                    var filename = "data/"+ xaxis + "/" + xaxis + ".json";
                     $scope.filename = filename;
                                
                    };
               }).error(function(data,status,header,config){
                    console.log($scope.filename+ " Not Found");
                    $scope.cursorstyle = "null";
                    $scope.onclicks = function($event,pts){};
                    
                });
                
                
                //click for previous files
                $scope.previousclick = function($event){
                  if ($scope.historyFile.length > 0){
                    $scope.filename = $scope.historyFile.pop();  
                      goback = true;
                  }
                  else
                      alert("At the beginning");
                };
            })
               
               
        }
            
            
            
        
    };
})

app.directive('scatterchart', function(){
    
    return{
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/scatter.html',
        scope:{
            filename: '@',
            theme: '=',
            xcolumn: '@',
            ycolumn: '@',
            width: '@',
            height: '@',
            logview: '@'
        },
        controller: function($scope, dataFactory){
            $scope.historyFile = new Array();
            var goback = false;
                $scope.$watch('filename',function(newValue, oldValue){
                    if (oldValue != newValue){ 
                    if(!goback)
                        $scope.historyFile.push(oldValue);
                    else
                        goback=false;
                }
             dataFactory.getData($scope.filename).success(function(d){
                var keys = Object.keys(d[0]);  
                var width = $scope.width;
                var height = $scope.height;
                var xColumn = $scope.xcolumn == "undefined" ? 0 : $scope.xcolumn;
                   xColumn = Number(xColumn); 
                   var yColumn = new Array();
                   if ($scope.ycolumn=="undefined"){
                       for(var i = 0; i <keys.length;i++)
                           if(i!=xColumn)
                               yColumn.push(i);
                   }else    
                       yColumn = convertArray($scope.ycolumn);
                var index = yColumn.indexOf(xColumn);
                if(index > -1) yColumn.splice(index,1);
                if(index > -1) yColumn.splice(index,1);
                var data = convertData(d, keys);
                var minMax = findMaxMinValue(data, xColumn, yColumn, keys);
                var pts = scale(data, xColumn, yColumn, keys, minMax, width, height, $scope.logview);
                pts = sortByKey(pts, keys[xColumn]);
                var xticks = makeXTicks(data,minMax,xColumn,keys,width);
                var yticks = makeYticks(data,minMax,yColumn,keys,$scope.logview,height);
                
                 
                 $scope.cursorstyle = "pointer";
                $scope.viewbox = "-50 0 "+width*1.15+" "+height;
                $scope.yColumn = yColumn;
                $scope.keys = keys;
                $scope.pts = pts;
                $scope.xColumn = xColumn;
                $scope.color = function(y){ 
                        y += $scope.theme;
                        return linearColor(y, $scope.theme)
                };
                
                $scope.xticks = xticks;
                $scope.yticks = yticks;
                $scope.xaxisname = keys[xColumn];
                var fontsize = parseInt(Math.sqrt((height * width)/1736));
                fontsize = fontsize > 14 ? 14 : fontsize;
                $scope.fontsize = fontsize;
                $scope.radius = 7;

				if(width > 500){
					var divSize = width - 500;

					while( divSize >= 0 ){

						$scope.radius += 1;
						divSize -= 100;
					}
				}
                 
                   //drilldown Location
                  if($scope.historyFile.length!=0){
                      var tmp = $scope.historyFile[$scope.historyFile.length - 1];
                      tmp = tmp.split('/');
                      tmp = tmp[1].split('.');
                      $scope.previousfilename = tmp[0] + " / ";
                  }else{
                      $scope.previousfilename = "";
                  }
                    
                   var words = $scope.filename.split("/");
                   var words2nd = words[1].split('.');
                   $scope.filecurrent = words2nd[0]; 
                  $scope.onclicks = function($event,pts){
                    var clicked = $event.currentTarget; 
                    var xaxis = clicked.getAttribute('xaxis');
                    var filename = "data/"+ xaxis + "/" + xaxis + ".json";
                     $scope.filename = filename;
                                
                };
                 
            }).error(function(data,status,header,config){
                    console.log($scope.filename+ " Not Found");
                    $scope.cursorstyle = "null";
                    $scope.onclicks = function($event,pts){};
                });
           
            })
            
             $scope.previousclick = function($event){
                  if ($scope.historyFile.length > 0){
                    $scope.filename = $scope.historyFile.pop();  
                      goback = true;
                  }
                  else
                      alert("At the beginning");
                };
        }
    };
});

app.directive('linechart', function(){
    
    return{
        restrict: 'E',
        replace: true,
        templateUrl: 'partials/linechart.html',
        scope:{
            filename: '@',
            theme: '=',
            xcolumn: '@',
            ycolumn: '@',
            width: '@',
            height: '@',
            logview: '@'
        },
        controller: function($scope, dataFactory){
             //create variables
            $scope.historyFile = new Array();
            var goback = false;
            $scope.$watch('filename',function(newValue, oldValue){
                //push old filenames
                if (oldValue != newValue){ 
                    if(!goback)
                        $scope.historyFile.push(oldValue);
                    else
                        goback=false;
                }
             dataFactory.getData($scope.filename).success(function(d){
                
                var keys = Object.keys(d[0]);
                var width = $scope.width;
                var height = $scope.height;
                var xColumn = $scope.xcolumn == "undefined" ? 0 : $scope.xcolumn;
                   xColumn = Number(xColumn); 
                   var yColumn = new Array();
                   if ($scope.ycolumn=="undefined"){
                       for(var i = 0; i <keys.length;i++)
                           if(i!=xColumn)
                               yColumn.push(i);
                   }else    
                       yColumn = convertArray($scope.ycolumn);
                var index = yColumn.indexOf(xColumn);
                if(index > -1) yColumn.splice(index,1);
                var data = convertData(d, keys);
                var minMax = findMaxMinValue(data, xColumn, yColumn, keys);
                 
                var pts = scale(data, xColumn, yColumn, keys, minMax, width, height, $scope.logview);
                pts = sortByKey(pts, keys[xColumn]);
                var xticks = makeXTicks(data,minMax,xColumn,keys,width);
                var yticks = makeYticks(data,minMax,yColumn,keys,$scope.logview,height);
                var ptsPoly = createPolyLinePts(pts, xColumn, yColumn, keys);
                $scope.cursorstyle = "pointer";
                $scope.viewbox = "-50 0 "+width*1.15+" "+height;
                $scope.xColumn = xColumn; 
                $scope.yColumn = yColumn; 
                $scope.keys = keys;
                $scope.pts = ptsPoly;
                $scope.circles = pts;
                $scope.color = function(y){ 
                        y += $scope.theme;
                        return linearColor(y, $scope.theme)
                }; 
                $scope.xticks = xticks;
                $scope.yticks = yticks;
                $scope.xaxisname = keys[xColumn];
                var fontsize = parseInt(Math.sqrt((height * width)/1736));
                fontsize = fontsize > 20 ? 20 : fontsize;
                $scope.fontsize = fontsize;
                $scope.linesize = 5;
				if(width > 500){

					var divSize = width - 500;

					while( divSize >= 0 ){
						$scope.linesize += .5;
						divSize -= 100;
					}
				}
                 
                    //drilldown Location
                  if($scope.historyFile.length!=0){
                      var tmp = $scope.historyFile[$scope.historyFile.length - 1];
                      tmp = tmp.split('/');
                      tmp = tmp[1].split('.');
                      $scope.previousfilename = tmp[0] + " / ";
                  }else{
                      $scope.previousfilename = "";
                  }
                    
                   var words = $scope.filename.split("/");
                   var words2nd = words[1].split('.');
                   $scope.filecurrent = words2nd[0];
                  $scope.onclicks = function($event,pts){
                    var clicked = $event.currentTarget; 
                    var xaxis = clicked.getAttribute('xaxis');
                    var filename = "data/"+ xaxis + "/" + xaxis + ".json";
                     $scope.filename = filename;
                                
                };
               }).error(function(data,status,header,config){
                 $scope.cursorstyle = "null";
                    console.log($scope.filename+ " Not Found");
                    $scope.onclicks = function($event,pts){};
                });
               
                //click for previous files
                $scope.previousclick = function($event){
                  if ($scope.historyFile.length > 0){
                    $scope.filename = $scope.historyFile.pop();  
                      goback = true;
                  }
                  else
                      alert("At the beginning");
                };
            })
                  
        }
        
    };
})

app.directive('axis', function(){
    
    return{
        restrict: 'E',
        replace: true,
        templateNamespace: 'svg',
        templateUrl: 'partials/axis.html',
        scope:{
            xticks: '=',
            yticks : '=',
            width : '@',
            height: '@',
            fontsize:'@',
            xaxisname: '@'
        } 
    };
})


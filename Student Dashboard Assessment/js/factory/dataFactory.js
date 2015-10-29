app.factory('dataFactory', function($http){

   return{
        getData : function(filename){
            
            return $http({
                url: filename,
                method: 'GET'
            })
        }
       
   }
   
});


app.factory('convertFactory', function($q,dataFactory){
    return{
        convertData: function(filename){
            
            var pts = new Array;
            var defer = $q.defer();
            dataFactory.getData(filename).success(function(data){
            
                var keys = Object.keys(data[0]);
                
                for (var i = 0; i < data.length; i++){
                    var temp = {};
                    for ( var j = 0; j < keys.length; j++){
                        var cur = Number(data[i][keys[j]]);    
                        if (isNaN(cur)){
                            cur = [j, data[i][keys[j]]];
                        }    
                        temp[keys[j]]=cur;
                    }
                    pts.push(temp);
                    
                }
                defer.resolve(pts);
            })
            return defer.promise;
        }     
        
    }
    
});

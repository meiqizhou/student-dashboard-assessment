#Author 
HLS design: Quantilus font-end team;
Hadoop Map-Reduce coding: Meiqi Zhou, Phun;
Java algorithm design: Meiqi Zhou;

#Student DashBoard Assessment

#What is used for?
student DashBoard Accessment is a Hadoop based project that clean the USA high-school students score and show result in HLS, help clients easily get a clear understanding of education for different States, Distrints, Schools and Sections, make it easier for student choose for their target education palce. All Raw data from Amazon collection, about 100GB CSV file.

#Tools and Technology used
Hadoop Map-Reduce, Java, HLS

#HLS 

#What is used for?
HLS which stands for Histogram, Bar, Line and Scatter charts. HLS API is created to be a easy to use library for data analysis. Our goal is to see the correlations between your data in a easy to read and useful way.  HLS API also has interativity for your data. HLS API will create visualization in following statistics charts: scatter charts, histogram plots, line charts, and bar charts. Our charts have features built into it to allow data to have drill downs.  See below for full explanation on how drill downs work.  HLS will work on any device with any device size and will still look good.


#Tools and Technology used
For Data visualization, we are using AngularJS, JavaScript, HTML5 and CSS. HLS emphasis on efficient manipulation of your data. It supports large data sets and dynamic behaviors. We will use composite filter effect on different charts. HLS has SVG animations that will run for 1.5 seconds when the chart is refreshed.

#ScreenShots
![Alt text](https://github.com/RichardFelix/HLSv2/raw/master/Pics/linechartV2.PNG "Line Chart")
![Alt text](https://github.com/RichardFelix/HLSv2/raw/master/Pics/scatterV2.PNG "Scatter Chart")
![Alt text](https://github.com/RichardFelix/HLSv2/raw/master/Pics/stackChart.PNG "Stack Chart A.K.A. Histogram")
![Alt text](https://github.com/RichardFelix/HLSv2/raw/master/Pics/barchartv2.PNG "Bar Chart")		
		
#Installation
Download this repository and include the JavaScript files in the head section of your web page as shown below.

		<script type="text/javascript" src = "lib/angular.min.js"></script>
		<link rel="stylesheet" href="css/hls.css">
        <script type = "text/javascript" src = "js/HLSapp.js"> </script>
        <script type = "text/javascript" src ="js/factory/dataFactory.js"></script>
        <script type = "text/javascript" src = "js/HLSfunctions.js"></script>
        <script type = "text/javascript" src = "js/HLSwrapper.js"> </script>
        <script type="text/javascript" src="js/HLSinteraction.js"></script>
        

# Compatibility 
HLS will only work with .json files.	
HLS can run on multiple updated browsers full list is below. 

Internet    Explorer  9+    
Firefox   31+   
Chrome    31+   
Safari     7+   
Opera     29+   
IOS Safari    7.1+  
Opera      8+   
 Mini     
Android Browser     4.4+    
Chrome  Android    42+      

#Drill Down Functionality Instructions	
To use our drill down function you have to drop your data files into the data folder in this manner.  	
![Alt text](https://github.com/RichardFelix/HLSv2/raw/master/Pics/teirs.PNG "Drill Down")		
The top teir can be called any file name.  The lower tiers must be named and in folders that match the corresponding x-axis choice.  For example in the photo above the x-axis of the chart would of been middle and that x-axis name would of been bottom. 

#Sample Code	
This code made the screenshots above very easy to use, Enjoy.	

	<script type="text/javascript">

	    //...HLS code goes here

            var chart4 = new scatterChart('data/test.json');
            
            var chart3 = new barChart('data/test.json',0,[1,2,3]);
            chart3.setTheme('dark');
            
            var chart = new stackChart('data/test.json',0,[1,2,3]);
            chart.setTheme('light');
            
            var chart2 = new lineChart('data/test.json',0,[1,2,3]);
            chart2.setTheme('neon');

	</script>



#User Functions
lineChart( String filePath [, int Xcolumn, [int Ycolumn], int width, int height, string theme, boolean logview] )	
	-Will draw a line chart with the given data file		
	-Optional Xcolumn and Ycolumn axis array which are the columns of the data of your choice		
   	    -If no Xcolumn, it will use the first column (make sure first column is a primary key).		
   	    -If no Ycolumn, it will use all other columns except Xcolumn.	
	-Optional width and height can be chosen by user	
            -if null or no width and height are chosen then HLS will use your browser width and height	
        -Optional theme can be chosen from these three choices ( 'dark', 'light', 'neon')	
            -if no theme is chosen HLS will color it with the default array of colors	
        -Optional logview toggle false to toggle the view off and true for on	
            -if no logview value is given then HLS will have it toggle off by default

scatterChart( String filePath [, int Xcolumn, [int Ycolumn], int width, int height, string theme, boolean logview] )	
	-Will draw a scatter chart with the given data file		
	-Optional Xcolumn and Ycolumn axis array which are the columns of the data of your choice			
   	    -If no Xcolumn, it will use the first column (make sure first column is a primary key).		
   	    -If no Ycolumn, it will use all other columns except Xcolumn.	
	-Optional width and height can be chosen by user	
            -if null or no width and height are chosen then HLS will use your browser width and height	
        -Optional theme can be chosen from these three choices ( 'dark', 'light', 'neon')	
            -if no theme is chosen HLS will color it with the default array of colors		                
        -Optional logview toggle false to toggle the view off and true for on	
            -if no logview value is given then HLS will have it toggle off by default                

barChart( String filePath [, int Xcolumn, [int Ycolumn], int width, int height, string theme])	
	-Will draw a histogram chart with the given data file		
	-Optional Xcolumn and Ycolumn axis array which are the columns of the data of your choice		
            -If no Xcolumn, it will use the first column (make sure first column is a primary key).		
   	    -If no Ycolumn, it will use all other columns except Xcolumn.	
	-Optional width and height can be chosen by user	
                -if null or no width and height are chosen then HLS will use your browser width and height	
        -Optional theme can be chosen from these three choices ( 'dark', 'light', 'neon')	
            -if no theme is chosen HLS will color it with the default array of colors	       		
               
stackChart( String filePath [, int Xcolumn, [int Ycolumn], int width, int height, string theme])	
	-Will draw a bar chart with the given data file		
	-Optional Xcolumn and Ycolumn axis array which are the columns of the data of your choice		
            -If no Xcolumn, it will use the first column (make sure first column is a primary key).		
   	    -If no Ycolumn, it will use all other columns except Xcolumn.	
	-Optional width and height can be chosen by user	
                -if null or no width and height are chosen then HLS will use your browser width and height		
        -Optional theme can be chosen from these three choices ( 'dark', 'light', 'neon')	
            -if no theme is chosen HLS will color it with the default array of colors		

chartObject.setTheme( String theme )	
        -Will change theme for your chart object		
        -Themes choices are ( 'dark', 'light', 'neon ) also null can be used to change chart back to default theme








<%@ page import="java.io.*,java.util.*,java.sql.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql"%>
 
<html>
<head>
<title>SELECT Operation</title>
</head>
<body>
 
<sql:setDataSource var="snapshot" driver="com.mysql.jdbc.Driver"
     url="jdbc:mysql://localhost/test"
     user="root"  password="melo1523"/>
<sql:query dataSource="${snapshot}" var="result">
SELECT * from test;
</sql:query>
 <p id="demo"></p>
    <script>
        var text = '{"sale":[';
    </script>

<c:forEach var="row" items="${result.rows}">
    <script>
        text += '{"month":"${row.month}","sales":"${row.sales}","sales1":"${row.sales1}","sales2":"${row.sales2}" },';        
    </script>
</c:forEach>
    <script>
        var data = text.slice(0, text.length-1) + ']}';
        obj = JSON.parse(data);
        console.log(obj);
    </script>
<!--</table>-->
 
</body>
</html>
// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";
 
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'innitel-node-chat';
 
// Port where we'll run the websocket server
var webSocketsServerPort = 1337;
 
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
 
/**
 * Global variables
 */

var connectionsObj = {};


var adminUserNameAndPassword = {
    'http://www.ynet.co.il' : {
        "admin":"yanivdror",
        "password":"1234"
    },
    'http://www.walla.co.il' : {
         "admin":"yanivdror",
        "password":"1234"       
    },
    'http://www.stvi.co.il':{
         "admin":"yanivdror",
        "password":"1234"           
    }
}

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
 
}).listen(webSocketsServerPort,function() {
    console.log((new Date()) + ' Server is listening on port 1337');
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer: server
});

 
// WebSocket server
wsServer.on('request', function(request) {

    console.log(request);
    var connection = request.accept(null, request.origin);

    // key in connectionsObj to hold connections objects by userName
    var objKey = request.origin;

    //check if its a known website
    if(!adminUserNameAndPassword[objKey]){

        //send the client notification
        connection.sendUTF(JSON.stringify({eror:"website not allowd to connect"}));
        connection.close(null,"website not allowd to connect");

        return;        
    }


    //check if the admin connected this request should come only from regular chat user
    if(request.resourceURL.query.check_admin_conn){

        var checkAdmin = request.resourceURL.query.check_admin_conn;
        var isAdminConnected = false;

        //check browser window.location for security
        if(checkAdmin === objKey){

            if(checkIfAdminConnected(objKey)){
                isAdminConnected = true; 
            }            
        }

        //close the connection anyway pass 
        connection.sendUTF(JSON.stringify({adminConnection:isAdminConnected}));
        connection.close(null,"is admin connected close");

        return;
    }

    /*
    //start second request after checkif admin connected or not   
    */


    // ---------------temporary-------------
    var userID = request.resourceURL.query.user_id; 



    // get the userName
    var userName = request.resourceURL.query.user_name;

    //check if the connection is admin that contains the password
    if(request.resourceURL.query.password){

        var adminRequestPassword = request.resourceURL.query.password;

        //if it as password assuming its admin connection and check it
        if(!adminConnectionLogInCheck(userName,adminRequestPassword,objKey)){

            //admin connection username and password failes close the connection
            connection.sendUTF(JSON.stringify({eror:"admin connection failed"}));
            connection.close(null,"admin connection failed");

            return;
        }

        /*
        //admin connection passed username and password stage
        */

        if(connectionsObj[objKey] === undefined){
            connectionsObj[objKey] = {};
        }

        //set adminConnected property to true        
        connectionsObj[objKey]["adminConnected"] = true;
        connection["adminConnection"] = true;

        //send admin connection message to verify
        connection.sendUTF(JSON.stringify({isAdmin:true}));

    }

    console.log("total server connections: "+request.socket.server._connections);
    
    //user_name not exist continue
    if(!(userName in connectionsObj[objKey])){

            var newConection = connectionsObj[objKey][userName] = connection;               


            //add userName key to know the connection key by name for removing from connectionsObj in close event
            newConection["userName"] = userName;

            //add parentObj key to know the connection parent(website) for removing from connectionsObj in close event  
            newConection["parentObj"] = objKey;


            newConection["userID"] = userID;

            if(newConection.adminConnection){
                var adminUserName = userName;
            }


            //send all website chat user to administrator
            showAdminChat(objKey);


            console.log(newConection.userName+" "+newConection.userID+ " is connected in "+objKey+" chat");
            console.log("--------------------------------------------------------------------------");       
    }       




    connection.on('message', function(message) {

        var adminUserName = adminUserNameAndPassword[this.parentObj].admin;

        if(message.utf8Data){

            var theMsg = JSON.parse(message.utf8Data);

            if(theMsg.from && theMsg.to && theMsg.msg){

                if(theMsg.from === adminUserName){
                 
                    if(theMsg.theAdminUserName){

                    }
                    messageFromAdmin(objKey,theMsg.from,theMsg.to,theMsg.msg,theMsg.theAdminUserName);
                }

                if(theMsg.to === 'chat-admin'){
                    theMsg.to = adminUserName;
                    messageToAdmin(objKey,theMsg.from,theMsg.to,theMsg.msg);               
                }
            }

        }
    });


    connection.on('close', function(message, description) {

        //check if the connection was not close because the user_name already exist in the website
        if(!(description === "user_name already exist" || description === "close connection chat admin is not connected")){

            console.log(this.userName+" "+this.userID+" is dissconnected from "+this.parentObj);

            if(this.adminConnection){

                console.log("this admin");
                //set adminConnected property to false            
                connectionsObj[objKey]["adminConnected"] = false;

                adminOutChat(objKey,"admin dissconnected from chat");

                // remove the connection from connectionsObj
                delete connectionsObj[this.parentObj][this.userName];

                return;
            }

            console.log("-----------------------------------");

            // remove the connection from connectionsObj
            delete connectionsObj[this.parentObj][this.userName];

            //updating the admin chat 
            showAdminChat(this.parentObj); 

        }
        else{

            if(description === "user_name already exist"){
                console.log("connection was close because user_name already exist");
            }

            if(description === "close connection chat admin is not connected"){
                console.log("close connection chat admin is not connected");
            }

        }      

    });


});


function adminConnectionLogInCheck(adminUserName,adminPasswors,origin){

    //double check if the connection is to website that exist in adminUserNameAndPassword Object
    if(adminUserNameAndPassword[origin]){

        //get the original username and password parameters
        var adminOrigin = adminUserNameAndPassword[origin];
        var adminOriginalUserName = adminOrigin.admin;
        var adminOriginalPassword = adminOrigin.password;

    }

    //double check that adminUserNameAndPassword[origin] makes an adminOrigin varible
    if(adminOrigin){

        //check if username and password mach
        if(adminOriginalUserName === adminUserName && adminOriginalPassword === adminPasswors){
            console.log("admin username and password ok");
            return true;         
        }

        return false;
    }
}


function checkIfAdminConnected(origin){

    if(connectionsObj[origin]){

        if(connectionsObj[origin].adminConnected){
            return true;
        }
    }

    return false;    
}


function messageToAdmin(origin,from,to,msg){

   if(connectionsObj[origin][from] && connectionsObj[origin][to]){

        var theTextObj = {
                            "from":from,
                            "to":'chat-admin',
                            "msg":msg
                        }

        //send message from one client to another
        connectionsObj[origin][to].sendUTF(JSON.stringify({newMessage:theTextObj}));

        //send the message back to sender chat
        connectionsObj[origin][from].sendUTF(JSON.stringify({newMessage:theTextObj})); 
       
   }

}

function messageFromAdmin(origin,from,to,msg,adminChatUserName){

   if(connectionsObj[origin][from] && connectionsObj[origin][to]){

        var theTextObj = {
                            "from":adminChatUserName,
                            "to":to,
                            "msg":msg
                        }

        //send message from one client to another
        connectionsObj[origin][to].sendUTF(JSON.stringify({newMessage:theTextObj}));

        //send the message back to sender chat
        connectionsObj[origin][from].sendUTF(JSON.stringify({newMessage:theTextObj})); 
       
   }

}

function showAdminChat(origin){

    var theWebsiteObj = connectionsObj[origin];
    var theWebsiteAdminUserName = adminUserNameAndPassword[origin].admin;

    var allConnections = Object.keys(theWebsiteObj);
    removeA(allConnections, 'adminConnected');

    if(theWebsiteObj.adminConnected){
     theWebsiteObj[theWebsiteAdminUserName].sendUTF(JSON.stringify({chatUsers:allConnections}));       
    }

}

function adminOutChat(origin){

    var theWebsiteObj = connectionsObj[origin];

    var allConnections = Object.keys(theWebsiteObj);
    removeA(allConnections, 'adminConnected');

   for(var i=0; i<allConnections.length; i++){


    messageFromAdmin(origin,"dddd",allConnections[i],"admin left the chat");

    connectionsObj[origin][allConnections[i]].sendUTF(JSON.stringify({newMessage:"admin left the chat"}));

   }

}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}



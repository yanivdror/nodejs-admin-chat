(function(parent) {

var connectionObj = {};
var theUserInfoObj = {};

//check if website admin connected if not close the connection
function checkAdminConnection(){

	var isAdminConnected = new WebSocket('ws://127.0.0.1:1337?check_admin_conn='+location.origin);

	isAdminConnected.onmessage = function(msg){

			var theMessage = JSON.parse(msg.data);
			
			if(theMessage.adminConnection){
				console.log("admin connected");
				initAdminConnectedChat();
			}

			if(theMessage.otherChatUsers){
				console.log(theMessage.otherChatUsers);
				initAdminNotConnectedChat();
			}
	}
}

function initAdminConnectedChat(){

	var enterUserName = createElementFunc('div');
	setAttributeFunc(enterUserName,"id", "enterUserName");
	setAttributeFunc(enterUserName,"style", "display:table;position:fixed;background:green;top:0;direction:rtl;z-index:999;");
	innerHTMLFunc(enterUserName, "מנהל האתר מחובר");

	var enterUserNameInput = createElementFunc('input');
	setAttributeFunc(enterUserNameInput,"type","text");	
	setAttributeFunc(enterUserNameInput,"id","userNameInput");	

	var enterUserButton = createElementFunc('input');
	setAttributeFunc(enterUserButton,"type","button");		
	setAttributeFunc(enterUserButton,"value","בחר שם משתמש");
	setAttributeFunc(enterUserButton,"onclick","yanivChat.submitUserName()");

	appendChildFunc(enterUserName, enterUserNameInput);
	appendChildFunc(enterUserName, enterUserButton);
	appendChildFunc(document.body, enterUserName);	
}


function submitUserName(){

	var theInputVal = document.querySelector("#userNameInput").value;
	theUserInfoObj.userName = theInputVal;
	connectToChat();
}

function sendMessage(){

	var	sender = theUserInfoObj.userName;
	var sendTo = 'chat-admin';
	var message = querySelectorValueFunc('#sendMsgTextInput');
	
	connectionObj.userConnection.send(JSON.stringify({from:sender,to:sendTo,msg:message}));

	querySelectorFunc('#sendMsgTextInput').value = "";
}


function plusSignClick(elem){


	if(elem.classList.contains('isOpen')){

		elem.classList.remove('isOpen');
		elem.classList.add('isClose');		

		closeThisUserChat();

		return;		
	}

	if(elem.classList.contains('isClose')){

		elem.classList.remove('isClose');
		elem.classList.add('isOpen');

		showThisUserChat();

		return;		
	}

	
}

//-------------------------START connectToChat scope--------------------------------
function connectToChat(){
	
	
	removeEnterUserNameDiv();

	
	
//-------------------------START chatEvents functions-----------------------------------

	function removeEnterUserNameDiv(){

		var catchEnterUserNameDiv = querySelectorFunc('#enterUserName');		
		removeChildFunc(document.body, catchEnterUserNameDiv);
		
		initChatConnection();
	}
	
	function initChatConnection(){

		connectionObj.userConnection = new WebSocket('ws://127.0.0.1:1337?user_id=127&user_name='+theUserInfoObj.userName);	

		connectionObj.userConnection.onmessage = function(msg){
			
			var theMessage = JSON.parse(msg.data);

			
			if(theMessage.newMessage){

				if(theMessage.newMessage === "admin left the chat"){
					
					adminLeftTheChat();

					return;
				}

				writeToChat(theMessage.newMessage);
			}
			
			if(theMessage.eror){
				console.log(theMessage.eror);	
			}	
		}

		buildOpenChat();
		buildUsersChatBox();
	}	

	function buildOpenChat(){

		var chatUserTableElem = createElementFunc('div');
		setAttributeFunc(chatUserTableElem,"id","chatUserTableElem");
		setAttributeFunc(chatUserTableElem,"style","display:table;position:fixed;background:transparent;top:0;direction:rtl;z-index:999;left:0;max-width:200px;");

		var chatUserRowElem = createElementFunc('div');
		setAttributeFunc(chatUserRowElem,"class","chatUserRowElem");
		setAttributeFunc(chatUserRowElem,"id","row-user");
		setAttributeFunc(chatUserRowElem,"style","display:table-row;");

		var chatUserNameCellElem = createElementFunc('div');
		setAttributeFunc(chatUserNameCellElem,"id","chat-user-cell");
		setAttributeFunc(chatUserNameCellElem,"style","display:table-cell;background:#d8e2d0;padding:0 8px;width:100%;");
		innerHTMLFunc(chatUserNameCellElem, theUserInfoObj.userName);

		var chatUserPlusSignCell = createElementFunc('div');
		setAttributeFunc(chatUserPlusSignCell,"id","chatUserPlusSignCell");
		setAttributeFunc(chatUserPlusSignCell,"class","isOpen");
		setAttributeFunc(chatUserPlusSignCell,"style","display:table-cell;padding:5px;cursor:pointer;background:#3e413b;color:#fff;font-size:20px;text-align:center;font-weight:bold;min-width:20px;");
		setAttributeFunc(chatUserPlusSignCell,"onclick","yanivChat.plusSignClick(this)");
		innerHTMLFunc(chatUserPlusSignCell, "-");

		var unReadMessagesCellElem = createElementFunc('div');
		setAttributeFunc(unReadMessagesCellElem,"style","display:table-cell;background:transparent;min-width:30px;text-align:center;");

		var unReadMessagesSpanElem = createElementFunc('span');
		setAttributeFunc(unReadMessagesSpanElem,"id","unReadMessagesCellElem");	

		appendChildFunc(unReadMessagesCellElem,unReadMessagesSpanElem);								
		appendChildFunc(chatUserRowElem,unReadMessagesCellElem);
		appendChildFunc(chatUserRowElem,chatUserPlusSignCell);			
		appendChildFunc(chatUserRowElem,chatUserNameCellElem);
		appendChildFunc(chatUserTableElem,chatUserRowElem);					
		appendChildFunc(document.body,chatUserTableElem);	

	}


	function buildUsersChatBox(){


		var chatUserBoxTableElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxTableElem,"class","chatUserBoxTableElem");
		setAttributeFunc(chatUserBoxTableElem,"id","chatUserBoxTableElem");
		setAttributeFunc(chatUserBoxTableElem,"style","display:table;position:fixed;background:green;top:0;direction:rtl;z-index:999;left:50%;");	

		var chatUserBoxTitleElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxTitleElem,"class","chatUserBoxTitleElem");
		setAttributeFunc(chatUserBoxTitleElem,"style","display:block;background:#3e413b;font-family:tahoma;padding:10px;font-weight:bold;color:#fff;cursor:pointer;");	
		innerHTMLFunc(chatUserBoxTitleElem, "ברוך הבא "+theUserInfoObj.userName);			

		var chatUserBoxRowElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxRowElem,"class","chatUserBoxRowElem");
		setAttributeFunc(chatUserBoxRowElem,"id","row-chat-box");
		setAttributeFunc(chatUserBoxRowElem,"style","display:block;");

		var chatUserBoxCellElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxCellElem,"id","chatUserBoxCellElem");

		var msgUl = createElementFunc('ul');
		setAttributeFunc(msgUl,"id", "msgUl");
		setAttributeFunc(msgUl,"style","background: #fff;padding:10px;max-height:200px;overflow-y:auto;");

		var sendMsgRowElem = createElementFunc('div');
		setAttributeFunc(sendMsgRowElem,"class","sendMsgRowElem");
		setAttributeFunc(sendMsgRowElem,"id","send-msg");
		setAttributeFunc(sendMsgRowElem,"style","display:block;padding:5px;background:#3e413b;border-radius: 0 0 10px 10px;");

		var sendMsgTextInputCellElem = createElementFunc('div');
		setAttributeFunc(sendMsgTextInputCellElem,"id","sendMsgTextInputCellElem");
		setAttributeFunc(sendMsgTextInputCellElem,"style","display:table-cell;");

		var sendMsgSpaceEmptyCellElem = createElementFunc('div');
		setAttributeFunc(sendMsgSpaceEmptyCellElem,"id","sendMsgSpaceEmptyCellElem");
		setAttributeFunc(sendMsgSpaceEmptyCellElem,"style","display:table-cell;min-width:10px;");		

		var sendMsgBtnInputCellElem = createElementFunc('div');
		setAttributeFunc(sendMsgBtnInputCellElem,"id","sendMsgBtnInputCellElem");
		setAttributeFunc(sendMsgBtnInputCellElem,"style","display:table-cell;");

		var sendMsgTextInput = createElementFunc('input');
		setAttributeFunc(sendMsgTextInput,"type","text");
		setAttributeFunc(sendMsgTextInput,"style","padding:5px;border:0;height:100%;border-radius:10px;");		
		setAttributeFunc(sendMsgTextInput,"id","sendMsgTextInput");		

		var sendMsgBtnInput = createElementFunc('input');
		setAttributeFunc(sendMsgBtnInput,"type","button");					
		setAttributeFunc(sendMsgBtnInput,"value","שלח הודעה");
		setAttributeFunc(sendMsgBtnInput,"style","width:100%;cursor:pointer;background:#00e500;font-family:tahoma;font-weight:bold;color:#fff;border:0;height:100%;padding:0 5px;border-radius:10px;");			
		setAttributeFunc(sendMsgBtnInput,"onclick","yanivChat.sendMessage()");


		appendChildFunc(chatUserBoxCellElem,msgUl);
		appendChildFunc(chatUserBoxRowElem,chatUserBoxCellElem);

		appendChildFunc(sendMsgBtnInputCellElem,sendMsgBtnInput);
		appendChildFunc(sendMsgTextInputCellElem,sendMsgTextInput);		
		appendChildFunc(sendMsgRowElem,sendMsgTextInputCellElem);
		appendChildFunc(sendMsgRowElem,sendMsgSpaceEmptyCellElem);		
		appendChildFunc(sendMsgRowElem,sendMsgBtnInputCellElem);

		appendChildFunc(chatUserBoxTableElem,chatUserBoxTitleElem);
		appendChildFunc(chatUserBoxTableElem,chatUserBoxRowElem);
		appendChildFunc(chatUserBoxTableElem,sendMsgRowElem);


		appendChildFunc(document.body,chatUserBoxTableElem);
	}

//-------------------------END chatEvents functions-----------------------------------


}


//-------------------------END connectToChat scope--------------------------------

//-------------------------START general use functions--------------------------------


function writeToChat(chatObj){

	var from = chatObj.from;
	var theMsg = chatObj.msg;
	var newMsg = createElementFunc('li');
	var chatLiStyle = "padding:10px;border-radius:5px;margin-top:5px;display:block;";
	var msgUl = querySelectorFunc('#chatUserBoxCellElem > #msgUl');	

	if(from === theUserInfoObj.userName){
		setAttributeFunc(newMsg,"style",chatLiStyle+"background:#CFDBC5;");
	}

	if(from !== theUserInfoObj.userName){

		setAttributeFunc(newMsg,"style",chatLiStyle+"background:#BCED91;");
	}


	innerHTMLFunc(newMsg, chatObj.from+" :<br />"+chatObj.msg);
	appendChildFunc(msgUl, newMsg);

	ifUserChatBoxClosed();

	scrollListener(msgUl);

}



function ifUserChatBoxClosed(){

	var isOpenOrClose = querySelectorFunc('#chatUserPlusSignCell');

	if(isOpenOrClose.classList.contains('isClose')){

		var unReadElem = querySelectorFunc('#unReadMessagesCellElem');

		setAttributeFunc(unReadElem,"style","background:red;border-radius:10px;padding:5px;");

		if(unReadElem.innerHTML === ""){			
			unReadElem.innerHTML = 1;			
		}else{
			unReadElem.innerHTML = parseInt(unReadElem.innerHTML)+1;
		}	

	}
}

function scrollListener(msgUl){

	var theElem = msgUl;

	if(theElem.clientHeight < theElem.scrollHeight){
		theElem.scrollTop = theElem.scrollHeight;
	}
}

function showThisUserChat(){

	var unReadMessagesElem = querySelectorFunc('#unReadMessagesCellElem');

	//reset the unRead messages
	if(unReadMessagesElem.innerHTML !== ""){
		unReadMessagesElem.innerHTML = "";
		setAttributeFunc(unReadMessagesElem,"style","");		
	}

	var chatchThisChat = querySelectorFunc('#chatUserBoxTableElem');
	chatchThisChat.style.display = "table";

	var plusSignElem = querySelectorFunc('#chatUserPlusSignCell');
	innerHTMLFunc(plusSignElem, "-");
}

function closeThisUserChat(){

	var chatchThisChat = querySelectorFunc('#chatUserBoxTableElem');
	chatchThisChat.style.display = "none";

	var plusSignElem = querySelectorFunc('#chatUserPlusSignCell');
	innerHTMLFunc(plusSignElem, "+");
}

function adminLeftTheChat(){

	var chatObj = {

		from:"הודעה חשובה",
		msg:"מנהל הצאט עזב הצאט עומד להסגר"
	}

	writeToChat(chatObj);

}

function arrayLength(arr){
	return arr.length;
}

function createElementFunc(elem){
	return document.createElement(elem);	
}

function setAttributeFunc(elem, attr, value){
	return elem.setAttribute(attr,value)
}

function innerHTMLFunc(elem, value){
	return elem.innerHTML = value;
}

function appendChildFunc(elem, value){
	return elem.appendChild(value);
}

function removeChildFunc(elem, value){
	return elem.removeChild(value);	
}

function querySelectorFunc(attr){
	return document.querySelector(attr);	
}

function querySelectorValueFunc(attr){
	return document.querySelector(attr).value;
}

//-------------------------END general use functions--------------------------------

	// Expose only our public stuff
	parent.yanivChat = {
		checkAdminConnection:checkAdminConnection,
		submitUserName:submitUserName,
		sendMessage: sendMessage,
		plusSignClick:plusSignClick
	};	
	
})(window);		

yanivChat.checkAdminConnection();
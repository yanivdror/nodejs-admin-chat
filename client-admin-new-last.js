
(function(parent) {

// object to contain chat users HTML elements
var existChatUsersObj = {};
var connectionObj = {};
var alreadyUsedUniqeNumbers= [];


//-------------------------START yanivChat Object functions --------------------------

function initAdminChat(){
	
	var adminLoginPanelTable = createElementFunc('div');
	setAttributeFunc(adminLoginPanelTable,"id", "adminLoginPanelTable");
	setAttributeFunc(adminLoginPanelTable,"style", "display:table;position:fixed;background:green;top:0;direction:rtl;text-align:right;padding:10px;z-index:999;");

	var enterUserNameRow = createElementFunc('div');
	setAttributeFunc(enterUserNameRow,"id", "enterUserNameRow");
	setAttributeFunc(enterUserNameRow,"style", "display:table-row");

	var enterUserNameCell = createElementFunc('div');
	setAttributeFunc(enterUserNameCell,"id", "enterUserNameCell");
	setAttributeFunc(enterUserNameCell,"style", "display:table-cell");
	innerHTMLFunc(enterUserNameCell, "שם משתמש: ");	

	var enterUserNameInputCell = createElementFunc('div');
	setAttributeFunc(enterUserNameInputCell,"id", "enterUserNameInputCell");
	setAttributeFunc(enterUserNameInputCell,"style", "display:table-cell");

	var enterUserNameInput = createElementFunc('input');
	setAttributeFunc(enterUserNameInput,"type","text");	
	setAttributeFunc(enterUserNameInput,"id","userNameInput");

	var enterPasswordRow = createElementFunc('div');
	setAttributeFunc(enterPasswordRow,"id", "enterPasswordRow");
	setAttributeFunc(enterPasswordRow,"style", "display:table-row");

	var enterPasswordCell = createElementFunc('div');
	setAttributeFunc(enterPasswordCell,"id", "enterPasswordCell");
	setAttributeFunc(enterPasswordCell,"style", "display:table-cell");
	innerHTMLFunc(enterPasswordCell, "סיסמה: ");	

	var enterPasswordInputCell = createElementFunc('div');
	setAttributeFunc(enterPasswordInputCell,"id", "enterPasswordInputCell");
	setAttributeFunc(enterPasswordInputCell,"style", "display:table-cell");

	var enterPasswordInput = createElementFunc('input');
	setAttributeFunc(enterPasswordInput,"type","password");	
	setAttributeFunc(enterPasswordInput,"id","enterPasswordInput");

	var senBtnRow = createElementFunc('div');
	setAttributeFunc(senBtnRow,"id", "senBtnRow");
	setAttributeFunc(senBtnRow,"style", "display:table-row");	

	var senBtnEmptyCell = createElementFunc('div');
	setAttributeFunc(senBtnEmptyCell,"id", "senBtnEmptyCell");
	setAttributeFunc(senBtnEmptyCell,"style", "display:table-cell");

	var senBtnInputCell = createElementFunc('div');
	setAttributeFunc(senBtnInputCell,"id", "senBtnInputCell");
	setAttributeFunc(senBtnInputCell,"style", "display:table-cell");

	var senBtnInput = createElementFunc('input');
	setAttributeFunc(senBtnInput,"type","button");
	setAttributeFunc(senBtnInput,"style","width:100%;cursor:pointer;");		
	setAttributeFunc(senBtnInput,"value","שלח");
	setAttributeFunc(senBtnInput,"onclick","yanivChat.submitUserName()");

	appendChildFunc(enterUserNameInputCell, enterUserNameInput);
	appendChildFunc(enterUserNameRow, enterUserNameCell);		
	appendChildFunc(enterUserNameRow, enterUserNameInputCell);

	appendChildFunc(enterPasswordInputCell, enterPasswordInput);
	appendChildFunc(enterPasswordRow, enterPasswordCell);		
	appendChildFunc(enterPasswordRow, enterPasswordInputCell);

	appendChildFunc(senBtnInputCell, senBtnInput);
	appendChildFunc(senBtnRow, senBtnEmptyCell);		
	appendChildFunc(senBtnRow, senBtnInputCell);	

	appendChildFunc(adminLoginPanelTable, enterUserNameRow);
	appendChildFunc(adminLoginPanelTable, enterPasswordRow);
	appendChildFunc(adminLoginPanelTable, senBtnRow);	
	appendChildFunc(document.body, adminLoginPanelTable);
	
}


function submitUserName(){

	var theUserNameVal = connectionObj.userNameValue = querySelectorValueFunc("#userNameInput");
	var thePasswordVal = querySelectorValueFunc("#enterPasswordInput");

	connectToChat(theUserNameVal, thePasswordVal);
}


function sendMsg(sendObj){

	var	sender = sendObj.adminName;
	var sendTo = sendObj.thisUser;
	var message = querySelectorValueFunc('#sendMsgTextInput-'+sendObj.inputUniqeNumber);
	var adminChatNameInputValue = querySelectorValueFunc('#adminChatNameInput');

	connectionObj.userConnection.send(JSON.stringify({from:sender,to:sendTo,msg:message,theAdminUserName:adminChatNameInputValue}));	

	querySelectorFunc('#sendMsgTextInput-'+sendObj.inputUniqeNumber).value = "";

}

function plusSignClick(elem){

	var theElemTempIdNumber = getElemUniqeNumber(elem);

	if(elem.classList.contains('isClose')){

		showThisUserChat(theElemTempIdNumber);

		elem.classList.remove('isClose');
		elem.classList.add('isOpen');

		return;
	}


	if(elem.classList.contains('isOpen')){

		closeThisUserChat(theElemTempIdNumber);
		
		elem.classList.remove('isOpen');
		elem.classList.add('isClose');

		return;		
	}
	
}


//-------------------------END yanivChat Object functions --------------------------

//-------------------------START connectToChat scope--------------------------------
function connectToChat(theUserName,thePassword){

	var adminInfoObj = {};
	var adminSelectBoxObj = {};
	var uniqUserTempNumber = {
		theNumber:1
	};
	
	removeAdminLoginPanelTable(theUserName);	

	var chatUsersHolderElem = createElementFunc('div');	
	setAttributeFunc(chatUsersHolderElem,"id","chatUsersHolderElem");
	setAttributeFunc(chatUsersHolderElem,"style","position:fixed;top:0;left:0;direction:rtl;z-index:999;max-width:230px;");

	var chatUsersTitleElem = createElementFunc('div');	
	setAttributeFunc(chatUsersTitleElem,"id","chatUsersTitleElem");
	setAttributeFunc(chatUsersTitleElem,"style","background: #3e413b;color:#fff;padding: 10px;font-family:tahoma;font-weight:bold;width:180px;float:left;");
	innerHTMLFunc(chatUsersTitleElem, " משתמשים בצאט");

	var chatUsersTitleCounterElem = createElementFunc('span');	
	setAttributeFunc(chatUsersTitleCounterElem,"id","chatUsersTitleCounterElem");
	innerHTMLFunc(chatUsersTitleCounterElem, "0");

	chatUsersTitleElem.insertBefore( chatUsersTitleCounterElem, chatUsersTitleElem.firstChild );

	appendChildFunc(chatUsersHolderElem, chatUsersTitleElem);
	appendChildFunc(document.body, chatUsersHolderElem);

	var catchChatUsersTitleCounterElem = querySelectorFunc('#chatUsersTitleCounterElem');
	var catchChatUsersHolderElem = querySelectorFunc('#chatUsersHolderElem');

	var chatBoxesHolderElem = createElementFunc('div');	
	setAttributeFunc(chatBoxesHolderElem,"id","chatBoxesHolderElem");
	setAttributeFunc(chatBoxesHolderElem,"style","display:table;position:fixed;top:0;direction:rtl;z-index:999;left:35%;width:100%;max-width:250px;");

	appendChildFunc(document.body, chatBoxesHolderElem);

	var catchChatBoxesHolderElem = querySelectorFunc('#chatBoxesHolderElem');	

	
//-------------------------START chatEvents functions-----------------------------------

	function removeAdminLoginPanelTable(theUserName){

		var catchEnterUserNameDiv = querySelectorFunc('#adminLoginPanelTable');		
		removeChildFunc(document.body, catchEnterUserNameDiv);
		
		initChatConnection();
	}

	
	function initChatConnection(){

		connectionObj.userConnection = new WebSocket('ws://127.0.0.1:1337?user_id=127&user_name='+theUserName+'&password='+thePassword);	

		connectionObj.userConnection.onmessage = function(msg){
			
			var theMessage = JSON.parse(msg.data);

			if(theMessage.isAdmin){

				adminInfoObj.userName = theUserName;

			}
			
			if(theMessage.chatUsers){
				parseChatUsers(theMessage.chatUsers);
			}
			
			if(theMessage.newMessage){
				
				if(theMessage.newMessage.from === querySelectorValueFunc('#adminChatNameInput')){

					writeToChat(theMessage.newMessage,"admin");						
				}
				else{

					writeToChat(theMessage.newMessage);					
				}				

			}
			
			if(theMessage.eror){
				console.log(theMessage.eror);	
			}	
		}	
	}	

	function parseChatUsers(chatUsersArr){
		
		var serverUserslength = arrayLength(chatUsersArr);
		var ChatUsersObjlength = Object.keys(existChatUsersObj).length;		
		
		if(ChatUsersObjlength < serverUserslength){			

			for (var i=0; i < serverUserslength; i++){
				
				if(!(chatUsersArr[i] in existChatUsersObj)){
					addUserToChat(chatUsersArr[i]);							
				}

			}	
		}
		
		if(ChatUsersObjlength > serverUserslength){
		
			var removeElem = findArrDiff(Object.keys(existChatUsersObj),chatUsersArr)
			
			removeUserFromChat(removeElem);
		}

	}


	function addUserToChat(theNewUser){

			//if this is admin
			if(theNewUser === adminInfoObj.userName){

				if(existChatUsersObj[theNewUser] === undefined){
					existChatUsersObj[theNewUser] = {};
					existChatUsersObj[theNewUser].isAdmin = true;				
				}

				//var theAdminPanelObj = buildAdminUserPanel(theNewUser);			
				appendChildFunc(document.body, buildAdminUserPanel(theNewUser));

			}
			//if this is not admin
			else{

				if(existChatUsersObj[theNewUser] === undefined){
					existChatUsersObj[theNewUser] = {};					
				}

				var theNewUserUniqeNumber = existChatUsersObj[theNewUser]["uniqeNumber"] =getUniqNumber();

				//build new user chat cell
				var theNewUserRow = existChatUsersObj[theNewUser]["userChatRow"] = buildOtherUsersRow(theNewUser);
				appendChildFunc(catchChatUsersHolderElem, theNewUserRow);


				//build new user chat box
				var theNewUserChatBox = existChatUsersObj[theNewUser]["userChatBox"] = buildOtherUsersChatBox(theNewUser);
				appendChildFunc(catchChatBoxesHolderElem, theNewUserChatBox);
			
			}

			innerHTMLFunc(catchChatUsersTitleCounterElem, howManyUsers());	
			
		}

		function removeUserFromChat(removeElem){

			console.log(removeElem);

			var theElemUniqeNumber = existChatUsersObj[removeElem].uniqeNumber;

			alreadyUsedUniqeNumbers.push(theElemUniqeNumber);

			delete existChatUsersObj[removeElem];


			var userRowToRemove = querySelectorFunc('#row-user-'+theElemUniqeNumber);

			var userChatBoxToRemove = querySelectorFunc('#chatUserBoxTableElem-'+theElemUniqeNumber);			

			removeChildFunc(catchChatUsersHolderElem, userRowToRemove);
			removeChildFunc(catchChatBoxesHolderElem, userChatBoxToRemove);

			innerHTMLFunc(catchChatUsersTitleCounterElem, howManyUsers());

		}

		function getUniqNumber(){

			if(alreadyUsedUniqeNumbers.length){

				var lastIndex = alreadyUsedUniqeNumbers.length-1;
				var userNumber = alreadyUsedUniqeNumbers[lastIndex];
				alreadyUsedUniqeNumbers.pop();
				
				return userNumber;

			}else{

				for(key in existChatUsersObj){

					if(!(existChatUsersObj[key].isAdmin)){

						var userNumber = uniqUserTempNumber.theNumber;
						uniqUserTempNumber.theNumber += 1;

						return userNumber;
					}


				}
			}

		}


//-------------------------END chatEvents functions-----------------------------------


//-------------------------START BuildHTML functions-----------------------------------

	function buildAdminUserPanel(theNewUser){

		var adminChatBoxHolder = createElementFunc('div');	
		setAttributeFunc(adminChatBoxHolder,"id","adminChatBoxHolder");
		setAttributeFunc(adminChatBoxHolder,"style","display:table;position:fixed;background:#3e413b;top:0;right:0;direction:rtl;z-index:999;padding:10px;text-align:right;color:#fff;font-family:tahoma;font-weight:bold;");

		var adminChatNameRow = createElementFunc('div');
		setAttributeFunc(adminChatNameRow,"class","adminChatNameRow");
		setAttributeFunc(adminChatNameRow,"style","display:table-row;");

		var adminChatNameCell = createElementFunc('div');
		setAttributeFunc(adminChatNameCell,"class","adminChatNameCell");
		setAttributeFunc(adminChatNameCell,"style","display:table-cell;");
		innerHTMLFunc(adminChatNameCell, "בחר שם לצאט: ");

		var adminChatNameInputCell = createElementFunc('div');
		setAttributeFunc(adminChatNameInputCell,"class","adminChatNameInputCell");
		setAttributeFunc(adminChatNameInputCell,"style","display:table-cell;");

		var adminChatNameInput = createElementFunc('input');	
		setAttributeFunc(adminChatNameInput,"type","text");
		setAttributeFunc(adminChatNameInput,"id","adminChatNameInput");
		setAttributeFunc(adminChatNameInput,"value","מנהל האתר");

										
		appendChildFunc(adminChatNameInputCell, adminChatNameInput);
		appendChildFunc(adminChatNameRow, adminChatNameCell);
		appendChildFunc(adminChatNameRow, adminChatNameInputCell);


		appendChildFunc(adminChatBoxHolder, adminChatNameRow);						

		return adminChatBoxHolder;
	}

	function buildOtherUsersRow(newUser){

		var userUniqNumber = existChatUsersObj[newUser]["uniqeNumber"];

		var chatUserRowElem = createElementFunc('div');
		setAttributeFunc(chatUserRowElem,"class","chatUserRowElem");
		setAttributeFunc(chatUserRowElem,"id","row-user-"+userUniqNumber);
		setAttributeFunc(chatUserRowElem,"style","display:table-row;");

		var chatUserNameCellElem = createElementFunc('div');
		setAttributeFunc(chatUserNameCellElem,"id","chat-user-temp-number-"+userUniqNumber);
		setAttributeFunc(chatUserNameCellElem,"style","display:table-cell;background:#d8e2d0;padding:0 8px;width:100%;border-bottom: 1px solid rgba(62, 65, 59, 0.2);");
		innerHTMLFunc(chatUserNameCellElem, newUser);

		var chatUserPlusSignCell = createElementFunc('div');
		setAttributeFunc(chatUserPlusSignCell,"id","chatUserPlusSignCell-"+userUniqNumber);
		setAttributeFunc(chatUserPlusSignCell,"class","isClose");
		setAttributeFunc(chatUserPlusSignCell,"style","display:table-cell;padding:5px;cursor:pointer;background:#3e413b;color:#fff;font-size:20px;text-align:center;font-weight:bold;min-width:20px;");
		setAttributeFunc(chatUserPlusSignCell,"onclick","yanivChat.plusSignClick(this)");
		innerHTMLFunc(chatUserPlusSignCell, "+");

		var unReadMessagesCellElem = createElementFunc('div');
		setAttributeFunc(unReadMessagesCellElem,"style","display:table-cell;background:transparent;min-width:30px;text-align:center;");

		var unReadMessagesSpanElem = createElementFunc('span');
		setAttributeFunc(unReadMessagesSpanElem,"id","unReadMessagesCellElem-"+userUniqNumber);	

		appendChildFunc(unReadMessagesCellElem,unReadMessagesSpanElem);								
		appendChildFunc(chatUserRowElem,unReadMessagesCellElem);
		appendChildFunc(chatUserRowElem,chatUserPlusSignCell);			
		appendChildFunc(chatUserRowElem,chatUserNameCellElem);				

		return chatUserRowElem;
	}


	function buildOtherUsersChatBox(newUser){

		var userUniqNumber = existChatUsersObj[newUser]["uniqeNumber"];

		var sendInfo = {

			adminName: adminInfoObj.userName,
			thisUser: newUser,
			inputUniqeNumber:userUniqNumber
		}

		var chatUserBoxTableElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxTableElem,"class","chatUserBoxTableElem");
		setAttributeFunc(chatUserBoxTableElem,"id","chatUserBoxTableElem-"+userUniqNumber);
		setAttributeFunc(chatUserBoxTableElem,"style","display:none;");	

		var chatUserBoxTitleElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxTitleElem,"class","chatUserBoxTitleElem");
		setAttributeFunc(chatUserBoxTitleElem,"style","display:block;background:#3e413b;font-family:tahoma;padding:10px;font-weight:bold;color:#fff;");
		innerHTMLFunc(chatUserBoxTitleElem, "צאט עם "+newUser);			

		var chatUserBoxRowElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxRowElem,"class","chatUserBoxRowElem");
		setAttributeFunc(chatUserBoxRowElem,"id","row-chat-box-"+userUniqNumber);
		setAttributeFunc(chatUserBoxRowElem,"style","display:block;");

		var chatUserBoxCellElem = createElementFunc('div');
		setAttributeFunc(chatUserBoxCellElem,"id","chatUserBoxCellElem-"+userUniqNumber);

		var msgUl = createElementFunc('ul');
		setAttributeFunc(msgUl,"id", "msgUl");
		setAttributeFunc(msgUl,"style","background: #fff;padding:10px;max-height:200px;overflow-y:auto;");

		var sendMsgRowElem = createElementFunc('div');
		setAttributeFunc(sendMsgRowElem,"class","sendMsgRowElem");
		setAttributeFunc(sendMsgRowElem,"id","send-msg"+userUniqNumber);
		setAttributeFunc(sendMsgRowElem,"style","display:block;padding:5px;background:#3e413b;border-radius: 0 0 10px 10px;");

		var sendMsgTextInputCellElem = createElementFunc('div');
		setAttributeFunc(sendMsgTextInputCellElem,"id","sendMsgTextInputCellElem-"+userUniqNumber);
		setAttributeFunc(sendMsgTextInputCellElem,"style","display:table-cell;");

		var sendMsgSpaceEmptyCellElem = createElementFunc('div');
		setAttributeFunc(sendMsgSpaceEmptyCellElem,"id","sendMsgSpaceEmptyCellElem-"+userUniqNumber);
		setAttributeFunc(sendMsgSpaceEmptyCellElem,"style","display:table-cell;min-width:10px;");		

		var sendMsgBtnInputCellElem = createElementFunc('div');
		setAttributeFunc(sendMsgBtnInputCellElem,"id","sendMsgBtnInputCellElem-"+userUniqNumber);
		setAttributeFunc(sendMsgBtnInputCellElem,"style","display:table-cell;");

		var sendMsgTextInput = createElementFunc('input');
		setAttributeFunc(sendMsgTextInput,"type","text");
		setAttributeFunc(sendMsgTextInput,"style","padding:5px;border:0;height:100%;border-radius:10px;");		
		setAttributeFunc(sendMsgTextInput,"id","sendMsgTextInput-"+userUniqNumber);		

		var sendMsgBtnInput = createElementFunc('input');
		setAttributeFunc(sendMsgBtnInput,"type","button");					
		setAttributeFunc(sendMsgBtnInput,"value","שלח הודעה");
		setAttributeFunc(sendMsgBtnInput,"style","width:100%;cursor:pointer;background:#00e500;font-family:tahoma;font-weight:bold;color:#fff;border:0;height:100%;padding:0 5px;border-radius:10px;");			
		setAttributeFunc(sendMsgBtnInput,"onclick","yanivChat.sendMsg("+JSON.stringify(sendInfo)+")");				

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


		return chatUserBoxTableElem;
	}

}


//-------------------------END connectToChat scope--------------------------------

//-------------------------START general use functions--------------------------------

function writeToChat(chatObj,admin){

	var from = chatObj.from;
	var theMsg = chatObj.msg;
	var newMsg = createElementFunc('li');
	var chatLiStyle = "padding:10px;border-radius:5px;margin-top:5px;display:block;";
	var theUserUniqeNumber;

	if(!(admin)){

		theUserUniqeNumber = existChatUsersObj[from].uniqeNumber;
		var msgUl = querySelectorFunc('#chatUserBoxCellElem-'+theUserUniqeNumber+' #msgUl');

		setAttributeFunc(newMsg,"style",chatLiStyle+"background:#CFDBC5;");

		ifUserChatBoxClosed(theUserUniqeNumber);
	}

	if(admin){

		theUserUniqeNumber = existChatUsersObj[chatObj.to].uniqeNumber;
		var msgUl = querySelectorFunc('#chatUserBoxCellElem-'+theUserUniqeNumber+' #msgUl');

		setAttributeFunc(newMsg,"style",chatLiStyle+"background:#BCED91;");
		
		ifUserChatBoxClosed(theUserUniqeNumber);				
	}

	innerHTMLFunc(newMsg, chatObj.from+" :<br />"+chatObj.msg);
	appendChildFunc(msgUl, newMsg);

	scrollListener(theUserUniqeNumber);
}


function ifUserChatBoxClosed(uniqeNumber){

	var isOpenOrClose = querySelectorFunc('#chatUserPlusSignCell-'+uniqeNumber);

	if(isOpenOrClose.classList.contains('isClose')){

		var unReadElem = querySelectorFunc('#unReadMessagesCellElem-'+uniqeNumber);

		setAttributeFunc(unReadElem,"style","background:red;border-radius:10px;padding:5px;");

		if(unReadElem.innerHTML === ""){			
			unReadElem.innerHTML = 1;			
		}else{
			unReadElem.innerHTML = parseInt(unReadElem.innerHTML)+1;
		}	

	}
}

function showThisUserChat(elemTempIdNumber){

	var unReadMessagesElem = querySelectorFunc('#unReadMessagesCellElem-'+elemTempIdNumber);

	//reset the unRead messages
	if(unReadMessagesElem.innerHTML !== ""){
		unReadMessagesElem.innerHTML = "";
		setAttributeFunc(unReadMessagesElem,"style","");		
	}

	var chatchThisChat = querySelectorFunc('#chatUserBoxTableElem-'+elemTempIdNumber);
	chatchThisChat.style.cssText = "display:table;vertical-align:top;margin-bottom:10px;";

	var plusSignElem = querySelectorFunc('#chatUserPlusSignCell-'+elemTempIdNumber);
	innerHTMLFunc(plusSignElem, "-");
}

function closeThisUserChat(elemTempIdNumber){

	var chatchThisChat = querySelectorFunc('#chatUserBoxTableElem-'+elemTempIdNumber);
	chatchThisChat.style.cssText = "display:none";

	var plusSignElem = querySelectorFunc('#chatUserPlusSignCell-'+elemTempIdNumber);
	innerHTMLFunc(plusSignElem, "+");
}

function getElemUniqeNumber(elem){

	var theElemTempId = elem.id;

	return theElemTempId.slice(-1);
}

function howManyUsers(){

	var counter = 0;

	for(key in existChatUsersObj){

		if(!(existChatUsersObj[key].isAdmin)){

			counter++;			
		}

	}

	return counter;	
}

function scrollListener(uniqeNumber){

	var theElem = querySelectorFunc('#chatUserBoxCellElem-'+uniqeNumber+' > #msgUl');

	if(theElem.clientHeight < theElem.scrollHeight){
		theElem.scrollTop = theElem.scrollHeight;
	}
}


function findArrDiff(a1, a2){

	var a=[];
	var diff=[];

	for(var i=0;i<a1.length;i++){
		a[a1[i]]=true;
	}

	for(var i=0;i<a2.length;i++){
	
		if(a[a2[i]]){
			delete a[a2[i]];
		}
		else{
			a[a2[i]]=true;
		} 
	}
	
	for(var k in a){
		diff.push(k);	
	}
	
	return diff;
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
		initAdminChat:initAdminChat,
		submitUserName:submitUserName,
		plusSignClick:plusSignClick,
		sendMsg:sendMsg
	};	
	
})(window);		

yanivChat.initAdminChat();
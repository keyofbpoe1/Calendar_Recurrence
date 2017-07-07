//after querying the master event for its recurrence data (recData)
function doXML(recData) {
//declare variables
	var completeRule = "RRULE:";
	var endTerm = "";
	var weekStart;
	var rruleSTR;
//parse xml
	myXML = recData.toUpperCase(); //to minimize error and because ics files are uppercase
	if (typeof DOMParser == "undefined") {
		xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
		xmlDoc.async = false;
		xmlDoc.loadXML(myXML);
	}
	else {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(myXML,"text/xml");
	}	
//get frequency
	var recNode1 = xmlDoc.getElementsByTagName("REPEAT")[0].childNodes[0];
	var rep1 = recNode1.nodeName;
//get termination
	var endNode = xmlDoc.getElementsByTagName("RULE")[0].childNodes[(xmlDoc.getElementsByTagName("RULE")[0].childNodes.length)-1];
	if(xmlDoc.getElementsByTagName("REPEATFOREVER").length==1){
		//do nothing
	}
	if(xmlDoc.getElementsByTagName("REPEATINSTANCES").length==1){
		endTerm = ";COUNT=" + endNode.childNodes[0].nodeValue;
	}
	if(xmlDoc.getElementsByTagName("WINDOWEND").length==1){
		endTerm = ";UNTIL=" + endNode.childNodes[0].nodeValue.replace(/\W/g,"");
	}
//get start of week
	weekStart = ";WKST=" + xmlDoc.getElementsByTagName("FIRSTDAYOFWEEK")[0].childNodes[0].nodeValue;
//switch frequency
	switch(rep1) {
    case "DAILY":
		rruleSTR = dailyFunc1(completeRule, endTerm, weekStart, recNode1);
        break;
    case "WEEKLY":
		rruleSTR = weeklyFunc1(completeRule, endTerm, weekStart, recNode1);
        break;
	case "MONTHLY":
		rruleSTR = monthlyFunc1(completeRule, endTerm, weekStart, recNode1);
        break;
	case "MONTHLYBYDAY":
		rruleSTR = monthlyBYDAYFunc1(completeRule, endTerm, weekStart, recNode1);
        break;
	case "YEARLY":
		rruleSTR = yearlyFunc1(completeRule, endTerm, weekStart, recNode1);
        break;
	case "YEARLYBYDAY":
		rruleSTR = yearlyBYDAYFunc1(completeRule, endTerm, weekStart, recNode1);
        break;
    default:
       // default code block
	}
	alert(rruleSTR);
}

function dailyFunc1(completeRule, endTerm, weekStart, recNode1) {
//set frequency
	completeRule += "FREQ=DAILY";
//set interval
	var interval = recNode1.getAttribute("DAYFREQUENCY");
	if(interval){
		completeRule += ";INTERVAL=" + interval;
	}
//set end and weekStart
	completeRule += endTerm + weekStart;
//set byday
	var ifbyday = recNode1.getAttribute("WEEKDAY");
	if(ifbyday){
		completeRule += ";BYDAY=MO,TU,WE,TH,FR";
	}
	return completeRule;
}
function weeklyFunc1(completeRule, endTerm, weekStart, recNode1) {
//set frequency
	completeRule += "FREQ=WEEKLY";
//set interval
	var interval = recNode1.getAttribute("WEEKFREQUENCY");
	if(interval){
		completeRule += ";INTERVAL=" + interval;
	}
//set end and weekStart
	completeRule += endTerm + weekStart;
// query and set byDay
	var sun = recNode1.getAttribute("SU");
	var mon = recNode1.getAttribute("MO");
	var tue = recNode1.getAttribute("TU");
	var wed = recNode1.getAttribute("WE");
	var thu = recNode1.getAttribute("TH");
	var fri = recNode1.getAttribute("FR");
	var sat = recNode1.getAttribute("SA");
	if(sun||mon||tue||wed||thu||fri||sat){
		completeRule += ";BYDAY=";
		var weekStr = "";
		if(sun){
			weekStr += "SU,";
		}
		if(mon){
			weekStr += "MO,";
		}
		if(tue){
			weekStr += "TU,";
		}
		if(wed){
			weekStr += "WE,";
		}
		if(thu){
			weekStr += "TH,";
		}
		if(fri){
			weekStr += "FR,";
		}
		if(sat){
			weekStr += "SA,";
		}
		weekStr = weekStr.slice(0,-1);
		completeRule += weekStr;
	}
	return completeRule;
}
function monthlyFunc1(completeRule, endTerm, weekStart, recNode1) {
//set frequency
	completeRule += "FREQ=MONTHLY";
//set interval
	var interval = recNode1.getAttribute("MONTHFREQUENCY");
	if(interval){
		completeRule += ";INTERVAL=" + interval;
	}
//set end and weekStart
	completeRule += endTerm + weekStart;
//set byday
	var whatday = recNode1.getAttribute("DAY");
	if(whatday){
		completeRule += ";BYMONTHDAY=" + whatday;
	}
	return completeRule;
}
function monthlyBYDAYFunc1(completeRule, endTerm, weekStart, recNode1) {
//set frequency
	completeRule += "FREQ=MONTHLY";
//set interval
	var interval = recNode1.getAttribute("MONTHFREQUENCY");
	if(interval){
		completeRule = completeRule + ";INTERVAL=" + interval;
	}
//set end and weekStart
	completeRule = completeRule + endTerm + weekStart;
//set byday
	var weekStr = "";
	var sun = recNode1.getAttribute("SU");
	var mon = recNode1.getAttribute("MO");
	var tue = recNode1.getAttribute("TU");
	var wed = recNode1.getAttribute("WE");
	var thu = recNode1.getAttribute("TH");
	var fri = recNode1.getAttribute("FR");
	var sat = recNode1.getAttribute("SA");
	if(sun||mon||tue||wed||thu||fri||sat){
		weekStr = ";BYDAY=";
		if(sun){
			weekStr += "SU,";
		}
		if(mon){
			weekStr += "MO,";
		}
		if(tue){
			weekStr += "TU,";
		}
		if(wed){
			weekStr += "WE,";
		}
		if(thu){
			weekStr += "TH,";
		}
		if(fri){
			weekStr += "FR,";
		}
		if(sat){
			weekStr += "SA,";
		}
		weekStr = weekStr.slice(0,-1);
	}
	if(recNode1.getAttribute("WEEKDAY")){
		weekStr = ";BYDAY=MO,TU,WE,TH,FR";
	}
	if(recNode1.getAttribute("WEEKEND_DAY")){
		weekStr = ";BYDAY=SA,SU";
	}
	completeRule += weekStr;
	var whatday = recNode1.getAttribute("WEEKDAYOFMONTH")
		switch(whatday) {
		case "FIRST":
			whatday = ";BYSETPOS=1";
			break;
		case "SECOND":
			whatday = ";BYSETPOS=2";
			break;
		case "THIRD":
			whatday = ";BYSETPOS=3";
			break;
		case "FOURTH":
			whatday = ";BYSETPOS=4";
			break;
		case "LAST":
			whatday = ";BYSETPOS=-1";
			break;
		default:
			// default code block
		}
	completeRule += whatday;
	return completeRule;
}
function yearlyFunc1(completeRule, endTerm, weekStart, recNode1) {
//set frequency
	completeRule += "FREQ=YEARLY";
//set interval
	var interval = recNode1.getAttribute("YEARFREQUENCY");
	if(interval){
		completeRule += ";INTERVAL=" + interval;
	}
//set end and weekStart
	completeRule += endTerm + weekStart;
//set bymonth
	var ybymonth = recNode1.getAttribute("MONTH");
	if(ybymonth){
		completeRule += ";BYMONTH=" + ybymonth;
	}
//set byday
	var ybyday = recNode1.getAttribute("DAY");
	if(ybyday){
		completeRule += ";BYMONTHDAY=" + ybyday;
	}
	return completeRule;
}
function yearlyBYDAYFunc1(completeRule, endTerm, weekStart, recNode1) {
//set frequency
	completeRule += "FREQ=YEARLY";
//set interval
	var interval = recNode1.getAttribute("YEARFREQUENCY");
	if(interval){
		completeRule += ";INTERVAL=" + interval;
	}
//set end and weekStart
	completeRule += endTerm + weekStart;
//set bymonth
	var ybymonth = recNode1.getAttribute("MONTH");
	if(ybymonth){
		completeRule += ";BYMONTH=" + ybymonth;
	}
//set byday
	var weekStr = "";
	var sun = recNode1.getAttribute("SU");
	var mon = recNode1.getAttribute("MO");
	var tue = recNode1.getAttribute("TU");
	var wed = recNode1.getAttribute("WE");
	var thu = recNode1.getAttribute("TH");
	var fri = recNode1.getAttribute("FR");
	var sat = recNode1.getAttribute("SA");
	if(sun||mon||tue||wed||thu||fri||sat){
		weekStr = ";BYDAY=";
		if(sun){
			weekStr += "SU,";
		}
		if(mon){
			weekStr += "MO,";
		}
		if(tue){
			weekStr += "TU,";
		}
		if(wed){
			weekStr += "WE,";
		}
		if(thu){
			weekStr += "TH,";
		}
		if(fri){
			weekStr += "FR,";
		}
		if(sat){
			weekStr += "SA,";
		}
		weekStr = weekStr.slice(0,-1);
	}
	completeRule += weekStr;
	var daystr = "";
	if(recNode1.getAttribute("DAY")){
		var wdom = recNode1.getAttribute("WEEKDAYOFMONTH")
		switch(wdom) {
		case "FIRST":
			daystr = ";BYMONTHDAY=1";
			break;
		case "SECOND":
			daystr = ";BYMONTHDAY=2";
			break;
		case "THIRD":
			daystr = ";BYMONTHDAY=3";
			break;
		case "FOURTH":
			daystr = ";BYMONTHDAY=4";
			break;
		case "LAST":
			daystr = ";BYMONTHDAY=-1";
			break;
		default:
			// default code block
		}
	}
	var wdomstr = "";
	if(recNode1.getAttribute("WEEKDAY")||recNode1.getAttribute("WEEKEND_DAY")){
		if(recNode1.getAttribute("WEEKDAY")){
			daystr = ";BYDAY=MO,TU,WE,TH,FR";
		}
		if(recNode1.getAttribute("WEEKEND_DAY")){
			daystr = ";BYDAY=SA,SU";
		}
		var wdom = recNode1.getAttribute("WEEKDAYOFMONTH")
		switch(wdom) {
			case "FIRST":
			wdomstr = ";BYMONTHPOS=1";
			break;
		case "SECOND":
			wdomstr = ";BYMONTHPOS=2";
			break;
		case "THIRD":
			wdomstr = ";BYMONTHPOS=3";
			break;
		case "FOURTH":
			wdomstr = ";BYMONTHPOS=4";
			break;
		case "LAST":
			wdomstr = ";BYMONTHPOS=-1";
			break;
		default:
			// default code block
		}
	}	
	completeRule += daystr + wdomstr;
	return completeRule;
}

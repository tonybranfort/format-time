
//TODO: add ability to detect h:m (single digit for minute)
var re = /^\s*([0-9]|[0-1][0-9]?|2[0-4]?)(?=\s*\:?\s*([0-5][0-9])?\s*[^0-9,a,p]*([a,p])?[^0-9,a,p]*$)/i;

var f = function(match, hour, minute, ampm, offset, str) { 
  return {
    hour: hour,
    minute: minute | '00',
    ampm: ampm | 'am'
  }; 
};

var getFormattedTime = function(timeStr, ampmSwitch) {

  ampmSwitch = ampmSwitch ? ampmSwitch : '6:59'; 

  var r = re.exec(timeStr); 
  var hour = r && r[1] ? Number(r[1]) : undefined; 
  var minutes = r && r[2] ? r[2] : 0;
  minutes = (minutes + '0').slice(0,2); 
  minutes = Number(minutes);  
  minutes = isNaN(minutes) ? 0 : minutes; 
  var ampm = r && r[3] ? r[3] : undefined; 

  var newTime; 


  // if no hour, then cannot determine time. return timeStr as passed in
  if(hour === undefined || isNaN(hour) || hour > 24 || minutes > 59) {
    return undefined; 
  }

  // 0 or 24: hour=12, ampm=AM if undefined
  // 1-11 :  ampm based on ampmSwitch
  // 12 :    ampm = pm if undefined 
  // 13-23 : ampm = pm always

  if(hour === 0 || hour === 24) {
    hour = 12; 
    if(!ampm) {
      ampm = 'AM'; 
    }
  }

  if(hour > 0 && hour < 12) {
    if (!ampm) {
      var sw = re.exec(ampmSwitch);
      var ampmSwitchHour = sw && sw[1] ? sw[1] : undefined; 
      var ampmSwitchMinute = sw && sw[2] ? sw[2] : undefined; 

      if(hour > ampmSwitchHour || 
        (hour === ampmSwitchHour && minute > ampmSwitchMinute)) {
        ampm = 'AM'; 
      } else {
        ampm = 'PM'; 
      }
    }
  }

  if(hour ===12) {
    ampm = !ampm ? 'PM' : ampm; 
  }

  if(hour > 12) {
    ampm = 'PM'; 
    hour = hour - 12 ; 
  } else { 
    ampm = ampm === 'A' || ampm === 'a' ? 'AM' : ampm;
    ampm = ampm === 'P' || ampm === 'p' ? 'PM' : ampm;
  }


  minutes = ('0' + minutes).slice(-2); 

  newTime = hour + ':' + minutes + ' ' + ampm;

  return newTime;  

};

module.exports = {
  getFormattedTime: getFormattedTime,
  f: f,
  re: re 
}; 

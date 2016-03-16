

var re = /^([0-9]|[0-1][0-9]?|2[0-3]?)\s*\:?\s*$/;

var f = function(match, hour, minute, ampm, offset, str) { 
  console.log('match:' + match); 
  console.log('hour:' + hour);
  console.log('minute:' + minute);
  console.log('ampm:' + ampm);
  return {
    hour: hour,
    minute: minute | '00',
    ampm: ampm | 'am'
  }; 
};

var getFormatted = function(timeStr) {
  var to = timeStr.replace(re, f); 
  var ft = to ? to.hour + ':' + to.minute + to.ampm : null;  
  return ft; 
}; 

module.exports = {
  getFormatted: getFormatted,
  f: f,
  re: re 
}; 

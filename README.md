# format-time
[![Build Status via Travis CI](https://travis-ci.org/tonybranfort/format-time.svg?branch=master)](https://travis-ci.org/tonybranfort/format-time)
[![Coverage Status](https://coveralls.io/repos/github/tonybranfort/format-time/badge.svg?branch=master)](https://coveralls.io/github/tonybranfort/format-time?branch=master)


Return consistently formatted time string given a string of messy time format.

Seeks to mimic Google Calendar online time entry. 

Install options: 
* `npm install format-time`
* `bower install format-time`
  
#### Example
```
var ft = require('format-time'); 

ft.getFormattedTime('9:35a');   // 9:35 AM
ft.getFormattedTime('9:35 p');  // 9:35 PM
ft.getFormattedTime('935');     // 9:35 AM
ft.getFormattedTime('21:35');   // 9:35 PM
ft.getFormattedTime('2135');    // 9:35 PM
ft.getFormattedTime('11');      // 11:00 AM
ft.getFormattedTime('11p');     // 11:00 PM
ft.getFormattedTime('24');      // 12:00 AM
ft.getFormattedTime('0:14');    // 12:14 AM

```

## Functions : `getFormattedTime`, `re`

### getFormattedTime(messyTime, ampmSwitch)
Returns either: 
* a string in the format of `h:mm A` where h is hour, mm is 2 digit minute and 'A' is AM or PM.
* null if format cannot be determined from messyTime
* 'h:mm A' format allows easy entry in Date object. Example: 
```
new Date('01/01/2017' + ' ' + ft.getFormattedTime(950)); 
// returns Date object set to `Jan 01 2017 09:50:00`
```

#### `messyTime`
* string, required
* the value that is to be converted into a reliable formatted time
* eg; 9:35, 10a, 11:32p, etc

#### `ampmSwitch`
* string, optional, default: 6:59
* the time at which PM switches to AM if am/pm is not included in messyString
Example: 
```
// default switches at 7:00
ft.getFormattedTime('6:59');   // 6:59 PM
ft.getFormattedTime('7:00');   // 7:00 AM

ft.getFormattedTime('6:59','7:59');   // 6:59 PM
ft.getFormattedTime('7:00','7:59');   // 7:00 PM
ft.getFormattedTime('7:59','7:59');   // 7:59 PM
ft.getFormattedTime('8:00','7:59');   // 8:00 AM

```

### re
Returns the regular expression to pull h, mm and a|p from a messy time string. 
Example: 
```
ft.re.exec('14')[1]       // '14'
ft.re.exec('12:32a')[1]   // '12'
ft.re.exec('12:32a')[2]   // '32'
ft.re.exec('12:32a')[3]   // 'a'
ft.re.exec('935')[1]      // '9'
ft.re.exec('935')[2]      // '35'
ft.re.exec('935')[3]      // undefined

```

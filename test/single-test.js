var calTime = require('../lib/index.js');
var expect = require('expect.js'); 

// h          var re = /^([0-9])\s*(?=$)($)($)$/
// hh         ([0-1][0-9]?|2[0-4]?)
// hmm        var re = /^([0-9])(?=[0-5][0-59])([0-5][0-59])$/
// hhmm  
// h:    
// hh:   
// h:m   
// h:mm  
// hh:m  
// hh:mm
//    h   => [0-9]
//    hh  => [01-24]
//    m   => [0-5]
//    mm  => [0-59]   => [0-5][0-9]
// each of above suffixed with (case insensitive)
//  a
//  p
//  a[any other char(s)]
//  p[any other char(s)]
//  _a    ('_' = any number of spaces)
//  _p

// h, hh, h:, hh:  => var re = /^([0-9]|[0-1][0-9]?|2[0-4]?)\s*\:?\s*$/ 

describe('cal-time',function(){
  describe('get formmated time', function() {
      //5:00AM    => 5:00AM
      //6a        => 6:00AM
      //7         => 7:00AM     // 6:59 is pm, 7:00 changes to am
      //8         => 8:00AM
      //8:20      => 8:20AM
      //9:40 AM   => 9:40AM
      //9:45 aM   => 9:45AM
      //9:47a     => 9:47AM
      //11:50     => 11:50AM
      //12        => 12:00PM    // 11:59 is am, 12:00 changes to pm
      //12:00     => 12:00PM
      //12 am     => 12:00PM
      //12pm      => 12:00PM
      //12:00pm   => 12:00PM
      //3         => 3:00PM
      //4:28      => 4:28PM
      //4:50PM    => 4:40PM
      //5:00      => 5:00PM
      //6         => 6:00PM
      //6 P       => 6:00PM
      //6:05pm    => 6:05PM
      //659       => 6:59PM
      //21        => 9:00PM
      //21:32     => 9:32PM
      //21:35p    => 9:35PM
      //21:37 pm  => 9:37PM
      //21:40am   => 9:40PM
    it('should return correct formatted time for |h|',function(){
      expect(calTime.re.exec('1')[1]).to.be('1'); 
      expect(calTime.re.exec('9')[1]).to.be('9'); 
    }); 

    it('should return correct formatted time for |hh|',function(){
      expect(calTime.re.exec('01')[1]).to.be('01'); 
      expect(calTime.re.exec('05')[1]).to.be('05'); 
      expect(calTime.re.exec('10')[1]).to.be('10'); 
      expect(calTime.re.exec('14')[1]).to.be('14'); 
      expect(calTime.re.exec('19')[1]).to.be('19'); 
      expect(calTime.re.exec('21')[1]).to.be('21'); 
    }); 

    it('should return null for |hh| > 23',function(){
      expect(calTime.re.exec('24')).to.be(null); 
      expect(calTime.re.exec('25')).to.be(null); 
      expect(calTime.re.exec('37')).to.be(null); 
      expect(calTime.re.exec('99')).to.be(null); 
    }); 

    it('should return correct formatted time for |h|,|hh| followed by spaces',function(){
      expect(calTime.re.exec('1   ')[1]).to.be('1'); 
      expect(calTime.re.exec('14  ')[1]).to.be('14'); 
      expect(calTime.re.exec('23')[1]).to.be('23'); 
    }); 


    it('should return correct formatted time for |h|,|hh| followed by :',function(){
      expect(calTime.re.exec('1:')[1]).to.be('1'); 
      expect(calTime.re.exec('1  :  ')[1]).to.be('1'); 
      expect(calTime.re.exec('14  :')[1]).to.be('14'); 
      expect(calTime.re.exec('23:   ')[1]).to.be('23'); 
    }); 

    it('should return correct formatted time for |h:mm| & hh:mm',function(){
      expect(calTime.re.exec('1:32')[1]).to.be('1'); 
      expect(calTime.re.exec('1:32')[2]).to.be('32'); 

      expect(calTime.re.exec('5:02')[1]).to.be('5'); 
      expect(calTime.re.exec('5:02')[2]).to.be('02'); 

      expect(calTime.re.exec('12:59')[1]).to.be('12'); 
      expect(calTime.re.exec('12:59')[2]).to.be('59'); 

      expect(calTime.re.exec('16:44')[1]).to.be('16'); 
      expect(calTime.re.exec('16:44')[2]).to.be('44'); 
    }); 

    it('should return the correct formatted time for |h| followed by a,p,A,P',
      function() {
        expect(calTime.re.exec('1 a')[1]).to.be('1'); 
        expect(calTime.re.exec('1 a')[3]).to.be('a'); 
        expect(calTime.re.exec('1a')[1]).to.be('1'); 
        expect(calTime.re.exec('1a')[3]).to.be('a'); 
        expect(calTime.re.exec('1 A')[3]).to.be('A'); 
        expect(calTime.re.exec('1A')[3]).to.be('A'); 
        expect(calTime.re.exec('1 P')[3]).to.be('P'); 
        expect(calTime.re.exec('1P')[3]).to.be('P'); 
    });

    it('should return the correct formatted time for |hh| followed by a,p,A,P',
      function() {
        expect(calTime.re.exec('11 a')[1]).to.be('11'); 
        expect(calTime.re.exec('11 a')[3]).to.be('a'); 
        expect(calTime.re.exec('11a')[1]).to.be('11'); 
        expect(calTime.re.exec('11a')[3]).to.be('a'); 
        expect(calTime.re.exec('11 A')[3]).to.be('A'); 
        expect(calTime.re.exec('11A')[3]).to.be('A'); 
        expect(calTime.re.exec('11 P')[3]).to.be('P'); 
        expect(calTime.re.exec('11P')[3]).to.be('P'); 
    });

    it('should return the correct formatted time for |hh| followed by am,pm,AM,PM',
      function() {
        expect(calTime.re.exec('11 am')[1]).to.be('11'); 
        expect(calTime.re.exec('11 am')[3]).to.be('am'); 
        expect(calTime.re.exec('11am')[1]).to.be('11'); 
        expect(calTime.re.exec('11am')[3]).to.be('am'); 
        expect(calTime.re.exec('11 AM')[3]).to.be('AM'); 
        expect(calTime.re.exec('11AM')[3]).to.be('AM'); 
        expect(calTime.re.exec('11 PM')[3]).to.be('PM'); 
        expect(calTime.re.exec('11PM')[3]).to.be('PM'); 
    });


    it('should return the correct formatted time for |h:mm| followed by a,p,A,P',
      function() {
        expect(calTime.re.exec('9:32 a')[1]).to.be('9'); 
        expect(calTime.re.exec('9:32 a')[2]).to.be('32'); 
        expect(calTime.re.exec('9:32 a')[3]).to.be('a'); 
        expect(calTime.re.exec('9:32a')[1]).to.be('9'); 
        expect(calTime.re.exec('9:32a')[2]).to.be('32'); 
        expect(calTime.re.exec('9:32a')[3]).to.be('a'); 
        expect(calTime.re.exec('4:20 A')[3]).to.be('A'); 
        expect(calTime.re.exec('4:20A')[3]).to.be('A'); 
        expect(calTime.re.exec('1:05 P')[3]).to.be('P'); 
        expect(calTime.re.exec('1:00P')[3]).to.be('P'); 
    });


    it('should return the correct formatted time for |h:mm| followed by am,pm,AM,PM',
      function() {
        expect(calTime.re.exec('9:32 am')[1]).to.be('9'); 
        expect(calTime.re.exec('9:32 am')[2]).to.be('32'); 
        expect(calTime.re.exec('9:32 am')[3]).to.be('am'); 
        expect(calTime.re.exec('9:32am')[1]).to.be('9'); 
        expect(calTime.re.exec('9:32am')[2]).to.be('32'); 
        expect(calTime.re.exec('9:32am')[3]).to.be('am'); 
        expect(calTime.re.exec('4:20 AM')[3]).to.be('AM'); 
        expect(calTime.re.exec('4:20AM')[3]).to.be('AM'); 
        expect(calTime.re.exec('1:05 PM')[3]).to.be('PM'); 
        expect(calTime.re.exec('1:00PM')[3]).to.be('PM'); 
    });

    it('should return correct formatted times even with bogus characters after hhmm',
      function() {
        expect(calTime.re.exec('9:32 aQ')).to.be(null); 
        expect(calTime.re.exec('5:43skj')).to.be(null); 
        expect(calTime.re.exec('5:4')).to.be(null); 

      });

    // it('should not return formatted times for crazy entries', function() {
    //     expect(calTime.re.exec('9:32 aQ')).to.be(null); 
    //     expect(calTime.re.exec('5:43skj')).to.be(null); 
    //     expect(calTime.re.exec('5:4')).to.be(null); 
    // }); 

    it('should return correct formatted times for |hmm| and |hmm|a|m|am|pm|', function() {
        expect(calTime.re.exec('932')[1]).to.be('9'); 
        expect(calTime.re.exec('932')[2]).to.be('32'); 
        expect(calTime.re.exec('105')[1]).to.be('1'); 
        expect(calTime.re.exec('105')[2]).to.be('05'); 
        expect(calTime.re.exec('113')[1]).to.be('1'); 
        expect(calTime.re.exec('113')[2]).to.be('13'); 
        expect(calTime.re.exec('459')[1]).to.be('4'); 
        expect(calTime.re.exec('459')[2]).to.be('59'); 
        expect(calTime.re.exec('459a')[1]).to.be('4'); 
        expect(calTime.re.exec('459a')[2]).to.be('59'); 
        expect(calTime.re.exec('459a')[3]).to.be('a'); 
        expect(calTime.re.exec('700 PM')[1]).to.be('7'); 
        expect(calTime.re.exec('700 PM')[2]).to.be('00'); 
        expect(calTime.re.exec('700 PM')[3]).to.be('PM'); 
    });

  });
});



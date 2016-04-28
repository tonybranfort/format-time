var calTime = require('../lib/index.js');
var expect = require('expect.js'); 

// h          
// hh         
// hmm        
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


describe('cal-time',function(){
  describe('get reg exp results', function() {
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
      //24:00     => 12:00 AM
      //24:32 PM  => 1:32 PM 
      //25:00     => undefined

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

    it('should return null for |hh| > 24',function(){
      expect(calTime.re.exec('24')).not.to.be(null); 
      expect(calTime.re.exec('25')).to.be(null); 
      expect(calTime.re.exec('37')).to.be(null); 
      expect(calTime.re.exec('99')).to.be(null); 
    }); 

    it('should return correct formatted time for |h|,|hh| followed by spaces',function(){
      expect(calTime.re.exec('1   ')[1]).to.be('1'); 
      expect(calTime.re.exec('14  ')[1]).to.be('14'); 
      expect(calTime.re.exec('23')[1]).to.be('23'); 
    }); 

    it('should return correct formatted time for |h|,|hh| preceded by spaces',function(){
      expect(calTime.re.exec(' 1   ')[1]).to.be('1'); 
      expect(calTime.re.exec('    14  ')[1]).to.be('14'); 
      expect(calTime.re.exec('   23')[1]).to.be('23'); 
    }); 

    it('should return correct formatted time for |hmm| & |hhmm|',function(){
      expect(calTime.re.exec('629')[1]).to.be('6'); 
      expect(calTime.re.exec('629')[2]).to.be('29'); 
      expect(calTime.re.exec('629')[3]).to.be(undefined); 
      expect(calTime.re.exec('100')[1]).to.be('1'); 
      expect(calTime.re.exec('100')[2]).to.be('00'); 
      expect(calTime.re.exec('100')[3]).to.be(undefined); 

      expect(calTime.re.exec('2343')[1]).to.be('23'); 
      expect(calTime.re.exec('2343')[2]).to.be('43'); 
      expect(calTime.re.exec('2343')[3]).to.be(undefined); 

      expect(calTime.re.exec('192')).to.be(null); 

    }); 

    it('should return correct formatted time for |h|,|hh| followed by :',function(){
      expect(calTime.re.exec('1:')[1]).to.be('1'); 
      expect(calTime.re.exec('1  :  ')[1]).to.be('1'); 
      expect(calTime.re.exec('14  :')[1]).to.be('14'); 
      expect(calTime.re.exec('23:   ')[1]).to.be('23'); 
    }); 

    it('should return correct formatted time for |h:mm| & |hh:mm|',function(){
      expect(calTime.re.exec('1:32')[1]).to.be('1'); 
      expect(calTime.re.exec('1:32')[2]).to.be('32'); 

      expect(calTime.re.exec('5:02')[1]).to.be('5'); 
      expect(calTime.re.exec('5:02')[2]).to.be('02'); 
      expect(calTime.re.exec('5:02')[3]).to.be(undefined); 

      expect(calTime.re.exec('12:59')[1]).to.be('12'); 
      expect(calTime.re.exec('12:59')[2]).to.be('59'); 

      expect(calTime.re.exec('16:44')[1]).to.be('16'); 
      expect(calTime.re.exec('16:44')[2]).to.be('44'); 
      expect(calTime.re.exec('16:44')[3]).to.be(undefined); 
    }); 

    //TODO: 
    // it('should return correct minutes |h:m| ',function(){
    //   expect(calTime.re.exec('1:3')[1]).to.be('1'); 
    //   expect(calTime.re.exec('1:3')[2]).to.be('3'); 

    //   expect(calTime.re.exec('23:4')[1]).to.be('23'); 
    //   expect(calTime.re.exec('23:4')[1]).to.be('4'); 
    // }); 

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
        expect(calTime.re.exec('11 am')[3]).to.be('a'); 
        expect(calTime.re.exec('11am')[1]).to.be('11'); 
        expect(calTime.re.exec('11am')[3]).to.be('a'); 
        expect(calTime.re.exec('11 AM')[3]).to.be('A'); 
        expect(calTime.re.exec('11AM')[3]).to.be('A'); 
        expect(calTime.re.exec('11 PM')[3]).to.be('P'); 
        expect(calTime.re.exec('11PM')[3]).to.be('P'); 
    });


    it('should return the correct formatted time for |h:mm| followed by a,p,A,P',
      function() {
        expect(calTime.re.exec('5:00AM')[1]).to.be('5'); 
        expect(calTime.re.exec('5:00AM')[2]).to.be('00'); 
        expect(calTime.re.exec('5:00AM')[3]).to.be('A'); 

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
        expect(calTime.re.exec('9:32 am')[3]).to.be('a'); 
        expect(calTime.re.exec('9:32am')[1]).to.be('9'); 
        expect(calTime.re.exec('9:32am')[2]).to.be('32'); 
        expect(calTime.re.exec('9:32am')[3]).to.be('a'); 
        expect(calTime.re.exec('4:20 AM')[3]).to.be('A'); 
        expect(calTime.re.exec('4:20AM')[3]).to.be('A'); 
        expect(calTime.re.exec('1:05 PM')[3]).to.be('P'); 
        expect(calTime.re.exec('1:00PM')[3]).to.be('P'); 
    });

    it('should return correct formatted times even with bogus characters after hhmm',
      function() {
        expect(calTime.re.exec('9:32 aQ')[1]).to.be('9'); 
        expect(calTime.re.exec('9:32 aQ')[2]).to.be('32'); 
        expect(calTime.re.exec('9:32 aQ')[3]).to.be('a'); 
        expect(calTime.re.exec('5:43skj')[1]).to.be('5'); 
        expect(calTime.re.exec('5:43skj')[2]).to.be('43'); 
        expect(calTime.re.exec('5:43skj')[3]).to.be(undefined); 
        expect(calTime.re.exec('13:00 q')[1]).to.be('13'); 
        expect(calTime.re.exec('13:00q')[2]).to.be('00'); 
        expect(calTime.re.exec('13:00lakjf')[2]).to.be('00'); 
        expect(calTime.re.exec('5:4')).to.be(null); 
        expect(calTime.re.exec('2314prkjr')[1]).to.be('23'); 
        expect(calTime.re.exec('2314prkjr')[2]).to.be('14'); 
        expect(calTime.re.exec('2314prkjr')[3]).to.be('p'); 

      });

    it('should return correct formatted times for |hmm| and |hmm|a|m|am|pm|', 
      function() {
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
        expect(calTime.re.exec('700 PM')[3]).to.be('P'); 
    });

  }); // end of describe / get reg exp results 


  describe('getFormattedTime', function() {
    it('should return formmated time for h:mm am|pm', function() {
      expect(calTime.getFormattedTime('10:32 am')).to.be('10:32 AM');
      expect(calTime.getFormattedTime('1:05 AM')).to.be('1:05 AM');
      expect(calTime.getFormattedTime('2:34 PM')).to.be('2:34 PM');
      expect(calTime.getFormattedTime('12:34 PM')).to.be('12:34 PM');
      expect(calTime.getFormattedTime(' 12:34 PM')).to.be('12:34 PM');
    }); 
    it('should return formatted time for leading spaces', function() {
      expect(calTime.getFormattedTime(' 12:34 PM')).to.be('12:34 PM');
      expect(calTime.getFormattedTime(' 12:38 AM   ')).to.be('12:38 AM');
    }); 
    it('should return 12:xx AM for 0:mm', function() {
      expect(calTime.getFormattedTime('0:00')).to.be('12:00 AM');
      expect(calTime.getFormattedTime('0:01')).to.be('12:01 AM');
      expect(calTime.getFormattedTime('0:59')).to.be('12:59 AM');
      expect(calTime.getFormattedTime('0:01 AM')).to.be('12:01 AM');
      expect(calTime.getFormattedTime('0:01 PM')).to.be('12:01 PM');
    }); 
    it('should return the correct am|pm for h:mm', function() {
      // by default 6:59 is the switch from pm to am
      //0:00-0:59 => 12:xx AM (see test above)
      //1:00-6:59 => PM
      //7:00-11:59 => AM
      //12:00-23:59 => PM
      expect(calTime.getFormattedTime('1:00')).to.be('1:00 PM');
      expect(calTime.getFormattedTime('5:35')).to.be('5:35 PM');
      expect(calTime.getFormattedTime('6:59')).to.be('6:59 PM');
      expect(calTime.getFormattedTime('7:00')).to.be('7:00 AM');
      expect(calTime.getFormattedTime('11:55')).to.be('11:55 AM');
      expect(calTime.getFormattedTime('12:00')).to.be('12:00 PM');
      expect(calTime.getFormattedTime('12:58')).to.be('12:58 PM');
      expect(calTime.getFormattedTime('13:00')).to.be('1:00 PM');
      expect(calTime.getFormattedTime('22:12')).to.be('10:12 PM');
      expect(calTime.getFormattedTime('23:59')).to.be('11:59 PM');
      expect(calTime.getFormattedTime('24:00')).to.be('12:00 AM');
      expect(calTime.getFormattedTime('24:32')).to.be('12:32 AM');
    });
    it('should return the correct time for 24:xx', function() {
      expect(calTime.getFormattedTime('24:00 PM')).to.be('12:00 PM');
      expect(calTime.getFormattedTime('24:32 AM')).to.be('12:32 AM');
      expect(calTime.getFormattedTime('24:32 PM')).to.be('12:32 PM');
    }); 
    it('should return undefined for hours > 24', function() {
      expect(calTime.getFormattedTime('25:00 PM')).to.be(undefined);
      expect(calTime.getFormattedTime('25:00')).to.be(undefined);
      expect(calTime.getFormattedTime('25')).to.be(undefined);
      expect(calTime.getFormattedTime('27')).to.be(undefined);
    }); 
    it('should return correct time for |h|', function() {
      expect(calTime.getFormattedTime('0')).to.be('12:00 AM');
      expect(calTime.getFormattedTime('1')).to.be('1:00 PM');
      expect(calTime.getFormattedTime('6')).to.be('6:00 PM');
      expect(calTime.getFormattedTime('7')).to.be('7:00 AM');
      expect(calTime.getFormattedTime('11')).to.be('11:00 AM');
      expect(calTime.getFormattedTime('12')).to.be('12:00 PM');
      expect(calTime.getFormattedTime('13')).to.be('1:00 PM');
      expect(calTime.getFormattedTime('23')).to.be('11:00 PM');
      expect(calTime.getFormattedTime('24')).to.be('12:00 AM');
    }); 
    it('should return correct time for |h|ap| (eg 7a)', function() {
      expect(calTime.getFormattedTime('0a')).to.be('12:00 AM');
      expect(calTime.getFormattedTime('0p')).to.be('12:00 PM');
      expect(calTime.getFormattedTime('0P')).to.be('12:00 PM');
      expect(calTime.getFormattedTime('1a')).to.be('1:00 AM');
      expect(calTime.getFormattedTime('1p')).to.be('1:00 PM');
      expect(calTime.getFormattedTime('6A')).to.be('6:00 AM');
      expect(calTime.getFormattedTime('7a')).to.be('7:00 AM');
      expect(calTime.getFormattedTime('7P')).to.be('7:00 PM');
      expect(calTime.getFormattedTime('11p')).to.be('11:00 PM');
      expect(calTime.getFormattedTime('12A')).to.be('12:00 AM');
      expect(calTime.getFormattedTime('12p')).to.be('12:00 PM');
      expect(calTime.getFormattedTime('13a')).to.be('1:00 PM');
      expect(calTime.getFormattedTime('18A')).to.be('6:00 PM');
      expect(calTime.getFormattedTime('23A')).to.be('11:00 PM');
      expect(calTime.getFormattedTime('24a')).to.be('12:00 AM');
      expect(calTime.getFormattedTime('24p')).to.be('12:00 PM');
    }); 

    // TODO: 
    // it('should return correct time for h:m ', function() {
    //   expect(calTime.getFormattedTime('12:1 PM')).to.be('12:10 PM');
    //   expect(calTime.getFormattedTime('2:2a')).to.be('2:20 AM');
    //   expect(calTime.getFormattedTime('7:4')).to.be('7:40 AM');
    //   expect(calTime.getFormattedTime('6:5')).to.be('6:50 PM');
    //   expect(calTime.getFormattedTime('23:4')).to.be('11:40 PM');
    // });     
  }); 

});



# MS_County_SYA_Race_Forecast
NodeJS microservice for Demography's Single Year of Age by Race Forecast to 2050


*In Development at:* 

http://red-meteor-147235.nitrousapp.com:4000/sya-race-forecast?

**Parameters**

county: (comma separated integers)  Mandatory.

      Integer equivalents of all Colorado County FIPS Codes

year: (comma separated integers)  Mandatory.

      2010-2050

age: (comma separated integers)  0-100. Mandatory.

      0: Age 0-17
      18: Age 18-64
      65: Age 65+

race: (comma separated integers)  Mandatory.
  
      1: Hispanic
      2: White non Hispanic
      3: Asian non Hispanic
      4: American Indian non Hispanic
      5: Black non Hispanic
      6: Total

group: (optional)   Default is no grouping

      opt1: year
      opt2: county_fips
      opt3: age
      opt4: race
      opt5: year, county_fips
      opt6: year, age
      opt7: year, race
      opt8: county_fips, age
      opt9: county_fips, race
      opt10: age, race
      opt11: year, county_fips, age
      opt12: year, county_fips, race
      opt13: year, age, race
      opt14: county_fips, age, race
  
  
Example:
http://red-meteor-147235.nitrousapp.com:4000/sya-race-forecast?age=0,18&county=1,3,5,7&year=2010&race=1,2&group=opt9

output
```
[{"county_fips":1,"county":"Adams","race":"Hispanic","count":"161235.81"},
{"county_fips":1,"county":"Adams","race":"White non Hispanic","count":"212881.84"},
{"county_fips":3,"county":"Alamosa","race":"Hispanic","count":"6521.45"},
{"county_fips":3,"county":"Alamosa","race":"White non Hispanic","count":"6662.15"},
{"county_fips":5,"county":"Arapahoe","race":"Hispanic","count":"102555.00"},
{"county_fips":5,"county":"Arapahoe","race":"White non Hispanic","count":"323730.13"},
{"county_fips":7,"county":"Archuleta","race":"Hispanic","count":"1937.24"},
{"county_fips":7,"county":"Archuleta","race":"White non Hispanic","count":"7646.76"}]
```

# MS_County_SYA_Race_Estimates
NodeJS microservice to serve CO Demography Single Year of Age Race Estimates by Race

*In Development at:* 

http://red-meteor-147235.nitrousapp.com:4000/sya-race-estimates?

**Parameters**

county: (comma separated integers)  Mandatory.

      Integer equivalents of all Colorado County FIPS Codes

year: (comma separated integers)  Mandatory.

      2011-2014

age: (comma separated integers)  0-90. Mandatory.

      Valid range is 0 to 90.

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

sex: (optional)   Default is sum of male and female

      m or M: male only
      f or F: female only
      b or B: both genders listed (rather than summed)
  
Example:
http://red-meteor-147235.nitrousapp.com:4000/sya-race-estimates?age=0&county=1&year=2012&race=6&sex=b

output
```
[{"sex":"M","county_fips":1,"year":2012,"age":0,"race":"Total","count":"3571.36"},
{"sex":"F","county_fips":1,"year":2012,"age":0,"race":"Total","count":"3429.61"}]
```

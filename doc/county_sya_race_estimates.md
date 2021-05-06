# MS_County_SYA_Race_Estimates
NodeJS microservice to serve CO Demography Single Year of Age Race Estimates by Race


**Parameters**

county: (comma separated integers)  Mandatory.

      Integer equivalents of all Colorado County FIPS Codes

year: (comma separated integers)  Mandatory.

      2011-2019

age: (comma separated integers)  0-90. Mandatory.

      Valid range is 0 to 90.

race: (comma separated integers)  Mandatory.
  
      1: White
      2: Asian
      3: American Indian
      4: Black
      
ethnicity: Mandatory.
      1: Hispanic
      2: Non Hispanic

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
https://gis.dola.colorado.gov/lookups/sya-race-estimates?age=0&county=1&year=2012&race=1&ethnicity=1&sex=b

output
```
[{"sex":"M","county_fips":1,"year":2012,"age":0,"race":"White","ethnicity":"Hispanic Origin","count":"1564"},{"sex":"F","county_fips":1,"year":2012,"age":0,"race":"White","ethnicity":"Hispanic Origin","count":"1489"}]
```

# MS_County_Demographic_Profiles
NodeJS microservice for Colorado Demography County Demographic Profile Information

*In Development at:* 

https://gis.dola.colorado.gov/profile?

**Parameters**

*county*: (comma separated integers)  Mandatory.

*year*: (comma separated integers)  1985-2014. Mandatory.

*vars*: (comma separated)   Default is all.  Optional

  - births
  - deaths
  - naturalincrease
  - netmigration
  - censusbuildingpermits
  - groupquarterspopulation
  - householdpopulation
  - households
  - householdsize
  - totalhousingunits
  - vacancyrate
  - vacanthousingunits

*group*: (optional)   Default is no grouping

  - opt1 = Group by Year
  - opt2 = Group by County
  

  
https://gis.dola.colorado.gov/profile?county=1&year=2011,2012&vars=births,deaths

*output*
```
[{"countyfips":1,"year":2011,"births":"7244","deaths":"2462"},
{"countyfips":1,"year":2012,"births":"6923","deaths":"2750"}]
```

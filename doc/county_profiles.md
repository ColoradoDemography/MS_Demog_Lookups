# MS_County_Demographic_Profiles
NodeJS microservice for Colorado Demography County Demographic Profile Information


**Parameters**

*county*: (comma separated integers)  Mandatory.

*year*: (comma separated integers)  1985-2017. Mandatory.

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
  - totalpopulation

*group*: (optional)   Default is no grouping

  - opt1 = Group by Year
  - opt2 = Group by County
  

  
https://gis.dola.colorado.gov/lookups/profile?county=1&year=2011,2012&vars=births,deaths

*output*
```
[{"countyfips":1,"year":2011,"births":"7244","deaths":"2462"},
{"countyfips":1,"year":2012,"births":"6923","deaths":"2750"}]
```

To get a list of counties:
https://gis.dola.colorado.gov/lookups/component_county

To obtain regional data:
https://gis.dola.colorado.gov/lookups/profile_regions?reg_num=1&year=1990

Regions (reg_num):
Colorado = 0
Planning regions 1-14 = 1-14 (See https://demography.dola.colorado.gov/housing-and-households/planning-and-management-regions/ for a map and further info)
Central Mountains = 15 (
Eastern Plains = 16
Front Range = 17
San Luis Valley = 18
Western Slope = 19
Denver PMSA = 20
Denver Boulder Metro Area = 21
Denver Boulder Greeley CMSA = 22
10 County Denver Metro = 23

To get a list of years:
https://gis.dola.colorado.gov/lookups/profileYRS

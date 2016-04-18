# Municipal Population and Housing Timeseries
NodeJS Microservice for County and Municipal Population and Housing Timeseries Data

*In Development at:* 

https://gis.dola.colorado.gov/munipophousing?

**Parameters**

countyfips: (comma separated integers)

placefips: (comma separated integers)

year: (comma separated integers)  possible: 2010,2011,2012,2013,2014.  Mandatory.

compressed: yes or no (no is assumed if you entered a countyfips and placefips)

stats: comma separated list  (none defaults to totalpopulation)
 - totalpopulation
 - householdpopulation
 - groupquarterspopulation
 - totalhousingunits
 - occupiedhousingunits
 - vacanthousingunits
 
https://gis.dola.colorado.gov/munipophousing?year=2014&placefips=4000&compressed=yes

output
```
[{"municipalityname":"Aurora","year":2014,"placefips":4000,"totalpopulation":"350773"}]
```

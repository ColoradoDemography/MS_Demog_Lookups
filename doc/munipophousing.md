# MS_MuniPopHousingTimeseries
NodeJS Microservice for MuniPopHousingTimeseries Data

*In Development at:* 

https://d2bm5f0oqkufle.cloudfront.net/munipophousing?

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
 
example:  https://d2bm5f0oqkufle.cloudfront.net/munipophousing?year=2014&placefips=4000&compressed=yes

output
```
[{"municipalityname":"Aurora","year":2014,"placefips":4000,"totalpopulation":"350773"}]
```

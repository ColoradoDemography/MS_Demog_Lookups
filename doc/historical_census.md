# Historical Census
NodeJS microservice for Colorado Demography Historical County and Municipality Census Population Data


**Parameters**

*geo*: (comma separated integers) This will be the geo name plus _M if it is a municipality or _C if it is a county Mandatory.

*year*: (comma separated integers)  1870-2020. Mandatory.

https://gis.dola.colorado.gov/lookups/historicalcensus?geo=Adams_C,Alamosa_C,Akron_M,Alamosa_M&year=2010,2020

*output*
```
[{"area_name":"Akron","area_type":"M","population_year":2010,"total_population":"1702"},{"area_name":"Alamosa","area_type":"M","population_year":2010,"total_population":"8780"},
{"area_name":"Akron","area_type":"M","population_year":2020,"total_population":"1757"},{"area_name":"Alamosa","area_type":"M","population_year":2020,"total_population":"9806"},
{"area_name":"Adams","area_type":"C","population_year":2010,"total_population":"441603"},{"area_name":"Alamosa","area_type":"C","population_year":2010,"total_population":"15445"},
{"area_name":"Adams","area_type":"C","population_year":2020,"total_population":"519572"},{"area_name":"Alamosa","area_type":"C","population_year":2020,"total_population":"16376"}]
```

To get a list of counties:
https://gis.dola.colorado.gov/lookups/historicalcounty

To get a list of municipalities:
https://gis.dola.colorado.gov/lookups/historicalmuni

To get a list of years:
https://gis.dola.colorado.gov/lookups/historicalYRS

# MS_CountySYA
NodeJS microservice for Colorado County Single Year of Age Data (Estimates and Forecasts)

*In Development at:* 

https://gis.dola.colorado.gov/sya?

**Parameters**

county: (comma separated integers)  Mandatory.

year: (comma separated integers)  1990-2050. Mandatory.

age: (comma separated integers)  0-100. Mandatory.

group: (optional)   Default is no grouping

  opt1 = Group by Year
  
  opt2 = Group by County and Year
  
  opt3 = Group by Age and Year
  

https://gis.dola.colorado.gov/sya?age=15,16&county=1,3&year=1990,2025

output
```
[{"countyfips":1,"year":1990,"age":15,"county":"Adams","malepopulation":"1902","femalepopulation":"1801","datatype":"Estimate"},
{"countyfips":1,"year":1990,"age":16,"county":"Adams","malepopulation":"1829","femalepopulation":"1747","datatype":"Estimate"},
{"countyfips":1,"year":2025,"age":15,"county":"Adams","malepopulation":"4432.42","femalepopulation":"4053.31","datatype":"Forecast"},
{"countyfips":1,"year":2025,"age":16,"county":"Adams","malepopulation":"4428.82","femalepopulation":"4161.48","datatype":"Forecast"},
{"countyfips":3,"year":1990,"age":15,"county":"Alamosa","malepopulation":"94","femalepopulation":"90","datatype":"Estimate"},
{"countyfips":3,"year":1990,"age":16,"county":"Alamosa","malepopulation":"99","femalepopulation":"99","datatype":"Estimate"},
{"countyfips":3,"year":2025,"age":15,"county":"Alamosa","malepopulation":"127.5","femalepopulation":"143.61","datatype":"Forecast"},
{"countyfips":3,"year":2025,"age":16,"county":"Alamosa","malepopulation":"139.62","femalepopulation":"161.74","datatype":"Forecast"}]
```

# MS_Components_of_Change
NodeJS microservice to deliver Colorado State Demography Office Components of Change Data


*In Development at:* 

http://red-meteor-147235.nitrousapp.com:4001/components?

**Parameters**

*county*: (comma separated integers)  Mandatory.

*year*: (comma separated integers)  1970-2050. Mandatory.

*group*: (optional)   Default is no grouping

  - opt1 = Group by Year
  - opt2 = Group by County
  

  
http://red-meteor-147235.nitrousapp.com:4001/components?county=1&year=2010,2011,2012

*output*
```
[{"countyfips":1,"year":2010,"estimate":"443711","change":"7388","births":"7436","deaths":"2474","netmig":"2426","datatype":"Estimate"},
{"countyfips":1,"year":2011,"estimate":"451926","change":"8215","births":"7244","deaths":"2462","netmig":"3433","datatype":"Estimate"},
{"countyfips":1,"year":2012,"estimate":"460254","change":"8328","births":"6923","deaths":"2750","netmig":"4155","datatype":"Estimate"}]
```

# MS_Components_of_Change
NodeJS microservice to deliver Colorado State Demography Office Components of Change Data


**Parameters**

*county*: (comma separated integers)  Mandatory.

*year*: (comma separated integers)  1970-2050. Mandatory.

*group*: (optional)   Default is no grouping

  - opt1 = Group by Year
  - opt2 = Group by County

  
https://gis.dola.colorado.gov/lookups/components?county=1&year=2010,2011,2012

*output*
```
[{"countyfips":1,"year":2010,"estimate":"443711","change":"7388","births":"7436","deaths":"2474","netmig":"2426","datatype":"Estimate"},
{"countyfips":1,"year":2011,"estimate":"451926","change":"8215","births":"7244","deaths":"2462","netmig":"3433","datatype":"Estimate"},
{"countyfips":1,"year":2012,"estimate":"460254","change":"8328","births":"6923","deaths":"2750","netmig":"4155","datatype":"Estimate"}]
```


To get a list of valid years:
https://gis.dola.colorado.gov/lookups/componentYRS

```
[{"year":1970,"datatype":"Estimate"},{"year":1971,"datatype":"Estimate"},{"year":1972,"datatype":"Estimate"},{"year":1973,"datatype":"Estimate"},{"year":1974,"datatype":"Estimate"},{"year":1975,"datatype":"Estimate"},{"year":1976,"datatype":"Estimate"},{"year":1977,"datatype":"Estimate"},{"year":1978,"datatype":"Estimate"},{"year":1979,"datatype":"Estimate"},{"year":1980,"datatype":"Estimate"},{"year":1981,"datatype":"Estimate"},{"year":1982,"datatype":"Estimate"},{"year":1983,"datatype":"Estimate"},{"year":1984,"datatype":"Estimate"},{"year":1985,"datatype":"Estimate"},{"year":1986,"datatype":"Estimate"},{"year":1987,"datatype":"Estimate"},{"year":1988,"datatype":"Estimate"},{"year":1989,"datatype":"Estimate"},{"year":1990,"datatype":"Estimate"},{"year":1991,"datatype":"Estimate"},{"year":1992,"datatype":"Estimate"},{"year":1993,"datatype":"Estimate"},{"year":1994,"datatype":"Estimate"},{"year":1995,"datatype":"Estimate"},{"year":1996,"datatype":"Estimate"},{"year":1997,"datatype":"Estimate"},{"year":1998,"datatype":"Estimate"},{"year":1999,"datatype":"Estimate"},{"year":2000,"datatype":"Estimate"},{"year":2001,"datatype":"Estimate"},{"year":2002,"datatype":"Estimate"},{"year":2003,"datatype":"Estimate"},{"year":2004,"datatype":"Estimate"},{"year":2005,"datatype":"Estimate"},{"year":2006,"datatype":"Estimate"},{"year":2007,"datatype":"Estimate"},{"year":2008,"datatype":"Estimate"},{"year":2009,"datatype":"Estimate"},{"year":2010,"datatype":"Estimate"},{"year":2011,"datatype":"Estimate"},{"year":2012,"datatype":"Estimate"},{"year":2013,"datatype":"Estimate"},{"year":2014,"datatype":"Estimate"},{"year":2015,"datatype":"Forecast"},{"year":2016,"datatype":"Forecast"},{"year":2017,"datatype":"Forecast"},{"year":2018,"datatype":"Forecast"},{"year":2019,"datatype":"Forecast"},{"year":2020,"datatype":"Forecast"},{"year":2021,"datatype":"Forecast"},{"year":2022,"datatype":"Forecast"},{"year":2023,"datatype":"Forecast"},{"year":2024,"datatype":"Forecast"},{"year":2025,"datatype":"Forecast"},{"year":2026,"datatype":"Forecast"},{"year":2027,"datatype":"Forecast"},{"year":2028,"datatype":"Forecast"},{"year":2029,"datatype":"Forecast"},{"year":2030,"datatype":"Forecast"},{"year":2031,"datatype":"Forecast"},{"year":2032,"datatype":"Forecast"},{"year":2033,"datatype":"Forecast"},{"year":2034,"datatype":"Forecast"},{"year":2035,"datatype":"Forecast"},{"year":2036,"datatype":"Forecast"},{"year":2037,"datatype":"Forecast"},{"year":2038,"datatype":"Forecast"},{"year":2039,"datatype":"Forecast"},{"year":2040,"datatype":"Forecast"},{"year":2041,"datatype":"Forecast"},{"year":2042,"datatype":"Forecast"},{"year":2043,"datatype":"Forecast"},{"year":2044,"datatype":"Forecast"},{"year":2045,"datatype":"Forecast"},{"year":2046,"datatype":"Forecast"},{"year":2047,"datatype":"Forecast"},{"year":2048,"datatype":"Forecast"},{"year":2049,"datatype":"Forecast"},{"year":2050,"datatype":"Forecast"}]
```

To get a list of counties:
https://gis.dola.colorado.gov/lookups/component_county

To obtain regional data:
https://gis.dola.colorado.gov/lookups/components_region?reg_num=1&year=1990

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

To get a list of regions:
https://gis.dola.colorado.gov/lookups/component_region

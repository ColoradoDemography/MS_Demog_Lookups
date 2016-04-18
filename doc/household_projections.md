# MS_Household_Projections
NodeJS microservice for accessing colorado household projections

*In Development at:* 

https://gis.dola.colorado.gov/household?

**Parameters**

county: (comma separated integers)  Mandatory.

      Integer equivalents of all Colorado County FIPS Codes

year: (comma separated integers)  Mandatory.

      2010-2050

age: (comma separated)  Mandatory.

      0: Total
      1: 18-24
      2: 25-44
      3: 45-64
      4: 65 & Over

household: (comma separated)  Mandatory.

      0: All Households
      1: One adult with no children
      2: One adult with children
      3: More than one adult with no children
      4: More than one adult with children
      
group: (optional)   Default is no grouping

      opt0: = none or all = base query
      opt1: year
      opt2: area_code
      opt3: age_group_id
      opt4: household_type_id
      opt5: year, area_code
      opt6: year, age_group_id
      opt7: year, household_type_id
      opt8: area_code, age_group_id
      opt9: area_code, household_type_id
      opt10: age_group_id, household_type_id
      opt11: year, area_code, age_group_id
      opt12: year, area_code, household_type_id
      opt13: area_code, age_group_id, household_type_id

  
Example:
https://gis.dola.colorado.gov/household?county=1,3&year=2010&age=1,2&household=1,2,3&group=opt8

output
```
[{"area_code":1,"age_group_id":1,"total_households":"6948.64992"},
{"area_code":1,"age_group_id":2,"total_households":"37030.65321"},
{"area_code":3,"age_group_id":1,"total_households":"431.60372"},
{"area_code":3,"age_group_id":2,"total_households":"861.61252"}]
```

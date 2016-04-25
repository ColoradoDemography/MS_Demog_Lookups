# MS\_Jobs\_by\_Sector
NodeJS microservice for accessing colorado jobs data


**Parameters**

county: (comma separated integers)  Mandatory.

      Integer equivalents of all Colorado County FIPS Codes (0 for Statewide)

year: (comma separated integers)  Mandatory.

      2001-2014

sector: (comma separated with leading zeros as necessary)  Optional. (Default is All)

    00000 Estimated Total Jobs
    01000 Agriculture
    01010   Crops and livestock production
    01020   Farm services
    02000 Mining
    02010   Oil and gas extraction
    02020   Mining (except oil and gas)
    02030   Support Activities for mining
    03000 Utilities
    03030   Utilities
    04000 Construction
    04010   Construction of buildings
    04020   Heavy and cilvil engineering construct
    04030   Special trade contractors
    05000 Manufacturing
    05010   Wood product and furniture manufacturi
    05020   Nonmetallic mineral product manufactur
    05030   Primary and fabricated metal manufactu
    05040   Machinery manufacturing
    05050   Computer and electrical equipment manu
    05060   Motor vehicle and transportation manuf
    05070   Miscellaneous manufacturing
    05080   Food and beverage product manufacturin
    05090   Textile mills and product  apparel  an
    05100   Paper and printing manufacturing
    05110   Chemical manufacturing
    05120   Plastics and rubber products manufactu
    06000 Wholesale trade
    06010   Wholesale
    07000 Retail Trade
    07010   Motor vehicle and parts dealers
    07020   Furniture  electronics  appliances  an
    07030   Food and beverage stores
    07040   Health and personal care stores
    07050   Gasoline stations
    07060   Clothing and clothing accessories stor
    07070   Sporting goods  hobby  book and music
    07080   General merchandise stores
    07090   Miscellaneous store retailers
    07100   Nonstore retailers
    08000 Transportation and warehousing
    08010   Air transportation
    08020   Rail transportation
    08030   Truck transportation
    08040   Support for transportation
    08050   Transit and ground passenger transport
    08060   Pipeline transportation
    08070   Scenic  sightseeing  and water transpo
    08080   Couriers and messengers and postal ser
    08090   Warehousing and storage
    09000 Information
    09010   Publishing industries
    09030   Motion picture and broadcasting  excep
    09050   ISPs  search portals  and data process
    10000 Finance activities
    10010   Monetary authorities and credit interm
    10020   Securities  commodity contracts and in
    10100   Insurance carriers  funds  trusts  and
    10150 Real estate
    10200   Real estate
    11000 Professional and business services
    11020   Professional and technical services
    11025   Management of companies and enterprise
    11030   Management of companies and enterprise
    11050   Admin and waste
    11090   Administrative and support services
    11100   Waste management and remediation servi
    12000 Education
    12010   Private Educational services
    12015 Health Services
    12020   Ambulatory health care services
    12030   Hospitals
    12040   Nursing and residential care facilitie
    12050   Social assistance
    13000 Arts
    13010   Arts  entertainment  and recreation
    13015   Accommodation and food
    13020   Accommodation
    13030   Food services and drinking places
    14000 Other services  except public administration
    14010   Automotive and other repair and mainte
    14020   Personal and laundry services
    14030   Membership associations and organizati
    14040   Private households
    15000 Government
    15010   Federal government  civilian
    15014   Military
    15020   State government
    15030   Local government

  
Example:
https://gis.dola.colorado.gov/lookups/jobs?county=1,3&year=2014,2013,2012&sector=04000,01010

output
```
[{"area_code":1,"sector_id":"01010","sector_name":"  Crops and livestock production","population_year":2012,"total_jobs":null},
{"area_code":1,"sector_id":"04000","sector_name":"Construction","population_year":2012,"total_jobs":"19224"},
{"area_code":3,"sector_id":"01010","sector_name":"  Crops and livestock production","population_year":2012,"total_jobs":null},
{"area_code":3,"sector_id":"04000","sector_name":"Construction","population_year":2012,"total_jobs":"490"},
{"area_code":1,"sector_id":"01010","sector_name":"  Crops and livestock production","population_year":2013,"total_jobs":null},
{"area_code":1,"sector_id":"04000","sector_name":"Construction","population_year":2013,"total_jobs":"21948"},
{"area_code":3,"sector_id":"01010","sector_name":"  Crops and livestock production","population_year":2013,"total_jobs":null},
{"area_code":3,"sector_id":"04000","sector_name":"Construction","population_year":2013,"total_jobs":"466"},
{"area_code":1,"sector_id":"01010","sector_name":"  Crops and livestock production","population_year":2014,"total_jobs":null},
{"area_code":1,"sector_id":"04000","sector_name":"Construction","population_year":2014,"total_jobs":"24758.7689106798"},
{"area_code":3,"sector_id":"01010","sector_name":"  Crops and livestock production","population_year":2014,"total_jobs":null},
{"area_code":3,"sector_id":"04000","sector_name":"Construction","population_year":2014,"total_jobs":"471.543534961562"}]
```

# MS_Labor_Force_Participation
NodeJS microservice to access Colorado Labor Force Participation Rate Projections from 2010 to 2040

*In Development at:* 

http://red-meteor-147235.nitrousapp.com:4001/labor-force?

**Parameters**

county: (comma separated integers)  Mandatory.

      Integer equivalents of all Colorado County FIPS Codes

year: (comma separated integers)  Mandatory.

      2010-2040

age: (comma separated letters)  Mandatory.

      a: 16 to 19
      b: 20 to 24
      c: 25 to 34
      d: 35 to 44
      e: 45 to 54
      f: 55 to 64
      g: 65+

group: (optional)   Default is no grouping

      opt1: year
      opt2: county_fips
      opt3: age
      opt4: year, county_fips
      opt5: year, age
      opt6: county_fips, age

sex: (optional)   Default is sum of male and female

      m or M: male only
      f or F: female only
      b or B: both genders listed (rather than summed)
  
Example:
http://red-meteor-147235.nitrousapp.com:4001/labor-force?year=2010,2011,2012&county=13,14&age=f,g&gender=b&group=opt4

output
```
[{"gender":"Female","population_year":2010,"area_code":13,"laborforce":"14741.19","cni_pop_16pl":"34067.47","participationrate":"0.43270574539289239853"},
{"gender":"Female","population_year":2010,"area_code":14,"laborforce":"2534.57","cni_pop_16pl":"6210.45","participationrate":"0.40811374377058023171"},
{"gender":"Female","population_year":2011,"area_code":13,"laborforce":"15729.11","cni_pop_16pl":"35698.83","participationrate":"0.44060575654720336773"},
{"gender":"Female","population_year":2011,"area_code":14,"laborforce":"2716.29","cni_pop_16pl":"6518.17","participationrate":"0.41672586017241035444"},
{"gender":"Female","population_year":2012,"area_code":13,"laborforce":"16612.70","cni_pop_16pl":"37294.27","participationrate":"0.44544912663527131648"},
{"gender":"Female","population_year":2012,"area_code":14,"laborforce":"2867.51","cni_pop_16pl":"6814.80","participationrate":"0.42077683864530140283"},
{"gender":"Male","population_year":2010,"area_code":13,"laborforce":"17245.12","cni_pop_16pl":"30788.06","participationrate":"0.56012363234318758636"},
{"gender":"Male","population_year":2010,"area_code":14,"laborforce":"2832.93","cni_pop_16pl":"5294.09","participationrate":"0.53511179447270446857"},
{"gender":"Male","population_year":2011,"area_code":13,"laborforce":"18131.50","cni_pop_16pl":"32315.17","participationrate":"0.56108323118832424524"},
{"gender":"Male","population_year":2011,"area_code":14,"laborforce":"3002.11","cni_pop_16pl":"5575.78","participationrate":"0.53841973679018899598"},
{"gender":"Male","population_year":2012,"area_code":13,"laborforce":"18914.17","cni_pop_16pl":"33782.46","participationrate":"0.55988137039161742514"},
{"gender":"Male","population_year":2012,"area_code":14,"laborforce":"3185.76","cni_pop_16pl":"5907.09","participationrate":"0.53931123446570138596"}]
```

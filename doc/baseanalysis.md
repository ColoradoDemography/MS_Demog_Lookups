# MS Base Analysis
NodeJS microservice to deliver Colorado State Demography Office Industry Base Analysis Data


*In Development at:* 

http://red-meteor-147235.nitrousapp.com:4001/base-analysis?

**Parameters**

*county*: (comma separated integers)  Mandatory.  

Special Cases:
 - Denver Metro Region counties are grouped into County Code: 500
 - Statewide code is 0

  
http://red-meteor-147235.nitrousapp.com:4001/base-analysis?county=3

*output*
```
[{"id":"1","fips":"003","ctype":1,"cname":"Alamosa ","employment":"9720.135844","agri_emp":"983.59812","mining_emp":"13.66601942","manuf_emp":"99.43993287","govt_emp":"1447.436666","regl_serv_emp":"1742.325088","ib_emp":"736.376685","tourism_emp":"825.112995","total_lrs_emp":"3872.180337","commuter_emp":"-441.8329698","other_hhd_emp":"316.735695","retiree_emp":"737.4488619","other_inc_emp":"188.940265","wrkr_lrs_emp":"3070.888485","total_basic_emp":"6649.247359","resorts_emp":"487.7985808","second_home_emp":"40.3343203","tour_serv_emp":"243.4402519","trans_emp":"53.53984204","ag_proc_emp":"27.26545455","ag_inputs_emp":"207.299012","ag_prod_emp":"603.939461","ag_proc_trade_emp":"145.0941925","natl_comm_emp":"1.5640625","natl_const_emp":"185.088875","natl_fire_emp":"22.40769044","natl_trade_emp":"270.0244805","natl_bus_emp":"6.969454876","natl_ed_emp":"1254.558897","direct_basic_emp":"5912.870674"}]
```

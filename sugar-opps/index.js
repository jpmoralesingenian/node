/*
 * Query SugarCRM for every possible opportunity in a JSON format
 */
var request = require("request");
var params = "method=login&input_type=json&response_type=json";
//var url = "http://crm.ingenian.com/service/v4/rest.php?"+ params; 
var payload= {"user_auth":{"user_name":"jpmorales","password":"3e48c3b5e76dd7a2e0144a886b6e47ef","version":"1.0"},"application_name":"RestCall"}    
payload =JSON.stringify(payload);
//var url= "http://crm.ingenian.com/service/v4/rest.php?method=login&input_type=JSON&response_type=JSON&rest_data={%22user_auth%22:{%22user_name%22:%22jpmorales%22,%22password%22:%223e48c3b5e76dd7a2e0144a886b6e47ef%22,%22version%22:%221%22},%22application_name%22:%22RestCall%22,%22name_value_list%22:[]}"; 
var http = require('http');
var headers = { "cache-control": "max-age=0","accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8","Upgrade-Insecure-Requests": 1,"Accept-Language": "en-US,en;q=0.8,es;q=0.6,es-419;q=0.4"};
var options = { url: "http://crm.ingenian.com/service/v4/rest.php?method=login&input_type=JSON&response_type=JSON&rest_data="+encodeURIComponent(payload),
			    headers: headers};
request(options, function(error,response,body) {
	if(!error&&response.statusCode==200) {
		load_opportunities(body,headers);
	} else {
		console.log("Error logging in["+response.statusCode+ "]..."+ error);
	}
});
function load_opportunities(body,headers) {
		var dateutil = require("dateutil");
		var data = JSON.parse(body);
		var session_id = data.id; 
		var cur_date = new Date();
		var year_week = +dateutil.format(cur_date,"M");
		var year = +dateutil.format(cur_date, "Y");
		var quarter=Math.ceil(year_week/3);  
		var quarter_text ;  
		switch (quarter){
				case 1:
						quarter_text="'"+year+"-01-01' and '"+year+"-03-30'";
						break;
				case 2:
						quarter_text="'"+year+"-04-01' and '"+year+"-06-30'";
						break;
				case 3:
						quarter_text="'"+year+"-07-01' and '"+year+"-09-30'";
						break;
				case 4:
						quarter_text="'"+year+"-10-01' and '"+year+"-12-31'";
						break;    
		}
		//"query":"opportunities.sales_stage not like '%Closed%' and opportunities.date_closed between "+quarter_text,
		payload = {
				"session":session_id,
				"module_name":"Opportunities",     
				"query":"opportunities.sales_stage not like '%Closed%'",
				"order_by":"opportunities.sales_stage",
				"offset":"0",
				"select_fields":"",
				"link_name_to_fields_array":{},
				"max_results":"1000",
				"deleted":"0"
		};
		payload =JSON.stringify(payload);
		options = { url: "http://crm.ingenian.com/service/v4/rest.php?method=get_entry_list&input_type=JSON&response_type=JSON&rest_data="+encodeURIComponent(payload),
					headers: headers};
		request(options, function(error,response,body) {
			if(!error&&response.statusCode<400) {
				console.log(body);		
			} else {
				console.log("Error fetching full data "+ error);
			}
		});
}

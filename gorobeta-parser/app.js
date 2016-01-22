var artoo = require('artoo-js');
var fs = require('fs');
var util = require('util');
var request = require('request');
var initialJSText = fs.readFileSync("bogota.json");
console.log("Leido el archivo bogota.json");
var initialJS = JSON.parse(initialJSText);
var restaurants = initialJS.abiertos;
console.log(restaurants.length + " restaurantes abiertos");
restaurants = restaurants.concat(initialJS.cerrados);
console.log(restaurants.length + " restaurantes totales");
// Initialize parsers
var artoo = require('artoo-js');
var cheerio = require('cheerio');
var http = require('http');
var request = require('request');
//Now we should start the cycle
restaurants.forEach(parseRestaurant);
//parseRestaurant(restaurants[3],3,restaurants);

function parseRestaurant(restaurant,index,restaurants) {
	console.log("Parsing "+ restaurant.nombre + "->"+ restaurant.link);
	//Get the gigantic url
	var content="";
	var headers = { "cache-control": "max-age=0",
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Upgrade-Insecure-Requests": 1,
			"Accept-Language": "en-US,en;q=0.8,es;q=0.6,es-419;q=0.4",
			"Cookie": "CAKEPHP=entjac8oe4b981on3ndlnfldf7"
			};
	
	var options = { url: "http://www.domicilios.com"+restaurant.link,
			headers: headers};
	request(options, function(error,response,body) {
		if(!error&&response.statusCode==200) {
			parseHTMLRestaurant(restaurant,body);
		} else {
			console.log("Error reading "+ restaurant.link + "->"+ error);
		}
	});
}
function parseHTMLRestaurant(restaurant,content) {
	console.log("Interpreting HTML");
	var $ = cheerio.load(content);
	artoo.setContext($);
	var child_number =1;
	var data = artoo.scrape('.categoria-menu-content', { 
		categoria: function() { return $(this).find("h4").text();},
		image_url: function() { return $(this).find(".category-image").attr("src");},
		descripcion_categoria: function() { return $(this).find(".descripcion-categoria").text(); },
		productos: function() {
				child_number++;
				return artoo.scrape('.categoria-menu-content:nth-child('+child_number +') .product-item', {
				title: function() { return $(this).find('.product-info .title').text();},
				image: function() { return $(this).find('.image-load').attr("data-src");},
				description: function() { var description = $(this).find('.description').text();
					description = description.replace(/.ver m.*/,"");
					description = description.replace(/ \./g,"");
					return description;
			
				},
				price: function() { return $(this).find('.product-info .price').attr("itemprice");},
				id: function() { return $(this).attr("id");}
				});
			}
	
	});
	sendToSOLR(restaurant,data);
}
/**
 * Given the information try and create solr nodes out of it
 */
function sendToSOLR(restaurant,data) {
//	console.log(util.inspect(data,{showHidden:false,depth:3}));
	//console.log("File written");
	var items = [];
	
	data.forEach(function(category) {
		if(!category.productos) {
			//No products in the category. BYE!
			return;
		}
		category.productos.forEach(function (product) {
			var item = {
				name: product.title,
				id: product.id,
				price: product.price,
				description: (category.descripcion_categoria)?[product.description,category.descripcion_categoria]:product.description,
				image_url: (product.image)?("http://www.domicilios.com"+ product.image):((category.image_url)?("http://www.domicilios.com"+category.image_url):undefined),
				url: "http://www.domicilios.com"+ restaurant.link,
				tag: category.categoria,
				restaurant: restaurant.nombre
			};
			items.push(item);
								
		});
	});
	//console.log(JSON.stringify(items));
	request.post({uri:'http://52.23.223.59:8983/solr/update?commit=true',headers: {'Content-Type':'application/json'},json:items},function(error,response, body) { console.log((error?"ERROR  ":"SUCESS ")+response.statusCode + " " + restaurant.nombre+ "->" + util.inspect(body));});
	//console.log(util.inspect(items,{showHidden:false,depth:3}));		
	
}

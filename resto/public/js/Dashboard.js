queue()
    .defer(d3.json, "/api/encuestas")
    .await(makeGraphs);

function makeGraphs(error, apiData) {
	
//Start Transformations
	var dataSet = apiData;
	var dateFormat = d3.time.format("%Y-%m-%d");
	dataSet.forEach(function(d) {
		d.when= dateFormat.parse(d.when.substring(0,10));
	});
	//Create a Crossfilter instance
	var ndx = crossfilter(dataSet);

	//Define Dimensions
	var when = ndx.dimension(function(d) { return d.when; });
	var score = ndx.dimension(function(d) { return d.score; });
	var mesero = ndx.dimension(function(d) { return d.mesero[0].name; });
	var totalScore  = ndx.dimension(function(d) { return d.score; });


	//Calculate metrics
	var encuestasByDate = when.group(); 
	var encuestasByScore = score.group(); 
	var meseroGroup = mesero.group();

	var all = ndx.groupAll();
	//Calculate Groups
	var totalScoreMesero = mesero.group().reduceCount();
	var netScoreAverage = ndx.groupAll().reduce(function(p,v) {++p.count,p.total+=v.score; return p;},function(p,v) {--p.count,p.total-=v.score; return p;},function() {return {count:0,total:0};});

	//Define threshold values for data
	var minDate = when.bottom(1)[0].when;
	var maxDate = when.top(1)[0].when;
console.log('MinDate is ' + minDate);
console.log('MaxDate is ' + maxDate);

    //Charts
	var dateChart = dc.lineChart("#date-chart");
	var scoreChart = dc.rowChart("#score-chart");
	var totalProjects = dc.numberDisplay("#total-projects");
	var scoreAverage = dc.numberDisplay("#score-average");
	var meseroDonations = dc.barChart("#mesero-donations");


  selectField = dc.selectMenu('#menuselect')
        .dimension(mesero)
        .group(meseroGroup); 

       dc.dataCount("#row-selection")
        .dimension(ndx)
        .group(all);


	totalProjects
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

	scoreAverage
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d.total/d.count; })
		.group(netScoreAverage)
		.formatNumber(d3.format(".3s"));

	dateChart
		//.width(600)
		.height(220)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(when)
		.group(encuestasByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Fecha")
		.yAxis().ticks(6);

	scoreChart
		//.width(300)
		.height(220)
        .dimension(score)
        .group(encuestasByScore)
        .xAxis().ticks(4);

  

    meseroDonations
    	//.width(800)
        .height(220)
        .transitionDuration(1000)
        .dimension(mesero)
        .group(totalScoreMesero)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(mesero))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format("s"));

    dc.renderAll();

};

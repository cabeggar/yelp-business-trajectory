var showType;
var showYear;

function renderTypeAnnualChart(data) {
    var width = 800,
        height = 300;
    var padding = {
        top: 10,
        right: 50,
        bottom: 50,
        left: 50
    };
    var svg = d3.select("#typeChart")
        .append('svg')
        .attr("width", "100%")
        .attr("height", "100%");
    var main = svg.append('g')
        .classed('main', true)
        .attr('transform', "translate(" + padding.left + ',' + padding.top + ')');
    var xScale = d3.scale.linear()
        .domain([0, 12])
        .range([0, width - padding.left - padding.right]);
    var yScale = d3.scale.linear()
        .domain([d3.min(data, function(d) {
            return d.weightedavg;
        })-0.1, d3.max(data, function(d) {
            return d.weightedavg;
        })+0.1])
        .range([height - padding.top - padding.bottom, 0]);
//    var yScale = d3.scale.linear()
//        .domain([0.6, 2.2])
//        .range([height - padding.top - padding.bottom, 0]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');
    main.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (height - padding.top - padding.bottom) + ')')
        .call(xAxis);
    main.append('g')
        .attr('class', 'axis')
        .call(yAxis);
    var line = d3.svg.line()
        .x(function (d) {
            return xScale(d.m)
        })
        .y(function (d) {
            return yScale(d.weightedavg);
        })
        .interpolate('linear');
    main.append('path')
        .attr('class', 'line')
        .attr('d', line(data));
    main.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d.m);
        })
        .attr('cy', function (d) {
            return yScale(d.weightedavg);
        })
        .attr('r', 3)
        .attr('fill');
};

function renderTypeAnnualTrend(data, typeName, year) {
    var resultFiltered = data.filter(function (d) {
        return d.y == showYear && d.ftype == showType;
    });

    renderTypeAnnualChart(resultFiltered);
}

function drawTypeAnnualTrend(typeName, year) {
    showType = typeName;
    showYear = year;
    d3.json("https://raw.githubusercontent.com/cabeggar/yelp-business-trajectory/master/data/data.json", function (error, result) {
        renderTypeAnnualTrend(result);
    });
}

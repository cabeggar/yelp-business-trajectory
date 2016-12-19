var data = [];
var elite = [];

// parameter
var bid;
var year;
var width = 800,
    height = 300;
var padding = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 15
};
initial("DoKUOUwAsWrlRY6ehzQV_w", 2014);

function initial(bid, year) {
    this.bid = bid;
    this.year = year;
    console.log(this.bid);
    readData();
}

function readData() {
    //import visit data for elite user
    d3.json("https://raw.githubusercontent.com/little2potato/yelp-business-trajectory/master/business-annual-trend/newVisit.json", function (error, result) {
        data = result;
        readElite();
    });
}

function readElite() {
    d3.json("https://raw.githubusercontent.com/little2potato/yelp-business-trajectory/master/business-annual-trend/newElite.json", function (error, result) {
        elite = result;
        //                console.log(data.length)
        render(data, elite);
    });

}

function renderChart(data, filteredElite) {
    
    var svg = d3.select('#businessChart')
        .append('svg')
        .attr("width", "100%")
        .attr("height", "100%");
    
    var main = svg.append('g')
        .classed('main', true)
        .attr('transform', "translate(" + padding.top + ',' + padding.left + ')');

    var xScale = d3.scale.linear()
        .domain([1, 12])
        .range([0, width - padding.left - padding.right]);
    var yScale = d3.scale.linear()
        .domain([0, 8])
        .range([height - padding.top - padding.bottom, 0]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var colorScale = d3.scale.linear()
        .domain([5, 4, 3, 2, 1])
        .range(["#d62728", "#ab1f20", "#801718", "#550f10", "#2a0708"]);

    //             var color = d3.scaleOrdinal(d3.schemeCategory20b);

    main.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (height - padding.top - padding.bottom) + ')')
        .call(xAxis);

    main.append('g')
        .attr('class', 'axis')
        .call(yAxis);

    var line = d3.svg.line()
        .x(function (d) {
            return xScale(d.month)
        })
        .y(function (d) {
            return yScale(d.vcount);
        })
        .interpolate('linear');

    main.append('path')
        .attr('class', 'line')
        .attr('d', line(data))
        .attr("id", "myline");

    main.selectAll('circle')
        .data(filteredElite)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
            return xScale(d.month + d.day / 30)
        })
        .attr('cy', function (d) {
            return findYatX(xScale(d.month + d.day / 30), document.getElementById("myline"))[1]
        })
        .attr("fill", function (d) {
            return colorScale(d.rstar)
        })
        .attr('r', 4);

    // Get the coordinates          
    function findYatX(x, linePath) {
        function getXY(len) {
            var point = linePath.getPointAtLength(len);
            return [point.x, point.y];
        }
        var curlen = 0;
        while (getXY(curlen)[0] < x) {
            curlen += 0.01;
        }
        return getXY(curlen);
    }

    var legendRectSize = 15;
    var legendSpacing = 2;

    var legend = main.selectAll('.legend')
        .data(colorScale.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = height * colorScale.domain().length / 5;
            var horz = 30 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', colorScale)
        .style('stroke', colorScale);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) {
            return d;
        });


}

function render(data, elite) {
    var filteredData = data.filter(function (d) {
        return d.bid == bid && d.year == year
    });
    var array = [];
    for (var i = 1; i <= 12; i++) {
        var object = {
            "month": i,
            "year": year,
            "vcount": 0
        };

        array.push(object);
    }
    for (var i = 0; i < filteredData.length; i++) {
        array[filteredData[i].month - 1].vcount = filteredData[i].vcount
    }
    var filteredElite = elite.filter(function (d) {
        return d.bid == bid && d.year == year
    });
    console.log(filteredElite);
    renderChart(array, filteredElite)
}	
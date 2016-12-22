var data = [];
var elite = [];

// parameter
var bid;
var year;
var _width = 800,
    height = 300;
var padding = {
    top: 15,
    right: 50,
    bottom: 60,
    left: 50
};
initial("DoKUOUwAsWrlRY6ehzQV_w", 2014);

function initial(bid, year) {
    this.bid = bid;
    this.year = year;
    console.log(this.bid);
    console.log(this.year);
    readData();
}

function readData() {
    //import visit data for elite user
    data = newVisit;
    readElite();
}

function readElite() {
    elite = newElite;
    //                console.log(data.length)
    render(data, elite);

}

function renderChart(data, filteredElite) {
    
    var svg = d3.select('#businessChart')
        .append('svg')
        .attr("width", "100%")
        .attr("height", "100%");
    
    var main = svg.append('g')
        .classed('main', true)
        .attr('transform', "translate(" + padding.left + ',' + padding.top + ')');
    
    var xScale = d3.scale.linear()
        .domain([0, 12])
        .range([0, _width - padding.left - padding.right]);
    var yScale = d3.scale.linear()
        .domain([d3.min(data, function(d) {
            return d.vcount;
        })-0.1, d3.max(data, function(d) {
            return d.vcount;
        })+0.1])
        .range([height - padding.top - padding.bottom, 0]);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');

    var colorScale = d3.scale.linear()
        .domain([5,4,3,2,1])
        .range(["#d7191c","#fdae61","#ffffbf","#abd9e9","#2c7bb6"]);

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
            return xScale(d.month - 1 + d.day / 30.0)
        })
        .attr('cy', function (d) {
            return findYatXbyBisection(xScale(d.month - 1 + d.day / 31.1), document.getElementById("myline"), 0.1);
//            return findYatX(xScale(d.month - 1 + d.day / 31.1), document.getElementById("myline"))[1]
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
    
    function findYatXbyBisection(x, path, error) {
        var length_end = path.getTotalLength(),
            length_start = 0,
            point = path.getPointAtLength((length_end + length_start) / 2) // get the middle point
            ,
            bisection_iterations_max = 50,
            bisection_iterations = 0

            error = error || 0.01

        while (x < point.x - error || x > point.x + error) {
            // get the middle point
            point = path.getPointAtLength((length_end + length_start) / 2)

            if (x < point.x) {
                length_end = (length_start + length_end) / 2
            } else {
                length_start = (length_start + length_end) / 2
            }

            // Increase iteration
            if (bisection_iterations_max < ++bisection_iterations)
                break;
        }
        return point.y
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
            var horz = 45 * legendRectSize;
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
d3.csv("https://raw.githubusercontent.com/cabeggar/yelp-business-trajectory/master/type-rank-trend/ranks.csv", function (error, data) {

    data.forEach(function (d) {
        d.rank = +d.rank;
    });

    // Set the dimensions of the canvas / graph
    var margin = {
        top: 30,
        left: 40,
        right: 30,
        bottom: 30
    };
    width = 960 - margin.left - margin.right;
    height = 400 - margin.top - margin.bottom;
    extra_height = 100;
    circle_topline_positions = margin.top + height + 30;
    circle_botline_positions = margin.top + height + 60;
    label_interval = 190;
    text_interval = 20;
    dif = 5;

    var svg = d3.select("#rankChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + extra_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var lineFunction = d3.svg.line()
        .x(function (d) {
            return xScale(d.year);
        })
        .y(function (d) {
            return yScale(11 - d.rank);
        })
        .interpolate("linear");

    var xAx = svg.append('g')
        .attr("class", "axis")
        .attr("transform", "translate(0, " + height + ")");

    var yAx = svg.append('g')
        .attr("class", "axis");

    var xScale = d3.scale.linear().domain([2004, 2016]).range([0, width]);
    var yScale = d3.scale.linear().domain([11, 1]).range([height, 0]);
    var colorScale = d3.scale.category10();

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
        .ticks(13)
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10)
        .tickFormat(function (year) {
            return year;
        });

    var yAxis = d3.svg.axis().scale(yScale).orient("left")
        .ticks(11)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);

    xAx.call(xAxis);
    yAx.call(yAxis);

    // Nest the entries by type
    var dataNest = d3.nest()
        .key(function (d) {
            return d.type;
        })
        .entries(data);

    // Loop through each type
    dataNest.forEach(function (d, i) {

        var typed = d.values[0].type;

        d.values.forEach(function (dv, di) {
            if (di != d.values.length - 1) {
                svg.append("path")
                    .attr("class", "line")
                    .style("stroke", function () {
                        return d.color = colorScale(d.key);
                    })
                    .attr("d", lineFunction([d.values[di], d.values[di + 1]]))
                    .attr("stroke-width", 5)
                    .attr("fill", "none")
                    .on("click", function() {
                        typeAndYear(typed, dv.year);
                    })
                    .on("mouseenter", function () {
                        d3.select(this).attr("stroke-width", 8);
                        d3.select("#tooltip").style({
                            visibility: "visible",
                            left: d3.event.clientX + 10,
                            top: d3.event.clientY + 10,
                            opacity: 1
                        }).html(function () {
                            var next = parseInt(dv.year) + 1;
                            return typed + "<br/>" + dv.year + ' - ' + next;
                        });
                        highlightInTypeList(typed, d.color);
                    })
                    .on("mouseleave", function () {
                        d3.select(this).attr("stroke-width", 5);
                        d3.select(this).attr("r", 7);
                        d3.select("#tooltip").style({
                            visibility: "hidden",
                            left: d3.event.clientX + 10,
                            top: d3.event.clientY + 10,
                            opacity: 1
                        }).html(function () {
                            var next = parseInt(dv.year) + 1;
                            return typed + "<br/>" + dv.year + ' - ' + next;
                        });
                        unHighlightInTypeList();
                    });
            }
        })

        svg.append("g").selectAll("circle")
            .data(d.values)
            .enter().append("circle")
            .attr("r", 7)
            .attr("cx", function (d) {
                return xScale(d.year);
            })
            .attr("cy", function (d) {
                return yScale(11 - d.rank);
            })
            .attr("fill", function (d) {
                return colorScale(d.type)
            });

        if (i < 5) {
            svg.append("g").append("circle")
                .attr("r", 7)
                .attr("cx", i * label_interval)
                .attr("cy", circle_topline_positions)
                .attr("fill", function () {
                    return colorScale(typed);
                });

            var left = i * label_interval + text_interval;
            var top = circle_topline_positions + dif;

            svg.append("text").attr("transform", "translate(" + left + "," + top + ")")
                .text(function () {
                    return typed
                });
        } else {
            svg.append("g").append("circle")
                .attr("r", 7)
                .attr("cx", (i - 5) * label_interval)
                .attr("cy", circle_botline_positions)
                .attr("fill", function () {
                    return colorScale(typed);
                });

            var left = (i - 5) * label_interval + text_interval;
            var bot = circle_botline_positions + dif;

            svg.append("text").attr("transform", "translate(" + left + "," + bot + ")")
                .text(function () {
                    return typed
                });
        }
    });
});
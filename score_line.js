function getScoreData(teamData) {
    return teamData.map(d => d.score.map((score, i) => ({ x: i + 1, y: score })))
}

function getLabels(teamData) {
    return teamData.map(d => d["team"])
}

function drawScores(svg, teamData, dx, dy) {
    // console.log(teamData)
    // console.log(getScoreData(teamData))
    var dataset = getScoreData(teamData)

    var xScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, function(d) { return d3.max(d, function(d) { return d.x; }); })])
        .range([50, 950]);

    var yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, function(d) { return d3.max(d, function(d) { return d.y; }); })])
        .range([750, 50]);

    var xAxis = d3.axisBottom(xScale).ticks(d3.max(dataset, function(d) { return d3.max(d, function(d) { return d.x; }); }));
    var yAxis = d3.axisLeft(yScale).ticks(d3.max(dataset, function(d) { return d3.max(d, function(d) { return d.y; }); }));

    var colorScale = d3.scaleOrdinal()
        .domain(d3.range(20)) // 设置索引值范围
        .range(d3.quantize(d3.interpolateRainbow, 20)); // 设置颜色范围

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(20, 20)"); // Adjust the position of the legend


    var legendItems = legend.selectAll(".legend-item")
        .data(getLabels(teamData))
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; }); // Adjust the vertical position of each legend item

    legendItems.append("rect")
        .attr("x", 50)
        .attr("y", 0)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d, i) { return colorScale(i); }); // Set the fill color based on the color scale

    legendItems.append("text")
        .attr("x", 70)
        .attr("y", 8)
        .text(function(d) { return d; });


    svg.append("g")
        .attr("transform", "translate(0, 750)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.append("g")
        .attr("transform", "translate(0, 750)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);



    // 定义折线
    var line = d3
        .line()
        .x(function(d) { return xScale(d.x); })
        .y(function(d) { return yScale(d.y); });

    for (var i = 0; i < dataset.length; i++) {
        var color = colorScale(i);
        var g = svg.append('g')
            .attr('opacity', 0.5)
            .on('mouseover', function(d) {
                d3.select(this).attr('opacity', 1)
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('opacity', 0.5)
            })

        g.append("path")
            .datum(dataset[i])
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)
            .attr("d", line);

        g.selectAll("circle" + i)
            .data(dataset[i])
            .enter()
            .append("circle")
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("r", 4)
            .attr("fill", color);
    }

}
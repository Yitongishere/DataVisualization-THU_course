let projection;
let svg;
const width = 1000;
const height = 1000;

function drawMap(geojson, teamloc) {
    svg = d3.select("#map").on("click", function(event, d) {
        var target = event.target;
        if (target.tagName === "svg") {
            svg.selectAll("#map-name").remove();
            svg.selectAll("#team-name").remove();
            svg.selectAll("image").remove();
            d3.selectAll("circle")
                .attr('opacity', 1);
            const circles = d3.selectAll("circle")
            circles.transition()
                .duration(500)
                .attr("transform", "")
                .attr('r', 4);
            svg
                .selectAll("path")
                .attr('scale', 1)
                .transition()
                .duration(500)
                .attr('fill', "#ccc")
                .attr("opacity", 1)
                .attr("transform", "");
        }
    });

    svg.append('text')
        .attr('class', 'tooltip-text')
        .attr('dx', 150)
        .attr('dy', 800)
        .style('font-family', 'Lato')
        .style('font-size', '4em')
        .text(`英超联赛球队地理分布图`)

    projection = d3.geoMercator().fitSize([800, 600], geojson);
    const path = d3.geoPath().projection(projection);

    const pattern = svg.append("defs")
        .append("pattern")
        .attr("id", "background-pattern")
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", width)
        .attr("height", height);

    pattern.append("svg:image")
        .attr("xlink:href", "./Logo/test.jpg")
        .attr("x", 200)
        .attr("y", 100)
        .attr("width", width)
        .attr("height", height)
        .attr('transform', `translate (0, 0) scale(3)`);

    svg.selectAll("path")
        .data(geojson.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#ccc")
        .on("mouseover", regionMouseOver)
        .on("mouseout", regionMouseOut)
        .on("click", onClick);

    // 绘制圆点
    svg.selectAll("circle")
        .data(teamloc)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([parseFloat(-d.Longitude), parseFloat(d.Latitude)])[0])
        .attr("cy", (d) => projection([parseFloat(-d.Longitude), parseFloat(d.Latitude)])[1])
        .attr("r", 4)
        .attr('opacity', "1")
        .attr("fill", "green")
        .on("mouseover", function(d) {
            // const inverseCoordinates = projection.invert(d3.select(this).data()[0]);
            // const invertedLongitude = inverseCoordinates[0];
            // const invertedLatitude = inverseCoordinates[1];
            // console.log(d3.select(this).data(), inverseCoordinates)
            d3.select(this).attr("fill", "blue");
        })
        .on("mouseout", pointMouseOut)
        .on("click", showTeamInfo);
}

function showTeamInfo(d) {
    svg.selectAll("#team-name").remove();
    svg.selectAll("image").remove();
    const point = d3.select(this);
    const teamData = point.data()[0];
    if (point.attr('r') > 3) {
        return
    } else {
        // console.log(teamData)
        text_group = svg.append("g")
            .attr("id", "team-name")
            .attr("x", 600)
            .attr("y", 300)
            .style("pointer-events", "none")

        var y = 200;
        for (var key in teamData) {
            if (teamData.hasOwnProperty(key)) {
                var text = text_group.append("text")
                    .style('font-size', '2em')
                    .attr("x", 10)
                    .attr("y", y)

                text.append("tspan")
                    .text(key)
                    .style("font-weight", "bold");

                text.append("tspan")
                    .text(": " + teamData[key]);

                y += 50;

            }
        }
        teams_logo = svg.append("svg:image")
            .attr('x', 600)
            .attr('y', 300)
            .attr('width', 400)
            .attr('height', 400)
            .attr("xlink:href", `./Logo/${teamData['Team']}.png`)
            .on('click', function(d) {
                window.location.href = `main.html?team=${teamData['Team']}`;
            })
            .on('mouseover', function(d) {
                d3.select(this).attr('opacity', '0.5');
            })
            .on('mouseout', function(d) {
                d3.select(this).attr('opacity', '1');
            })
            // window.location.href = 'main.html';
    }

}

function pointMouseOut(d) {
    d3.select(this).attr("fill", "green");
}

function regionMouseOut(d) {
    if (d3.select(this).attr('scale') > 1) {
        return
    }
    d3.select(this).attr("fill", "#ccc");
}

function regionMouseOver(d) {
    if (d3.select(this).attr('scale') > 1) {
        return
    }
    d3.select(this).attr("fill", "red");
}


function onClick(event, d) {
    if (d3.select(this).attr('scale') > 1) {
        return
    }

    d3.selectAll("circle")
        .transition()
        .duration(500)
        .attr("transform", "")
        .attr('r', 4);

    d3.selectAll("#map")
        .filter(function() {
            return !d3.select(this);
        })
        .each(function() {
            d3.select(this)
                .attr('scale', 1)
                .transition()
                .duration(500)
                .attr("transform", "translate(-300, -300)");
        });
    const svg = d3.select("#map");
    svg.selectAll("#map-name").remove();
    svg.selectAll("#team-name").remove();
    svg.selectAll("image").remove();
    const clickedPath = d3.select(this);



    const totalLength = clickedPath.node().getTotalLength();
    const currentPosition = clickedPath.node().getPointAtLength(totalLength);

    const bounds = clickedPath.node().getBBox();
    const allCircles = d3.selectAll("circle")
        .attr('opacity', 0.2);
    const circles = allCircles.filter(function(circleData) {
        const point = [-circleData.Longitude, circleData.Latitude];
        return d3.geoContains(clickedPath.datum(), point);
    });

    const center = [
        bounds.x + 0.5 * bounds.width,
        bounds.y + 0.5 * bounds.height
    ];


    const scale = 5;


    const transform = `translate(${bounds.width / 2},${bounds.height / 2}) scale(${scale}) translate(${200/scale-center[0]},${400/scale-center[1]})`;

    svg
        .selectAll("path")
        .attr('fill', "#ccc")
        .attr("opacity", 0.1)
        .attr("transform", "")
        .attr('scale', 1);

    clickedPath
        .attr("opacity", 1)
        .attr('scale', scale)
        .transition()
        .duration(500)
        .attr("opacity", 1)
        .attr('fill', '#62a7c1')
        .attr('transform', transform)

    circles.attr("opacity", 1)
        .transition()
        .duration(500)
        .attr('r', 1)
        .attr('transform', transform)



    const name = clickedPath.data()[0].properties.Name;

    svg
        .append("text")
        .attr("id", "map-name")
        .attr("x", 10)
        .attr("y", 80)
        .style('font-size', '3em')
        .text(name);

};
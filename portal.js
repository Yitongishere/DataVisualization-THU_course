function showLogo(svg, teamData, i) {
    const processedData = {
        ...teamData,
    };

    pos = calculatePosition(processedData['plot_i'], 50, width);
    transX = pos['x'];
    transY = pos['y'];

    // 队徽
    const teams_logo = svg.append("svg:image")
        .attr('x', transX - 40)
        .attr('y', transY)
        .attr('width', 90)
        .attr('height', 90)
        .attr("xlink:href", `./Logo/${processedData.team}.png`)

    // “球队聚焦”字样
    svg.append("text")
        .attr('x', width / 2)
        .attr('y', 30)
        .attr("text-anchor", "middle")
        .text("球队聚焦");

    // 队名
    svg.append("text")
        .attr('x', transX + 6)
        .attr('y', transY + 90)
        .attr("text-anchor", "middle")
        .style('font', '13px sans-serif')
        .text(`${processedData.team}`);

    mouseon(teams_logo)
    mouseoff(teams_logo)
    click_logo(teams_logo, processedData.team)
        // console.log(i)

    // 全局图标
    if (i == 19) {
        const pano_logo = svg.append("svg:image")
            .attr('x', width / 2 - 60)
            .attr('y', 320)
            .attr('width', 120)
            .attr('height', 120)
            .attr("xlink:href", `./Logo/Z_panoramic.png`)

        // “全局视角”字样
        svg.append("text")
            .attr('x', width / 2)
            .attr('y', 300)
            .attr("text-anchor", "middle")
            .text("全局视角");

        mouseon(pano_logo)
        mouseoff(pano_logo)
        click_pano(svg, pano_logo)
    }
}

function mouseon(target) {
    target.on('mouseover', () => {
        target.style("opacity", 0.5);
    })
}

function mouseoff(target) {
    target.on('mouseout', () => {
        target.style("opacity", 1);
    })
}

function click_logo(target, team) {
    target.on('click', () => {
        getAllPic(team)
    })
}

function click_pano(svg, target) {
    target.on('click', () => {
        svg.selectAll("*").remove();
    })
}



function calculatePosition(i, size, width) {
    l = size * 2
    per_line = Math.floor(width / l);
    var row = Math.floor(i / per_line); // 计算行数
    var col = Math.floor(i % per_line); // 计算列数
    var x = col * l; // 计 x 坐标
    var y = row * l; // 计算 y算 坐标
    return {
        x: x + size,
        y: y + size
    };
}
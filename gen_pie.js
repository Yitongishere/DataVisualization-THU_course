// import generatePieChart from 'gen_pie.js'
size = 160, inR = 60, outR = 140, width = 1000;


function toStrPercent(float_num) {
    formattedNum = (float_num * 100).toFixed(2) + "%";
    return formattedNum
}

function drawWLDPie(svg, teamData) {
    const processedData = {
        ...teamData,
        winRate: teamData.wins / teamData.totalGames,
        drawRate: teamData.draws / teamData.totalGames,
        lossRate: teamData.losses / teamData.totalGames,
    };


    // 绘制饼图
    const pie = d3.pie()
        .value((d) => d.value)
        .sort((a, b) => d3.ascending(a.key, b.key));

    pos = calculatePosition(processedData['plot_i'], size, width);
    transX = pos['x'];
    transY = pos['y'];

    const pieData = pie([
        { key: "winRate", value: processedData.winRate, label: "Win", info: processedData.wins },
        { key: "drawRate", value: processedData.drawRate, label: "Draw", info: processedData.draws },
        { key: "lossRate", value: processedData.lossRate, label: "Loss", info: processedData.losses },
    ]);

    pie_title = processedData.team;

    colors = ['#1f7ae1', '#ca02c2', '#67c7b4']

    generatePieChart(svg, pieData, pie_title, transX, transY, colors, size, inR, outR)
}

function drawODDPie(svg, teamData) {
    const processedData = {
        ...teamData,
        expectedRate: teamData.expected / teamData.totalGames,
        middleRate: teamData.middle / teamData.totalGames,
        oppositeRate: teamData.opposite / teamData.totalGames,
    };

    pos = calculatePosition(processedData['plot_i'], size, width);
    transX = pos['x'];
    transY = pos['y'];

    // 绘制饼图
    const pie = d3.pie()
        .value((d) => d.value)
        .sort((a, b) => d3.ascending(a.key, b.key));


    const pieData = pie([
        { key: "expectedRate", value: processedData.expectedRate, label: "Expected", info: processedData.expected },
        { key: "middleRate", value: processedData.middleRate, label: "Middle", info: processedData.middle },
        { key: "oppositeRate", value: processedData.oppositeRate, label: "Opposite", info: processedData.opposite },
    ]);

    pie_title = processedData.team;

    colors = ['#ff7f0e', '#2ca02c', '#1f77b4']

    generatePieChart(svg, pieData, pie_title, transX, transY, colors, size, inR, outR)
}

function drawGoalPie(svg, teamData, size = 160, inR = 60, outR = 140, width = 1000) {


    const processedData = {
        ...teamData,
        expectedRate: teamData.expected / teamData.totalGames,
        middleRate: teamData.middle / teamData.totalGames,
        oppositeRate: teamData.opposite / teamData.totalGames,
    };

    // console.log(processedData, processedData['plot_i'])

    pos = calculatePosition(processedData['plot_i'], size, width);
    transX = pos['x'];
    transY = pos['y'];



    // 绘制饼图
    const pie = d3.pie()
        .value((d) => d.value)
        .startAngle(0)
        .endAngle(2 * Math.PI)
        .sort((a, b) => d3.ascending(a.value, b.value));

    const pieData = pie([
        { key: `Shots`, value: 1, label: "Shots", info: processedData.totalShot },
        { key: `Rate`, value: processedData.totalGoal / processedData.totalShot, label: `${toStrPercent(processedData.totalGoal / processedData.totalShot)}`, info: processedData.totalGoal },
    ]);

    pie_title = processedData.team;

    colors = ['#6f6f6f', '#cc30ac']
    generatePieChart(svg, pieData, pie_title, transX, transY, colors, size, inR, outR)
}



function generatePieChart(svg, pieData, title = '', tx, ty, colors = ['#ff7f0e', '#2ca02c', '#1f77b4'], size = 160, inR = 60, outR = 140) {

    const max_size = size
    const g = svg.append("g")
        .attr('transform', `translate(${tx}, ${ty})`)
        .attr('class', `pie`);




    // 弧生成器
    const arc = d3.arc()
        .innerRadius(inR)
        .outerRadius(outR)
        .cornerRadius(10);


    const startAngle = 0;
    const endAngle = 2 * Math.PI;
    const arcTween = (d) => {
        const interpolate = d3.interpolate(d.startAngle, d.endAngle);
        return (t) => {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    };



    // 绘制扇形
    const slices = g.selectAll('path')
        .data(pieData)
        .enter()
        .append('path')
        .attr('changefill', (d, i) => getDifferentColor(colors[i]))
        .attr('d', arc)
        .attr('tmpfill', (d, i) => colors[i])
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
        .style('pointer-events', 'none')


    slices.transition()
        .duration(500)
        .attrTween('d', arcTween)
        .attr('fill', (d, i) => colors[i])
        .on('end', function() {
            d3.select(this).style('pointer-events', 'auto');
        })




    const labels = g.selectAll('text')
        .data(pieData)
        .enter()
        .append('text')
        .attr('transform', (d) => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .text((d) => d.data.label)
        .style('pointer-events', 'none')
        .style('text-anchor', 'middle');


    g.append("text")
        // .attr("x", tx)
        // .attr("y", ty)
        .attr("text-anchor", "middle")
        .text(title)
        .on('click', function(d) {
            window.location.href = `main.html?team=${title}`;
        })
        .on('mouseover', function(d) {
            d3.select(this).attr('opacity', '0.5');
            d3.select(this).style('font-size', '1.2em');
            d3.select(this).style('cursor', 'pointer')
        })
        .on('mouseout', function(d) {
            d3.select(this).attr('opacity', '1');
            d3.select(this).style('font-size', '1em');
        });



    const tooltip = svg.append('g')
        .style('pointer-events', 'none')
        .attr('class', 'tooltip');

    const toolBg = tooltip.append('rect')
        .style('fill', '#c3e197')
        .style('opacity', 0)
        .attr('width', 200)
        .attr('height', 50)
        .attr('rx', 10)
        .attr('ry', 10);

    const toolBg2 = tooltip.append('rect')
        .style('fill', '#c3e197')
        .style('opacity', 0)
        .attr('width', 200)
        .attr('height', 10)
        .attr('rx', 5)
        .attr('ry', 5);


    const toolText = tooltip.append('text')
        .attr('class', 'tooltip-text')
        .style('font-family', 'Lato')
        .style('font-size', '2em')
        .text(`${1}`)
        .style('opacity', 0)



    // 鼠标悬停事件处理函数
    function handleMouseOver(d, i) {
        var svg = document.querySelector("svg");

        // 获取鼠标相对于 SVG 的位置
        var svgRect = svg.getBoundingClientRect();
        var mouseX = event.clientX - svgRect.left;
        var mouseY = event.clientY - svgRect.top;

        // console.log(inR, size, outR)

        sel = d3.select(this)

        sel.transition()
            .attr('d', d3.arc()
                .innerRadius(inR)
                .outerRadius(size)
                .cornerRadius(10))
            .attr('fill', (d, i) => sel.attr("changefill"))


        tooltip.raise();
        toolBg.raise();
        toolBg2.raise();
        toolText.raise();
        tooltip.attr('x', mouseX)
            .attr('y', mouseY)



        toolBg.transition()
            .duration(500)
            .attr('x', mouseX)
            .attr('y', mouseY)
            .style('fill', '#7cbaaf')
            .style('opacity', 0.7);

        toolBg2.attr('y', mouseY + 40)
            .transition()
            .duration(600)
            .attr('x', mouseX)
            .style('fill', '#7a2c4f')
            .style('opacity', 0.7);

        value = d3.select(this).data()[0].data.info;
        toolText.text(`${value}`);
        toolText.transition()
            .duration(500)
            .style('opacity', 0.95)
            .attr('x', mouseX + 50)
            .attr('y', mouseY + 30)
            .style('fill', '#af2a7b')
    }

    // 鼠标离开事件处理函数
    function handleMouseOut(d, i) {
        sel = d3.select(this)
        sel.transition()
            .duration(300)
            .attr('d', d3.arc().innerRadius(inR).outerRadius(outR).cornerRadius(10))
            .attr('fill', (d, i) => sel.attr('tmpfill'))

        toolBg.transition()
            .duration(500).attr('x', -50).style('opacity', 0).style('fill', '#c3e197');
        toolBg2.transition()
            .duration(500).attr('x', -50).style('opacity', 0).style('fill', '#c3e197');
        toolText.transition()
            .duration(500).attr('y', -50).style('opacity', 0).style('fill', '#c3e197');

    }

    return g.node();
}


function getDifferentColor(color) {
    // 解析颜色值的红、绿、蓝分量
    var r = parseInt(color.substr(1, 2), 16);
    var g = parseInt(color.substr(3, 2), 16);
    var b = parseInt(color.substr(5, 2), 16);

    // 修改颜色分量的值
    var diff = 32; // 修改的差异值
    var newR = (g + diff) % 256;
    var newG = (r + diff) % 256;
    var newB = (b + diff) % 256;

    // 转换为十六进制字符串表示
    var newColor = "#" + componentToHex(newR) + componentToHex(newG) + componentToHex(newB);

    return newColor;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function calculatePosition(i, size, width) {
    l = size * 2
    per_line = Math.floor(width / l);
    var row = Math.floor(i / per_line); // 计算行数
    var col = Math.floor(i % per_line); // 计算列数
    var x = col * l; // 计算 x 坐标
    var y = row * l; // 计算 y 坐标
    return {
        x: x + size,
        y: y + size
    };
}

function changeOrder(svg, newOrder, size = 160, width = 1000) {
    pies = d3.selectAll('.pie');
    var duration = 1000; // 动画持续时间（毫秒）

    pies.transition()
        .duration(duration)
        .attr('transform', function(d, i) {
            pos = calculatePosition(newOrder[i], size, width);
            x = pos['x'];
            y = pos['y'];
            return 'translate(' + x + ',' + y + ')';
        });
}
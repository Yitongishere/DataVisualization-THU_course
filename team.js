function getAllPic(teamData) {
    const svg = d3.select("svg");
    svg.selectAll("*").remove();

    var now_x = 0;
    var now_y = 0;
    teamData["plot_i"] = 1;
    //1. 积分折线图(占位)
    svg.append("text")
        .attr("x", now_x + 500)
        .attr("y", now_y + 100)
        .attr("text-anchor", "middle")
        .text("积分折线图")
        .style("font-size", "28px");

    score_group = svg.append("g")
        .attr('transform', `translate(${now_x + 0}, ${now_y + 100})`)
    drawScores(score_group, [teamData], 0, 0)

    //2. 胜率饼图(占位)
    svg.append("g")
        .attr('transform', `translate(${200}, ${100})`)

    //3. 射门转化率饼图
    teamData["plot_i"] = 3;
    now_x = 0;
    now_y = 600;
    shot_group = svg.append("g")
        .attr('transform', `translate(${now_x + 0}, ${now_y + 100})`)
    drawGoalPie(shot_group, teamData)

    //4. 包含阿森纳的比赛的平均赔率柱状图
    now_x = 30;
    now_y = 1500;
    const data = {
        wins: parseFloat(teamData['winOddAvg'].toFixed(4)),
        losses: parseFloat(teamData['loseOddAvg'].toFixed(4)),
        draws: parseFloat(teamData['drawOddAvg'].toFixed(4)),
        big: parseFloat(teamData['bigOddAvg'].toFixed(4)),
        small: parseFloat(teamData['smallOddAvg'].toFixed(4)),
    };

    const chartWidth = 300;
    const chartHeight = 400;

    // 创建绘图区域
    const chart = svg.append("g")
        .attr("transform", `translate(${now_x}, ${now_y})`);

    // 设置比例尺
    const xScale = d3.scaleBand()
        .domain(Object.keys(data))
        .range([0, chartWidth])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(data))])
        .range([chartHeight, 0]);

    // 绘制柱状图
    chart.selectAll(".bar")
        .data(Object.entries(data))
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d[0]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => chartHeight - yScale(d[1]))
        .attr("fill", "steelblue")
        .attr("rx", 5) // 圆角半径
        .attr("ry", 5) // 圆角半径
        .on("mouseover", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "orange"); // 鼠标移入时改变颜色为橙色

            const x = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
            const y = parseFloat(d3.select(this).attr("y")) - 10;

            chart.append("text")
                .attr("class", "bar-label")
                .attr("x", x)
                .attr("y", y)
                .attr("text-anchor", "middle")
                .text(d3.select(this).data()[0][1])
                .style("font-size", "12px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("fill", "steelblue"); // 鼠标移出时恢复颜色为蓝色
            chart.select(".bar-label").remove();
        });

    // 添加X轴
    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));

    // 添加Y轴
    chart.append("g")
        .call(d3.axisLeft(yScale));

    // 添加图表标题
    svg.append("text")
        .attr("x", now_x + 150)
        .attr("y", now_y - 20)
        .attr("text-anchor", "middle")
        // .style("font-size", "22px")
        .text("每种竞猜的赔率");

    // 添加X轴标签
    svg.append("text")
        .attr("x", now_x + 10)
        .attr("y", now_y - 20)
        .attr("text-anchor", "middle")
        .text("数量");

    // 添加Y轴标签
    svg.append("text")
        .attr("x", now_x + 320)
        .attr("y", now_y + 430)
        .attr("text-anchor", "middle")
        .text("赔率种类");

    //5. 阿森纳赛果与赛前赔率关系饼图
    now_x = 0;
    now_y = 600;
    svg.append("text")
        .attr("x", now_x + 160)
        .attr("y", now_y + 430)
        .attr("text-anchor", "middle")
        .text("射门转化率");
    odd_group = svg.append("g")
        .attr('transform', `translate(${now_x + 0}, ${now_y + 100})`)
    teamData["plot_i"] = 5;
    drawODDPie(odd_group, teamData)

    //6. 针对阿森纳使用不同投注策略的折线收益图
    now_x = 400;
    now_y = 1300;
    svg.append("text")
        .attr("x", now_x + 400)
        .attr("y", now_y - 270)
        .attr("text-anchor", "middle")
        .text("赛果与赛前赔率");
    const chart_profit = svg.append("g")
        .attr('transform', `translate(${now_x + 0}, ${now_y + 100})`)
    drawProfitLine(chart_profit, teamData)

}
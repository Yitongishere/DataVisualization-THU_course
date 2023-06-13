function drawProfitLine(svg, dictData, teamname) {
    // console.log(dictData[teamname]['date'])
    // console.log(dictData[teamname]["winDetails"])

    const dates = dictData[teamname]['date']
    let games = {}
    dictData[teamname]["winDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "win" })
    dictData[teamname]["drawDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "draw" })
    dictData[teamname]["lossDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "loss" })

    console.log(dates)
    console.log(games)
    
    let capital_per_1 = 100
    let profit_record_expected = get_profit_record(capital_per_1, games, "expected")
    let profit_record_unexpected = get_profit_record(capital_per_1, games, "unexpected")
    let profit_record_middle = get_profit_record(capital_per_1, games, "middle")

    function get_profit_record(capital_per_1, games, strategy) {
        // 每次都投注赔率最看好的方向
        // (1) 判断投注看好的方向是什么
        let selected_odds_1 = []
        for (i = 1; i <= dates.length; i++) {
            odd_win = games[i]["avg_win"];
            odd_draw = games[i]["avg_draw"];
            odd_loss = games[i]["avg_loss"];
            if (strategy == "expected") { odd = Math.min(odd_win, odd_draw, odd_loss) }
            else if (strategy == "unexpected") { odd = Math.max(odd_win, odd_draw, odd_loss) }
            else if (strategy == "middle") { odd = (odd_win + odd_draw + odd_loss - Math.min(odd_win, odd_draw, odd_loss) - Math.max(odd_win, odd_draw, odd_loss)).toFixed(2) }
            selected_odds_1.push(odd)
        }
        console.log("selected_odds_1", selected_odds_1)
        // （2）计算收益, 记录每轮结束后的累计收益
        let profits_acc_1 = []
        profits_acc_1 = profit_curve(games, selected_odds_1, capital_per_1, profits_acc_1)
        return profits_acc_1

        function profit_curve(games, selected_odds_1, capital_per_1, profits_acc_1) {
            let p_acc = 0
            for (i = 0; i < selected_odds_1.length; i++) {
                if (games[`${i+1}`]['result'].slice(-3) == findKey(games[`${i+1}`], selected_odds_1[i]).slice(-3)) {
                    profit = Math.round(capital_per_1 * (selected_odds_1[i] - 1))
                }
                else {
                    profit = -1 * capital_per_1
                }
            p_acc += profit
            profits_acc_1.push(p_acc)
            }
            return profits_acc_1
        }

        function findKey(obj, value) {
            for (let k in obj) {
                if (obj[k] == value) {return k}
            }
        }
    }
    // 绘图
    const xScale = d3.scaleLinear();
    const yScale = d3.scaleLinear();

    xScale.domain([1,38]).range([100, 500]).nice();
    yScale.domain([-2500, 2500]).range([500, 100]).nice();
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale);
    const xAxisGroup = svg.append('g').attr('id', 'xAxisGroup').call(xAxis).attr('transform', `translate(0, 300)`);
    const yAxisGroup = svg.append('g').attr('id', 'yAxisGroup').call(yAxis).attr('transform', `translate(100, 0)`);
    // 添加图表标题
    svg.append("text").attr("x", 300).attr("y", 80).attr("text-anchor", "middle").text("投注回报走势图");
    // 添加X轴标签
    svg.append("text").attr("x", 535).attr("y", 310).attr("text-anchor", "middle").text("联赛轮次");
    // 添加Y轴标签
    svg.append("text").attr("x", 100).attr("y", 80).attr("text-anchor", "middle").text("收益");

    round = []
    for(i = 1; i <= dates.length; i++) {
        round.push(i)
    }

    const line_expected = d3.line().x((d, i) => xScale(round[i])).y((d, i) => yScale(profit_record_expected[i]))
    svg.append('path').datum(round, profit_record_expected).attr('fill', 'none')
    .attr('d', line_expected).attr('stroke', 'green').attr('stroke-width', '1px');
    svg.selectAll("circle")
    .data(profit_record_expected)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) { return xScale(round[i]) })
    .attr("cy", function(d, i) { return yScale(profit_record_expected[i]) })
    .attr("r", 2)
    .attr("fill", "blue")
    .on("mouseover", function(d) {
        d3.select(this)
            .attr("r", 4) // 鼠标悬停时增大圆点半径
            .attr("fill", "red"); // 鼠标悬停时改变圆点颜色
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .attr("r", 2)
            .attr("fill", "blue");
    });

    const line_unexpected = d3.line().x((d, i) => xScale(round[i])).y((d, i) => yScale(profit_record_unexpected[i]))
    svg.append('path').datum(round, profit_record_unexpected).attr('fill', 'none')
    .attr('d', line_unexpected).attr('stroke', 'red').attr('stroke-width', '1px');

    const line_middle = d3.line().x((d, i) => xScale(round[i])).y((d, i) => yScale(profit_record_middle[i]))
    svg.append('path').datum(round, profit_record_middle).attr('fill', 'none')
    .attr('d', line_middle).attr('stroke', 'orange').attr('stroke-width', '1px');
}
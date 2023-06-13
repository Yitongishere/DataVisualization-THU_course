function drawProfitLine(svg, dictData, teamname, strategy) {
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
    let profit_record = get_profit_record(capital_per_1, games, strategy)
    console.log("profit_record", profit_record)

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

    xScale.domain([0,38]).range([100, 500]).nice();
    yScale.domain([-2000, 2000]).range([500, 100]).nice();
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale);
    const xAxisGroup = svg.append('g').attr('id', 'xAxisGroup').call(xAxis).attr('transform', `translate(0, 300)`);
    const yAxisGroup = svg.append('g').attr('id', 'yAxisGroup').call(yAxis).attr('transform', `translate(100, 0)`);

    round = []
    for(i = 1; i <= dates.length; i++) {
        round.push(i)
    }

    const line = d3.line().x((d, i) => xScale(round[i])).y((d, i) => yScale(profit_record[i]))
    console.log(line)
    line.curve(d3.curveLinear);
    svg.append('path').datum(round, profit_record).attr('fill', 'none')
    .attr('d', line).attr('stroke', 'black').attr('stroke-width', '1px');
}
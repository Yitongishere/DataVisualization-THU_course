function drawProfitLine(svg, dictData, teamname) {
    // console.log(dictData[teamname]['date'])
    // console.log(dictData[teamname]["winDetails"])
    

    
    const xScale = d3.scaleTime();
    const yScale = d3.scaleLinear();

    const dates = dictData[teamname]['date']
    let games = {}
    dictData[teamname]["winDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "win" })
    dictData[teamname]["drawDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "draw" })
    dictData[teamname]["lossDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "loss" })

    console.log(dates)
    console.log(games)
    
    // 每次都投注赔率最看好的方向
    // (1) 判断投注看好的方向是什么
    let selected_odds_1 = []
    for (i = 1; i <= dates.length; i++) {
        odd_win = games[i]["avg_win"];
        odd_draw = games[i]["avg_draw"];
        odd_loss = games[i]["avg_loss"];
        odd = Math.min(odd_win, odd_draw, odd_loss)
        selected_odds_1.push(odd)
    }
    console.log(selected_odds_1)
    // （2）计算收益, 记录每轮结束后的累计收益
    let profits_acc_1 = []
    let capital_per_1 = 100
    profits_acc_1 = profit_curve(games, selected_odds_1, capital_per_1, profits_acc_1)
    console.log(profits_acc_1)

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
    



    // profit_1 = 

}
function drawProfitLine(svg, dictData, teamname) {
    // console.log(dictData[teamname]['date'])
    // console.log(dictData[teamname]["winDetails"])
    

    
    const xScale = d3.scaleTime();
    const yScale = d3.scaleLinear();

    const dates = dictData[teamname]['date']
    let games = {}
    let profit_1 = []
    dictData[teamname]["winDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "win" })
    dictData[teamname]["drawDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "draw" })
    dictData[teamname]["lossDetails"].forEach((d, i) => { games[d.number] = d; games[d.number]['result'] = "loss" })

    console.log(dates)
    console.log(games)
    
    // 每次都投注赔率最看好的方向
    // (1) 判断投注看好的方向是什么
    let selected_odds = []
    for (i = 1; i <= dates.length; i++) {
        odd_win = games[i]["avg_win"];
        odd_draw = games[i]["avg_draw"];
        odd_loss = games[i]["avg_loss"];
        odd = Math.min(odd_win, odd_draw, odd_loss)
        selected_odds.push(odd)
    }
    console.log(selected_odds)


    // profit_1 = 

}
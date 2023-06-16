async function drawBubble(svg, dictData) {

    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = {top: 100, right: 100, bottom: 100, left: 100};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const picWidth = 720
    const picHeight = 900
    let xScale, yScale;

    const xValue = d => +(d['diff_goals']);  ////
    const yValue = d => +(d['score']);  ////
    const rValue = d => +(d['goals']) * 0.4;  ////
    const keyValue = d => d['teamname']
    
    // 设置动画过渡时间
    let aduration = 1000
    // 设置横纵轴label
    const xAxisLabel = '净胜球数';
    const yAxisLabel = '积分';
    // 设置气泡颜色
    const color = {
        "Arsenal":"#ff1c12",
        "Aston Villa": "#de5991",
        "Bournemouth": "#759AA0",
        "Brentford": "#E69D87",
        "Brighton": "#be3259",
        "Chelsea": "#EA7E53",
        "Crystal Palace": "#EEDD78",
        "Everton": "#9359b1",
        "Fulham": "#47c0d4",
        "Leeds": "#F49F42",
        "Leicester": "#AA312C",
        "Liverpool": "#B35E45",
        "Man City": "#4B8E6F",
        "Man United": "#ff8603",
        "Newcastle": "#ffde1d",
        "Nott'm Forest": "#1e9d95",
        "Southampton": "#7289AB",
        "Tottenham": "#38ae01",
        "West Ham": "#aa90c1",
        "Wolves": "#efa213"
    }

    const renderinit = function(){
        // 设置比例尺
        xScale = d3.scaleLinear()
            .domain([-50, 70])
            .range([0, picWidth])
            .nice();
        yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([picHeight, 0])
            .nice();

        // The reason of using group is that nothing is rendered outside svg, so margin of svg is always blank while margin of group is rendered inside svg; 
        const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'maingroup');

        // 定义坐标轴属性
        const yAxis = d3.axisLeft(yScale).tickSize(-picWidth).tickPadding(10);  // .tickPadding is used to prevend intersection of ticks;
        const xAxis = d3.axisBottom(xScale).tickSize(-picHeight).tickPadding(10);
        
        // 在画布上添加坐标轴y
        let yAxisGroup = svg.append('g').call(yAxis)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'yaxis');
        // 在画布上添加坐标轴y的label
        yAxisGroup.append('text')
        .attr('font-size', '2em')
        .attr('transform', `rotate(-90)`)
        .attr('x', -picHeight / 2)
        .attr('y', -30)
        .attr('fill', '#333333')
        .text(yAxisLabel)
        .attr('text-anchor', 'middle') // Make label at the middle of axis. 
        // 在画布上添加坐标轴x
        let xAxisGroup = g.append('g').call(xAxis)
        .attr('transform', `translate(${0}, ${picHeight})`)
        .attr('id', 'xaxis');
        // 在画布上添加坐标轴x的label
        xAxisGroup.append('text')
        .attr('font-size', '2em')
        .attr('y', 60)
        .attr('x', picWidth / 2)
        .attr('fill', '#333333')
        .text(xAxisLabel);

        // 设定legend的颜色和文字
        let legend_color = Object.values(color)
        let legend_text = Object.keys(color)
        // draw legend
        var legend = d3.select('#maingroup').selectAll(".legend")
        .data(legend_text).join('g')
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (picWidth + 30) + "," + (i * 25 + 100) + ")"; });
        // draw legend colored rectangles
        legend.append("rect")
        .data(legend_color) 
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 30)
        .attr("height", 20)
        .style("fill", d => d);
        // draw legend text
        legend.append("text")
        .attr("x", 40)
        .attr("y", 9)
        .attr("dy", ".5em")
        .attr("text-anchor", "start")
        .text(d => d); 

        // draw date
        g.append("text")
        .attr('id', 'date_text')
        .attr("x", picWidth / 4 + 100)
        .attr("y", picHeight / 10 - 20)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .attr("fill", "#504f4f")
        .attr('font-size', '4em')
        .attr('font-weight', 'bold')
        .text('');
    }

    const renderupdate = async function(seq, i){
        const g = d3.select('#maingroup');

        d3.select('#date_text').text(`Round${i-1}`); ////

        let transition = d3.transition().duration(aduration).ease(d3.easeLinear);

        let circleupdates = g.selectAll('circle').data(seq);
        let circleenters = circleupdates.enter().append('circle')
        .attr('fill', d => color[keyValue(d)] )
        .attr('opacity', .8)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d))) 
        .attr('r', c => rValue(c));

        circleupdates.merge(circleenters).transition(transition)
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d))) 
        .attr('r', c => rValue(c));

        let textupdates = g.selectAll('.team_text').data(seq);
        let textenters = circleupdates.enter().append('text')
        .attr("class", "team_text")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill", "#333333")
        .text( d => keyValue(d))
        .attr('x', d => xScale(xValue(d)))
        .attr('y', d => yScale(yValue(d)));

        textupdates.merge(textenters).transition(transition)
        .attr('x', d => xScale(xValue(d)))
        .attr('y', d => yScale(yValue(d)));

        await transition.end();
    }

    
    d3.csv('bubble.csv').then(async function(data){
        
        alldates = Array.from(new Set(data.map( datum => datum['round'])))
        // console.log(alldates)

        // 建立sequential数组，并为每支球队占位
        sequential = []
        alldates.forEach(datum => {
            sequential.push([])
        });
        // 将数据从data.json中抽取，填充该数组
        data.forEach(datum => {
            sequential[alldates.indexOf(datum['round'])].push(datum)
        })

        renderinit()

        for (let i = 1; i <= sequential.length; i++) {
            await renderupdate(sequential[i], i)
        }
    })
}
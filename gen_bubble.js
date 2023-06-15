function drawBubble(svg, dictData) {
    let the_data = [1, 2, 3, 4, 5, 6]
    console.log(svg)
    svg.selectAll('text')
    .data(the_data)
    .enter()
    .append('text')
    .text((d, i) => {console.log(d, i); return `Hello ${d} + ${i}`})
}
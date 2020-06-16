const BAR_CHART_PADDING = {
    top: 40,
    bottom: 30,
    start: 90,
    end: 10
};

const BAR_PADDING = 1;

function createBarChart(chartWidth, chartHeight) {
    let barChart = d3.select("#cases-evolution-over-time-bar-chart")
        .attr("width", chartWidth)
        .attr("height", chartHeight);
        
    barChart.append("g").classed("x-axis", true);
    barChart.append("g").classed("y-axis", true);

    barChart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -chartHeight / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "1em")
        .classed("y-axis-title", true);

    barChart.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", 25 + "px")
        .attr("font-size", "1.2em")
        .style("text-anchor", "middle")
        .classed("total-cases-evolution-title", true);
}

function renderBarChart(countryData) {
    const barChart = d3.select("#cases-evolution-over-time-bar-chart");

    updateTotalCasesEvolutionChartTitle(getSelectedCaseType(), countryData.country);

    const chartWidth = +barChart.attr("width");
    const chartHeight = +barChart.attr("height");

    let xScale = d3.scaleBand()
        .domain(countryData.cases.map(data => data.date))
        .rangeRound([BAR_CHART_PADDING.start, chartWidth - BAR_CHART_PADDING.end])
        .padding([0.2]);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(countryData.cases, data => data.count)])
        .range([chartHeight - BAR_CHART_PADDING.bottom, BAR_CHART_PADDING.top])
        .nice();

    let transition = d3.transition()
        .duration(1000)
        .ease(d3.easeBounceOut);

    let xAxis = d3.axisBottom(
            d3.scaleTime()
                .domain(d3.extent(countryData.cases, data => new Date(data.date)))
                .nice()
                .range([BAR_CHART_PADDING.start, chartWidth - BAR_CHART_PADDING.end])
            )
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%B %Y"));
    d3.select(".x-axis")
        .attr("transform", `translate(0, ${chartHeight - BAR_CHART_PADDING.bottom})`)
        .call(xAxis);
    
    let yAxis = d3.axisLeft(yScale);
    d3.select(".y-axis")
        .attr("transform", `translate(${BAR_CHART_PADDING.start - xScale.bandwidth() / 2}, 0)`)
        .transition()
        .duration(500)
        .call(yAxis);

    d3.select(".y-axis-title")
        .text("Total Cases");

    let chartUpdate = barChart
        .selectAll(".bar")
        .data(countryData.cases);
    
    chartUpdate
        .exit()
        .transition(transition)
            .delay((data, index, nodes) => (nodes.length - index - 1) * 10)
            .attr("y", chartHeight)
            .attr("height", 0)
            .remove();
        
    chartUpdate
        .enter()
        .append("rect")
            .classed("bar", true)
            .attr("y", data => chartHeight)
            .attr("height", 0)
        .merge(chartUpdate)
            .attr("x", data => xScale(data.date))
            .attr("width", xScale.bandwidth())
            .transition(transition)
            .delay((data, index) => index * 2)
                .attr("y", data => yScale(data.count))
                .attr("height", data => yScale(0) - yScale(data.count))
                .attr("fill", data => COVID_CHARTS_BASE_COLORS[getSelectedCaseType()]);
                
}

function updateTotalCasesEvolutionChartTitle(dataType, countryName) {
    d3.select(".total-cases-evolution-title")
        .text(`COVID-19 ${capitalizeString(dataType)} Daily Evolution for ${countryName}`);
}

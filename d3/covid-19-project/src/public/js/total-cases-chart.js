function createMap(chartWidth, chartHeight) {
    d3.select("#world-map")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
        .append("text")
            .attr("x", chartWidth / 2)
            .attr("y", 25 + "px")
            .attr("font-size", "1.5em")
            .style("text-anchor", "middle")
            .classed("world-map-title", true);
}

function renderMap(geoData, covidCasesData, covidCasesType, dateString) {
    updateMapChartTitle(covidCasesType, dateString);

    let date = new Date(dateString);
    let map = d3.select("#world-map");

    let mapProjection = d3.geoMercator()
        .scale(97)
        .translate([
            +map.attr("width") / 2,
            +map.attr("height") / 1.5
        ]);
    
    let mapPath = d3.geoPath()
        .projection(mapProjection);

    geoData.forEach(data => {
        let countryCovidData = covidCasesData.find(caseData => caseData.country === data.properties.name);
        if (countryCovidData !== undefined) {
            let dateData = countryCovidData.cases.find(caseData => caseData.date.getTime() === date.getTime());
            if (dateData !== undefined) {
                data.properties = Object.assign(data.properties, dateData);
            }
        } 
    });

    let allCasesCount = covidCasesData.reduce((accumulator, countryData) => {
        countryData.cases.forEach(dailyCases => accumulator.push(dailyCases.count));
        return accumulator;
    }, [])

    let logScale = d3.scaleSymlog()
        .domain([0, d3.max(allCasesCount)])
    let colorScale = d3.scaleSequential(data => COVID_CHARTS_COLOR_RANGES[covidCasesType](logScale(data)));

    let updateSelection = map.selectAll(".country")
        .data(geoData);
    
    updateSelection
        .enter()
        .append("path")
            .classed("country", true)
            .attr("d", mapPath)
            .on("click", function() { // using a lambda here breaks `this`
                let country = d3.select(this);
                let isActive = country.classed("active");
                let countryName = isActive ? "" : country.data()[0].properties.name;

                console.log(getCountryDataForCurrentlySelectedType(countryName));
                renderBarChart(getCountryDataForCurrentlySelectedType(countryName));
                d3.selectAll(".country").classed("active", false);
                country.classed("active", !isActive);
            })
        .merge(updateSelection)
            .transition()
            .duration(700)
            .attr("fill", data => {
                let casesCount = data.properties.count; 
                return casesCount ? colorScale(casesCount) : "white"
            });
}

function updateMapChartTitle(dataType, dateString) {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US').format(date);
    d3.select(".world-map-title")
        .text(`COVID-19 ${capitalizeString(dataType)} for ${formattedDate}`);
}
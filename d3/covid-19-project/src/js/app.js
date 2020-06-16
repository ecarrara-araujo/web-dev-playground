// Fix the US country name
// Review the color scales

Promise.all([
    d3.json(WORLD_TOPOGRAFIC_DATA),
    d3.csv(COVID_19_TIMESERIES_CONFIRMED_GLOBAL, prepareRow),
    d3.csv(COVID_19_TIMESERIES_DEATHS_GLOBAL, prepareRow),
    d3.csv(COVID_19_TIMESERIES_RECOVERED_GLOBAL, prepareRow),
])
    .then(function(values) {
        [mapData, confirmedData, deathsData, recoveredData] = values;
        initPage(mapData, confirmedData, deathsData, recoveredData);
    })
    .catch(error => console.log(error));

function initPage(mapData, confirmedData, deathsData, recoveredData) {
    initData(mapData, confirmedData, deathsData, recoveredData);
    
    const chartWidth = +d3.select(".chart-container")
        .node()
        .offsetWidth;
    const chartHeight = 500;

    setupDateRangeSelector();
    setupCaseTypeRadiosButtons();

    createMap(chartWidth, chartHeight);
    renderMap(
        COVID_CHARTS_DATA.geoData, 
        COVID_CHARTS_DATA.confirmed, 
        getSelectedCaseType(), 
        COVID_CHARTS_DATA.availableDates[COVID_CHARTS_DATA.availableDates.length - 1]
    );
    createBarChart(chartWidth, 300);
    setupTooltip();
}

function setupCaseTypeRadiosButtons() {
    d3.selectAll('input[name="case-type"]')
        .on("change", () => {
            selectedDataType = d3.event.target.value;
            renderMap(
                COVID_CHARTS_DATA.geoData,
                COVID_CHARTS_DATA[selectedDataType],
                selectedDataType,
                new Date(getSelectedDate())
            );
            
            const selectedCountrySelection = d3.selectAll(".country.active");
            if (!selectedCountrySelection.empty()) {
                const selectedCountryName = selectedCountrySelection.data()[0].properties.name;
                if (selectedCountryName) {
                    renderBarChart(getCountryDataForCurrentlySelectedType(selectedCountryName));
                }
            } 
        });
}

function setupDateRangeSelector() {
    d3.select("#dateRange")
        .property("min", 0)
        .property("max", COVID_CHARTS_DATA.availableDates.length - 1)
        .property("value", COVID_CHARTS_DATA.availableDates.length - 1)
        .on("input", () => {
            let selectedDate = COVID_CHARTS_DATA.availableDates[+d3.event.target.value];
            let selectedDataType = getSelectedCaseType();
            renderMap(
                COVID_CHARTS_DATA.geoData,
                COVID_CHARTS_DATA[selectedDataType],
                selectedDataType,
                selectedDate
            );
        });
}

function setupTooltip() {
    d3.selectAll("svg")
        .on("mousemove touchmove", showTooltip);
}

function getSelectedCaseType() {
    return d3.select('input[name="case-type"]:checked').attr("value");
}

function getSelectedDate() {
    return COVID_CHARTS_DATA.availableDates[+d3.select("#dateRange").property("value")];
}

function showTooltip() {
    const tooltip = d3.select(".tooltip");
    const eventTargetSelection = d3.select(d3.event.target);

    const tooltipContent = getToolTipContentForSelection(eventTargetSelection);

    tooltip
        .style("opacity", tooltipContent ? 1 : 0)
        .style("left", (d3.event.pageX - tooltip.node().offsetWidth / 2) + "px")
        .style("top", (d3.event.pageY - tooltip.node().offsetHeight - 10) + "px")
        .html(tooltipContent);
}

function getToolTipContentForSelection(selection) {
    if (selection.classed("country")) {
        return formatTooltipContentForMapCountry(selection);
    } else if (selection.classed("bar")) {
        return formatTooltipContentForBar(selection);
    }
    return null;
}

function formatTooltipContentForMapCountry(selection) {
    const countryData = selection.data()[0].properties;
    if (countryData) {
        const casesCount = countryData.count ? countryData.count : "Data Not Available";
        const formattedDate = countryData.date ? formatDateForTooltip(countryData.date) : "Date Not Available";
        return `<p>Country: ${countryData.name}</p>
                <p>Date: ${formattedDate}</p>
                <p>Cases: ${casesCount.toLocaleString()}</p>
                `;
    }
    return null;
}

function formatTooltipContentForBar(selection) {
    const countryData = selection.data()[0];
    if (countryData) {
        const casesCount = countryData.count ? countryData.count : "Data Not Available";
        const formattedDate = countryData.date ? formatDateForTooltip(countryData.date) : "Date Not Available";
        return `
                  <p>Date: ${formattedDate}</p>
                  <p>Cases: ${casesCount.toLocaleString()}</p>
                `;
    }
    return null;
}

function formatDateForTooltip(date) {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }); 
    return dateTimeFormat.format(date);
}

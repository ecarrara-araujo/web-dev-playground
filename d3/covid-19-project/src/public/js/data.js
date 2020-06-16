const COVID_19_TIMESERIES_CONFIRMED_GLOBAL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const COVID_19_TIMESERIES_DEATHS_GLOBAL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
const COVID_19_TIMESERIES_RECOVERED_GLOBAL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";
const WORLD_TOPOGRAFIC_DATA = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const CASE_TYPE_CONFIRMED = "confirmed";
const CASE_TYPE_DEATHS = "deaths";
const CASE_TYPE_RECOVERIES = "recoveries";

const COVID_CHARTS_COLOR_RANGES = {};
COVID_CHARTS_COLOR_RANGES[CASE_TYPE_CONFIRMED] = d3.interpolatePurples;
COVID_CHARTS_COLOR_RANGES[CASE_TYPE_DEATHS] = d3.interpolateReds;
COVID_CHARTS_COLOR_RANGES[CASE_TYPE_RECOVERIES] = d3.interpolateGreens;

const COVID_CHARTS_BASE_COLORS = {}
COVID_CHARTS_BASE_COLORS[CASE_TYPE_CONFIRMED] = "Indigo";
COVID_CHARTS_BASE_COLORS[CASE_TYPE_DEATHS] = "DarkRed";
COVID_CHARTS_BASE_COLORS[CASE_TYPE_RECOVERIES] = "DarkGreen";

const COVID_CHARTS_DATA = {};

function initData(mapData, confirmedData, deathsData, recoveredData) {
    COVID_CHARTS_DATA[CASE_TYPE_CONFIRMED] = prepareData(confirmedData);
    COVID_CHARTS_DATA[CASE_TYPE_DEATHS] = prepareData(deathsData);
    COVID_CHARTS_DATA[CASE_TYPE_RECOVERIES] = prepareData(recoveredData);

    COVID_CHARTS_DATA.availableDates = confirmedData.columns.slice(4);
    COVID_CHARTS_DATA.geoData = topojson.feature(mapData, mapData.objects.countries).features;
}

function prepareRow(row) {
    let cases = Object.entries(row)
            .slice(4)
            .reduce((accumulator, currentValue) => {
                accumulator.push(
                    {
                        date: new Date(currentValue[0]), 
                        count: +currentValue[1]
                    }
                );
                return accumulator;
            }, []);
    return {
        country: row["Country/Region"],
        state: row["Province/State"],
        latitude: +row.Lat,
        longitude: +row.Long,
        cases: cases
    }
}

function prepareData(dataset) {
    return dataset.reduce((accumulator, currentValue, index, data) => {
        if (accumulator.findIndex(countryData => countryData.country === currentValue.country) === -1) { // item ainda não processado, talvez não precise
            let occurrencies = data.filter(countryData => countryData.country === currentValue.country);
            if (occurrencies.length > 1) {
                occurrencies.forEach(item => {
                    if (item.state !== currentValue.state) {
                        item.cases.forEach(covidCase => {
                            let index = currentValue.cases.findIndex(currentValueCovidCase => currentValueCovidCase.date.getTime() === covidCase.date.getTime());
                            if (index > -1) currentValue.cases[index].count += covidCase.count;
                        });
                    }
                });
                currentValue.state = "";
            }
            data = data.filter(countryData => countryData.country !== currentValue.country);
            currentValue.latestCases = currentValue.cases[currentValue.cases.length - 1];;
            accumulator.push(currentValue);
        } 
        return accumulator;
    }, []);
}

function getCountryDataForCurrentlySelectedType(countryName) {
    return COVID_CHARTS_DATA[getSelectedCaseType()].find(countryData => countryData.country === countryName)
}
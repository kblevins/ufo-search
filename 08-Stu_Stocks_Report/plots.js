var apiKey = "1x4ve2wzzYxFYBdTJXBT";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function getMonthlyData() {

  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
  Plotly.d3.json(queryUrl, function(error, response) {
    var dates = unpack(response.dataset.data, 0);
    var openPrices = unpack(response.dataset.data, 1);
    var highPrices = unpack(response.dataset.data, 2);
    var lowPrices = unpack(response.dataset.data, 3);
    var closingPrices = unpack(response.dataset.data, 4);
    var volume = unpack(response.dataset.data, 5);
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = Plotly.d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot() {
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&api_key=${apiKey}`;

  Plotly.d3.json(url, function(error, response) {

    if (error) return console.warn(error);

    // Grab values from the response json object to build the plots
    var name = response.dataset.name;
    var stock = response.dataset.dataset_code;
    var startDate = response.dataset.start_date;
    var endDate = response.dataset.end_date;
    var dates = unpack(response.dataset.data, 0);
    var openingPrices = unpack(response.dataset.data, 1);
    var highPrices = unpack(response.dataset.data, 2);
    var lowPrices = unpack(response.dataset.data, 3);
    var closingPrices = unpack(response.dataset.data, 4);

    getMonthlyData();

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}

buildPlot();

// BONUS - Dynamically add the current date to the report header
var monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var today = new Date();
var date = `${monthNames[today.getMonth()]} ${today.getFullYear().toString().substr(2, 2)}`;

Plotly.d3.select("#report-date").text(date);

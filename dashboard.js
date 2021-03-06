function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open(
    "GET",
    "https://publicdashboard.blob.core.windows.net/public/dashboard-data.json",
    true
  ); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}


//function init() {
loadJSON(function (response) {
  // Parse JSON string into object
  var dashboardData = JSON.parse(response);

  var generatedByMonths = generateByMonthData(dashboardData.byMonth);

  // By Month chart transactions
  var byMonth = document.getElementById("byMonth");
  if (byMonth) {
    new Chart(byMonth, {
      type: "bar",
      data: {
        labels: [
          "Gennaio",
          "Febbraio",
          "Marzo",
          "Aprile",
          "Maggio",
          "Giugno",
          "Luglio",
          "Agosto",
          "Settembre",
          "Ottobre",
          "Novembre",
          "Dicembre",
        ],
        datasets: generatedByMonths,
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontSize: 15,
                fontColor: "lightgrey",
              },
            },
          ],
          yAxes: [
            {
              //  gridLines: {
              //    drawBorder: false,
              //  },
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
                //  beginAtZero: true,
                fontSize: 15,
                fontColor: "lightgrey",
                maxTicksLimit: 5,
                //   padding: 25,
              },
            },
          ],
        },
        //  scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
      },
    });
  }

  var topEdcData = generateTop(dashboardData.dEcbyAnno, "DenominazioneEc");

  var top10Edc = document.getElementById("top10Edc");
  if (top10Edc) {
    new Chart(top10Edc, {
      type: "horizontalBar",
      data: topEdcData,
      options: {
        responsive: true,
        legend: {
          position: "right",
        },
        title: {
          display: false,
          text: "5 enti creditori con più transazioni per anno ",
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontSize: 15,
                fontColor: "lightgrey",
              },
            },
          ],
          yAxes: [
            {
              //  gridLines: {
              //    drawBorder: false,
              //  },
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
                //  beginAtZero: true,
                fontSize: 15,
                fontColor: "lightgrey",
                maxTicksLimit: 5,
                //   padding: 25,
              },
            },
          ],
        },
      },
    });
  }

  var topPspData = generateTop(dashboardData.pspByAnno, "PSP");

  var top10PSP = document.getElementById("top10PSP");
  if (top10PSP) {
    new Chart(top10PSP, {
      type: "horizontalBar",
      data: topPspData,
      options: {
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
          rectangle: {
            borderWidth: 2,
          },
        },
        responsive: true,
        legend: {
          position: "right",
        },
        title: {
          display: false,
          text: "5 Psp con più transazioni per anno ",
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                fontSize: 15,
                fontColor: "lightgrey",
              },
            },
          ],
          yAxes: [
            {
              //  gridLines: {
              //    drawBorder: false,
              //  },
              gridLines: {
                display: false,
              },
              ticks: {
                display: false,
                //  beginAtZero: true,
                fontSize: 15,
                fontColor: "lightgrey",
                maxTicksLimit: 5,
                //   padding: 25,
              },
            },
          ],
        },
      },
    });
  }

  var dataForPspPie = generateTopForPie(dashboardData.pspByAnno, "PSP");
  var top10PSPPieElem = document.getElementById("top10PSPPie").getContext("2d");
  var top10PSPPie = new Chart(top10PSPPieElem, {
    type: "pie",
    data: dataForPspPie,
    options: {
      responsive: true,
    },
  });

  var dataForEdcPie = generateTopForPie(
    dashboardData.dEcbyAnno,
    "DenominazioneEc"
  );
  var top10PEdcPieElem = document
    .getElementById("top10EdcPie")
    .getContext("2d");
  var top10PEdcPie = new Chart(top10PEdcPieElem, {
    type: "pie",
    data: dataForEdcPie,
    options: {
      responsive: true,
    },
  });

  var totalPred = document.getElementById("totalPred").getContext("2d");
  var predData = generatePredData(dashboardData);
  var predChart = new Chart(totalPred, {
    type: "line",
    data: predData,
    options: {
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        rectangle: {
          borderWidth: 2,
        },
      },
      responsive: true,
      title: {
        display: false,
        text: "10 Psp con più transazioni ",
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
            ticks: {
              fontSize: 15,
              fontColor: "lightgrey",
            },
          },
        ],
        yAxes: [
          {
            //  gridLines: {
            //    drawBorder: false,
            //  },
            gridLines: {
              display: false,
            },
            ticks: {
              display: false,
              //  beginAtZero: true,
              fontSize: 15,
              fontColor: "lightgrey",
              maxTicksLimit: 5,
              //   padding: 25,
            },
          },
        ],
      },
    },
  });

  function sixMonthPredictionTotal(forecastByMonth) {
    return forecastByMonth
      .map((element) => Math.round(element.yhat_upper))
      .reduce((a, b) => a + b, 0);
    // .toLocaleString();
  }

  $(function () {
    var eUntil31122019 = 11129053683
    var e2020 = Math.round(dashboardData.transactions2020[0].importo / 100);
    var t2020 = dashboardData.transactions2020[0].total;
    var tPred = sixMonthPredictionTotal(dashboardData.forecastByMonth);
    var predImporto = Math.round((e2020 / t2020) * tPred);
    var eTotal = eUntil31122019 + e2020;

    $("#2019t").text(
      "# " + dashboardData.transactions2019[0].total.toLocaleString("en")
    );
    $("#2020t").text("# " + t2020.toLocaleString());
    $("#2020e").text("€ " + e2020.toLocaleString());
    $("#totalt").text("# " + dashboardData.totalInHistory.toLocaleString());
    $("#growthRate").text(Math.round(dashboardData.growthRate) + " %");
    $("#predTotal").text("# " + tPred.toLocaleString());
    $("#predEuro").text("€ " + predImporto.toLocaleString());
    $("#eTotal").text("€ " + eTotal.toLocaleString());

  });
});

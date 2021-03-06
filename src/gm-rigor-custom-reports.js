// ==UserScript==
// @name        Custom Report tweaks for rigor.com
// @namespace   https://github.com/fiann/greasemonkey-scripts/
// @match       https://monitoring.rigor.com/reports/*
// @grant       none
// @version     1.0
// @run-at      document-idle
// @author      Fiann O'Hagan <fiann@thisisoptimal.com>
// ==/UserScript==


const budgets = {
  "Mean First Byte Time" : { green: 0.5, red: 1.0 },
  "Mean First Contentful Paint Time" : { green: 1.0, red: 3.0 },
  "Mean Speed Index" : { green: 4300, red: 5800 },
  "Mean Time to Interactive" : { green: 3.8, red: 7.3 },
  "Mean Largest Contentful Paint" : { green: 2.0, red: 4.0 },
  "Mean Total Blocking Time" : { green: 0.3, red: 0.6 },
  "Mean Cumulative Layout Shift" : { green: 0.1, red: 0.25 },
  "Mean Total Content Size" : { green: 2500, red: 3500 },
  "Mean Total Image Size" : { green: 1200, red: 2000 },
  "Mean Total Video Size" : { green: 1500, red: 2500 },
  "Mean Total JavaScript Size" : { green: 500, red: 1000 },
  "Mean Total CSS Size" : { green: 150, red: 250 },
  "Mean Total Font Size" : { green: 150, red: 200 },
  "Mean Video Count" : { green: 2, red: 5 },
  "Mean Font Count" : { green: 5, red: 6 },
  "Mean JavaScript Count" : { green: 30, red: 50 },
  "Mean CSS Count" : { green: 10, red: 20 },
};
const styles = `
  <style type="text/css">
    .budget-button { float: right; background-image: linear-gradient(to right, lawngreen, yellow, red); }
    .budget-green { background-clip: content-box; background-color: #C6E6D7 !important; }
    .budget-yellow { background-clip: content-box; background-color: #F9EE9F !important; }
    .budget-red { background-clip: content-box; background-color: #F3C5C4 !important; }
    .budget-brightred { background-clip: content-box; color: crimson !important; color: crimson; font-weight: bold; border: 1px solid crimson }
  </style>
`;
$("head").append($(styles));

const button = $(`<button class="budget-button">Use budget colors</button>`);
button.click(setBudgetColors);
$(".reportHeader .row:first").append(button);


// Set window title to match report title
window.jQuery(() => {
  let report_title = $("h1").text().trim();
  console.log("Title", report_title)
  if (report_title !== "") {
    document.title = report_title + " - Rigor report";
  }
});


// Add colors to tables
function setBudgetColors() {
  
  let tables = $(".ReactTable");
  console.log("Checking " + tables.length + " tables");
  tables.each((t_idx, t_elem) => {
    let table = $(t_elem);
    let header_cells = $(".rt-th", table);
    let headers = [];
    header_cells.each((h_idx, h_elem) => {
      headers[h_idx] = $(h_elem).text().trim();
    });
    console.log(headers.join());
    let rows = $(".rt-tr-group .rt-tr", table);
    rows.each((r_idx, r_elem) => {
      let row = $(r_elem);
      let cells = $(".rt-td", row);
      cells.each((c_idx, c_elem) => {
        let metric = headers[c_idx];
        console.log(`Table ${t_idx}, row ${r_idx}, column ${c_idx}, metric ${metric}`);
        let budget = budgets[metric];
        if (budget !== undefined) {
          let cell = $(c_elem);
          let text = cell.text().trim();
          let value = window.parseFloat(text);
          let color;
          if (value >= (budget.red * 2)) {
            color = "budget-brightred";
          } 
          else if (value >= budget.red) {
            color = "budget-red";
          } 
          else if (value <= budget.green) {
            color = "budget-green";
          } 
          else {
            color = "budget-yellow";
          }
          console.log(`${value} is ${color}`);
          cell.html(`<div class="${color}">${text}</div>`);
        }
      }); // end for cell
    }); // end for row
  });
}

setTimeout(setBudgetColors, 5000);

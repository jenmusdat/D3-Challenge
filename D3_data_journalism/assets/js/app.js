var svgArea = d3.select("body").select("svg");

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  bottom: 50,
  right: 50,
  left: 50,
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append group element
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "healthcare";
function xScale(stateData, chosenXAxis) {
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(stateData, (d) => d[chosenXAxis]) * 0.7,
      d3.max(stateData, (d) => d[chosenXAxis]),
    ])
    .range([0, width]);
  return xLinearScale;
}
// Read CSV
d3.csv("assets/data/data.csv").then(
  function (stateData) {
    // parse data
    stateData.forEach(function (data) {
      data.poverty = +data.poverty;
      data.income = +data.income;
      data.age = +data.age;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // create scales
    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = d3
      .scaleLinear()
      .domain([0, d3.max(stateData, (d) => d.poverty)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g").call(yAxis);

    // append circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d.poverty))
      .attr("r", "20")
      .attr("fill", "purple")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    var textGroup = chartGroup
      .selectAll("text.abbr")
      .data(stateData)
      .enter()
      .append("text")
      .attr("class", "abbr")
      .text((d) => d.abbr)
      .attr("dx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("dy", (d) => yLinearScale(d.poverty))
      .style("text-anchor", "middle")
      .style("font-size", "15px")
      .style("color", "white");
    // Step 1: Append tooltip div
    var toolTip = d3.select("body").append("div").classed("tooltip", true);

    // Step 2: Create "mouseover" event listener to display tooltip
    //  circlesGroup
    //     .on("mouseover", function (d) {
    //       toolTip
    //         .style("display", "block")
    //         .html(`<strong>Poverty</strong><hr>${d.poverty}</hr>`)
    //         .style("left", d3.event.pageX + "px")
    //         .style("top", d3.event.pageY + "px");
    //     })
    //     // Step 3: Create "mouseout" event listener to hide tooltip
    //     .on("mouseout", function () {
    //       toolTip.style("display", "none");
    //     });
    // Step 2: Create "mouseover" event listener to display tooltip
    // circlesGroup
    //   .on("mouseover", function (d) {
    //     toolTip
    //       .style("display", "block")
    //       .html(`<hr>${d.poverty} medal(s) won`)
    //       .style("left", d3.event.pageX + "px")
    //       .style("top", d3.event.pageY + "px");
    //   })
    //   // Step 3: Create "mouseout" event listener to hide tooltip
    //   .on("mouseout", function () {
    //     toolTip.style("display", "none");
    //   });
    // part b: create handlers
    function onMouseover(d, i) {
      toolTip.style("display", "block");
      toolTip
        .html(`Health <strong>${d.healthcare}</strong>`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    }

    function onMouseout(d, i) {
      toolTip.style("display", "none");
    }

    // part c: add event listener
    circlesGroup.on("mouseover", onMouseover).on("mouseout", onMouseout);
  },
  function (error) {
    console.log(error);
  }
);

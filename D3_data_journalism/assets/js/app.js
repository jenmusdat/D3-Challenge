// Define the workspace area
var svgArea = d3.select("body").select("svg");

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
 append svg and group
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
//* Access the data from somewhere and pull it into your program
//Load data from data.csv
d3.csv("data/data.csv").then(function (data) {
  console.log(data);
});

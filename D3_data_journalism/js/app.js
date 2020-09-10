var svgWidth = 900;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("D3_data_journalism/data/data.csv").then(function(censusData) {

  console.log(censusData)
        // Step 1: Parse Data/Cast as numbers
        censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;

    });


    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([6, d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(censusData, d => d.smokes)])
      .range([height, 0]);
      


    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //  Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "20")
    .attr("fill", "green")
    .attr("opacity", ".5");


    //  Add State Abbr.
    // ==============================
    var stateAbbr = chartGroup.append("g").selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .text(function(d) {return d.abbr;})
    .attr("x", d => xLinearScale(d.poverty-0.25))
    .attr("y", d => yLinearScale(d.smokes-0.25))
    .attr("r", "15")
    .attr("fill", "white");



    //  Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(data, index) {
        return (`${data.abbr}<br>Poverty: ${data.poverty} %<br>Smokers: ${data.smokes} %`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    //  Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoker Rate (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate (%)");
  }).catch(function(error) {
    console.log(error);
  });


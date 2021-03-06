var imgURL = "https://lahacksimages.blob.core.windows.net/classphotos/myimage0.jpeg";

var StreamContainer = React.createClass({
  render: function() {
    var now = new Date();
    return (
      <div id="stream-container">
        <img id="stream-image" src={imgURL + "?" + now.getTime()} />
        <div id="face-rectangles-container"></div>
      </div>
    );
  }
});

var FaceRectangles = React.createClass({
  render: function() {

    $.ajax({
      url: "https://getfacesinfo.azurewebsites.net/api/HttpTriggerJS1?code=a82NvcCSnCUZuMEkiiZfAA3laFa25zA6wDXizt0FBZtjQxCz2iajBg==",
      dataType: 'json',
      type: 'GET',
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Access-Control-Allow-Headers": "Authorization"
      },
      success: function(faceData) {
        if (faceData.length > 0) {
          this.setState({data: faceData});
          studentsArr = faceData;
          console.log(studentsArr);
        }
        else {
          studentsArr = [];
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("ajax error");
      }.bind(this)
    });

    var streamImage = document.getElementById("stream-image");
    var imgOriginalWidth = streamImage.naturalWidth;
    var ratio = streamImage.getBoundingClientRect().width / imgOriginalWidth;
    var faceRectangles = [];
    studentsArr.map(function(student){
      var faceStyle = {
        position: "absolute",
        border: "3px solid " + (student.label == "0" ? "#FF687A" : "#20d3b0"),
        left: ratio * student.faceRectangle.left,
        top: ratio * student.faceRectangle.top,
        width: ratio * student.faceRectangle.width,
        height: ratio * student.faceRectangle.height
      };
      faceRectangles.push(
        <div style={faceStyle}></div>
      );
      var i = idArr.indexOf(student.name);
      if (i >= 0) {
        var att = parseInt(student.label);
        idInfoArr[i].attention = att;
        idInfoArr[i].history.push(att);
      }
    });
    return (
      <div id="face-rectangles-inner">
        {faceRectangles}
      </div>
    );
  }
});

var Stats = React.createClass({
  render: function() {
    var attentiveness = 0;
    if (studentsArr.length > 0) {
      studentsArr.map(function(student){
        attentiveness += parseInt(student.label);
      });
      attentiveness /= studentsArr.length;
    }
    historyData.push(
      {
        time: timeCount,
        attention: attentiveness
      }
    );
    var attentivenessHistory = 0;
    if (historyData.length > 0) {
      historyData.map(function(student){
        attentivenessHistory += student.attention;
      });
      attentivenessHistory /= historyData.length;
    }
    timeCount++;
    return (
      <div id="stats">
        <div style={{flexGrow: 0}}>10:30 AM - 12:30 AM | Hacking Class</div>
        <div id="stats-content">
          <div id="stats-overall" style={{backgroundColor: attentiveness < 0.5 ? "#FF687A" : "#20d3b0"}}>
            <p style={{fontSize: "350%", lineHeight: "90%"}}>{Math.floor(attentiveness * 100)}%</p>
            <p>Student</p>
            <p>Attentiveness</p>
          </div>
          {/* <div id="stats-graph">

          </div> */}
          <div id="stats-overall-history" style={{backgroundColor: attentivenessHistory < 0.5 ? "#FF687A" : "#20d3b0"}}>
            <p>Overall</p>
            <p style={{fontSize: "350%", lineHeight: "90%"}}>{Math.floor(attentivenessHistory * 100)}%</p>
            <p>Student</p>
            <p>Attentiveness</p>
          </div>
        </div>
      </div>
    );
  }
});

var ContentLeft = React.createClass({
  render: function() {
    return (
      <div id="content-left">
        <StreamContainer />
        <Stats />
      </div>
    );
  }
});

var Students = React.createClass({
  render: function() {
    var studentsElements = idInfoArr.map(function(student) {
      var overallAttention = 0;
      student.history.map(function(stat) {
        overallAttention += stat;
      });
      overallAttention /= student.history.length;

      var currentStatStyle = {
        marginLeft: "auto",
        marginRight: "2vh",
        backgroundColor: student.attention == 0 ? "#FF687A" : "#20d3b0"
      };
      var overallStatStyle = {
        backgroundColor: overallAttention < 0.5 ? "#FF687A" : "#20d3b0"
      };
      return (
        <div className="student-container">
          <p style={{margin: "0", marginRight: "auto"}}>{student.name}</p>
          <div className="student-stat" style={currentStatStyle}>
            <p>Currently</p>
            {student.attention==0 ? <p>NOT</p> : null}
            <p>Attentive</p>
          </div>
          <div className="student-stat" style={overallStatStyle}>
            <p>Overall</p>
            <p style={{fontSize: "200%", lineHeight: "95%"}}>{Math.floor(overallAttention * 100)}%</p>
            <p>Attentive</p>
          </div>
        </div>
      );
    });
    return (
      <div id="students">
        {studentsElements}
      </div>
    );
  }
});

var Container = React.createClass({
  render: function() {
    return (
      <div id="content-container">
        <ContentLeft />
        <Students />
      </div>
    );
  }
});

var renderGraph = function() {
  var data = historyData;
  // console.log(timeCount);
  var statsElement = document.getElementById('stats-overall').getBoundingClientRect();
  var statsContentElement = document.getElementById('stats-content').getBoundingClientRect();
  var graphWidth = statsContentElement.width - statsElement.width - 150;
  var graphHeight = statsElement.height;
  var timeFn = function(item) { return item.time; };
  var attnFn = function(item) { return item.attention; };
  var x = d3.scaleLinear()
    .range([0, graphWidth])
    .domain([0, timeCount]);
  var y = d3.scaleLinear()
    .range([graphHeight, 0])
    .domain([0, 1]);
  var xAxis = d3.axisBottom().scale(x).ticks(0);
  var yAxis = d3.axisLeft().scale(y).ticks(5);
  var prevGraph = document.getElementById("stats-graph-svg");
  if (prevGraph) {
    prevGraph.parentNode.removeChild(prevGraph);
  }
  var svg = d3.select('#stats-graph')
    .append('svg')
    .attr('id', 'stats-graph-svg')
    .attr('width', graphWidth) // set its dimentions
    .attr('height', graphHeight);
  var g = svg.append("g");
  g.append('g')
    .attr('class', 'x axis')
    .attr("transform", "translate(0," + graphHeight*0.99 + ")")
    .call(xAxis);
  g.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
  var line = d3.line().x(timeFn).y(attnFn);
  g.append('g')
    .append("path")
    .data(data)
    .attr("transform", "translate(0," + graphHeight*0.50 + ")")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
};

var renderPage = function() {
  ReactDOM.render(<Container />, document.getElementById('content'), function(){
    setTimeout(function(){
      ReactDOM.render(<FaceRectangles />, document.getElementById('face-rectangles-container'));
      // renderGraph();
    }, 100);
  });
};

renderPage();
setInterval(renderPage, 1500);

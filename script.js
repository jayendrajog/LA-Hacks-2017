var imgURL = "assets/stream-example.jpg";

var StreamContainer = React.createClass({
  render: function() {
    return (
      <div id="stream-container">
        <img id="stream-image" src={imgURL} />
        <div id="face-rectangles-container"></div>
      </div>
    );
  }
});

var FaceRectangles = React.createClass({
  render: function() {
    var streamImage = document.getElementById("stream-image");
    var imgOriginalWidth = streamImage.naturalWidth;
    console.log(imgOriginalWidth);
    var ratio = streamImage.getBoundingClientRect().width / imgOriginalWidth;
    var faceRectangles = [];
    studentsArr.map(function(student){
      var faceStyle = {
        position: "absolute",
        border: "3px solid " + (student.attention == 0 ? "#ff7f9b" : "#20d3b0"),
        left: ratio * student.coordinates[0],
        top: ratio * student.coordinates[1],
        width: ratio * student.coordinates[2],
        height: ratio * student.coordinates[3]
      };
      faceRectangles.push(
        <div style={faceStyle}></div>
      );
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
    studentsArr.map(function(student){
      attentiveness += student.attention;
    });
    attentiveness /= studentsArr.length;
    return (
      <div id="stats">
        <div style={{flexGrow: 0}}>10:30 AM - 12:30 AM | Hacking Class</div>
        <div id="stats-content">
          <div id="stats-overall" style={{backgroundColor: attentiveness < 0.5 ? "#ff7f9b" : "#20d3b0"}}>
            <p style={{fontSize: "350%"}}>{attentiveness * 100}%</p>
            <p>Student</p>
            <p>Attentiveness</p>
          </div>
          <div id="stats-graph">

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
    var studentsElements = studentsArr.map(function(student) {
      return (
        <div className="student-container">

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

var renderPage = function() {
  ReactDOM.render(<Container />, document.getElementById('content'), function(){
    setTimeout(function(){
      ReactDOM.render(<FaceRectangles />, document.getElementById('face-rectangles-container'));
    }, 100);
  });
}

renderPage();
setInterval(renderPage, 2000);

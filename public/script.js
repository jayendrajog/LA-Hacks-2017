var ImageForm = React.createClass({
  //this component can be converted into the webcam component with modifications
  getInitialState: function() {
    var imageState = {imageURL: "/assets/test-image.jpg"};
    return imageState;
  },
  // onChange : function(e){
  //     this.setState({imageState : e.target.value});
  // },
  handleUserChange: function(e) {
    e.preventDefault();
    if (!this.state.imageURL) {
      console.log("what the");
      return;
    }
    this.props.onUserSubmit({imageURL: this.state.imageURL});
    // this.setState({imageURL: ""});
  },
  render: function() {
    return (
      <form className="image-form" onSubmit={this.handleUserChange}>
        <button className="image-form-submit" type="submit" value="Submit">Test Image</button>
      </form>
    );
  }
});

var FaceData = React.createClass({
  render: function() {
    var boxes = this.props.data ? this.props.data.faceArr.map(function(face) {
      var top = face.faceRectangle.top;
      var left = face.faceRectangle.left;
      var width = face.faceRectangle.width;
      var height = face.faceRectangle.height;
      const divStyle = {position: "absolute", border: "2px solid red", top: top, left: left, width: width, height: height};
      console.log(divStyle);
      return (
        <div className="" style={divStyle}></div>
      );
    }) : null;
    console.log(this.props.data);
    return this.props.data ? (
      <div style={{position: "relative"}}>
        <img src={this.props.data.imageURL}/>
        {boxes}
      </div>
    ) : null;
    // [ { faceRectangle: { top: 743, left: 508, width: 488, height: 488 },
    // faceAttributes: { gender: 'female', age: 24.1 } } ]
  }
});

var FaceResult = React.createClass({
  getInitialState: function() {
    return {data: null};
  },
  handleSearchSubmit: function(face) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      data: face,
      success: function(faceArr) {
        this.setState({data: {faceArr: faceArr, imageURL: face.imageURL}});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: []});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return(
      <div className="face">
        <ImageForm onUserSubmit={this.handleSearchSubmit}/>
        <FaceData data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(<FaceResult url="/result"/>, document.getElementById('content'));

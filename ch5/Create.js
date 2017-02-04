class CreatePost extends React.Component {
  constructor(props) {
    super(props);

    // Set up state
    this.state = {
      content: 'pippo',
      valid: true,
    };

    // Set up event handlers
    console.log(`CreatePost constructor`);
    this.handleSubmit = this.handleSubmit.bind(this);          //Function.prototype.bind()  quando handleSubmit e' invocato, this riferira' a questo component invece che undefined!
    this.handlePostChange = this.handlePostChange.bind(this);  //Function.prototype.bind()  quando handlePostChange e' invocato, this riferira' a questo component invece che undefined!
  }

  //ogni volta che la textarea viene modificata occorre updatare lo state
  //altrimenti la view non viene aggionata!!
  handlePostChange(event) {
    const content =event.target.value;
    console.log(`CreatePost.handlePostChange(${event.target.value})`);
    this.setState({
      content,
      valid: content.length <= 3,
    });
  }

  handleSubmit(event) {
    event.preventDefault();//Non si vuole inviare il post direttamente, solo notificare parent App del nuovo post
    if (!this.state.valid) {
      return;
    }
    if (this.props.onSubmit) {//onSubmit deve essere fornito dalle props!!
      const newPost = {
        date: Date.now(),
        // Assign a temporary key to the post; the API will create a real one for us
        id: Date.now(),
        content: this.state.content,
      };

      this.props.onSubmit(newPost);//comunico al parent App che form deve essere inviato
      this.setState({
        content: '',
        valid: false,
      });
    }
  }

  render() {
    return (
      <form className="create-post" onSubmit={this.handleSubmit}>
        <textarea value={this.state.content} onChange={this.handlePostChange} placeholder="What's on your mind?" />
		{ !this.state.valid ? <div>your post is too long! :(</div> : null}
		<input disabled={!this.state.valid}  type="submit"  className="btn btn-default"  placeholder="Post"/>
	  </form>
		    );
  }
}

CreatePost.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
};




export default CreatePost;

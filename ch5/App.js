import CreatePost from './Create.js'


class App extends React.Component {
	  constructor(props) {
	    super(props);
	    
	    this.state={posts:[]};
	    this.handlePostSubmit = this.handlePostSubmit.bind(this);   
	  }
	  
	  
	  //handler che viene invocato all invio del form
	  handlePostSubmit(payload) {
			console.log(`App.handlePostSubmit()   payload = ${payload}`); 
			// Disable empty posts
			if (!payload.content) {
              return;
			}
			const oldPosts = this.state.posts; 
			oldPosts.unshift(payload);// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
			this.setState({posts:oldPosts});
			
			// Invio new post al server
			const requestOptions = {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
				    // Create options for the request
					'Content-Type': 'application/json'}
			}
			// Send the new post to the API https://fetch.spec.whatwg.org/
			fetch('www.google.post/posts',requestOptions)	
			.then()
			}


	  render() {
		    return (
	    		 <div className="app">
	    	      <div className="container-fluid">
	    	      <CreatePost onSubmit={this.handlePostSubmit} />
	    	      </div>
	    	    </div>	
		    )
	  }
}


export default App;



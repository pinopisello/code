import CreatePost from './CreatePost'
import React from 'react'


class App extends React.Component {
	  constructor(props) {
	    super(props);
	    
	    this.state= { 
	    		posts: { all: [],
	    		         filtered: [] 
	                    },
	    		category: null,
	    		filters: { image: null,
	    			        link: null,
	    			        categories: []
	                     },
	    		loaded: false,
	    		showBanner: false
		};
	    this.handlePostSubmit = this.handlePostSubmit.bind(this);   
	  }
	  
	  handlePostSubmit(payload) {
			console.log(payload); 
			// Disable empty posts
			if (!payload.content) {
              return;
			}
			const oldPosts = this.state.posts.all; 
			oldPosts.unshift(payload);//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
			this.setState({posts:{all:oldPosts}});
			
			//Invio new post al server
			const requestOptions = {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {'Content-Type':'application/json'}
			}
			// Send the new post to the API  https://fetch.spec.whatwg.org/
		/*	fetch(`${process.env.ENDPOINT}/posts`, requestOptions)
			.then(res => {
				if(res.ok === true){
					this.fetchPosts();
				}
			   });
			   */
}


	  render() {
		    return (
	    		 <div className="app">
	    	      <div className="container-fluid">
	    	      <CreatePost onSubmit={this.handlePostSubmit} />
	    	      </div>
	    	      <div className="posts">
	    	          {
	    	      this.state.posts.all.map(post => { return (
	    	      <div className="post"> {post.content}
	    	      </div> );
	    	      }) 
	    	      }
	    	      </div>
	    	    </div>	
		    )
	  }
}


export default App;



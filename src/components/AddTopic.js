import React from 'react';
import { auth, store } from '../services/firebase';

class AddTopic extends React.Component {
  constructor() {
    super();

    this.state = { 
      user: auth().currentUser,
      topics: [],
      title: '',
      description: '',
      errors: []
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //console.log('[AddTopic.js] -- componentDidMount');
    const userId = this.state.user.uid;
    store.collection("topics").doc(userId).collection("topicList")
    .onSnapshot((querySnapshot) => {
      const topics = [];
      querySnapshot.forEach(function(doc) { 
          let topic = { topicId: doc.id, title: doc.data().title, description: doc.data().description }
          topics.push(topic);
      });
      this.setState({topics: topics});
    });
  }

  componentWillUnmount() {
    //console.log('[AddTopic.js] -- componentWillUnmount');
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  handleInputChange(event) {
    var key = event.target.name;
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
  }

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    var errors = [];

    if (this.state.title === "") {
      errors.push("title");
    }

    if (this.state.description === "") {
      errors.push("description");
    }

    this.setState({
      errors: errors
    });

    if (errors.length > 0) {
      return false;
    } 
    // else {
    //   alert("everything good. submit form!");
    // }

    const userId = this.state.user.uid;
    const { title, description } = this.state;
    
    // Firestore
    store.collection("topics").doc(userId).collection("topicList").doc(`${Date.now()}`).set({
      title: title,
      description: description
    })
    .then(function(docRef) { 
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

    this.setState({ 
      title: '',
      description: '' 
    });
  }

  handleDelete = topicId => {
    const userId = this.state.user.uid;
    store.collection("topics").doc(userId).collection("topicList").doc(topicId).delete().then(function() {
      console.log("Topic successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  render() {
    return (
      <div className="card">  
        <div className="card-body">
          <div className="card-title"><b>Topics</b></div>       
          <div className="border rounded p-1" style={{backgroundColor:"#EAEDED"}}>
            <form onSubmit={this.handleSubmit}>
              <input
                name="title"
                // onChange={() => this.handleNewTopicChange()}
                onChange={this.handleChange}
                value={this.state.title}
                className={
                  this.hasError("title")
                    ? "form-control is-invalid"
                    : "form-control"
                }
                placeholder="Title"
              />
              <div className="invalid-feedback">
                Please enter title.
              </div>
              <textarea
                name="description"
                className={
                  this.hasError("description")
                    ? "form-control is-invalid mt-1"
                    : "form-control mt-1"
                } 
                placeholder="Description"
                onChange={this.handleChange}
                value={this.state.description}
              />
              <div className="invalid-feedback">
                Please enter description.
              </div>
              <button className="btn btn-outline-primary mt-2">Add</button>
            </form>
            <ul className="list-unstyled mt-1">
              {this.state.topics.map(topic => (
              <li key={topic.topicId} className="shadow-sm rounded bg-white p-1 mt-2">
                <span className="font-weight-bold">{topic.title}</span>
                <div className="float-right">
                  <span style={{"cursor":"pointer"}} onClick={() => this.handleDelete(topic.topicId)}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </span>
                  {/* <button className="btn btn-sm btn-danger ml-1" >
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button> */}
                </div>
                <div>
                <span className="font-weight-lighter">{topic.description}</span>
                </div>      
              </li>))}
              </ul>
          </div>
        </div>
      </div> 
    );
  }
}

export default AddTopic;

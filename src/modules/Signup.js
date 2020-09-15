import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../helpers/auth';
import { store } from '../services/firebase';

class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: '' });
    try {
      const response = await signup(this.state.email, this.state.password);

      store.collection("users").doc(response.user.uid).set({
        userId: response.user.uid,
        email: response.user.email
      })
      .then(function(docRef) {
        console.log("User added in Firestore", docRef);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

render() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <form className="py-4 px-4" autoComplete="off" onSubmit={this.handleSubmit}>
                <h3>Sign Up to&nbsp;<Link className="title" to="/">Todo</Link></h3>
                <p className="lead">Fill in the form below to create an account.</p>
                <div className="form-group">
                  <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
                </div>
                <div className="form-group mt-2">
                  <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
                </div>
                <div className="form-group mt-2">
                  {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
                  <button className="btn btn-primary rounded-pill px-5">Sign up</button>
                </div>
                <hr></hr>
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div> 
    </div>
    );
  }
}

export default {
  routeProps: {
      path: '/signup',
      component: SignUp,
  },
  name: 'Signup',
};

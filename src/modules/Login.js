import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signin, facebookLogin, signinWithFacebook } from '../helpers/auth';
import { auth } from '../services/firebase';

class Login extends Component {

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
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async handleFB(event) {
    event.preventDefault();
    //this.setState({ error: '' });
    try {
      var facebookProvider = new auth.FacebookAuthProvider();
      await auth().signInWithPopup(facebookProvider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });;
    } catch (error) {
      //this.setState({ error: error.message });
    }
  }

  async signinWithGoogle(event) {
    event.preventDefault();
    //this.setState({ error: '' });
    try {
      var googleProvider = new auth.GoogleAuthProvider();
      await auth().signInWithPopup(googleProvider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });;
    } catch (error) {
      //this.setState({ error: error.message });
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
                <h3>Login to&nbsp;<Link className="title" to="/">Todo</Link></h3>
                <p className="lead">Fill in the form below to login to your account.</p>
                <div className="form-group">
                  <input className="form-control" placeholder="Email" name="email" type="email" onChange={this.handleChange} value={this.state.email}></input>
                </div>
                <div className="form-group mt-2">
                  <input className="form-control" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} type="password"></input>
                </div>
                <div className="form-group mt-2">
                  {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
                  <button className="btn btn-primary rounded-pill px-5">Login</button>
                </div>
                <hr></hr>
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
              </form>
              <div className="text-center">
              <button className="btn btn-primary rounded-pill px-5" onClick={this.handleFB}>Login using Facebook</button>
              </div>
              <div className="text-center mt-2">
              <button className="btn btn-primary rounded-pill px-5" onClick={this.signinWithGoogle}>Login using Google</button>
              </div>
                         
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>       
    </div>
    )
  }
}

export default {
  routeProps: {
      path: '/login',
      component: Login,
  },
  name: 'Login',
};

import React, { Component } from 'react';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import ImageUpload from '../components/ImageUpload';

export default class Profile extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Header />
                <ImageUpload />
                <Footer />
                </div>
        );
    }
}
import React, { Component } from 'react';
import TagForm from './TagForm'

export default class Tagger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectDetails: {
                name: null,
                overview: null,
                drivingQuestion: null,
                finalProducts: null,
                checkpoints: null,
                requirements: null
            }
        };
    }

    componentWillMount() {
        this.fetchProject().then( project => {
            this.projectKey = project._key
            this.setState( {
                projectDetails: {
                    name: project.name || null,
                    overview: project.details.overview || null,
                    drivingQuestion: project.details.drivingQuestion || null,
                    finalProducts: project.details.finalProducts || null,
                    checkpoints: project.details.checkpoints || null,
                    requirements: project.details.requirements || null
                }
            } ) 
        } )
    }

    async fetchProject() {
        const response = await fetch('/api/new-project');
        const json = await response.json()
        return json
    }

    render () {
        return (
            <div>
                <ProjectDetails name={this.state.projectDetails.name}
                                overview={this.state.projectDetails.overview}
                                drivingQuestion={this.state.projectDetails.drivingQuestion}
                                finalProducts={this.state.projectDetails.finalProducts}
                                checkpoints={this.state.projectDetails.checkpoints}
                                requirements={this.state.projectDetails.requirements}
                />
                <TagForm projectKey={this.projectKey} />
            </div>
        )
    };
}

const ProjectDetails = props => {
    return (
        <div>
            <h2>{props.name}</h2>
            <h3>Project Overview</h3>
            <p>{props.overview || "No overview."}</p>            
            <h3>Driving Question</h3>
            <p>{props.drivingQuestion || "No overivew."}</p>
            <h3>Final Products</h3>
            {props.finalProducts ? props.finalProducts.map( product => <p>{product}</p> ) : "No final products."}
            <h3>Checkpoints</h3>
            {props.checkpoints ? props.checkpoints.map( checkpoint => <p>{checkpoint}</p> ) : "No checkpoints."}
            <h3>Custom Requirements</h3>
            {props.requirements ? props.requiremnts.map( requirement => <p>{requirement}</p> ) : "No requirements."}
        </div>
    );
};
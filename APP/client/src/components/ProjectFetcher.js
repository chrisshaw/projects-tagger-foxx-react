import React, { Component } from 'react';
import ProjectForm from './ProjectForm'

export default class ProjectFetcher extends Component {
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
                    finalProducts: project.details.finalProducts || [],
                    checkpoints: project.details.checkpoints || [],
                    requirements: project.details.requirements || [],
                    tags: project.topics || [],
                    standards: project.standards || []
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
                <ProjectForm    projectKey={this.projectKey}
                                name={this.state.projectDetails.name}
                                overview={this.state.projectDetails.overview}
                                drivingQuestion={this.state.projectDetails.drivingQuestion}
                                finalProducts={this.state.projectDetails.finalProducts}
                                checkpoints={this.state.projectDetails.checkpoints}
                                requirements={this.state.projectDetails.requirements}
                                topics={this.state.projectDetails.topics}
                                standards={this.state.projectDetails.standards}
                />
            </div>
        )
    };
}
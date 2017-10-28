
import React, { Component } from 'react';
import './Project.css'
import ProjectSection from './ProjectSection'

const messages = {
    topics: {
        createOption: 'Request a new topic...'
    }
}

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            link: '',
            overview: '',
            drivingQuestion: '',
            finalProducts: [],
            checkpoints: [],
            requirements: [],
            topics: [],
            standards: [],
            options: {}
        }
    }

    async componentDidMount() {
        const project = await this.fetchJSON('/api/any-project')
        console.log(project)
        const options = await this.fetchJSON('/api/autocomplete')
        console.log(options)
        
        this.projectKey = project._key
        this.setState( {
            name: project.name || '',
            link: project.link || '',
            overview: project.details.overview || '',
            drivingQuestion: project.details.drivingQuestion || '',
            finalProducts: project.details.finalProducts || [],
            checkpoints: project.details.checkpoints || [],
            requirements: project.details.requirements || '',
            topics: project.topics || [],
            standards: project.standards || [],
            options: options || {}
        } ) 
    }

    fetchJSON = async url => {
        const response = await fetch(url);
        const json = await response.json()
        return json
    }

    handleCreate = e => {
        this.setState((prevState, props) => ({
            options: {
                [e.target.name]: [...prevState.options[e.target.name], e.target.value.toLowerCase()]
            },
            [e.target.name]: [...prevState[e.target.name], e.target.value.toLowerCase()]
        }))
    }

    handleChange = value => {
        this.setState({ value })
    }

    handleAdd = value => {
        console.log('Handle add:', '\n', value)
    }

    handleRemove = value => {
        console.log('Handle remove:', '\n', value)
    }

    handleSubmit = async e => {
        const tags = this.state.value.slice()
        const result = await fetch(
            `/api/${this.props.projectKey}/update`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({ tags: tags })
            }
        )
        const jsonResult = await result.json()
        alert(jsonResult.responseMessage)
        e.preventDefault()
        window.location.reload()
    }

    render() {
        console.log(this.state.options)
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>{this.state.name}</h2>
                <ProjectSection
                    header="Project Overview"
                    type="text"
                    value={this.state.overview}
                    onChange={this.handleChange}
                />
                <ProjectSection
                    header="Driving Question"
                    type="text"
                    value={this.state.drivingQuestion}
                    onChange={this.handleChange}
                />
                <ProjectSection
                    header="Final Products"
                    type="multitextinput"
                    value={this.state.finalProducts}
                    data={this.state.options.finalProducts}
                    onChange={this.handleChange}
                    handleAdd={this.handleAdd}
                    handleRemove={this.handleRemove}
                />
                <ProjectSection
                    header="Checkpoints"
                    type="multitextinput"
                    value={this.state.checkpoints}
                    data={this.state.options.checkpoints}
                    onChange={this.handleChange}
                    handleAdd={this.handleAdd}
                    handleRemove={this.handleRemove}
                />
                <ProjectSection
                    header="Custom Requirements"
                    type="text"
                    value={this.state.requirements}
                    onChange={this.handleChange}
                />
                <ProjectSection
                    allowCreate
                    header="Topics"
                    type="multiselect"
                    value={this.state.topics}
                    data={this.state.options.topics}
                    filter="contains"
                    messages={messages.topics}
                    onCreate={this.handleCreate}
                    onChange={this.handleChange}
                />
                <ProjectSection
                    header="Standards"
                    type="multiselect"
                    value={this.state.standards}
                    data={this.state.options.standards}
                    onChange={this.handleChange}
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
};
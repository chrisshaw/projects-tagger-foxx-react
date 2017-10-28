
import React, { Component } from 'react';
import './Project.css'
import ProjectSection from './ProjectSection'

const messages = {
    topics: {
        createOption: 'Create new'
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
            standards: project.standards || []
        } ) 
        this.setState({ options: options.options })
    }

    fetchJSON = async url => {
        const response = await fetch(url);
        const json = await response.json()
        return json
    }

    handleCreate = e => {
        console.log('Handle create:','\n', e)
        console.log('e.target.value', e.target.value)
        // this.setState((prevState, props) => ({
        //     options: {
        //         [e.target.name]: [...prevState.options[e.target.name], e.target.value.toLowerCase()]
        //     },
        //     [e.target.name]: [...prevState[e.target.name], e.target.value.toLowerCase()]
        // }))
    }

    handleChange = (e, valueKey) => {
        let value = ''
        if (['overview','drivingQuestion','requirements'].includes(valueKey)) {
            value = e.target.value
        } else if(['topics','standards'].includes(valueKey)) {
            value = e
        }

        console.log('Handle change:','\n', `value: ${value}`, '\n', `valueKey: ${valueKey}`)
        this.setState( { [valueKey]: value })
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
        // console.log('>>>>> state', '\n', this.state)
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>{this.state.name}</h2>
                <ProjectSection
                    header="Project Overview"
                    type="text"
                    value={this.state.overview}
                    onChange={value => this.handleChange(value, 'overview')}
                />
                <ProjectSection
                    header="Driving Question"
                    type="text"
                    value={this.state.drivingQuestion}
                    onChange={value => this.handleChange(value, 'drivingQuestion')}
                />
                <ProjectSection
                    header="Final Products"
                    type="multitextinput"
                    value={this.state.finalProducts}
                    data={this.state.options.finalProducts}
                    filter="contains"
                    onChange={value => this.handleChange(value, 'finalProducts')}
                    messages={messages.topics}
                    allowCreate
                    onCreate={this.handleCreate}
                    handleAdd={this.handleAdd}
                    handleRemove={this.handleRemove}
                />
                <ProjectSection
                    header="Checkpoints"
                    type="multitextinput"
                    value={this.state.checkpoints}
                    data={this.state.options.checkpoints}
                    filter="contains"
                    onChange={value => this.handleChange(value, 'checkpoints')}
                    messages={messages.topics}
                    allowCreate
                    onCreate={this.handleCreate}
                    handleAdd={this.handleAdd}
                    handleRemove={this.handleRemove}
                />
                <ProjectSection
                    header="Custom Requirements"
                    type="text"
                    value={this.state.requirements}
                    onChange={value => this.handleChange(value, 'requirements')}
                />
                <ProjectSection
                    header="Topics"
                    type="multiselect"
                    value={this.state.topics}
                    data={this.state.options.topics}
                    filter="contains"
                    onChange={value => this.handleChange(value, 'topics')}
                    messages={messages.topics}
                    allowCreate
                    onCreate={this.handleCreate}
                />
                <ProjectSection
                    header="Standards"
                    type="multiselect"
                    value={this.state.standards}
                    data={this.state.options.standards}
                    filter="contains"
                    onChange={value => this.handleChange(value, 'standarsd')}
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
};

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
        this.setState({ options })
    }

    fetchJSON = async url => {
        const response = await fetch(url);
        const json = await response.json()
        return json
    }

    getValue = (e, valueKey) => {
        // console.log(e, valueKey)

        if (['overview','drivingQuestion','requirements'].includes(valueKey)) {
            return e.target.value
        } else if(['topics','standards'].includes(valueKey)) {
            return e
        } else if (['finalProducts','checkpoints'].includes(valueKey)) {
            return e.value
        }
    }

    handleCreate = valueKey => e => {
        let value = this.getValue(e, valueKey)
        // console.log('Handle change:','\n', `value: ${value}`, '\n', `valueKey: ${valueKey}`)
        this.setState( (prevState, props) => {
            let newValue = null
            if (e.i !== undefined) {
                // the state value is an array and we needed to send in the index
                newValue = prevState[valueKey].slice()
                newValue[e.i] = value
            } else {
                newValue = value
            }
            const newOptions = prevState.options
            newOptions[valueKey] = [...newOptions[valueKey], value]
            return {
                options: newOptions,
                [valueKey]: newValue
            }
        })
    }

    handleChange = valueKey => e => {
        let value = this.getValue(e, valueKey)
        if (e.i !== undefined) {
            // the state value is an array and we needed to send in the index
            this.setState( (prevState, props) => { 
                const values = prevState[valueKey].slice()
                values[e.i] = value
                return { [valueKey]: values }
            })
        } else {
            this.setState( { [valueKey]: value })
        }
    }

    handleAdd = valueKey => () => {
        // console.log('Handle add:', '\n', valueKey)
        this.setState((prevState, props) =>  ({ [valueKey]: [...prevState[valueKey], ''] }) )
    }

    handleRemove = valueKey => () => {
        this.setState((prevState, props) => { 
            const values = prevState[valueKey]
            values.pop()
            return { [valueKey]: values }
        })
    }

    handleSubmit = async e => {
        const { options, ...project } = this.state
        const result = await fetch(
            `/api/${this.props.projectKey}/update`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify({ project })
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
                    onChange={this.handleChange('overview')}
                />
                <ProjectSection
                    header="Driving Question"
                    type="text"
                    value={this.state.drivingQuestion}
                    onChange={this.handleChange('drivingQuestion')}
                />
                <ProjectSection
                    header="Final Products"
                    type="multitextinput"
                    value={this.state.finalProducts}
                    data={this.state.options.finalProducts}
                    filter="contains"
                    onChange={this.handleChange('finalProducts')}
                    messages={messages.topics}
                    allowCreate
                    onCreate={this.handleCreate('finalProducts')}
                    handleAdd={this.handleAdd('finalProducts')}
                    handleRemove={this.handleRemove('finalProducts')}
                    placeholder="Select something"
                />
                <ProjectSection
                    header="Checkpoints"
                    type="multitextinput"
                    value={this.state.checkpoints}
                    data={this.state.options.checkpoints}
                    filter="contains"
                    onChange={this.handleChange('checkpoints')}
                    messages={messages.topics}
                    allowCreate
                    onCreate={this.handleCreate('checkpoints')}
                    handleAdd={this.handleAdd('checkpoints')}
                    handleRemove={this.handleRemove('checkpoints')}
                    placeholder="Select something"
                />
                <ProjectSection
                    header="Custom Requirements"
                    type="text"
                    value={this.state.requirements}
                    onChange={this.handleChange('requirements')}
                />
                <ProjectSection
                    header="Topics"
                    type="multiselect"
                    value={this.state.topics}
                    data={this.state.options.topics}
                    filter="contains"
                    onChange={this.handleChange('topics')}
                    messages={messages.topics}
                    allowCreate
                    onCreate={this.handleCreate('topics')}
                />
                <ProjectSection
                    header="Standards"
                    type="multiselect"
                    value={this.state.standards}
                    data={this.state.options.standards}
                    filter="contains"
                    onChange={this.handleChange('standards')}
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
};
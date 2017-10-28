
import React, { Component } from 'react';
import Multiselect from 'react-widgets/lib/Multiselect'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
import './ProjectForm.css'

const messages = {
    topics: {
        createOption: 'Request a new topic...'
    }
}

export default class ProjectForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.name,
            overview: this.props.overview,
            drivingQuestion: this.props.drivingQuestion,
            finalProducts: this.props.finalProducts,
            checkpoints: this.props.checkpoints,
            requirements: this.props.requirements,
            topics: this.props.topics,
            standards: this.props.standards,
            options: {
                standards: [],
                topics: [],
                products: [],
                checkpoints: []
            }
        }
    }

    async componentDidMount() {
        const response = await fetch('/api/autocomplete')
        const options = await response.json()
        console.log(options)
        this.setState({ options })
    }

    fetchOptions = async () => {
        const response = await fetch('/api/autocomplete')
        const json = await response.json()
        return json.options
    }

    handleCreate = newTag => {
        this.setState((prevState, props) => ({
            options: [...prevState.options, newTag.toLowerCase()],
            value: [...prevState.value, newTag.toLowerCase()]
        }))
    }

    handleChange = value => {
        this.setState({ value })
    }

    handleAdd = value => {
        console.log(`handleAdd value: ${value}`)
    }

    handleRemove = value => {
        console.log(`handleRemove value: ${value}`)
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
        window.location.reload()
    }

    render() {
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
                />
                <ProjectSection
                    header="Final Products"
                    type="multitextinput"
                    value={this.state.finalProducts}
                />
                <ProjectSection
                    header="Checkpoints"
                    type="multitextinput"
                    value={this.state.checkpoints}
                />
                <ProjectSection
                    header="Custom Requirements"
                    type="multitextinput"
                    value={this.state.requirements}
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
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
};

const ProjectSection = props => {
    let section = <h3>${props.header || "No data."}</h3>

    if (props.type === 'text') {
        section += <TextArea {...props} />
    } else if (props.type === 'multiselect') {
        section += <Multiselect {...props} />
    } else if (props.type === 'multitextinput') {
        section += <MultiTextInput {...props} />
    }

    return section
}

const MultiTextInput = props => {
    let inputs = props.value.map( (oneValue, i) => {
        return <AddableDropdownList
                    key={i}
                    type="text"
                    name={`value_${i}`}
                    value={oneValue}
                />
    })
    
    return inputs
}

const AddableDropdownList = props => {
    return (
        <div>
            <DropdownList {...props} />
            <input
                type="button"
                value="Add"
                onClick={props.handleAdd}
            />
            <input
                type="button"
                value="Remove"
                onClick={props.handleRemove}
            />
        </div>
    )

}

const TextArea = props => {
    /*just use a textarea exept with a change handler */
    return
}
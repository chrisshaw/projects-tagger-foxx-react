
import React, { Component } from 'react';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css'
import './TagForm.css'

const messages = {
    createOption: 'Request a new topic...'
}

export default class TagForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            value: []
        }
    }

    componentWillMount() {
        this.fetchTags().then(options => this.setState({ options: options }))
    }

    async fetchTags() {
        const response = await fetch('/api/autocomplete')
        const json = await response.json()
        return json.tags
    }

    handleCreate = newTag => {
        this.setState((prevState, props) => ({
            options: [...prevState.options, newTag.toLowerCase()],
            value: [...prevState.value, newTag.toLowerCase()]
        }))
    }

    handleChange = value => {
        this.setState({ value: value })
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
                <Multiselect
                    autoFocus
                    messages={messages}
                    allowCreate="onFilter"
                    data={this.state.options}
                    value={this.state.value}
                    onCreate={this.handleCreate}
                    onChange={this.handleChange}
                />
                <input type="submit" value="Submit" />
            </form>
        );
    }
};
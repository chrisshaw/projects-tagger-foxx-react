
import React, { Component } from 'react';
import SuperSelectField from 'material-ui-superselectfield'
import Chip from 'material-ui/Chip/Chip'
import './TagForm.css'

export default class TagForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: [],
            tags: []
        }
    }

    componentWillMount() {
        this.fetchTags().then( options => this.setState( {options: options} ) )
    }

    async fetchTags() {
        const response = await fetch('/api/autocomplete')
        const json = await response.json()
        return json.tags
    }

    addTag = (values) => {
        this.setState( (prevState, values) => ( { tags: values } ) )
    }

    render() {
        return (
            <form action={`/api/${this.props.projectKey}/update`} method="post">
            <SuperSelectField
                name='tags'
                multiple
                onChange={this.addTag}
            >
                <div 
            </SuperSelectField>

                <input type="submit" value="Submit" />
            </form>
        );
    }
};
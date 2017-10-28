import React from 'react';
import Multiselect from 'react-widgets/lib/Multiselect'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'
import './ProjectSection.css'

export const ProjectSection = props => {
    const type = props.type
    // Object.entries(props).forEach( ([key, value]) => console.log(key, value))

    let section = [<h3 key="header">{props.header || "No data."}</h3>]

    if (type === 'text') {
        section = [...section, <TextArea key="textarea" {...props} />]
    } else if (type === 'multiselect') {
        section = [...section, <Multiselect key="multiselect" {...props} />]
    } else if (type === 'multitextinput') {
        section = [...section, <MultiTextInput key="multitextinput" {...props} />]
    }
    return section
}

export const MultiTextInput = props => {
    const { value, onChange, ...otherProps } = props
    let inputs = value.map( (oneValue, i) => {
        return <DropdownList
                    key={i}
                    value={oneValue}
                    onChange={value => onChange({value, i})}
                    {...otherProps}
                />
    })
    
    return (
        <div>
            {inputs}
            <input
                type="button"
                value="Add to End"
                onClick={props.handleAdd}
            />
            <input
                type="button"
                value="Remove Last"
                onClick={props.handleRemove}
            />
        </div>            
    )
}

export const TextArea = props => {
    /*just use a textarea exept with a change handler */
    return <textarea value={props.value} onChange={props.onChange} />
}

export default ProjectSection
import React from 'react';
import { Multiselect, DropdownList, NumberPicker } from 'react-widgets'
import 'react-widgets/dist/css/react-widgets.css'
import './ProjectSection.css'
// import numberLocalizer from 'react-widgets/lib/localizers/simple-number'
// numberLocalizer()

export const ProjectSection = props => {
    const type = props.type
    // Object.entries(props).forEach( ([key, value]) => console.log(key, value))

    let section = [<h3 key="header">{props.header || "No data."}</h3>]

    switch (type) {
        case 'text':
            section = [...section, <TextArea key="textarea" {...props} />]
            break
        case 'multiselect':
            section = [...section, <Multiselect key="multiselect" {...props} />]
            break
        case 'multitextinput':
            section = [...section, <MultiTextInput key="multitextinput" {...props} />]
            break
        case 'dropdown':
            section = [...section, <DropdownList key="dropdown" {...props} />]
            break
        case 'number':
            section = [...section, <NumberPicker key="number" {...props}/>]
            break
        default:
            throw new Error('No recognized type.')
    }
    return section
}

export const MultiTextInput = props => {
    const { value, onChange, onCreate, ...otherProps } = props
    let inputs = value.map( (oneValue, i) => {
        return <DropdownList
                    key={i}
                    value={oneValue}
                    onChange={value => onChange({value, i})}
                    onCreate={value => onCreate({value, i})}
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
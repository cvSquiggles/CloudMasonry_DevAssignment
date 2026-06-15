import React from 'react'

export function YearPicker({id, yearValue, yearSetter, labelText}) {

    const handleChange = (event) => {
        yearSetter(event.target.value)
    }


  return (
    <div id={id}>
        <label>{labelText}
            <select id={id+"_select"} name={id+"_select"} value={yearValue} onChange={handleChange}>
                <option value="">--Select {labelText}--</option>
                {/* The following code iterates from 2026 to 1900, and builds out drop down select options for each value,
                    I'm using this instead of the default HTML calendar date fields because the API only cares about the year value. */}
                {(() => {
                    const options = [];
                    for(let i = 2026; i >= 1850; i--)
                    {
                        options.push(<option key={i} value={i}>{i}</option>)
                    }
                    return options //return all the options
                })()} 
            </select>
        </label>
    </div>
  )
}

export default YearPicker
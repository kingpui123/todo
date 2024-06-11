import React from "react"

export default (props) => {
    return (
        <div className={`inline-block m-1 rounded-xl p-2 text-xs font-bold ${props.className}`}>
            {props.text}
        </div>
    )
}
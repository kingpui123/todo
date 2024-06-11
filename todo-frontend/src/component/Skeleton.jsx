import React from "react";

export default (props) => {

    return (
        <div className={`p-4 rounded-lg drop-shadow-lg border ${props.className ? props.className : ""}`}>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-2/3 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-full"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
        </div>
    )
}
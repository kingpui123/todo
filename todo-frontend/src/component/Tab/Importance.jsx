import React from "react";
import CommonTab from './CommonTab'

export default ({ todo }) => {
    return (
        <React.Fragment>
            {
                todo.importance == 3 && <CommonTab text="Crucial" className="text-white bg-red-600" />
            }
            {       
                todo.importance == 2 && <CommonTab text="Important" className="text-white bg-amber-500" />
            }
            {       
                todo.importance == 1 && <CommonTab text="Minor" className="text-white bg-sky-500" />
            }

        </React.Fragment>
    )
}
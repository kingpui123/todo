import React from "react";
import CommonTab from "./CommonTab";

export default ({ todo }) => {
    return (
        <React.Fragment>
            {
                todo.priority == 3 && <CommonTab text="Critical" className="text-white bg-rose-600" />
            }
            {       
                todo.priority == 2 && <CommonTab text="Prioritized" className="text-white bg-orange-500" />
            }
            {       
                todo.priority == 1 && <CommonTab text="Optional" className="text-white bg-green-500" />
            }

        </React.Fragment>
    )
}
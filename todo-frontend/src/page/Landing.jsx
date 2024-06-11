import React from "react";
import Skeleton from "../component/Skeleton";

export default (props) => {
    return (
        <div className="h-full w-full"> 
          <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 ">
            <div className="border-t-transparent border-solid animate-spin rounded-full border-zinc-400 border-8 h-32 w-32"></div>
        </div>
        </div>
    )
}
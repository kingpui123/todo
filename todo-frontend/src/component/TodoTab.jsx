import React from "react";
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";
import Schedule from '@mui/icons-material/Schedule';
import Cached from '@mui/icons-material/Cached';
import EditNote from '@mui/icons-material/EditNote';
import Prority from "./Tab/Priority";
import Importance from "./Tab/Importance";
import CommonTab from "./Tab/CommonTab";
import { AllStatus } from '../const/const'

dayjs.extend(utc)

const getFormattedTime = (timeString) => {
    let dayjsDate = dayjs.utc(timeString)
    if (!dayjsDate.isValid() || dayjsDate.valueOf() <= 0){
        return '-'
    }
    return dayjsDate.local().format("YYYY-MM-DD HH:mm")
}

const getFormattedStatus = (status) => {
    let found = AllStatus.find(s => s.value === status)
    if (!!found) {
        return found.label
    }

    return '-'
}

export default (props) => {
    let todo = props.todo
    return (
        <div className="p-4 hover:bg-zinc-100 transition-all border-b border-zinc-200 flex flex-nowrap">
            <div className="grow">
            <h1 className="text-2xl font-bold">{todo.name}</h1>
            {
                todo.description != "" && (
                    <h3 className="text-lg mt-2">{todo.description}</h3>
                )
            }

            <div className="flex flex-nowrap mb-2">
                <div className="mr-2 min-w-24 text-nowrap">
                    <Schedule fontSize="lg" className="mr-1" /><span className="inline-block align-middle">{getFormattedTime(todo.dueTime)}</span>
                </div>

                <div className="min-w-24 text-nowrap">
                    <Cached fontSize="lg" className="mr-1" /><span className="inline-block align-middle">{getFormattedStatus(todo.status)}</span>
                </div>
            </div>

            <div className="h-auto">
                <Prority todo={todo} />
                <Importance todo={todo} />
            </div>
            <div className="mt-2">
                {
                    todo.tags.map(((t, i) => (
                        <CommonTab text={`# ${t}`} key={i} className="text-black bg-white border border-slate-300"/>
                    )))
                }
            </div>
            </div>
            <div className="ml-2 shrink-0 flex">
                <button onClick={() => props.onTodoFocus()}className="hover:bg-zinc-200 my-auto align-middle inline-block p-2 transition-all rounded-full">
                    <EditNote fontSize="large" />
                </button>
            </div>
        </div>
    )
}
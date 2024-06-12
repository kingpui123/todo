import React, { useContext } from 'react'
import dayjs from 'dayjs'
import { ListAlt, CheckCircle, Today, PriorityHigh, PendingActions, LowPriority } from '@mui/icons-material'

const ListItem = (props) => (
    <div onClick={() => props.onClick()} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer items-baseline">
        <span className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
            {props.icon}
        </span>
        <span className="flex-1 ms-3 whitespace-nowrap align-middle">{props.text}</span>
    </div>
)

export default (props) => {
    return (

        <div className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform  bg-white dark:bg-gray-800 ${!props.showSideBar ? "-translate-x-full" : ""} shadow-lg`} tabindex="-1">
            <button onClick={() => props.onClose()} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
            <div className="py-4 overflow-y-auto">
                <div className="flex items-center ps-2.5 mb-5">
                    <img src="https://todo-asset.s3.ap-southeast-1.amazonaws.com/image/a_plain_logo.png" className="h-6 me-3 sm:h-7" alt="Todo" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Todo List</span>
                </div>
                <ul className="space-y-2 font-medium">
                    <ListItem icon={<ListAlt />} text={"All"} onClick={() => props.onChangeFilter({ search: {} })}/>
                    <ListItem icon={<CheckCircle />} text={"Completed"} onClick={() => props.onChangeFilter({ search: { progress: ["finished"]} })}/>
                    <ListItem icon={<Today />} text={"Today"} onClick={() => props.onChangeFilter({ search: { startTime: dayjs().startOf("day"), endTime: dayjs().endOf("day") } })} />
                    <ListItem icon={<PriorityHigh />} text={"Critical"} onClick={() => props.onChangeFilter({ search: { priority: [3]} })}/>
                    <ListItem icon={<PendingActions />} text={"Prioritized"} onClick={() => props.onChangeFilter({ search: { priority: [2]} })}/>
                    <ListItem icon={<LowPriority />} text={"Optional"} onClick={() => props.onChangeFilter({ search: { priority: [1]} })}/>
                </ul>
            </div>
        </div>

    )
}
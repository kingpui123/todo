import axios from '../utils/axios';
import React, { useContext, useEffect, useReducer, useState } from "react";
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import { message, Layout, Menu } from 'antd';

import TodoTab from '../component/TodoTab'
import TodoForm from '../component/TodoForm'
import TodoSideBar from '../component/TodoSideBar';

const searchTodosService = async ({ search, sort }) => {
    try {
        let res = await axios.post('/api/todo/search', {
            sort,
            search
        })

        return res.data.data
    } catch (error) {
        console.log(error)
        // show error notification
        throw error
    }
}

const updateTodoService = async (id, body) => {
    try {
        let res = await axios.post(`/api/todo/${id}`, {
            ...body,
            ...((body.dueTime || "") && {
                dueTime: new Date(body.dueTime).toISOString()
            })
        })

        return res.data.data
    } catch (error) {
        console.log(error)
        // show error notification
        throw error
    }
}

const createTodoService = async (body) => {
    try {
        console.log(body.dueTime)
        let res = await axios.post(`/api/todo`, {
            ...body,
            ...((body.dueTime || "") != "" && {
                dueTime: new Date(body.dueTime).toISOString()
            })
        })

        return res.data.data
    } catch (error) {
        throw error
    }
}

export default (props) => {
    const [todos, setTodos] = useState([])
    const [searchParams, setSearchParams] = useState({
        status: ["not-started", "in-progress"]
    })
    const [sortKey, setSortKey] = useState("created_at")
    const [sortOrder, setSortOrder] = useState(-1)
    const [formAction, setFormAction] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [showSideBar, setShowSideBar] = useState(false)

    const [todoOnFocus, setTodoOnFocus] = useState({})


    const updateSearchParams = (newParams = {}) => {
        setSearchParams({ ...newParams, ...searchParams, })
    }

    const removeSearchParams = (key) => {
        let newSearchParams = { ...searchParams }
        delete newSearchParams[key]
        setSearchParams(newSearchParams)
    }

    const searchTodos = async () => {
        try {
            let todos = await searchTodosService({ search: searchParams, sort: { sort_by: sortKey, sort_order: sortOrder } })
            if (Array.isArray(todos)) {
                setTodos(todos)
                setShowSideBar(false)
            } else {
                throw new Error("Invalid response from server")
            }
        } catch (error) {
            console.log(error)
            message.error("Please try again later!")
        }
    }

    const onUpdateTodo = async (id, body) => {
        try {
            let result = await updateTodoService(id, body)
            setShowForm(false)
            message.success("Success")
            return searchTodos()
        } catch (error) {
            console.log(error)
            message.error("Please try again later!")
        }
    }

    const onCreateTodo = async (body) => {
        try {
            let result = await createTodoService(body)
            setShowForm(false)
            message.success("Success")
            return searchTodos()
        } catch (error) {
            console.log(error)
            message.error("Please try again later!")
        }
    }

    const onSubmitAction = (id, body) => {
        if (formAction === "edit") {
            return onUpdateTodo(id, body)
        } else {
            return onCreateTodo(body)
        }
    }

    const focusTodo = (todo) => {
        setShowForm(true)
        setFormAction("edit")
        setTodoOnFocus(todo)
    }

    const onCreateNewTodo = () => {
        setShowForm(true)
        setFormAction("create")
    }


    useEffect(() => {
        const initGetTodos = async () => {
            try {
                let todos = await searchTodosService({ search: searchParams, sort: { sort_by: sortKey, sort_order: sortOrder } })
                if (Array.isArray(todos)) {
                    setTodos(todos)
                } else {
                    throw new Error("Invalid response from server")
                }
            } catch (error) {
                console.log(error)
            }
        }
        initGetTodos()
    }, [])

    useEffect(() => {
        if (!showForm) {
            setFormAction("")
            setTodoOnFocus({})
        }

    }, [showForm])

    useEffect(() => {
        searchTodos()
    }, [JSON.stringify(searchParams)])

    return (
        <div>
        <TodoSideBar
            showSideBar={showSideBar}
            onClose={() => setShowSideBar(false)}
            onChangeFilter={(object) => setSearchParams(object)}
        />
        <div className="">
            <div>
                {
                    todos.map((todo) => {
                        return (
                            <TodoTab key={todo.id} id={todo.id} todo={todo} onTodoFocus={() => focusTodo(todo)} />
                        )
                    })
                }
                {
                    todos.length == 0 && (
                        <div className="text-center text-xl font-semibold text-gray-600 pt-8">
                            No todos found
                        </div>
                    )
                }
            </div>

            <div className="fixed bottom-4 right-4">
                <div className='flex justify-center'>
                <button onClick={() => setShowSideBar(!showSideBar)} className="mr-4 rounded-full bg-white px-4 py-2 shadow-xl hover:bg-slate-100 transition-all">
                        <MenuIcon fontSize='large' />
                    </button>
                    <button onClick={() => onCreateNewTodo()} className="rounded-full bg-white px-4 py-2  hover:bg-slate-100 transition-all shadow-xl">
                        <AddIcon fontSize='large' />
                    </button>
                </div>
            </div>

            <TodoForm
                todoOnFocus={todoOnFocus}
                showForm={showForm}
                formAction={formAction}
                onSubmit={onSubmitAction}
                onClose={() => setShowForm(false)}
            />
        </div>
        </div>
    );
}

import axios from '../utils/axios';
import React, { useContext, useEffect, useReducer, useState } from "react";
import AddIcon from '@mui/icons-material/Add'
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import { Snackbar, Button } from '@mui/joy';

import { UserContext } from "../context/UserContext";
import TodoTab from '../component/TodoTab'
import TodoForm from '../component/TodoForm'
import moment from 'moment';

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
        console.log(error)
        // show error notification
        throw error
    }
}

export default (props) => {
    const { setUser } = useContext(UserContext)
    const [todos, setTodos] = useState([])
    const [searchParams, setSearchParams] = useState({
        status: ["not-started", "in-progress"]
    })
    const [sortKey, setSortKey] = useState("created_at")
    const [sortOrder, setSortOrder] = useState(-1)
    const [formAction, setFormAction] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showErrorMessage, setShowErrorMessage] = useState(false)

    const [todoOnFocus, setTodoOnFocus] = useState({})
    co


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
            } else {
                throw new Error("Invalid response from server")
            }
        } catch (error) {
            console.log(error)
            setShowErrorMessage(true)
        }
    }

    const onUpdateTodo = async (id, body) => {
        try {
            let result = await updateTodoService(id, body)
            setShowForm(false)
            setShowSuccessMessage(true)
            return searchTodos()
        } catch (error) {
            console.log(error)
            setShowErrorMessage(true)
        }
    }

    const onCreateTodo = async (body) => {
        try {
            let result = await createTodoService(body)
            setShowForm(false)
            setShowSuccessMessage(true)
            return searchTodos()
        } catch (error) {
            console.log(error)
            setShowErrorMessage(true)
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

    return (
        <div className="">
            <div class="sticky top-0 drop-shadow-md"></div>
            <div>
                {
                    todos.map((todo) => {
                        return (
                            <TodoTab key={todo.id} id={todo.id} todo={todo} onTodoFocus={() => focusTodo(todo)} />
                        )
                    })
                }
            </div>

            <div className="fixed bottom-4 right-4">
                <div className='flex justify-center'>
                    <button onClick={() => onCreateNewTodo()} className="rounded-xl bg-white px-4 py-2 shadow-lg">
                        <AddIcon fontSize='large' /><span className='inline-block ml-2 font-semibold text-xl align-middle'>Add new</span>
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

            <Snackbar
                variant="soft"
                color="success"
                open={showSuccessMessage}
                autoHideDuration={2500}
                onClose={() => setShowSuccessMessage(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                startDecorator={<CheckCircleOutline />}
                endDecorator={
                    <Button
                        onClick={() => setShowSuccessMessage(false)}
                        size="sm"
                        variant="soft"
                        color="success"
                    >
                        Dismiss
                    </Button>
                }
            >
                Success!
            </Snackbar>
            <Snackbar
                variant="soft"
                color="danger"
                open={showErrorMessage}
                autoHideDuration={2500}
                onClose={() => setShowErrorMessage(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                startDecorator={<ErrorOutline />}
                endDecorator={
                    <Button
                        onClick={() => setShowErrorMessage(false)}
                        size="sm"
                        variant="soft"
                        color="danger"
                    >
                        Dismiss
                    </Button>
                }
            >
                Please try again later!
            </Snackbar>
        </div>
    );
}
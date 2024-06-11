import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import axios from '../utils/axios'
import { LocalStorageTokenKey } from '../const/const.js'
import Landing from '../page/Landing.jsx'
import LoginLanding from '../page/LoginLanding.jsx'
import TodoList from '../page/TodoList.jsx'

export default function TodoWrapper(props) {
    const { setUser, setToken, setInitFetched, initFetched, user } = useContext(UserContext)

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.post("/auth/verifytoken")
                if (res.status !== 200) {
                    localStorage.removeItem(LocalStorageTokenKey)
                    setUser(null)
                    setToken("")
                } else {
                    // success login
                    setUser(res.data.data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setInitFetched(true)
            }
        }
        getUser()
    }, []
    )

    return (
        <div className='h-screen w-screen flex items-stretch flex-wrap'>
            <div className='m-8 flex-1'>
            {
                initFetched ?
                user != null ?
                <TodoList />
                :
                <LoginLanding />
                : <Landing />
            }
            </div>
        </div>
    )
}

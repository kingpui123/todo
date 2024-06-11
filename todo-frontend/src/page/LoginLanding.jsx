import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import LoginButton from "../component/LoginButton";
import axios from "../utils/axios"

export default (props) => {
    const { setUser, setToken } = useContext(UserContext)

    const onLoginSuccess = async (codeResponse) => {
        let authorizationCode = codeResponse.code;
        try {
            let res = await axios.post('/auth/login', {
                "AuthorizationCode": authorizationCode
            })

            let token = res.data.data.token
            let user = res.data.data.user
            setToken(token)
            setUser(user)
        } catch (error) {
            console.log(error)
        }
    }

    const onError = err => console.log(err)

    return (
       <div className="flex items-center h-full">
         <div className="border border-zinc drop-shadow-md p-8 rounded-lg self-center flex-1">
            <div className="">
                <img src="https://todo-asset.s3.ap-southeast-1.amazonaws.com/image/a_plain_logo.png" alt="logo" className="d-inline-block mx-auto w-32 h-32" />
                <h1 className="text-center text-3xl font-bold">Your Todo List App</h1>
                <h2 className="text-center text-xl font-semi-bold mt-4">Turn Plans into Action</h2>
            </div>
            <div className="mt-20">
                <div className="flex justify-center">
                    <LoginButton  onLoginSuccess={onLoginSuccess}  onError={onError} />
                </div>"
            </div>
        </div>
       </div>
    );
}
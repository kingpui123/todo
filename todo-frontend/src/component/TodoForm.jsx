import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Drawer from '@mui/joy/Drawer';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import AddIcon from '@mui/icons-material/Add'
import { FormLabel, Box, Select, Option, Input, Modal, ModalDialog, Stack, FormControl, Button } from "@mui/joy";
import { AllStatus, AllImportance, AllPriority } from "../const/const";
import Priority from "./Tab/Priority";
import Importance from "./Tab/Importance";
import axios from '../utils/axios'
import { Select as AntdSelect, DatePicker } from 'antd'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

const aiGenerateTodo = async (description) => {
    try {
        let res = await axios.post("/api/todo/generate/ai", {
            description
        })

        return res.data.data

    } catch (error) {
        console.log(error)
        return null
    }
}

export default (props) => {
    let { showForm, todoOnFocus, formAction, onSubmit, onClose, } = props
    const [todo, setTodo] = useState(todoOnFocus)
    const [openAIModal, setOpenAIModal] = useState(false)


    useEffect(() => {
        if (!showForm) {
            setTodo({})
        } else {
            setTodo(todoOnFocus)
        }
    }, [showForm])

    const updateTodoOnFocus = (key, value) => {
        setTodo({
            ...todo,
            [key]: value
        })
    }

    const getGeneratedTodo = async (description) => {
        try {
            let t = await aiGenerateTodo(description)
            if (t) {
                setOpenAIModal(false)
                setTodo(t)
            }
        } catch (error) {

        }
    }

    return (
        <Drawer
            anchor="right"
            size="lg"
            open={showForm}
            onClose={() => props.onClose()}
        >
            <ModalClose />
            <DialogTitle>
                {formAction == "edit" ? "Edit" : "Create a new"} Todo...
            </DialogTitle>
            <DialogContent>
                <div className="p-4">
                    {
                        showForm && (
                            <div>
                                <div className="mb-3">
                                    <FormLabel>Name</FormLabel>
                                    <TextField
                                        className="w-full"
                                        value={(todo || {}).name || ''}
                                        onChange={(e) => updateTodoOnFocus('name', e.target.value)}
                                    ></TextField>
                                </div>
                                <div className="mb-3">
                                    <FormLabel>Description</FormLabel>
                                    <TextField
                                        className="w-full"
                                        value={(todo || {}).description || ''}
                                        onChange={(e) => updateTodoOnFocus('description', e.target.value)}
                                    ></TextField>
                                </div>
                                <div className="mb-3">
                                    <FormLabel>Status</FormLabel>
                                    <Select value={(todo || {}).status || ''} onChange={(_, values) => updateTodoOnFocus('status', values)}>
                                        {
                                            AllStatus.map(s => (
                                                <Option key={s.value} value={s.value}>{s.label}</Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div className="mb-3">
                                    <FormLabel>Priority</FormLabel>
                                    <Select
                                        value={(todo || {}).priority || 1}
                                        onChange={(_, values) => updateTodoOnFocus('priority', values)}
                                        renderValue={(option) => {
                                            if (!option) {
                                                return null;
                                            }

                                            return (

                                                <Priority todo={{ priority: option.value }} />

                                            );
                                        }}
                                    >
                                        {
                                            AllPriority.map(s => (
                                                <Option key={s.value} value={s.value}>
                                                    <Priority todo={{ priority: s.value }} />
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div className="mb-3">
                                    <FormLabel>Importance</FormLabel>
                                    <Select
                                        value={(todo || {}).importance || -1}
                                        onChange={(_, values) => { updateTodoOnFocus('importance', values) }}
                                        renderValue={(option) => {
                                            if (!option) {
                                                return null;
                                            }

                                            return (
                                                <React.Fragment>
                                                    <Importance todo={{ importance: option.value }} />
                                                </React.Fragment>
                                            );
                                        }}
                                    >
                                        {
                                            AllImportance.map(s => (
                                                <Option key={s.value} value={s.value}>
                                                    <Importance todo={{ importance: s.value }} />
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </div>
                                <div className="mb-3">
                                    <FormLabel>Due Time</FormLabel>
                                    <DatePicker
                                        showTime
                                        getPopupContainer={(triggerNode) => {
                                            return triggerNode.parentNode;
                                          }}
                                        zIndexPopup={9999}
                                        value={dayjs.utc(todo.dueTime).local()}
                                        format={"YYYY-MM-DD HH:mm"}
                                        onChange={(_, dateString) => updateTodoOnFocus("dueTime", dateString)}
                                    />

                                </div>
                                <div className="mb-3">
                                    <FormLabel>Tags</FormLabel>
                                    <AntdSelect
                                        mode="tags"
                                        style={{
                                            width: '100%',
                                        }}
                                        value={todo.tags}
                                        placeholder=""
                                        onChange={(v) => updateTodoOnFocus('tags', v)}
                                        options={(todo.tags || []).map(t => ({ label: t, value: t }))}
                                        dropdownStyle={{ zIndex: 9999 }}
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
            </DialogContent>
            <Box
                className="flex justify-end gap-2 border-t-2 py-4 px-2"
            >
                {
                    formAction == "create" && (
                        <button className="transition-all text-white rounded py-2 px-3 hover:bg-blue-700 bg-blue-800" onClick={() => setOpenAIModal(true)}>Create with AI</button>
                    )
                }
                <button className="transition-all text-white rounded py-2 px-3 hover:bg-green-400 bg-green-500 " onClick={() => onSubmit(todo.id || -1, todo)}>Save</button>
                <button className="transition-all rounded border py-2 px-3 hover:bg-slate-100" onClick={() => onClose()}>Cancel</button>

            </Box>
            <Modal open={openAIModal} onClose={() => setOpenAIModal(false)}>
                <ModalDialog>
                    <DialogTitle>Create your todo with AI</DialogTitle>
                    <DialogContent>Fill in the description of what you are planning to do.</DialogContent>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            return getGeneratedTodo(event.target[0].value)
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <Input />
                            </FormControl>
                            <Button type="submit">Generate</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </Drawer>
    )
}
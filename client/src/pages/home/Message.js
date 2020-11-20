import React from 'react'
import { useAuthState } from '../../context/authContext'
import classNames from 'classnames'

export default function Message({ message }) {
    
    const { user } = useAuthState()

    const sent = message.from === user.username
    const recived = !sent


    return (
    <div className={classNames("d-flex my-3", { 'ml-auto': sent, 'mr-auto': recived })}>
        <div className={classNames("py-2 px-3 rounded-pill", { 'bg-primary': sent, 'bg-secondary': recived })}>
        <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
            </p>
        </div>
    </div>
    )
}

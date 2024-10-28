import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { MESSAGE_API_END_POINT } from '@/utils/constant';

const AllMessages = (token) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await axios.get(`${MESSAGE_API_END_POINT}/all-messages`,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true, // Ensure cookies are sent
                });
            setMessages(data.messages);
        };

        fetchMessages();
    }, []);

    return (
        <div>
            <Helmet>
        <title>Admin Messages | Manage All Platform Communications</title>
      </Helmet>
            <h1>All Messages</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message._id}>
                        <h3>{message.title}</h3>
                        <p>{message.message}</p>
                        <small>Sent by: {message.sender.fullname} at {new Date(message.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllMessages;

import React, { useEffect, useState } from 'react'
import axios from "axios";

const ChatPage = () => {
    const [data,setData]=useState([]);

    const fetchData= async()=>{
        const {data}= await axios.get("/api/chat");
        setData(data);
        console.log(data);
    }
    useEffect(()=>{
        fetchData();
    },[])
  return (
    <div>
     {data.map((chatdata)=>{
       return(
         <div key={chatdata._id}>
        {chatdata.chatName}
        </div>
       )
     })}
    </div>
  )
}

export default ChatPage

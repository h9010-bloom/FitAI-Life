import { useEffect, useState } from "react";
import axios from "axios";

const ChatHistoryManager = () => {
  const [chats,setChats]=useState([]);
  const [loading,setLoading]=useState(true);

  const fetchChats=async()=>{
    try{
      setLoading(true);
      const res=await axios.get("https://fitai-life-backend.onrender.com/api/chat/admin/history");
      setChats(res.data);
    }catch(err){
      console.error(err);
      alert("Unable to load AI chat history.");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{fetchChats();},[]);

  const deleteChat=async(id)=>{
    if(!window.confirm("Delete this chat?")) return;
    await axios.delete(`https://fitai-life-backend.onrender.com/api/chat/admin/history/${id}`);
    fetchChats();
  };

  const deleteAllChats=async()=>{
    if(!window.confirm("Delete ALL chat history?")) return;
    await axios.delete("https://fitai-life-backend.onrender.com/api/chat/admin/history");
    fetchChats();
  };

  return (
    <div className="content-card">
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
        <h2>💬 AI Chat History</h2>
        <button className="delete-btn" onClick={deleteAllChats}>Delete All</button>
      </div>

      {loading ? <h3>Loading...</h3> :
      chats.length===0 ? <h3>No AI chat history found.</h3> :
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Question</th>
            <th>AI Response</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {chats.map(chat=>(
            <tr key={chat._id}>
              <td>{chat.user?.name||"-"}</td>
              <td>{chat.user?.email||"-"}</td>
              <td>{chat.prompt}</td>
              <td>{chat.response}</td>
              <td>{new Date(chat.createdAt).toLocaleString()}</td>
              <td><button className="delete-btn" onClick={()=>deleteChat(chat._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default ChatHistoryManager;

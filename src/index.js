import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals"

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "./images/avatar1.png",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "./images/avatar2.png",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "./images/avatar3.png",
    balance: 0,
  },
];

function App(){
  const [friend,setfriend]=useState(initialFriends);
  const[show,setshow]=useState(false);
  const [selectedfriend,setselectedfriend]=useState(null);
  function hundleaddfriend(){
    setshow((show)=>!show)
  }
  function addFriend(friend){
    setfriend((friends)=>[...friends,friend]);       
    setshow(false);
  }
function hundleselectedfriend(friend){
setselectedfriend((current)=>(current?.id===friend.id?null:friend));
setshow(false);
}
function handleSplitBill(value) {
  setfriend((friends) =>
    friends.map((friend) =>
      friend.id === selectedfriend.id
        ? { ...friend, balance: friend.balance + value }
        : friend
    )
  );
  setselectedfriend(null)
}
return(
<div className="app">
  <div className="sidebar">
    <FriendsList onslection={hundleselectedfriend}
     selectedfriend={selectedfriend} friends={friend}/>
    {show && <AddFriendToList onaddFriend={addFriend}/>}
      <Button onClick={hundleaddfriend}>
        {show ? "Close" : "Add friend"}
      </Button>
  </div>
  {selectedfriend &&<SpliBill 
  selectedfriend={selectedfriend}
   key={selectedfriend.id} 
   onsplitbill={handleSplitBill}/>}
</div>
)
}

function Button({children,onClick}){
  return(
    <button className="button" onClick={onClick}>{children}</button>
  )
}

  function FriendsList({onslection,selectedfriend,friends}) {
    // const friends = initialFriends;
    return (
      <ul>
        {friends.map((friend) => (
          <Friend key={friend.id} friend={friend}  onslection={onslection}
           setselectedfriend={selectedfriend}/> 
        ))}
      </ul>
    );
  }
  
function Friend({friend,onslection,setselectedfriend}){
  const iselected=setselectedfriend?.id===friend.id;  
  // console.log(selectedfriend);
  
  return (
  <li className={iselected ? "selected" : ""}>
  <img src={friend.image} alt={friend.name}/>
  <h3>{friend.name}</h3>

    {friend.balance < 0 && (
      <p className="red">
        You owe {friend.name} {Math.abs(friend.balance)}$
      </p>
    )}
    {friend.balance > 0 && (
      <p className="green">
        {friend.name} owes you {Math.abs(friend.balance)}$
      </p>
    )}
    {friend.balance === 0 && <p>You and {friend.name} are even</p>}
  <Button onClick={()=>onslection(friend)}>{iselected ? "close" : "select"}</Button>
</li>
  )
}

function AddFriendToList({onaddFriend}){
  const [name,setname]=useState("");
  const [image,setimage]=useState("https://i.pravatar.cc/48");
  function hundlesubmit(e){
    e.preventDefault();
    if(!name || !image) return;
    const id=crypto.randomUUID();
    const newfriend={
      id,
      name,
      image:`${image}?=${id}`,
      balance:0,
    };
    onaddFriend(newfriend);
    setname("");
    setimage("https://i.pravatar.cc/48");
  }
  return <form className="form-add-friend" onSubmit={hundlesubmit}>
     <label>👫 Friend name</label>
      <input
       type="text" value={name} onChange={(e)=>setname(e.target.value)}
      />
       <label>🌄 Image URL</label>
      <input
         type="text" value={image} onChange={(e)=>setimage(e.target.value)}
      />
      <Button>Add</Button>
  </form>
}

function SpliBill({selectedfriend,onsplitbill}){
  const [Bill,setBill]=useState("");
  const [paidByUser,setPaidByUser]=useState("");
  const [whoIsPaying,setWhoIsPaying]=useState("user");
  const paidByFriend=Bill?Bill-paidByUser:"";
  function handleSubmit(e){
    e.preventDefault();
    if (!Bill || !paidByUser) return;
    onsplitbill(whoIsPaying==="user" ?paidByFriend:-paidByUser)
  }
  return(
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedfriend.name}</h2>
      <label>💰Bill value</label>
      <input type="text" value={Bill} onChange={(e)=>setBill(Number(e.target.value))}/>
      <label>🧍‍♀️ Your expense</label>
      <input type="text" value={paidByUser} onChange={(e)=>setPaidByUser(Number(e.target.value)>Bill?paidByUser:Number(e.target.value))}/>
      <label>👫 {selectedfriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}/>
      <label>🤑Who is paying the bill</label>
      <select
      value={whoIsPaying}
      onChange={(e) => setWhoIsPaying(e.target.value)} 
      >
        <option value="user">You</option>
        <option value="friend">{selectedfriend.name}</option>
      </select>
      <Button>Split bill Now</Button>
    </form>
  )
}
const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


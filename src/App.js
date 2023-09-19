import { useState } from 'react';
import './index.css';
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button ({children ,onClick}) {
  return (
    <button className='button' onClick={onClick}>{children}</button>
  )
}

export default function App() {

  
  const [friends, setFriends] =useState(initialFriends) //! the state that's responsible for all the users 
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectFriends, setSelectFriends] = useState(null)

  function handelSelectFriend (friend){
    // setSelectFriends(friend)
    setSelectFriends((cur) => (cur?.id === friend.id  ? null : friend)) //? we used (?.) cus we don't now if the user will use it or not
    // ? (?.) : this object is not Exist yet so is it Existed ably the remain code (optional chaining)
  }
  //*handel Deleting only the friend with 0 balance in the App
  function handelDelete(id){
    setFriends((friends) => friends.filter((friends)=> friends.id !== id))
  }
  
  //*handel Adding any friend in the App
  function handelAddFriend(friend){
    setFriends((friends)=> [...friends, friend]); //Add the newFriends/friend in the end of the main friends Array
    
    setShowAddFriend(false);  // after the user Add the newFriends close the ShowAddFriends Form
  }
  

  //* handle add Show friend form submit event
  function handleShowAddFriend(){
    setShowAddFriend(!showAddFriend)
  }

  // * handel Split Bill from FormSplitBill component
  function handleSplitBill(value){
    // console.log(value)


    setFriends((friends)=> friends.map((friend) => friend.id === selectFriends.id ? {...friend , balance: friend.balance + value }: friend))

    setSelectFriends(null)

  }


  return (
    <div className="app">
      <div className="sidebar">
      <FriendsList 
      friends={friends}
      selectFriends={selectFriends}
      onSelectFriend= {handelSelectFriend}
      onDelete={handelDelete}
      
      />

      { showAddFriend && <FormAddFriend onAddFriends={handelAddFriend}/>}

      <Button onClick={handleShowAddFriend}>
        {showAddFriend ? "Close" :" Add Friend"}</Button>
      </div>

      
    {selectFriends &&  <FormSplitBill 
    selectFriends={selectFriends} 
    onSplitBill={handleSplitBill}
    key={selectFriends.id}
    onDelete={handelDelete}
    />}
    </div>
  );
};

function FriendsList({friends ,selectFriends ,onSelectFriend ,onDelete}) {
  // const friends = initialFriends
  return (
    <ul>
      {friends.map((friend)=> 
      (
        <Friend
        friend={friend}
        key={friend.id}
        selectFriends={selectFriends}
        onSelectFriend={onSelectFriend}
        onDelete={onDelete}
        />
      ))}
      
  
    </ul>
  )
}
function Friend({friend ,selectFriends, onSelectFriend ,onDelete}) {

  const isSelected = selectFriends?.id === friend.id


  return (
  <li className={isSelected ? 'selected' : ''}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>

    {friend.balance < 0 && (<p className='red'>You Owe {friend.name} {Math.abs(friend.balance)}</p>)}
    {/* Math.abs :to view the number without (-)  */}

    {friend.balance > 0 && (<p className='green'>Your friend  {friend.name} Owes you {Math.abs(friend.balance)}</p>)}

    {friend.balance === 0 && (<p className='green'>you and {friend.name} are even</p>)}

    <Button onClick={()=> onSelectFriend(friend)}>{isSelected ? 'Close': 'Select'}</Button>
    {friend.balance=== 0 &&(

      <Button onClick={()=> onDelete(friend.id)}>Delete</Button>
    )

    }
    </li>
    
  )
}

function FormAddFriend({onAddFriends}) {

  const [name , setName] = useState('')

  const [image , setImage] = useState("https://i.pravatar.cc/48")


  function handelSubmit(e){
    e.preventDefault(); //to not reload the page
    

    if(!name || !image) return; //to brevet the user from making an empty newFriend

    const id = crypto.randomUUID() 
  // to have a generated random id

    const newFriend ={ 
      id , 
      name,
      image:`${image}?= ${id}` ,//to have a random image to every newFriend with the help of the url in the image state
      balance: 0,
      
    }
    onAddFriends( newFriend) ;//to show the newFriend on the bored after submitting

    //after the user het submit set the fields to there old state:

    setName('')
    setImage('https://i.pravatar.cc/48')
  }


  return (
    <form className='form-add-friend' onSubmit={handelSubmit}>
      <label>👩🏻‍🤝‍👩🏻 Friend name</label>
      <input type="text" value={name} onChange={((e)=> setName (e.target.value))}/>
      
      <label>📷 Image Url</label>
      <input type="text" value={image} onChange={((e)=> setImage(e.target.value))}/>

      <Button>Add</Button>

    </form>
  )
}

function FormSplitBill ({selectFriends, onSplitBill }) {

  const [bill , setBill] = useState('')
  const [payedByUser , setPayedByUser] = useState('')
  const friendExpense = bill? bill - payedByUser : ""

  const [whoIsPaying , setWhoIsPaying] = useState("user")



  function handelSubmit(e){
    e.preventDefault();

    if(!bill || !payedByUser) return;
    onSplitBill(whoIsPaying === "user" ? friendExpense : -payedByUser)


  }

  return (

    <form className='form-split-bill' onSubmit={handelSubmit}>
      <h2>Split a bill with {selectFriends.name}</h2>

<label>💰 Bill value </label>
<input type="text"
value={bill} 
onChange={((e)=>setBill(Number(e.target.value)))} />


<label>💁‍♀️ Your expense </label>
<input type="text" 
value={payedByUser} 
onChange={(e)=>
  setPayedByUser(
    Number(e.target.value) > bill ? payedByUser : 
    Number(e.target.value))} 
    //?  if the bill value payedByUser don't lit the user writ any of it > 
/>

<label>👩🏻‍🤝‍👩🏻 {selectFriends.name}'s expense </label>
<input type="text" disabled value={friendExpense} /> {/*//*disabled : used so the user can't write in it */}

<label>🤑 who is paying the bill </label>

<select 
value={whoIsPaying} 
onChange={(e)=>(setWhoIsPaying(e.target.value))}>

    <option value="user">You</option>

    <option value="friend">{selectFriends.name} </option>

</select>


<Button>Split bill</Button>
      
    </form>
  )
}










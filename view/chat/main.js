const myForm = document.querySelector('#my-form');
const messageInput=document.querySelector('#message');
const msg_send=document.querySelector('#user-send')
const chats=document.querySelector('.chats')
const users_list=document.querySelector('.users-list')
const groups_list=document.querySelector('.groups-list')
const users_count=document.querySelector('.users-count')
const grp_usr_add_name=document.querySelector('#grpusrname')
const creategroup=document.querySelector('#creatgrp')
const grpname=document.querySelector('#groupname')
const grp_add_groupName=document.querySelector('#groupName')
const user_group_list=document.querySelector('#users-group-list')

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  localStorage.setItem("groupid", 0)
});

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function sendmsz(e){
  e.preventDefault();
  var message=messageInput.value

  let obj={
      message
  };
  console.log(message);
  const token  = localStorage.getItem('token')
  console.log(">>>>>>>>>",token);
  const decodeToken = parseJwt(token)
  console.log(">>>>>>>>>", decodeToken);
  const uid=decodeToken.userId;
  console.log(obj);
  const groupid = localStorage.getItem("groupid") ? localStorage.getItem("groupid") : 0;
  console.log("send msg gid>>>>>>",groupid);
  
  console.log("send msg token ",token)
  axios.post(`http://localhost:5000/message/sendmsg/${groupid}`,obj,  { headers: {"Authorization" : token} })
  .then((response)=>{
    console.log("send response>>>>>>>", response)
    if(uid==response.data.newUserDetail.userId){
      showNewMessageOnScreen(response.data.newUserDetail,'outgoing');
    }
    else{
      showNewMessageOnScreen(response.data.newUserDetail,'incoming');
    } 
  })
  .catch((err)=>{
    document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
    console.log(err);
  })
  messageInput.value=""
}

var groupid = localStorage.getItem("groupid") ? localStorage.getItem("groupid") : 0;
if (groupid <= 0) {
  window.addEventListener("DOMContentLoaded", getmessage)
} else {
    window.addEventListener("DOMContentLoaded", opengroupchat(groupid))
}




async function getmessage(){
  
    const token  = localStorage.getItem('token')
    const decodeToken = parseJwt(token)
    console.log("decode token>>>>>>>>>>",decodeToken.userId)
    const uid=decodeToken.userId;
    chats.innerHTML=""
    showAlltheUsers()
    axios.get("http://localhost:5000/message/getmessages", { headers: {"Authorization" : token} })
    .then((response)=>{
      console.log("all the data",response.data);
      
      
      for(var i=0;i<response.data.allMessages.length;i++){
        if(uid==response.data.allMessages[i].userId){
          showNewMessageOnScreen(response.data.allMessages[i],'outgoing');
        }
        else{
          showNewMessageOnScreen(response.data.allMessages[i],'incoming');
        }
        
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  
  }
  
  
  function showNewMessageOnScreen(user,status){
    let div=document.createElement('div');
    div.classList.add('message',status)
    let content=`<h5> ${user.Username}</h5>
                    <p>${user.message}</p>`
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
  }
  



async function showAlltheUsers(){
    users_list.innerHTML=""
    
    const token  = localStorage.getItem('token')
    axios.get("http://localhost:5000/message/getusers", { headers: {"Authorization" : token} })
    .then((response)=>{
      
      console.log(response.data.allUsers.length);
      for(var i=0;i<response.data.allUsers.length;i++){
        let p=document.createElement('p')
        p.innerText=response.data.allUsers[i].name
        users_list.appendChild(p)
      }
      users_count.innerHTML=response.data.allUsers.length
    })
    .catch((err)=>{
      console.log(err);
    })
  }



function myFunction(){
  var groupname=grpname.value

    let obj={
      groupname
    };
    console.log(groupname);
    console.log(obj);
    const token  = localStorage.getItem('token')
    axios.post("http://localhost:5000/group/creategroup",obj,  { headers: {"Authorization" : token} })
    .then((response)=>{
      console.log("this is response>>>>>>>>",response)
      console.log("this is groupid>>>>>",response)
      let p=document.createElement('p')
        p.innerText=response.data.allGroups[i].groupname
        groups_list.appendChild(p)
 
    })
    .catch((err)=>{
      document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
      console.log(err);
    })
}


window.addEventListener("DOMContentLoaded", () =>{
  const token  = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  console.log("decode token<<<<<<<<<<.",decodeToken.userId)
  const uid=decodeToken.userId;
  axios.get("http://localhost:5000/group/getgroups", { headers: {"Authorization" : token} })
  .then((response)=>{
    console.log("all the group data",response);
    
    for(var i=0;i<response.data.allGroups.length;i++){
    
      const parentNode=document.getElementById('groups-list');
      const childHTML = `<p class="group-det">${response.data.allGroups[i].groupName} 
      
      <a href="#" onclick="openForm(); getgroupusr(${response.data.allGroups[i].groupId})"  class="button"><i class="fas fa-users" id="group-users"></i></a>
      <a href="#"  class="button" onclick="opengroupchat(${response.data.allGroups[i].groupId})"><i class="fa fa-comment" aria-hidden="true" id="group-messages"></i></a>
      <a href="#" onclick="exit() " id="exit"  class="button"><i class="fa fa-arrow-left" aria-hidden="true"></i></a>
      <a href="#"  class="button" id="exitgroup" onclick="deletegroup(${response.data.allGroups[i].groupId})"> <i class="fa fa-minus" aria-hidden="true"></i></a></p>
                        `
      parentNode.innerHTML=parentNode.innerHTML+childHTML;
    }
  })

  .catch((err)=>{
    console.log(err);
  })


})


     


function getgroupusr(groupId){
  
  user_group_list.innerHTML=""
  const token  = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  console.log("decode token>>>>>>>>>>>>grp",decodeToken.userId)
  const uid=decodeToken.userId;
  axios.get(`http://localhost:5000/group/getgroupusers/${groupId}`, { headers: {"Authorization" : token} })
  .then((response)=>{
    console.log("all the group user",response.data.allgrpusr);
    
    
    for(var i=0;i<response.data.allgrpusr.length;i++){
      if(uid==response.data.allgrpusr[i].userId && response.data.allgrpusr[i].is_admin==true){
        const parentNode=document.getElementById('users-group-list');
        const childHTML = 
        `<p>${response.data.allgrpusr[i].userName} <a href="#"  class="button" onclick="openadduserform()"><i class="fa fa-plus" aria-hidden="true"></i></a>
        <a href="#"  class="button" onclick="deleteuser(${response.data.allgrpusr[i].groupId},${response.data.allgrpusr[i].userId})"><i class="fa fa-minus" aria-hidden="true"></i></a>
        </p>`
        parentNode.innerHTML=parentNode.innerHTML+childHTML;
      }
      else if(uid==response.data.allgrpusr[i].userId){
        const parentNode=document.getElementById('users-group-list');
        const childHTML = 
        `<p>${response.data.allgrpusr[i].userName}
        <a href="#"  class="button" onclick="deleteuser(${response.data.allgrpusr[i].groupId},${response.data.allgrpusr[i].userId})"><i class="fa fa-minus" aria-hidden="true"></i></a>
        </p>`
        parentNode.innerHTML=parentNode.innerHTML+childHTML;
      }
      else{
        const parentNode=document.getElementById('users-group-list');
        const childHTML = 
        `<p>${response.data.allgrpusr[i].userName}
        <a href="#"  class="button" onclick="deleteuser(${response.data.allgrpusr[i].groupId},${response.data.allgrpusr[i].userId})"><i class="fa fa-minus" aria-hidden="true"></i></a></p>
        </p>`
        parentNode.innerHTML=parentNode.innerHTML+childHTML;
      }
      
    }
  })
  .catch((err)=>{
    console.log(err);
  })
}



function addusrtogrp() {
  var radios = document.getElementsByName("is_admin");
    var selected = Array.from(radios).find(radio => radio.checked);
    console.log("radio value",selected.value)

    var is_admin=selected.value
    var usrname=grp_usr_add_name.value
    console.log("grp_usr_add_name",grp_usr_add_name.value)
    console.log("grp_add_groupName",grp_add_groupName.value)
    var groupName=grp_add_groupName.value
    let obj={
      usrname,
      is_admin,
      groupName
    }
    const token  = localStorage.getItem('token')
    axios.post(`http://localhost:5000/group/addusertogroup`,obj,  { headers: {"Authorization" : token} })
    .then((response)=>{
      console.log("add user data",response)
        
    })
    .catch((err)=>{
      document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
      console.log(err);
    })
}


function deleteuser(groupId,userId){
  console.log(groupId,userId);
  const token  = localStorage.getItem('token')
  axios.delete(`http://localhost:5000/group/deleteuser/${groupId}/${userId}`,  { headers: {"Authorization" : token} })
    .then((response)=>{
      if(response.status==201){
        alert("user successfully deleted")
      }
      console.log(response.status)
      if(response.status==200){
          alert("you are not admin of this group")
      }
       console.log("delete response>>>>>>>>>>",response) 
    })
    .catch((err)=>{
      document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
      console.log(err);
    })
}

function deletegroup(groupId){
  console.log("delete group id",groupId)
  const token  = localStorage.getItem('token')
  axios.delete(`http://localhost:5000/group/deletegroup/${groupId}`,  { headers: {"Authorization" : token} })
    .then((response)=>{
      if(response.status==201){
        alert("group successfully deleted")
      }
      console.log(response.status)
      if(response.status==200){
          alert("you are not owner of this group")
      }
       console.log(">>>>>>>>delete group response",response) 
    })
    .catch((err)=>{
      document.body.innerHTML=document.body.innerHTML+"<h4>Something went wrong</h4>"
      console.log(err);
    })
}

function opengroupchat(groupid){
  var message=messageInput.value
  chats.innerHTML=""
  showAlltheUsers()
    let obj={
        message
    };
    console.log(message);
    console.log(obj);
    console.log("get group id in group chat",groupid)
    const token  = localStorage.getItem('token')
    localStorage.setItem("groupid", groupid)
    const decodeToken = parseJwt(token)
    console.log(">>>>>>>>>decode token",decodeToken.userId)
    const uid=decodeToken.userId;
    axios.get(`http://localhost:5000/message/getgroupmessages/${groupid}`, { headers: {"Authorization" : token} })
    .then((response)=>{
      console.log("all the group message data",response.data.message);

      
      for(var i=0;i<response.data.message.length;i++){
        if(uid==response.data.message[i].userId){
          showNewMessageOnScreen(response.data.message[i],'outgoing');
        }
        else{
          showNewMessageOnScreen(response.data.message[i],'incoming');
        }
        
      }
    })
    .catch((err)=>{
      console.log(err);
    })
}


function exit() {
  if(localStorage.getItem("groupid")!=0){
  localStorage.setItem("groupid", 0)
  getmessage()
  }
}

function logout(){
  localStorage.setItem("groupid", 0)
}

async function sendFile(e){
  e.preventDefault()
  const groupid=localStorage.getItem("groupid")
  const file=document.getElementById('file').value
  let obj={
    file,
    groupid
}
  // const fileData=file.files[0];
  const token  = localStorage.getItem('token')
  console.log(file)
  // const formData=new FormData();
  // formData.append('file',fileData);
  // console.log(fileData);

  const response=await axios.post(`http://localhost:5000/media/sendmedia/${groupid}`,obj,{ headers: {"Authorization" : token} })
  console.log(response)
}
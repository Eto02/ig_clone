import { useEffect, useState } from 'react';
import './App.css';
import db, { auth } from './firebase';
import Post from './Post';
import Modal from '@material-ui/core/Modal';
import { Button, makeStyles,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';



function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([])
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [opnePost, setOpenPost] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
  const unsubscribe= auth.onAuthStateChanged(authUser=>{
     if(authUser){
      if(authUser.displayName){
        setUsername(authUser.displayName)
      }else{
        return authUser.updateProfile({
          displayName:username
        })
      }
      setUser(authUser)
     }else{
      
     }
   })
   return()=>{
    unsubscribe()
   }
  }, [user,username])
  console.log(username)
  useEffect(() => {
   db.collection('posts').orderBy('timestamp','desc').onSnapshot(snap=>{
    setPosts(snap.docs.map(doc=>(
      {
        id:doc.id,
        post:doc.data()
        
      }
    )))
   })
  }, [])

  
  const signUp =(event)=>{
    event.preventDefault()
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      setUser(authUser.user)
     return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((err)=>alert(err.message))
    setOpen(false)
  }
  
  const signIn=(event)=>{
    event.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((err)=>alert(err.message))
    setOpenSignIn(false)
  }
  const signOut=()=>{
    auth.signOut()
    setUser(null)
  }
  const handleModal=(bool)=>{
    setOpenPost(false)
  }

  return (
    <div className="app">

    

        <Modal
        open={open}
        onClose={()=>setOpen(false)}
        >
          <div style={modalStyle} className={classes.paper}>
          <form className="app__singup">
            <center>
              <img 
                className='app_headerImage'
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
            </center>   
                <Input
                  placeholder='username'
                  type='text'
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                />
                  
                  <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
                  
                  <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
            <Button type='submit' onClick={signUp}>Sing Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        >
          <div style={modalStyle} className={classes.paper}>
          <form className="app__singup">
            <center>
              <img 
                className='app_headerImage'
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
            </center>   
                  <Input
                  placeholder='email'
                  type='text'
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                 />
                  <Input
                  placeholder='password'
                  type='password'
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
            <Button type='submit' onClick={signIn}>Sing In</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={opnePost}
        onClose={()=>setOpenPost(false)}
        >
          <div style={modalStyle} className={classes.paper}>
          {
            user?(
            <ImageUpload
            closeModal={handleModal}
            username={username}
            />):null
          }
        </div>
      </Modal>
      <div className='app__header'>
      <img 
      className='app_headerImage'
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Instagram" />
      {
        user?(
          <Button onClick={signOut}>Logout</Button>
        ):(
          <div className="app_loginContainer">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In </Button>
             <Button onClick={()=>setOpen(true)}>Sign Up </Button>
          </div>
         
        )
      }
      </div>
     
      <div className="app_posts">
     {
       user?(   <div className="app__postReel">
       <Button onClick={()=>setOpenPost(true)}>POST</Button>
     </div>):null
     }
      {
        posts.map(({id,post})=>(
          <Post
            key={id}
            postId={id}
            user={username}
            username={post.username}
            caption={post.caption}
            imgUrl={post.imgUrl}
          />
        ))
      }
      </div>
      
     
     
       
     
      
    </div>
  );
}

export default App;

import { Avatar, IconButton } from '@material-ui/core'
import React from 'react'
import { useEffect,useState } from 'react'
import db from './firebase'
import './Post.css'
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import './imageUpload.css'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeOutlinedIcon from '@material-ui/icons/NearMeOutlined';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css



function Post({postId, user, username, caption, imgUrl}) {
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState([])
    const [isLike, setIsLike] = useState(false)
    const [isPost, setIsPost] = useState(false)
    const [idLike, setIdLike] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        let unsubscribe2;
        if(postId){
            unsubscribe= db.collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp')
            .onSnapshot(snap=>{
                setComments(snap.docs.map(doc=>doc.data()))
                snap.docs.map(doc=>{
                    if(doc.data().username==user){
                        setIsPost(true)
                       
                    }
                })
            })
            unsubscribe2= db.collection('posts')
            .doc(postId)
            .collection('likes')
            .onSnapshot(snap=>{
                setLikes(snap.docs.map(doc=>doc.length))
                snap.docs.map(doc=>{
                    console.log('db',doc.data().username)
                    console.log('user',user)
                    if(doc.data().username==user){
                        setIsLike(true)
                        setIdLike(doc.id)
                       
                    }
                })
            })
        }
        return ()=>{
            unsubscribe()
            unsubscribe2()
        }
      
    }, [postId,idLike])
    const postComment=(e)=>{
        e.preventDefault()
         db.collection('posts')
        .doc(postId)
        .collection('comments').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            text:comment,
            username:user
        })
        setComment('')
    }
    const handleLike=()=>{
        if(isLike){
            db.collection('posts')
            .doc(postId)
            .collection('likes').doc(idLike).delete().then(res=>{
                setIsLike(false)
                setIdLike(null)
            }).catch(err=>{
                alert(err)
            }
            )
         
        }else{
            db.collection('posts')
            .doc(postId)
            .collection('likes').add({
                username:user
            })
        }
    
    }
    const confirmDelete=(id)=>{
        confirmAlert({
            title: 'Hapus Post',
            message: 'Apakah anda yakin?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    db.collection('posts')
                    .doc(postId).delete().then(res=>{
                        setIsLike(false)
                        setIdLike(null)
                    }).catch(err=>{
                        alert(err)
                    }
                    )
                }
              },
              {
                label: 'No',
                onClick: () => alert('Click No')
              }
            ]
          });
    }

    return (
        <div className='post'>
            <div className="post__header">
                <div className="post__left">
                <Avatar 
                className='post__avatar'
                alt='Tahta'
                src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
                />
                <h3>{username}</h3> 
                </div>
                <div className="post__right">
                {
                    username==user?(
                        <IconButton onClick={confirmDelete}>
                            <DeleteOutlineIcon/>
                        </IconButton>
                    ):null
                }
                </div>
              
                
            </div>
            <img className='post__image' src={imgUrl} alt="" />
            <div className="post__action">
               
                 <IconButton disabled={!user} onClick={handleLike}>
                        {
                            isLike?( <FavoriteOutlinedIcon className='post__liked'/>):( <FavoriteBorderIcon/>)
                        }   
                 </IconButton>
                 <ChatBubbleOutlineIcon/>
                 <NearMeOutlinedIcon/>
            </div>
            <p className='post__likes'><strong>{likes?.length?likes.length+' suka':null}</strong> </p>
            <h4 className='post__text'>
                <strong>{username}</strong> {caption}
            </h4>
            <p className='post__komentar'>komentar...</p>
            <div className="post__comment">
                {
                    comments.map((comm)=>(
                        <p>
                            <b>{comm.username}</b> {comm.text}
                        </p>
                    ))
                }
            </div>
            
            <form action="" className='post__commentBox'>
                <input 
                className='post__input'
                type="text"
                placeholder="Tambahkan komentar"
                value={comment}
                onChange={(e)=>setComment(e.target.value)} />
                <button
                className='post__button'
                disabled={!user}
                type='submit'
                onClick={postComment}
                >
                    Post
                </button>
            </form>
        </div>
    )
}

export default Post

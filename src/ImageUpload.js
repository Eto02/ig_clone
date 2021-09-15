import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import db, { storage } from './firebase'
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import './imageUpload.css'
function ImageUpload({username,closeModal}) {
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState('')
    const [progress, setProgress] = useState('')
    const [caption, setCaption] = useState('')
    const handleChange =(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload=(e)=>{
        e.preventDefault()
        const uploadTask= storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snap)=>{
                const progres =Math.round(
                    (snap.bytesTransferred/snap.totalBytes)*100
                )
                setProgress(progres)
            },
            (err)=>{
                //erro func
                console.log(err)
                alert(err.message)
            },
            ()=>{
                storage.ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection('posts').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imgUrl:url,
                        username:username
                    })
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
        closeModal(true)
    }
    return (
        <div className='imageUpload'>
            <progress className='imageUpload__progress' value={progress} max="100"/>
            <br />
            <Input type="text" placeholder='Enter a caption' onChange={event=>setCaption(event.target.value)} value={caption} required/>
            <br />
            <input className="imageUpload__file" type="file" name=""onChange={handleChange} required/>
            <br />
            <button className='imageUpload__button' onClick={handleUpload}>Upload</button>
        </div>
    )
}

export default ImageUpload

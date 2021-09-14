import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import db, { storage } from './firebase'
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

function ImageUpload({username}) {
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
                const progress =Math.round(
                    (snap.bytesTranferred/snap.totalBytes)*100
                )
                setProgress(progress)
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
    }
    return (
        <div>
            <input type="text" placeholder='Enter a caption' onChange={event=>setCaption(event.target.value)} value={caption} />
            <input type="file" name=""onChange={handleChange} />
            <Button  onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload

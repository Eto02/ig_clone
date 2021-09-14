import { Button } from '@material-ui/core'
import React, { useState } from 'react'

function ImageUpload() {
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

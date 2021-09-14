import { Avatar } from '@material-ui/core'
import React from 'react'
import './Post.css'
function Post({username, caption, imgUrl}) {
    return (
        <div className='post'>
            <div className="post__header">
                <Avatar 
                className='post__avatar'
                alt='Tahta'
                src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
                />
                <h3>{username}</h3>
            </div>
            <img className='post__image' src={imgUrl} alt="" />
            
            <h4 className='post__text'>
                <strong>{username}</strong>  :{caption}
            </h4>
        </div>
    )
}

export default Post

import React, { useEffect, useState } from 'react'
import { getSession } from '../common/session'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'


const blogAffichage = ({blog,islike,setCommentWrapper,commentWrapper}) => {
  let user= getSession('user')
   user= JSON.parse(user)
   console.log(islike, "islike")
   const [like, setLike] = useState(islike)

   useEffect(() => {
    setLike(islike)
   }, [islike])
   const navigate=useNavigate()
   
 const handlLike=async()=>{
    console.log(like, "like")
    setLike(like=>!like)
 
    ! like ? blog.activity.total_likes-- : blog.activity.total_likes++
   
    try {
         const res=  await axios.post('http://localhost:3000/api/likeArticle', {id_blog:blog._id,isLike:like}, {headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  
    } catch (error) {
      if(error.response.status === 403 || error.response.status === 401){
        return toast.error('please login to like')
      }
      console.log(error)
    }
 }
  const deleteArticle=async()=>{
    alert('Are you sure you want to delete this article?')
    try {
      const res= await axios.post('http://localhost:3000/api/deleteArticle', {id_blog:blog._id}, {headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    console.log(res.data, "res")
   navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
    <hr className="border-grey my-2"/>
    <div className= "flex gap-6 justify-between">
      <div className='flex gap-3 items-center'>
       
        <button className={' w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 ' + (!like ? 'bg-red/20 text-red' : 'bg-grey/80') } onClick={handlLike}>
        <i className='fi fi-rr-heart'></i>
        </button>
        <p className='text-xl text-dark-grey'>{blog.activity.total_likes}</p>
       
       
        <button className=' w-10 h-10 rounded-full flex items-center justify-center bg-grey/80' onClick={()=>{setCommentWrapper(!commentWrapper)}}>
        <i className='fi fi-rr-comment-dots'></i>
        </button>
        <p className='text-xl text-dark-grey'>{blog.activity.total_comments}</p>
        
      </div>

        <div className='flex gap-3 items-center'>
          {
            blog.author._id === user?.id ?
            <>
            <Link to={`/editor/${blog._id}`}>Edit</Link>
            <button onClick={deleteArticle} className='text-red'>delete</button>
            </>
            
            : ""
          
          }
          {/* <Link to={`/editor/${blog._id}`} className='underline '>Edit</Link>  */}
        </div>
    </div>
    <hr className="border-grey my-2"/>
    </>
  )
}

export default blogAffichage
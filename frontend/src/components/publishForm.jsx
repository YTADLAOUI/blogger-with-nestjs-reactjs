import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editBlog, setEditorState } from '../features/editSlice'
import Tag from './tags'
import toast from 'react-hot-toast'
import axios from 'axios'
import banners from '../assets/blogbanner.png'
const publishForm = ({id}) => {
  const dispatch=useDispatch()
  const blog=useSelector(state=>state.blog.value)
const {title,banner,content,tags,des,author}=blog
const charachterLimit= 200
const tagLimit=9
  const handleCloseEvent=()=>{
    dispatch(setEditorState('editor'))
  }
  const User=JSON.parse(localStorage.getItem('user'))
  const handelBlogTitleChange=(e)=>{
    let input=e.target;
    dispatch(editBlog({...blog,title:input.value}))
  }
  const handleBlogDes =(e)=>{
   let input= e.target
   console.log(des)
   dispatch(editBlog({...blog,des:input.value}))
  }
  const handelKeyDown=(e)=>{
      // e.preventDefault();
      if(e.keyCode==13 || e.keyCode==188){
        e.preventDefault();
        
        let tag=e.target.value
        console.log(tags)
        if(tags.length<tagLimit){
          console.log(tag,'g')
              if(!tags.includes(tag)&&tag.length){
                dispatch(editBlog({...blog,tags:[...tags,tag]}))
              }
            }else{
              toast.error(`you can max add ${tagLimit} tagas`)
            }
            e.target.value=""
      }
  }
 const updatData=async()=>{
    try {
      if(!des){ 
        return  toast.error('please add description')
       }
       if(!tags.length){
        return  toast.error('please add tags')
       }
       if(!banner){
        return toast.error('please add banner')
       }
         
 
     const loadingToastId = toast.loading('Update article...', { autoClose: false });

      const  response =await axios.patch('http://localhost:3000/api/updateArticle',{_id:id,...blog},{
        headers:{
          'Content-Type': 'application/json',
          'withCredentials': true,
        }
      })
      console.log(response.data, "response")
      dispatch(editBlog({title:'',des:'',tags:[],banner:'',content:[]}))

    }catch (error) {
      console.log(error)
    }
  }
  const storeData=async()=>{
    let loadingToastId 
    try {
      if(!title){
      return  toast.error('please add title')
        
      }
      if(!des){ 
       return  toast.error('please add description')
      }
      if(!tags.length){
       return  toast.error('please add tags')
      }
      if(!banner){
       return toast.error('please add banner')
      }
        

     loadingToastId = toast.loading('save article...', { autoClose: false });
    const  response =await axios.post('http://localhost:3000/api/saveArticle', {...blog,author:User?.id},
    {
      withCredentials: true,
    });
    toast.dismiss(loadingToastId);
    toast.success('article saved successfully')
    dispatch(editBlog({title:'',des:'',tags:[],banner:'',content:[]}))
  }
    catch (error) {
        toast.dismiss(loadingToastId)
        if(error.response.status === 403 || error.response.status === 401){
        return toast.error('please login to save article')
      }
      toast.error('Error while saving article')
    }
  }

  return (
  
    <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap'>
      <div className='flex-1'></div>
      <button className="w-max absoulte ms-auto "
      onClick={handleCloseEvent}>
          <i className='fi fi-br-cross'></i>
      </button>
      <div className='max-w-[550px] center'>
      <p className='text-dark-grey mb-1'>
          Preview
        </p>
        <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
          <img src={banner ? banner: banners}/>
        </div>
        <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>
        <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
      </div>
      <div className='border-grey lg:border-1 lg:pl-8'>
      <div className='border-grey lg:border-1 lg:pl-8'>
        <p>Blog Title</p>
        <input type='text' placeholder='Blog Title' defaultValue={title} className='input-box pl-4' onChange={handelBlogTitleChange}/>
        <p className='text-dark-grey mb-2 mt-9'>short description about your blog</p>
        {/* <input type='text' placeholder='Blog desctiption' defaultValue={des} className='input-box pl-4'/> */}

        <textarea
        maxLength={charachterLimit}
        defaultValue={des}
        className='h-40 resize-none leading-7 input-box pl-4'
        onChange={handleBlogDes}
        >
        </textarea>
        <p className='mt-1 text-dark grey tet-sm text-right'>
          {charachterLimit-des.length}
          charachters left
        </p>
        <p className='text-dark-grey mb-2 mt-9'>Topics - (Helps is searching and ranking your blog post )</p>
        <div className='relative input-box pl-2 py-2 pb-4'>
          <input type="text" placeholder='Topic' className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white' onKeyDown={handelKeyDown} />
          {
          tags.map((tag,i)=>(
            <Tag tag={tag} key={i}/>
          ))
          }
        </div>
      </div>
          <p className='mt-1 text-dark grey tet-sm text-right'>
          {tagLimit-tags.length }
           tags left
        </p>
         {
          !id?
           <button className='btn-dark px-8' onClick={()=>storeData()}>Publish</button>:
            <button className='btn-light px-8' onClick={()=>updatData()}>Update</button>
         }
      </div>
    </section>
  )
}

export default publishForm
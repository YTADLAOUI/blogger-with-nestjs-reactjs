import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/navbar'
import { Route, Routes } from 'react-router-dom'
import AuthForm from './pages/authForm'

import AuthMidd from './middlewares/authMidd'
import { useDispatch } from 'react-redux'
import { login } from './features/authSlice'
import { getSession } from './common/session'
import Editor from './pages/editor'
import Home from './pages/home'
import SearchPage from './pages/searchPage'
import NotFound from './pages/404'
import Profile from './pages/profile'
import Blog from './pages/blog'
import SideNav from './components/sideNav'
import EditProfile from './pages/editProfile'
import ChangePassword from './pages/changePassword'
import  Notifictions  from './pages/notifictions'

function App() {

  const [user, setUser] = useState(null)
  const dispatch = useDispatch()


  useEffect(() => {
    const user = getSession('user');
    if (user) {
      dispatch(login(JSON.parse(user)));
      setUser(JSON.parse(user));
    } else {
      dispatch(login(null));
    }
  }, []);

  return (
    <>
    <Routes>
      <Route path='/editor' element={
        <AuthMidd>
          <Editor/>
        </AuthMidd>
      }/>
      <Route path='/editor/:id' element={
         <AuthMidd>
          <Editor/>
        </AuthMidd>
      }/>
      <Route path='/' element={<Navbar/>} >
        <Route index element={<Home/>}/>
        <Route path='signin' element={<AuthForm page="sign-in"/>}/>
        <Route path='signup' element={<AuthForm page="sign-up"/>}/>
        <Route path='profil/:id_user' element={
          <Profile/>
        }/>
        <Route path='settings' element={
          <AuthMidd>
             <SideNav/>
           </AuthMidd>
        }>
          <Route path='notifications' element={
          <AuthMidd>
            <Notifictions/>
          </AuthMidd>
          
          } />
          <Route path='edit-profile' element={
            <authMidd>
          <EditProfile/>
          </authMidd>
          
          } /> 
          <Route path='change-password' 
            element={
          <AuthMidd>
            <ChangePassword/>
          </AuthMidd>
          }
          /> 
          </Route>
        <Route path='search/:query' element={<SearchPage/>}/>
        <Route path='*' element={<NotFound/>}/>
        <Route path='blog/:id' element={<Blog/>}/>
      </Route>
  
    </Routes>
    </>
  )
}

export default App

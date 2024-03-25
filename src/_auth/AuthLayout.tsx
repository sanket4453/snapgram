import {Outlet , Navigate } from 'react-router-dom'

const AuthLayout = () => {

  const isAuthenticated = false

  return (
   <>
   {isAuthenticated ? (
    <Navigate to="/" />
   ) : (
    <>
    <section className='flex flex-1 justify-center items-center flex-col py-10' >
      <Outlet />  {/* Renders the child route's element, if there is one.*/}
    </section>

    <img
      src='/assets/images/side-bar-image.png'
      alt='logo'
      className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'
    />
    </>
   )
   
   }
   </>
  )
}

export default AuthLayout
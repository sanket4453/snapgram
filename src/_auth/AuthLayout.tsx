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
      <div className='p-12'>To test or view the application, you can use the credentials provided below, or you can create your own account.
        <div className='mt-3'>Email: test@gmail.com</div>
        <div>Password: test@123</div>
      </div>
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
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';

const LibrarianDashboard: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [role, setRole] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('logged_in')) {
            const _role = localStorage.getItem('role');

            if(_role !== 'librarian') {
                navigate('/');
            }
            
            setUsername(localStorage.getItem('username') ?? '');
            setDate(new Date(localStorage.getItem('created_at') ?? ''));
            setRole(_role ?? '');
        }
        else {
            navigate('/');
        }
      }, [navigate]);
    
      const handleSignout = (): void => {
        localStorage.clear();
        navigate('/');
      }
    

  return (
    <main className='relative w-full min-h-screen text-white'>
        <Filter show={show}>
          <div className='w-[30rem] h-[20rem] bg-white rounded-lg border-2 border-black flex flex-col items-center text-black p-10 gap-5'>
            <p className='text-xl font-medium'>Your Information</p>
            <div className='flex flex-col items-start w-full'>
              <p>Name: {username}</p>
              <p>Account created on: {date.toLocaleDateString()}</p>
              <p>Role: {role}</p>
            </div>
            <div className='flex gap-4 mt-16'>
              <button className='px-4 py-2 bg-red-400 border border-black rounded-lg text-white' onClick={handleSignout}>Sign Out</button>
              <button className='px-4 py-2 border border-black rounded-lg' onClick={() => setShow(false)}>Close</button>
            </div>
          </div>
        </Filter>

        <img src="/img/lib.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='w-full fixed top-0 h-20 bg-black flex justify-between items-center px-10 z-10'>
          <Link to='/librarian' className='text-4xl font-medium font-serif'>Lib-Me-Alone</Link>

          <div className='flex gap-4 items-center justify-center text-black'>
            <Link to='/books' className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>View Books</Link>
            <Link to='/borrowed-books' className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Borrowed Books</Link>
            <Link to='/requested-books' className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Requested Books</Link>
            <button onClick={() => setShow(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Profile</button>
          </div>
        </div>

        <div className='h-full w-full flex fixed justify-center items-center'>
          <p className='text-9xl font-bold font-serif'>Welcome, {username}!</p>
        </div>
    </main>
  )
}

export default LibrarianDashboard
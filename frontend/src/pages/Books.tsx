import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Book from '../components/Book';

const Books: React.FC = () => {
    const [id, setId] = useState<number>(-1);
    const [role, setRole] = useState<string>('');
    const [returnTo, setReturnTo] = useState<string>('');
    const [canBorrow, setCanBorrow] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('logged_in')) {
          setId(Number.parseInt(localStorage.getItem('id') as string));
          setRole(localStorage.getItem('role') ?? '');
        }
        else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if(role === 'admin') {
            setReturnTo('/admin');
        }
        else if(role === 'librarian') {
            setReturnTo('/librarian');
        }
        else {
            setReturnTo('/home');
            setCanBorrow(true);
        }
    }, [role]);
  return (
    <main className='relative w-full min-h-screen text-white'>
        <img src="/img/empty-shelf.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='fixed w-full h-screen px-10'>
            <div className='w-full py-10 flex justify-between items-center relative'>
                <p className='text-6xl font-medium font-serif'>Library</p>

                <Link to={returnTo} className='text-4xl font-medium bg-white hover:bg-gray-300 active:bg-gray-400 border-black rounded-lg text-black px-6 py-4'>Close</Link>
            </div>

            <div className='w-full h-4/5 bg-white p-5 grid grid-cols-4 grid-rows-2 gap-5'>
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
            </div>
        </div>
    </main>
  )
}

export default Books
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Filter from '../components/Filter';
import YourBookRow from '../components/YourBookRow';
import { IYourBook } from '../types/Book';
import { fetchYourRequestedBooks, fetchYourUnreturnedBooks } from '../services/books';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

const UserDashboard: React.FC = () => {
  const [id, setId] = useState<number>(-1);
  const [username, setUsername] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [role, setRole] = useState<string>('');

  const [show, setShow] = useState<boolean>(false);
  const [showYourBooks, setShowYourBooks] = useState<boolean>(false);

  const [requestedBooks, setRequestedBooks] = useState<IYourBook[]>([]);
  const [unreturnedBooks, setUnreturnedBooks] = useState<IYourBook[]>([]);

  const [refresh, setRefresh] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('logged_in')) {
      const _role = localStorage.getItem('role');

      if(_role !== 'user') {
          navigate('/');
      }
      
      setUsername(localStorage.getItem('username') ?? '');
      setId(Number.parseInt(localStorage.getItem('id') as string));
      setDate(new Date(localStorage.getItem('created_at') ?? ''));
      setRole(_role ?? '');
    }
    else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if(id !== -1) {
      (async function() {
      try {
          const res = await fetchYourRequestedBooks(id);
          const data = res.data;

          console.log(data);
          if(data.books) setRequestedBooks(data.books as IYourBook[]);
      }
      catch(err: unknown | AxiosError) {
          if(axios.isAxiosError(err)) {
              console.log(err);
          }
      }
    })();

    (async function() {
      try {
          const res = await fetchYourUnreturnedBooks(id);
          const data = res.data;

          console.log(data);
          if(data.books) setUnreturnedBooks(data.books as IYourBook[]);
      }
      catch(err: unknown | AxiosError) {
          if(axios.isAxiosError(err)) {
              console.log(err);
          }
      }
      })();
    }
  }, [id, refresh]);

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

        <Filter show={showYourBooks}>
          <div className='w-[80rem] h-[30rem] bg-white rounded-lg border-2 border-black text-black overflow-y-scroll'>
            <div className='w-full flex justify-between items-center px-8 py-4'>
              <p className='text-3xl font-medium'>Your books</p>
              <button onClick={() => setShowYourBooks(false)} className='rounded-lg border border-black px-4 py-1'>Close</button>
            </div>

            <div className='grid grid-cols-2 w-full text-black px-8 gap-4'>
              <div className='flex flex-col w-full gap-2'>
                <p className='text-sm font-medium'>Requested books</p>
                <table className='border w-full text-xs'>
                  <thead>
                    <tr>
                      <th>Book ID</th>
                      <th>Book Name</th>
                      <th>Borrower's name</th>
                      <th>Date Borrowed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      requestedBooks.map((book, index) => {
                        return <YourBookRow key={index} book={book} method='cancel' refresh={() => setRefresh(prev => !prev)}/>
                      })
                    }
                  </tbody>
                </table>
              </div>

              <div className='flex flex-col w-full gap-2'>
                <p className='text-sm font-medium'>Unreturned books</p>
                <table className='border w-full text-xs'>
                  <thead>
                    <tr>
                      <th>Book ID</th>
                      <th>Book Name</th>
                      <th>Borrower's name</th>
                      <th>Date Borrowed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      unreturnedBooks.map((book, index) => {
                        return <YourBookRow key={index} book={book} />
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Filter>

        <img src="/img/lib.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='w-full fixed top-0 h-20 bg-black flex justify-between items-center px-10 z-10'>
          <Link to='/home' className='text-4xl font-medium font-serif'>Lib-Me-Alone</Link>

          <div className='flex gap-4 items-center justify-center text-black'>
            <Link to='/books' className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>View Books</Link>
            <button onClick={() => setShowYourBooks(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Your Books</button>
            <button onClick={() => setShow(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Profile</button>
          </div>
        </div>

        <div className='h-full w-full flex fixed justify-center items-center'>
          <p className='text-9xl font-bold font-serif'>Welcome, {username}!</p>
        </div>
    </main>
  )
}

export default UserDashboard
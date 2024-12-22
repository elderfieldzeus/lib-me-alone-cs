import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Filter from '../components/Filter';
import { fetchRequestedBooks, fetchUnreturnedBooks } from '../services/books';
import { IYourBook } from '../types/Book';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import YourBookRow from '../components/YourBookRow';

const LibrarianDashboard: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [role, setRole] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);

    const [showBorrowed, setShowBorrowed] = useState<boolean>(false);
    const [showRequested, setShowRequested] = useState<boolean>(false);

    const [requestedBooks, setRequestedBooks] = useState<IYourBook[]>([]);
    const [unreturnedBooks, setUnreturnedBooks] = useState<IYourBook[]>([]);

    const [refresh, setRefresh] = useState<boolean>(false);

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

      useEffect(() => {
        (async function() {
          try {
              const res = await fetchRequestedBooks();
              const data = res.data;
    
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
              const res = await fetchUnreturnedBooks();
              const data = res.data;
    
              if(data.books) setUnreturnedBooks(data.books as IYourBook[]);
          }
          catch(err: unknown | AxiosError) {
              if(axios.isAxiosError(err)) {
                  console.log(err);
              }
          }
        })();
      }, [refresh]);
    
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

        <Filter show={showBorrowed}>
          <div className='w-[35rem] h-[40rem] bg-white rounded-lg text-black flex flex-col py-6 px-4 gap-4 overflow-y-scroll'>
            <div className='flex w-full justify-between'>
              <p className='font-medium text-2xl'>Unreturned Books</p>
              <button onClick={() => setShowBorrowed(false)} className='rounded-lg border border-black px-4 py-1'>Close</button>
            </div>
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
                        return <YourBookRow key={index} book={book} method='return' refresh={() => setRefresh(prev => !prev)}/>
                      })
                    }
                  </tbody>
                </table>
          </div>
        </Filter>

        <Filter show={showRequested}>
          <div className='w-[35rem] h-[40rem] bg-white rounded-lg text-black flex flex-col py-6 px-4 gap-4 overflow-y-scroll'>
            <div className='flex w-full justify-between'>
              <p className='font-medium text-2xl'>Requested Books</p>
              <button onClick={() => setShowRequested(false)} className='rounded-lg border border-black px-4 py-1'>Close</button>
            </div>
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
                        return <YourBookRow key={index} book={book} method='approve' refresh={() => setRefresh(prev => !prev)}/>
                      })
                    }
                  </tbody>
                </table>
          </div>
        </Filter>

        <img src="/img/lib.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='w-full fixed top-0 h-20 bg-black flex justify-between items-center px-10 z-10'>
          <Link to='/librarian' className='text-4xl font-medium font-serif'>Lib-Me-Alone</Link>

          <div className='flex gap-4 items-center justify-center text-black'>
            <Link to='/books' className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>View Books</Link>
            <button onClick={() => setShowBorrowed(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Borrowed Books</button>
            <button onClick={() => setShowRequested(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Requested Books</button>
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
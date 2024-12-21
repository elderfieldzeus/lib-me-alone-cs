import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Book from '../components/Book';
import IBook from '../types/Book';
import { fetchBooks } from '../services/books';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

const Books: React.FC = () => {
    const [id, setId] = useState<number>(-1);
    const [role, setRole] = useState<string>('');
    const [returnTo, setReturnTo] = useState<string>('');

    const [page, setPage] = useState<number>(0);
    const [books, setBooks] = useState<IBook[]>([]);

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
        }
    }, [role]);

    useEffect(() => {
        (async function() {
            try {
                const res = await fetchBooks(page);
                const data = res.data;

                setBooks(data as IBook[]);
            }
            catch(err: unknown | AxiosError) {
                if(axios.isAxiosError(err)) {
                    console.log(err);
                }
            }
        })();
    }, [page]);

    const handleNextPage = () => {
        setPage(prev => prev + 1);
    }

    const handlePrevPage = () => {
        setPage(prev => {
            return prev > 0 ? prev - 1 : prev;
        });
    }

  return (
    <main className='relative w-full min-h-screen text-white'>
        <img src="/img/empty-shelf.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='fixed w-full h-screen px-10'>
            <div className='w-full py-10 flex justify-between items-center relative'>
                <p className='text-6xl font-medium font-serif'>Library</p>
                <Link to={returnTo} className='text-4xl font-medium bg-white hover:bg-gray-300 active:bg-gray-400 border-black rounded-lg text-black px-6 py-4'>Close</Link>

                <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white w-80 h-24 grid grid-cols-3 text-black'>
                    <button onClick={handlePrevPage} className='w-full h-full border border-black'>&lt;</button>
                    <div className='w-full h-full border border-black flex justify-center items-center'>
                        <p>{page}</p>
                    </div>
                    <button onClick={handleNextPage} className='w-full h-full border border-black'>&gt;</button>
                </div>
            </div>

            <div className='w-full h-4/5 bg-white p-5 grid grid-cols-4 grid-rows-2 gap-5'>
                {books.map((book, index) => <Book key={index} book = {book} role={role} user_id={id}/>)}
            </div>
        </div>
    </main>
  )
}

export default Books
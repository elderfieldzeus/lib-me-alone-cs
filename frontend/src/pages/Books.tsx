import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Book from '../components/Book';
import { IBook, ICreateBook } from '../types/Book';
import { createBook, fetchBooks } from '../services/books';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import Filter from '../components/Filter';

const Books: React.FC = () => {
    const [id, setId] = useState<number>(-1);
    const [role, setRole] = useState<string>('');
    const [returnTo, setReturnTo] = useState<string>('');

    const [page, setPage] = useState<number>(0);
    const [books, setBooks] = useState<IBook[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    const [show, setShow] = useState<boolean>(false);

    const formRef = useRef<HTMLFormElement>(null);

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
    }, [page, refresh]);

    const handleNextPage = () => {
        setPage(prev => {
            return books.length < 8 ? prev : prev + 1;
        });
    }

    const handlePrevPage = () => {
        setPage(prev => {
            return prev > 0 ? prev - 1 : prev;
        });
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if(formRef.current) {
            const formData = new FormData(formRef.current);

            const name: string = formData.get("name") as string;
            const author: string = formData.get("author") as string;
            const description: string = formData.get("description") as string;

            if(!name || !author || !description) return alert("Incomplete input");

            (async function() {
                try {
                    const res = await createBook({name, author, description} as ICreateBook);
                    const data = res.data;

                    alert(data.message);
    
                    setRefresh(prev => !prev);
                
                    if (formRef.current) {
                        Array.from(formRef.current.elements).forEach(field => {
                            const element = field as HTMLInputElement | HTMLTextAreaElement;

                            element.value = "";
                        });
                      }

                    setShow(false);
                }
                catch(err: unknown | AxiosError) {
                    if(axios.isAxiosError(err) && err.response) {
                        alert(err.response.data);
                    }
                }
            })();
        }
    }

  return (
    <main className='relative w-full min-h-screen text-white'>
        <Filter show={show}>
            <form ref = {formRef} onSubmit={handleSubmit} className='w-[30rem] h-[36rem] bg-white rounded-lg border border-black flex flex-col py-12 items-center px-12 gap-4 text-black'>
                <p className='text-6xl mb-10'>Add a Book</p>
                <input name='name' type="text" placeholder='Title' className='w-full border border-black py-3 rounded-md px-3'/>
                <input name='author' type="text" placeholder='Author' className='w-full border border-black py-3 rounded-md px-3'/>
                <textarea name="description" id="" placeholder='Description' className='w-full border border-black py-3 rounded-md px-3 resize-none h-36'></textarea>
                <div className='flex gap-2 w-full'>
                    <button className='w-full border border-black py-3 rounded-lg bg-green-400'>Add</button>
                    <button type='button' onClick={() => setShow(false)} className='w-full border border-black py-3 rounded-lg'>Cancel</button>
                </div>
            </form> 
        </Filter>

        <img src="/img/empty-shelf.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='fixed w-full h-screen px-10'>
            <div className='w-full py-10 flex justify-between items-center relative'>
                <p className='text-6xl font-medium font-serif'>Library</p>
                <div className='flex gap-4'>
                    {role === 'admin' && <button onClick={() => setShow(true)} className='text-4xl font-medium bg-green-400 hover:bg-green-500 active:bg-green-600 border-black rounded-lg text-black px-6 py-4'>Add Book</button>}
                    <Link to={returnTo} className='text-4xl font-medium bg-white hover:bg-gray-300 active:bg-gray-400 border-black rounded-lg text-black px-6 py-4'>Close</Link>
                </div>

                <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white w-80 h-24 grid grid-cols-3 text-black'>
                    <button onClick={handlePrevPage} className='w-full h-full border border-black'>&lt;</button>
                    <div className='w-full h-full border border-black flex justify-center items-center'>
                        <p>{page}</p>
                    </div>
                    <button onClick={handleNextPage} className='w-full h-full border border-black'>&gt;</button>
                </div>
            </div>

            <div className='w-full h-4/5 bg-white p-5 grid grid-cols-4 grid-rows-2 gap-5'>
                {books.map((book, index) => <Book key={index} book = {book} role={role} user_id={id} refresh={() => setRefresh(prev => !prev)}/>)}
            </div>
        </div>
    </main>
  )
}

export default Books
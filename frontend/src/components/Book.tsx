import React from 'react'
import IBook from '../types/Book'
import { borrowBook } from '../services/books';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

interface BookProps {
  book: IBook;
  role: string;
  user_id: number;
}

const Book: React.FC<BookProps> = ({book, role, user_id}) => {
  const handleBorrowBook = async () => {
    try {
      const res = await borrowBook(user_id, book.id);
      const data = res.data;

      alert(data.message);
    }
    catch(err: unknown | AxiosError) {
      if(axios.isAxiosError(err) && err.response && err.response.data) {
        alert(err.response.data.message);
      }
  }
  }

  return (
    <div className='bg-gray-200 rounded-lg w-full h-full p-6 flex'>
        <div className='h-full bg-stone-400 relative flex flex-col items-center justify-between w-full'>
            <div className='absolute h-full w-4 left-0 bg-white'></div>
            <p className='mt-4 font-medium'>{book.name}</p>
            <div className='flex flex-col items-center mb-4'>
              <p className='underline leading-none'>{book.author}</p>
              <p className='text-[0.6rem]'>Author</p>
            </div>
        </div>

        <div className='flex flex-col justify-between pl-4 text-black w-full'>
          <div className='max-w-[80%]'>
            <p className='font-medium'>Description: </p>
            <p>{book.description}</p>
          </div>

          <div className='flex flex-col w-full gap-2'>
            {role === 'admin' && <button className='w-full bg-red-400 hover:bg-red-500 active:bg-red-600 py-1 text-white border border-black rounded-md font-medium'>Delete</button>}
            {role === 'user' && <button onClick={handleBorrowBook} className='w-full bg-green-400 hover:bg-green-500 active:bg-green-600 py-1 text-white border border-black rounded-md font-medium'>Borrow</button>}
          </div>
        </div>
    </div>
  )
}

export default Book
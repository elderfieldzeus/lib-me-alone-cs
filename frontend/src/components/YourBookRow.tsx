import React from 'react'
import { IYourBook } from '../types/Book';
import { cancelBorrow } from '../services/books';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

interface YourBookRowProps {
    book: IYourBook;
    cancellable?: boolean;
    refresh?: () => void;
}

const YourBookRow: React.FC<YourBookRowProps> = ({book, cancellable = false, refresh = () => {}}) => {
  const handleCancel = () => {
    const res = confirm("Delete borrow #" + book.id + "?");
    if(res) {
      (async function() {
        try {
            const res = await cancelBorrow(book.id);
            const data = res.data;
  
            if(data.success) {
              alert(data.message);
            }
        }
        catch(err: unknown | AxiosError) {
            if(axios.isAxiosError(err) && err.response) {
                alert(err.response.data.message);
            }
        }
        finally {
          refresh();
        }
      })();
    }
    
  }

  return (
    <tr className='text-center hover:bg-gray-200 transition-colors' onClick={cancellable ? handleCancel : () => {}}>
        <td>{book.id}</td>
        <td>{book.book_name}</td>
        <td>{book.borrower_name}</td>
        <td>{new Date(book.date_borrowed).toLocaleDateString()}</td>
    </tr>
  )
}

export default YourBookRow
import React from 'react'
import { IYourBook } from '../types/Book';
import { approveBorrow, cancelBorrow, returnBook } from '../services/books';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';

interface YourBookRowProps {
    book: IYourBook;
    method?: 'cancel' | 'approve' | 'return' | 'none';
    refresh?: () => void;
}

const YourBookRow: React.FC<YourBookRowProps> = ({book, method = 'none', refresh = () => {}}) => {
  const handleCancel = () => {
    const res = confirm("Cancel borrow #" + book.id + "?");
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

  const handleApprove = () => {
    const res = confirm("Approve borrow #" + book.id + "?");
    if(res) {
      (async function() {
        try {
            const res = await approveBorrow(book.id);
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

  const handleReturn = () => {
    const res = confirm("Return borrow #" + book.id + "?");
    if(res) {
      (async function() {
        try {
            const res = await returnBook(book.id);
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



  let handleFunction: () => void;

  switch(method) {
    case 'cancel':
      handleFunction = handleCancel; break;
    case 'approve':
      handleFunction = handleApprove; break;
    case 'return':
      handleFunction = handleReturn; break; 
    default:
      handleFunction = () => {};
  }

  return (
    <tr className='text-center hover:bg-gray-200 transition-colors' onClick={handleFunction}>
        <td>{book.id}</td>
        <td>{book.book_name}</td>
        <td>{book.borrower_name}</td>
        <td>{new Date(book.date_borrowed).toLocaleDateString()}</td>
    </tr>
  )
}

export default YourBookRow
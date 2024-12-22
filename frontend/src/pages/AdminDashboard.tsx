import React, { useEffect, useRef, useState } from 'react'
import Filter from '../components/Filter'
import { Link, useNavigate } from 'react-router-dom';
import { IUser } from '../types/User';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import { fetchLibrarians, fetchUsers } from '../services/users';
import UserRow from '../components/UserRow';
import { signup, signupLib } from '../services/auth';

const AdminDashboard: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [role, setRole] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);

    const [showLib, setShowLib] = useState<boolean>(false);
    const [showMem, setShowMem] = useState<boolean>(false);

    const [showForm, setShowForm] = useState<boolean>(false);

    const [formMethod, setFormMethod] = useState<'librarian' | 'user'>('user');

    const [lib, setLib] = useState<IUser[]>([]);
    const [mem, setMem] = useState<IUser[]>([]);

    const formRef = useRef<HTMLFormElement>(null);

    const [refresh, setRefresh] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('logged_in')) {
            const _role = localStorage.getItem('role');

            if(_role !== 'admin') {
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
              const res = await fetchUsers();
              const data = res.data;
    

              if(data) setMem(data as IUser[]);
          }
          catch(err: unknown | AxiosError) {
              if(axios.isAxiosError(err)) {
                  console.log(err);
              }
          }
        })();
        
        (async function() {
          try {
              const res = await fetchLibrarians();
              const data = res.data;
    

              if(data) setLib(data as IUser[]);
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

      const handleAddUser = (role: 'librarian' | 'user') => () => {
        setFormMethod(role);
        setShowForm(true);
      }

      const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const form = formRef.current;

        if(form) {
          const formData = new FormData(form);

          const username = formData.get("username") as string;
          const password = formData.get("password") as string;
          const cpassword = formData.get("cpassword") as string;

          if(formMethod === 'librarian') {
            (async function() {
              try {
                  const res = await signupLib(username, password, cpassword);
                  const data = res.data;

                  if(data.success) {
                    alert(data.message);

                    Array.from(form.elements).forEach(field => {
                      const element = field as HTMLInputElement | HTMLTextAreaElement;

                      element.value = "";
                    });

                    setShowForm(false);
                  }
              }
              catch(err: unknown | AxiosError) {
                  if(axios.isAxiosError(err) && err.response) {
                    alert(err.response.data.message);
                  }
              }
              finally {
                setRefresh(prev => !prev);
              }
            })();
          }
          else {
            (async function() {
              try {
                  const res = await signup(username, password, cpassword);
                  const data = res.data;

                  if(data.success) {
                    alert(data.message);

                    Array.from(form.elements).forEach(field => {
                      const element = field as HTMLInputElement | HTMLTextAreaElement;

                      element.value = "";
                    });

                    setShowForm(false);
                  }
              }
              catch(err: unknown | AxiosError) {
                  if(axios.isAxiosError(err) && err.response) {
                    alert(err.response.data.message);
                  }
              }
              finally {
                setRefresh(prev => !prev);
              }
            })();
          }
        }
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

        <Filter show={showLib}>
          <div className='w-[35rem] h-[40rem] bg-white rounded-lg text-black flex flex-col py-6 px-4 gap-4 overflow-y-scroll'>
            <div className='flex w-full justify-between'>
              <p className='font-medium text-2xl'>Librarians</p>
              <div className='flex gap-2 items-center'>
                <button onClick={handleAddUser('librarian')} className='rounded-lg border border-black px-4 py-1 bg-green-400'>Add User</button>
                <button onClick={() => setShowLib(false)} className='rounded-lg border border-black px-4 py-1'>Close</button>
              </div>
            </div>
              <table className='border w-full text-xs'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      lib.map((l, index) => {
                        return <UserRow key={index} user={l} />
                      })
                    }
                  </tbody>
                </table>
          </div>
        </Filter>

        <Filter show={showMem}>
          <div className='w-[35rem] h-[40rem] bg-white rounded-lg text-black flex flex-col py-6 px-4 gap-4 overflow-y-scroll'>
            <div className='flex w-full justify-between'>
              <p className='font-medium text-2xl'>Members</p>
              <div className='flex gap-2 items-center'>
                <button onClick={handleAddUser('user')} className='rounded-lg border border-black px-4 py-1 bg-green-400'>Add User</button>
                <button onClick={() => setShowMem(false)} className='rounded-lg border border-black px-4 py-1'>Close</button>
              </div>
            </div>
              <table className='border w-full text-xs'>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      mem.map((m, index) => {
                        return <UserRow key={index} user={m} />
                      })
                    }
                  </tbody>
                </table>
          </div>
        </Filter>
        
        <Filter show={showForm}>
          <form ref={formRef} onSubmit={handleSubmit} className='w-[35rem] h-[40rem] bg-white rounded-lg text-black flex flex-col py-6 px-4 gap-4 overflow-y-scroll z-20'>
            <div className='flex w-full justify-between'>
              <p className='font-medium text-2xl'>Add a User</p>
              <div className='flex gap-2 items-center'>
                <button type='button' onClick={() => setShowForm(false)} className='rounded-lg border border-black px-4 py-1'>Close</button>
              </div>
            </div>
            <div className='flex flex-col gap-4 pt-6'>
              <input name='username' type="text" placeholder='Username' className='w-full border border-black py-3 rounded-md px-3'/>
              <input name='password' type="password" placeholder='Password' className='w-full border border-black py-3 rounded-md px-3'/>
              <input name='cpassword' type="password" placeholder='Confirm Password' className='w-full border border-black py-3 rounded-md px-3'/>
              <div className='flex gap-2 w-full'>
                  <button className='w-full border border-black py-3 rounded-lg bg-green-400'>Add</button>
              </div>
            </div>
          </form>
        </Filter>

        <img src="/img/lib.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>
        <div className='w-full fixed top-0 h-20 bg-black flex justify-between items-center px-10 z-10'>
          <Link to='/admin' className='text-4xl font-medium font-serif'>Lib-Me-Alone</Link>

          <div className='flex gap-4 items-center justify-center text-black'>
            <Link to='/books' className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>View Books</Link>
            <button onClick={() => setShowLib(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>View Librarians</button>
            <button onClick={() => setShowMem(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>View Members</button>
            <button onClick={() => setShow(true)} className='bg-white hover:bg-gray-300 active:bg-gray-400 transition-colors px-4 py-2 rounded-lg'>Profile</button>
          </div>
        </div>

        <div className='h-full w-full flex fixed justify-center items-center'>
          <p className='text-9xl font-bold font-serif'>Welcome, {username}!</p>
        </div>
    </main>
  )
}

export default AdminDashboard
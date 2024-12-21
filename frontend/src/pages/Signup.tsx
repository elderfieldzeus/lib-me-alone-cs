import React, { useEffect, useRef } from 'react'
import { signup } from '../services/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const passRef = useRef<HTMLInputElement>(null);
    const cpassRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
            localStorage.clear();
    }, []);

    const handleSubmit: React.FormEventHandler = async (e) => {
        e.preventDefault();

        if(!formRef.current || !passRef.current || !cpassRef.current) return;

        const formData = new FormData(formRef.current);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const cpassword = formData.get("cpassword") as string;

        passRef.current.value = "";
        cpassRef.current.value = "";

        try {
            const result = await signup(username, password, cpassword);
            const data = result.data;

            if(data.message) {
                alert(data.message);
            }

            navigate('/');
        }
        catch(error: unknown | AxiosError) {
            if(axios.isAxiosError(error) && error.response?.data) {
                alert(error.response.data.message);
            }
        }

            

    }

  return (
    <main className='relative w-full min-h-screen'>
        <img src="/img/lib.jpg" alt="Homescreen" className='w-full h-full object-cover fixed'/>

        <form ref={formRef} className='w-full h-full flex justify-center items-center z-10 fixed' onSubmit={handleSubmit}>
            <div className='w-[30rem] h-[40rem] bg-white rounded-xl flex flex-col items-center p-12 gap-8'>
                <p className='text-6xl font-medium'>SIGN UP</p>

                <div className='flex flex-col w-full gap-1'>
                    <label htmlFor="username">Username</label>
                    <input type="text" id='username' name='username' className='border border-black outline-none px-4 py-3 rounded-md'/>
                </div>

                <div className='flex flex-col w-full gap-1'>
                    <label htmlFor="password">Password</label>
                    <input ref={passRef} type="password" id='password' name='password' className='border border-black outline-none px-4 py-3 rounded-md'/>
                </div>

                <div className='flex flex-col w-full gap-1'>
                    <label htmlFor="cpassword">Confirm Password</label>
                    <input ref={cpassRef} type="password" id='cpassword' name='cpassword' className='border border-black outline-none px-4 py-3 rounded-md'/>
                </div>

                <button className='w-full bg-red-800 active:bg-red-900 transition-colors text-white py-3 rounded-md'>
                    Login
                </button>
                
                <div className='flex gap-2 font-medium'>
                    <p>Already have an account?</p>
                    <Link to="/" className='text-blue-600 active:text-blue-700 underline'>Login.</Link>
                </div>
            </div>
        </form>
    </main>
  )
}

export default Signup
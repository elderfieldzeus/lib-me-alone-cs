import React from 'react'
import { IUser } from '../types/User'

interface UserRowProps {
    user: IUser;
}

const UserRow: React.FC<UserRowProps> = ({user}) => {
  return (
    <tr className='text-center hover:bg-gray-200 transition-colors' onClick={() => {}}>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{new Date(user.created_at).toLocaleDateString()}</td>
    </tr>
  )
}

export default UserRow
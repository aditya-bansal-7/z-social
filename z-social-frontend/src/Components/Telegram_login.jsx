import React from 'react';
import { LoginButton } from '@telegram-auth/react';
import { useNavigate } from 'react-router-dom';
import { client } from '../client';

const Telegram_login = () => {
    const navigate = useNavigate();
    const onTelegramAuth = (user) => {
        console.log(user);
        const data = {
          googleId:user.id.toString(),
          imageUrl:user.photo_url,
          name: user.first_name + " " + user.last_name,
        }
        localStorage.setItem('user',JSON.stringify(data));
        const doc = {
          _id: user.id.toString(),
          _type:'user' ,
          userName: user.first_name + " " + user.last_name,
          image: user.photo_url,
      }
      client.createIfNotExists(doc)
      .then(() => {
          navigate('/' ,{replace:true})
      })
    }

  return (
        <>
        <LoginButton
                botUsername="z_social_bot"
                onAuthCallback={onTelegramAuth}
            />
        </>
  )
}
export default Telegram_login
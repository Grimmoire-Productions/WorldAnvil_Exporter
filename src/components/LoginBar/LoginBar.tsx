import React from 'react';
import type { UserContextType } from '../../utils/types';

type LoginBarProps = {
  accessToken: UserContextType['accessToken']
  onUpdateAccessToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function LoginBar({accessToken, onUpdateAccessToken, onLogin}: LoginBarProps) {
  return (
    <div className={'LoginBar'}>
      <input
        id='access-token'
        name='access-token'
        data-testid='access-token'
        value={accessToken}
        placeholder='Enter Your User API Token'
        onChange={onUpdateAccessToken}
      />
      <button
        className={'btn'}
        onClick={onLogin}
        data-testid='login-button'
      >
        Login
      </button>
    </div>
  )
}

export default LoginBar;
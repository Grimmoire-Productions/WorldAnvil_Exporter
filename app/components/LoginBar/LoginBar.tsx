import React from 'react';
import type { UserContextType } from '../../utils/types';
import styles from './LoginBar.module.css';

type LoginBarProps = {
  accessToken: UserContextType["accessToken"];
  onUpdateAccessToken: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: (event: React.MouseEvent<HTMLButtonElement>) => void;
  needsApplicationKey: boolean;
  applicationKey?: string | null;
  onUpdateApplicationKey?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function LoginBar({
  accessToken,
  onUpdateAccessToken,
  onLogin,
  needsApplicationKey,
  applicationKey,
  onUpdateApplicationKey,
}: LoginBarProps) {
  return (
    <div className={styles.loginBar}>
      {needsApplicationKey && (
        <>
          <input
            id="application-key"
            name="application-key"
            data-testid="application-key"
            value={applicationKey || ""}
            placeholder="Enter Application Key"
            onChange={onUpdateApplicationKey}
          />
        </>
      )}
      <input
        id="access-token"
        name="access-token"
        data-testid="access-token"
        value={accessToken}
        placeholder="Enter Your User API Token"
        onChange={onUpdateAccessToken}
      />
      <button
        className="blueButton"
        onClick={onLogin}
        data-testid="login-button"
      >
        Login
      </button>
    </div>
  );
}

export default LoginBar;
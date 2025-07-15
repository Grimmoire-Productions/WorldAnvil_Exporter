import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../../src/hooks/useLogin';
import UserProvider from '../../src/context/UserContext';
import type { UserInitialValues } from '../../src/utils/types';

import backendAPI from '../../src/utils/backendAPI';

// Override specific mock behavior for this test
const mockBackendAPI = backendAPI as jest.Mocked<typeof backendAPI>;
mockBackendAPI.getWorlds.mockResolvedValue([
  { id: 'world-1', title: 'Test World', cssClassName: 'TestWorld' }
]);

describe('useLogin', () => {
  const userInit: UserInitialValues = {
    isLoggedIn: false,
    user: null,
    accessToken: '',
    expiresAt: null,
    applicationKey: null,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <UserProvider initialValues={userInit}>
      {children}
    </UserProvider>
  );

  it('should provide login function', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    
    expect(result.current.login).toBeDefined();
    expect(typeof result.current.login).toBe('function');
  });

  it('should call login and return user with worlds', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });
    
    let user: any;
    await act(async () => {
      user = await result.current.login('test-token', 'test-app-key');
    });
    
    expect(user).toEqual({
      id: 'mock-user-id',
      displayName: 'Mock User',
      worlds: [{ id: 'world-1', title: 'Test World', cssClassName: 'TestWorld' }]
    });
  });
});
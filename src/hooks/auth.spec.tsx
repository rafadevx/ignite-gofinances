import { act, renderHook } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from './auth';
import { startAsync } from 'expo-auth-session';
import fetchMock from 'jest-fetch-mock';
import { mocked } from 'ts-jest/utils';

jest.mock('expo-auth-session');

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn()
  }
});

fetchMock.enableMocks();

describe('Auth hook', () => {
  it('should be able to sign in with Google account', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'success',
      params: {
        access_token: 'any_token',
      }
    });

    fetchMock.mockResponseOnce(JSON.stringify(
      {
        id: 'any_id',
        email: 'rodrigo.goncalves@rocketseat.team',
        name: 'Rodrigo',
        photo: 'any_photo.png'
      } 
    ));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user.email).toBe('rodrigo.goncalves@rocketseat.team');
  });

  it('should not connect if user cancel authentication', async () => {
    const googleMocked = mocked(startAsync as any);
    googleMocked.mockReturnValueOnce({
      type: 'cancel',
      params: {
        access_token: 'any_token',
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(() => result.current.signInWithGoogle());

    expect(result.current.user).not.toHaveProperty('id');
  });
});
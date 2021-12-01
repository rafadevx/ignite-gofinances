import React from 'react';

import { render, fireEvent } from '@testing-library/react-native';

import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';
import { Register } from '.';

const Provider: React.FC = ({ children }) => (
  <ThemeProvider theme={theme} >
    {children}
  </ThemeProvider>
);

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn()
  }
});

describe('Register Screen', () => {
  it('should open category modal when button is clicked', () => {
    const { getByTestId } = render(<Register />, {
      wrapper: Provider
    });
    const categoryModal = getByTestId('modal-category');
    const categoryButton = getByTestId('button-category');
    fireEvent.press(categoryButton);
    expect(categoryModal.props.visible).toBeTruthy();
  });
});
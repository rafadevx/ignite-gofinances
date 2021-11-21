import React from 'react';

import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

test('check if text input placeholder is correctly', () => {
  const { debug } = render(<Profile />);
  debug();
});
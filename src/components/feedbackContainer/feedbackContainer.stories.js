// SPDX-FileCopyrightText: 2023 Digg - Agency for Digital Government
//
// SPDX-License-Identifier: MIT

import FeedbackContainer from './feedbackContainer';
import mock from '../../assets/mock.json';

export default {
  component: FeedbackContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    config: { control: 'object' },
    styling: { control: 'object' },
    context: { control: 'object' },
  },
};

export const Default = {
  args: {
    config: mock.config,
    styling: mock.styling,
    context: mock.context,
  },
};

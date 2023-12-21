
import { render, fireEvent, screen } from '@testing-library/react';
import { FeedbackHeader } from './feedbackHeader';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('FeedbackHeader Component', () => {
  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <FeedbackHeader />
      </I18nextProvider>
    );

  test('renders header title', () => {
    renderComponent();
    expect(screen.getByText(/header.title/i)).toBeInTheDocument();
  });

  test('toggle tooltip icon and content on click', () => {
    renderComponent();
    const tooltip = screen.getByTitle(/header.tooltip.alt_text/i);
    expect(screen.queryByText(/header.tooltip.text/i)).not.toBeVisible();

    // Simulate click
    fireEvent.click(tooltip);
    expect(screen.getByText(/header.tooltip.text/i)).toBeVisible();

    // Simulate another click
    fireEvent.click(tooltip);
    expect(screen.queryByText(/header.tooltip.text/i)).not.toBeVisible();
  });

  test('toggle tooltip icon and content on key press', () => {
    renderComponent();
    const tooltip = screen.getByTitle(/header.tooltip.alt_text/i);

    // Simulate key press
    fireEvent.keyDown(tooltip, { key: 'Enter' });
    expect(screen.getByText(/header.tooltip.text/i)).toBeVisible();

    // Simulate another key press
    fireEvent.keyDown(tooltip, { key: ' ' });
    expect(screen.queryByText(/header.tooltip.text/i)).not.toBeVisible();
  });

  // Add more tests as necessary for other interactions or conditions
});


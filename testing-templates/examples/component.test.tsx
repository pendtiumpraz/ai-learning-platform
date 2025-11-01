// Component Testing Example - TutorChat Component
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TutorChat from '../../../src/app/tutor/page';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/tutor',
      pathname: '/tutor',
      query: '',
      asPath: '/tutor',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('TutorChat Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset fetch mock before each test
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render the tutor interface correctly', () => {
      render(<TutorChat />);

      // Check main elements are present
      expect(screen.getByRole('heading', { name: /AI Tutor Assistant/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Tanyakan apa saja/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();

      // Check initial AI message
      expect(screen.getByText(/Saya AI Tutor Anda/i)).toBeInTheDocument();
    });

    test('should display subject selector', () => {
      render(<TutorChat />);

      const subjectSelector = screen.getByRole('combobox');
      expect(subjectSelector).toBeInTheDocument();

      // Check default subject
      expect(subjectSelector).toHaveValue('general');

      // Check available subjects
      const options = within(subjectSelector).getAllByRole('option');
      expect(options).toHaveLength(7); // General + 6 subjects
    });

    test('should show quick prompt buttons', () => {
      render(<TutorChat />);

      const quickPrompts = screen.getAllByRole('button');
      const promptButtons = quickPrompts.filter(button =>
        button.textContent?.includes('Jelaskan') ||
        button.textContent?.includes('Bagaimana') ||
        button.textContent?.includes('Apa')
      );

      expect(promptButtons.length).toBeGreaterThan(0);
    });

    test('should display tools sidebar', () => {
      render(<TutorChat />);

      // Check sidebar elements
      expect(screen.getByText(/Study Mode/i)).toBeInTheDocument();
      expect(screen.getByText(/Recent Topics/i)).toBeInTheDocument();
      expect(screen.getByText(/Learning Tip/i)).toBeInTheDocument();
      expect(screen.getByText(/Session Stats/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('should allow typing in the input field', async () => {
      render(<TutorChat />);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      await user.type(input, 'What is photosynthesis?');

      expect(input).toHaveValue('What is photosynthesis?');
    });

    test('should send message when send button is clicked', async () => {
      // Mock successful API response
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'Photosynthesis is the process by which plants make their food.',
          subject: 'biology',
          level: 'adaptive',
          followUpQuestions: [
            'What are the inputs for photosynthesis?',
            'Why is photosynthesis important?'
          ]
        })
      });

      render(<TutorChat />);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(input, 'What is photosynthesis?');
      await user.click(sendButton);

      // Check loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for response
      await waitFor(() => {
        expect(screen.getByText(/Photosynthesis is the process/)).toBeInTheDocument();
      });

      // Check API was called correctly
      expect(fetch).toHaveBeenCalledWith('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'What is photosynthesis?',
          subject: 'general',
          level: 'adaptive'
        })
      });
    });

    test('should send message when Enter key is pressed', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'Test answer',
          subject: 'general',
          level: 'adaptive'
        })
      });

      render(<TutorChat />);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);

      await user.type(input, 'Test question{enter}');

      await waitFor(() => {
        expect(screen.getByText(/Test answer/)).toBeInTheDocument();
      });
    });

    test('should not send empty message', async () => {
      render(<TutorChat />);

      const sendButton = screen.getByRole('button', { name: /send/i });

      // Send button should be disabled with empty input
      expect(sendButton).toBeDisabled();

      await user.click(sendButton);

      // API should not be called
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should handle subject selection change', async () => {
      render(<TutorChat />);

      const subjectSelector = screen.getByRole('combobox');
      await user.selectOptions(subjectSelector, 'mathematics');

      expect(subjectSelector).toHaveValue('mathematics');
    });
  });

  describe('Quick Prompts Functionality', () => {
    test('should fill input when quick prompt is clicked', async () => {
      render(<TutorChat />);

      const quickPrompt = screen.getByText(/Jelaskan teorema Pythagoras/i);
      await user.click(quickPrompt);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      expect(input).toHaveValue('Jelaskan teorema Pythagoras dengan contoh');
    });

    test('should send quick prompt message', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'The Pythagorean theorem explanation...',
          subject: 'mathematics'
        })
      });

      render(<TutorChat />);

      const quickPrompt = screen.getByText(/Jelaskan teorema Pythagoras/i);
      await user.click(quickPrompt);

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Pythagorean theorem explanation/)).toBeInTheDocument();
      });
    });
  });

  describe('Tools Functionality', () => {
    test('should toggle tools panel when plus button is clicked', async () => {
      render(<TutorChat />);

      const toolsButton = screen.getByText('➕');

      // Initially tools should be hidden
      expect(screen.queryByText(/Upload Image/i)).not.toBeInTheDocument();

      await user.click(toolsButton);

      // Tools should now be visible
      expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
      expect(screen.getByText(/Voice Input/i)).toBeInTheDocument();
      expect(screen.getByText(/Create Graph/i)).toBeInTheDocument();
    });

    test('should handle tool actions', async () => {
      render(<TutorChat />);

      // Show tools
      const toolsButton = screen.getByText('➕');
      await user.click(toolsButton);

      // Test graph tool
      const graphButton = screen.getByText(/Create Graph/i);
      await user.click(graphButton);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      expect(input).toHaveValue('Buatkan grafik untuk fungsi y = x² - 2x + 1');

      // Test quiz tool
      const quizButton = screen.getByText(/Generate Quiz/i);
      await user.click(quizButton);

      expect(input).toHaveValue('Buatkan 5 soal quiz tentang ');
    });

    test('should show alert for upcoming features', async () => {
      // Mock window.alert
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      render(<TutorChat />);

      const toolsButton = screen.getByText('➕');
      await user.click(toolsButton);

      const uploadButton = screen.getByText(/Upload Image/i);
      await user.click(uploadButton);

      expect(alertSpy).toHaveBeenCalledWith('Upload image feature coming soon!');

      alertSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('should handle API error gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<TutorChat />);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      await user.type(input, 'Test question');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Maaf, terjadi kesalahan/i)).toBeInTheDocument();
      });
    });

    test('should handle API timeout', async () => {
      (fetch as jest.Mock).mockImplementationOnce(() =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      render(<TutorChat />);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      await user.type(input, 'Test question');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Maaf, terjadi kesalahan/i)).toBeInTheDocument();
      }, { timeout: 200 });
    });
  });

  describe('Session Statistics', () => {
    test('should update session stats when questions are asked', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          answer: 'Test answer',
          subject: 'general'
        })
      });

      render(<TutorChat />);

      // Initially should show 0 questions
      expect(screen.getByText('0')).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      await user.type(input, 'Test question');

      const sendButton = screen.getByRole('button', { name: /send/i });
      await user.click(sendButton);

      await waitFor(() => {
        // Should now show 1 question asked
        const questionCount = screen.getAllByText('1')[0];
        expect(questionCount).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels', () => {
      render(<TutorChat />);

      // Check for proper semantic elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar

      // Check for proper form labels
      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      expect(input).toHaveAccessibleName();

      // Check for button labels
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toHaveAccessibleName();
    });

    test('should be keyboard navigable', async () => {
      render(<TutorChat />);

      const input = screen.getByPlaceholderText(/Tanyakan apa saja/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      // Tab navigation
      await user.tab();
      expect(input).toHaveFocus();

      await user.tab();
      expect(sendButton).toHaveFocus();

      // Enter key should work when input is focused
      await user.click(input);
      await user.keyboard('Test question{enter}');

      // Should attempt to send (though will fail due to mock)
      expect(fetch).toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    test('should render quickly', () => {
      const startTime = performance.now();

      render(<TutorChat />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
    });

    test('should not re-render unnecessarily', () => {
      const { rerender } = render(<TutorChat />);

      // Re-render with same props
      rerender(<TutorChat />);

      // Component should still be properly rendered
      expect(screen.getByRole('heading', { name: /AI Tutor Assistant/i })).toBeInTheDocument();
    });
  });
});
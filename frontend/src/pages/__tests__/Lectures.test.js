import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Lectures from '../Lectures';
import { api, useApi } from '../../hooks/useApi';

jest.mock('../../components/PageHero', () => ({
  __esModule: true,
  default: ({ title }) => <div>{title}</div>,
}));

jest.mock('../../components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, className, ...props }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} className={className} {...props} />
  ),
}));

jest.mock('../../components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={className} {...props}>{children}</button>
  ),
}));

jest.mock('../../hooks/useApi', () => ({
  api: { list: jest.fn() },
  useApi: jest.fn(),
}));

describe('Lectures page refresh behavior', () => {
  let container;
  let root;
  let subjectState;
  let lectureState;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    subjectState = [{ id: 's1', name: 'Maths', is_published: true }];
    lectureState = [{
      id: 'l1',
      title: 'Initial lecture',
      subject_id: 's1',
      subject_name: 'Maths',
      is_published: true,
      video_url: 'https://example.com/watch',
      thumbnail_url: '',
      lecture_topic: 'Fractions',
      chapter_or_unit: 'Chapter 1',
      description: 'Learn basics.',
      instructor_name: 'Teacher A',
      duration: '10 min',
    }];

    api.list.mockImplementation((path) => {
      if (path === 'lecture-subjects') {
        return Promise.resolve(subjectState);
      }
      if (path === 'lectures') {
        return Promise.resolve(lectureState);
      }
      return Promise.resolve([]);
    });

    useApi.mockImplementation((fetcher) => {
      const fn = fetcher.toString();
      const path = fn.includes('lecture-subjects') ? 'lecture-subjects' : 'lectures';
      const setData = (value) => {
        if (path === 'lecture-subjects') subjectState = value;
        else lectureState = value;
      };
      api.list(path).then(setData);
      return {
        data: path === 'lecture-subjects' ? subjectState : lectureState,
        loading: false,
        setData,
      };
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.clearAllMocks();
  });

  it('reloads lecture content when a content update event fires', async () => {
    await act(async () => {
      root.render(<Lectures />);
    });

    expect(api.list.mock.calls.filter(([path]) => path === 'lectures').length).toBeGreaterThanOrEqual(1);
    expect(container.textContent).toContain('Initial lecture');

    lectureState = [{
      id: 'l2',
      title: 'Updated lecture',
      subject_id: 's1',
      subject_name: 'Maths',
      is_published: true,
      video_url: 'https://example.com/watch2',
      thumbnail_url: '',
      lecture_topic: 'Algebra',
      chapter_or_unit: 'Chapter 2',
      description: 'Newer topic.',
      instructor_name: 'Teacher B',
      duration: '12 min',
    }];

    await act(async () => {
      window.dispatchEvent(new CustomEvent('content-updated', { detail: { path: 'lectures' } }));
      await Promise.resolve();
    });

    expect(api.list.mock.calls.filter(([path]) => path === 'lectures').length).toBeGreaterThan(1);
  });
});

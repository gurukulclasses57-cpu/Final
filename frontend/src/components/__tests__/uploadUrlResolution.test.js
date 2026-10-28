jest.mock('../ui/input', () => ({
  Input: ({ value, onChange, placeholder, className, ...props }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} className={className} {...props} />
  ),
}));

jest.mock('../ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

const { resolveUrl } = require('../ImageUploadField');

describe('upload URL resolution', () => {
  beforeEach(() => {
    delete process.env.REACT_APP_BACKEND_URL;
  });

  it('falls back to the current origin when no backend URL is configured', () => {
    expect(resolveUrl('/api/uploads/test.png')).toBe(`${window.location.origin}/api/uploads/test.png`);
  });
});

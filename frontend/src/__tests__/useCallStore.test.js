import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCallStore } from '../store/useCallStore';
import toast from 'react-hot-toast';

// Mock Socket and react-hot-toast
vi.mock('react-hot-toast', () => {
  const toastMock = Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  });
  return {
    default: toastMock,
    toast: toastMock,
  };
});

vi.mock('../store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      socket: {
        emit: vi.fn(),
        off: vi.fn(),
      },
      authUser: { _id: 'user_123' },
    })
  }
}));

describe('useCallStore UI Logic', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useCallStore.setState({
      callStatus: 'idle',
      callType: null,
      incomingCall: null,
      remoteStream: null,
      localStream: null,
      isRemoteVideoMuted: false,
      callDuration: 0,
    });
    vi.clearAllMocks();
  });

  it('should handle call:rejected with busy reason correctly', () => {
    const { handleCallRejected } = useCallStore.getState();
    
    // Simulate being in a calling state
    useCallStore.setState({ callStatus: 'calling', callType: 'voice' });
    
    // Trigger rejection
    handleCallRejected({ reason: 'busy' });
    
    const state = useCallStore.getState();
    
    // Verify State is reset
    expect(state.callStatus).toBe('idle');
    expect(state.callType).toBe(null);
    expect(state.localStream).toBe(null);
    
    // Verify customized toast behavior
    expect(toast.error).toHaveBeenCalledWith("Người này đang bận trong một cuộc gọi khác.", { icon: '☎️' });
  });

  it('should handle call:rejected with offline reason correctly', () => {
    const { handleCallRejected } = useCallStore.getState();
    
    useCallStore.setState({ callStatus: 'calling' });
    handleCallRejected({ reason: 'offline' });
    
    expect(toast.error).toHaveBeenCalledWith("Người dùng đang ngoại tuyến, không thể nhận cuộc gọi.", { icon: '🚫' });
  });
});

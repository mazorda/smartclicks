import { renderHook, act } from '@testing-library/react';
import { useDomainAudit } from '../useDomainAudit';

// Example usage in a component:
/*
function DomainAuditDisplay() {
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    retry, 
    refresh 
  } = useDomainAudit();

  if (isLoading) {
    return <LoadingAnimation />;
  }

  if (isError) {
    return (
      <div>
        <p>Error: {error?.message}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <h2>{data.domain}</h2>
      <p>Traffic Score: {data.semrush_traffic_rank}</p>
      <p>Time on Site: {data.semrush_time_on_site}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
*/

// Mock the domain audit service
jest.mock('../../services/database', () => ({
  domainAuditServices: {
    getLatestDomainAudit: jest.fn(),
  },
}));

// Mock the logger
jest.mock('../../services/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

import { domainAuditServices } from '../../services/database';
import { TimeoutError, DomainAuditError } from '../../types/services';

describe('useDomainAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful data fetching', async () => {
    const mockData = {
      id: '1',
      domain: 'example.com',
      semrush_traffic_rank: 92000,
      semrush_time_on_site: 180,
      status: 'completed',
      enrichment_status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (domainAuditServices.getLatestDomainAudit as jest.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useDomainAudit());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);

    // Wait for the hook to update
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle timeout errors', async () => {
    (domainAuditServices.getLatestDomainAudit as jest.Mock).mockRejectedValueOnce(
      new TimeoutError('Request timed out')
    );

    const { result } = renderHook(() => useDomainAudit());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe('Request timed out. Please try again.');
  });

  it('should handle domain audit errors', async () => {
    (domainAuditServices.getLatestDomainAudit as jest.Mock).mockRejectedValueOnce(
      new DomainAuditError('Permission denied', 'PERMISSION_DENIED')
    );

    const { result } = renderHook(() => useDomainAudit());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe('Permission denied');
  });

  it('should handle refresh', async () => {
    const mockData = {
      id: '1',
      domain: 'example.com',
      semrush_traffic_rank: 92000,
      status: 'completed',
      enrichment_status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    (domainAuditServices.getLatestDomainAudit as jest.Mock)
      .mockResolvedValueOnce(mockData)
      .mockResolvedValueOnce({ ...mockData, semrush_traffic_rank: 90000 });

    const { result } = renderHook(() => useDomainAudit());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.data?.semrush_traffic_rank).toBe(92000);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.data?.semrush_traffic_rank).toBe(90000);
  });

  it('should handle retry with maximum attempts', async () => {
    (domainAuditServices.getLatestDomainAudit as jest.Mock)
      .mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useDomainAudit());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Attempt retries
    for (let i = 0; i < 4; i++) {
      await act(async () => {
        await result.current.retry();
      });
    }

    expect(result.current.isError).toBe(true);
    expect(result.current.error?.message).toBe('Maximum retry attempts reached. Please try again later.');
  });
});

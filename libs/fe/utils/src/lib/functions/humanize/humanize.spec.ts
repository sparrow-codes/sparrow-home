import { humanize } from './humanize';

describe('Humanize', () => {
  it('should humanize', () => {
    expect(humanize('test')).toEqual('Test');
    expect(humanize('test-test')).toEqual('Test test');
    expect(humanize('test-test-test')).toEqual('Test test test');
    expect(humanize('testTest')).toEqual('Test test');
    expect(humanize('testTestTest')).toEqual('Test test test');
    expect(humanize('test_test')).toEqual('Test test');
    expect(humanize('test_test_test')).toEqual('Test test test');
    expect(humanize('_test_test_test')).toEqual('Test test test');
    expect(humanize('_Test_test_test')).toEqual('Test test test');
    expect(humanize('')).toEqual('');
    expect(humanize(null)).toEqual('');
    expect(humanize(undefined)).toEqual('');
  });
});

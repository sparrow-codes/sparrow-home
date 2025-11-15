import { HumanizePipe } from './humanize.pipe';

describe('HumanizePipe', () => {
  it('create an instance', () => {
    const pipe: HumanizePipe = new HumanizePipe();
    expect(pipe).toBeTruthy();
  });

  it('should humanize', () => {
    const pipe: HumanizePipe = new HumanizePipe();
    expect(pipe.transform('test')).toEqual('Test');
    expect(pipe.transform('test-test')).toEqual('Test test');
    expect(pipe.transform('test-test-test')).toEqual('Test test test');
    expect(pipe.transform('testTest')).toEqual('Test test');
    expect(pipe.transform('testTestTest')).toEqual('Test test test');
    expect(pipe.transform('test_test')).toEqual('Test test');
    expect(pipe.transform('test_test_test')).toEqual('Test test test');
    expect(pipe.transform('_test_test_test')).toEqual('Test test test');
    expect(pipe.transform('_Test_test_test')).toEqual('Test test test');
    expect(pipe.transform('')).toEqual('');
    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(undefined)).toEqual('');
  });
});

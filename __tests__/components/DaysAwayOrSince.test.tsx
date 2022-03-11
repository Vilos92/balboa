import {shallow} from 'enzyme';

import {DaysAwayOrSince} from '../../components/DaysAwayOrSince';

/*
 * Constants.
 */

const startDate = '2022-05-18T11:00:00+0000';

/*
 * Tests.
 */

describe('DaysAwayOrSince', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders today', () => {
    jest.useFakeTimers().setSystemTime(new Date(startDate).getTime());

    const wrapper = shallow(<DaysAwayOrSince dateString={startDate} />);
    expect(wrapper.text()).toEqual('Today');
  });

  it('renders 7 days away', () => {
    jest.useFakeTimers().setSystemTime(new Date(startDate).getTime());

    const date7DaysAway = '2022-05-25T07:00:00+0000';
    const wrapper = shallow(<DaysAwayOrSince dateString={date7DaysAway} />);
    expect(wrapper.text()).toEqual('7 days away');
  });

  it('renders 7 days since', () => {
    jest.useFakeTimers().setSystemTime(new Date(startDate).getTime());

    const date7DaysBefore = '2022-05-11T07:00:00+0000';
    const wrapper = shallow(<DaysAwayOrSince dateString={date7DaysBefore} />);
    expect(wrapper.text()).toEqual('7 days since');
  });

  it('renders today when several hours ahead', () => {
    jest.useFakeTimers().setSystemTime(new Date(startDate).getTime());

    const dateAlsoToday = '2022-05-18T23:00:00+0000';
    const wrapper = shallow(<DaysAwayOrSince dateString={dateAlsoToday} />);
    expect(wrapper.text()).toEqual('Today');
  });

  it('renders today when several hours behind', () => {
    jest.useFakeTimers().setSystemTime(new Date(startDate).getTime());

    const dateAlsoToday = '2022-05-18T09:00:00+0000';
    const wrapper = shallow(<DaysAwayOrSince dateString={dateAlsoToday} />);
    expect(wrapper.text()).toEqual('Today');
  });
});

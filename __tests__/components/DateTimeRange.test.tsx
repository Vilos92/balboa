import {shallow} from 'enzyme';

import {DateTimeRange} from '../../components/DateTimeRange';

describe('DateTimeRange', () => {
  it('renders a Date Time Range within the same day', () => {
    const start = '2022-01-06T10:11:00+0000';
    const end = '2022-01-06T14:26:00+0000';

    const wrapper = shallow(<DateTimeRange start={start} end={end} />);
    expect(wrapper.text()).toEqual('January 6, 2022 at 2:11 AM - 6:26 AM');
  });

  it('renders a Date Time Range spanning multiple days', () => {
    const start = '2022-01-06T10:11:00+0000';
    const end = '2022-01-09T14:26:00+0000';

    const wrapper = shallow(<DateTimeRange start={start} end={end} />);
    expect(wrapper.text()).toEqual('January 6, 2022 at 2:11 AM - January 9, 2022 at 6:26 AM');
  });

  it('render a Date Time Range indicating invalid inputs', () => {
    const start = '';
    const end = '';

    const wrapper = shallow(<DateTimeRange start={start} end={end} />);
    expect(wrapper.text()).toEqual('Invalid Date at Invalid Date - Invalid Date');
  });

  it('render nothing when a Date Time Range has a greater start than end', () => {
    const start = '2022-01-09T14:26:00+0000';
    const end = '2022-01-06T10:11:00+0000';

    const wrapper = shallow(<DateTimeRange start={start} end={end} />);
    expect(wrapper.type()).toEqual(null);
  });
});

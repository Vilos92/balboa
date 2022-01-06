/**
 * This setup module will be run prior to every test file.
 */
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

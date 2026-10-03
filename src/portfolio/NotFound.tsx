import { Link } from 'react-router-dom';
import Header from './Header';
import Contact from './Contact';
import Icon from './Icon';

export default function NotFound() {
  return <><Header /><main id="main-content" className="not-found section-shell"><p className="eyebrow">404 / Outside the frame</p><h1>This frame<br /><em>is missing.</em></h1><p>The page you’re looking for isn’t in this collection.</p><Link to="/" className="button button-light">Back to the portfolio <Icon name="arrow" /></Link></main><Contact /></>;
}

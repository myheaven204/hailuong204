import { useContext } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { GalleryNavigation } from './navigation';

export default function MotionLink({ to, onClick, ...props }: Omit<LinkProps, 'to'> & { to: string }) {
  const transition = useContext(GalleryNavigation);
  return <Link {...props} to={to} onClick={event => {
    onClick?.(event);
    if (!transition || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (props.target && props.target !== '_self') || props.download !== undefined) return;
    event.preventDefault();
    transition(to);
  }} />;
}

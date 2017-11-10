import * as React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export const LayoutTopNav: React.SFC<{className?: string}> = props => {
  return (
    <nav className={classNames("c-nav c-nav--inline", props.className)}>
      {props.children}
    </nav>
  );
};

export interface LayoutTopNavLinkProps {
  className?: string;
  href: string;
  isRight?: boolean;
  isPrimary?: boolean;
}

export const LayoutTopNavLink: React.SFC<LayoutTopNavLinkProps> = props => {
  const classList = classNames(props.className, 'c-nav__item', {
    'c-nav__item--info': props.isPrimary,
    'c-nav__item--right': props.isRight,
  });
  const activeClassList = classNames(
    'c-nav__item--active',
  );

  return (
    <Link to={props.href} className={classList} activeClassName={activeClassList}>
      {props.children}
    </Link>
  );
}

LayoutTopNavLink.defaultProps = {
  className: "",
  href: "/",
  isRight: false,
  isPrimary: false,
};

import * as React from "react";
import * as classNames from "classnames";
import { NavLink } from "react-router-dom";

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
  const classList = classNames(props.className, "c-nav__item", {
    "c-nav__item--info": props.isPrimary,
    "c-nav__item--right": props.isRight,
  });
  const activeClassList = classNames(
    "c-nav__item--active",
  );

  return (
    <NavLink to={props.href} className={classList} activeClassName={activeClassList}>
      {props.children}
    </NavLink>
  );
}

LayoutTopNavLink.defaultProps = {
  className: "",
  href: "/",
  isRight: false,
  isPrimary: false,
};

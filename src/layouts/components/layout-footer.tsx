import * as React from 'react';
import classNames from 'classnames';


export const LayoutFooter: React.SFC<{className?: string}> = props => {

  const classList = classNames(
    props.className,
    'u-centered',
    'u-letter-box--medium',
  );

  return (
    <footer className={classList}>
      {props.children}
    </footer>
  );
}

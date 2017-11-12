import * as React from "react";
import * as classNames from "classnames";

export const LayoutHeader: React.SFC<{className?: string}> = props => {

  const classList = classNames(
    props.className,
  );

  return (
    <header className={classList}>
      {props.children}
    </header>
  );
};

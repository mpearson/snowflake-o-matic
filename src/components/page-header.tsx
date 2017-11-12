import * as React from "react";
import * as classNames from "classnames";

export const PageHeader: React.SFC<{className?: string}> = props => {
  const classList = classNames(
    props.className.toString(),
    "c-heading",
    "u-centered",
  );

  return (
    <h2 className={classList}>
      {props.children}
    </h2>
  );
}

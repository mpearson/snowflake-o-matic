import * as React from "react";
import * as classNames from "classnames";

export const LayoutMain: React.SFC<{className?: string}> = props => {

  const classList = classNames(
    props.className,
  );
  const innerClass = classNames(
    "o-container o-container--medium",
  );

  return (
    <main className={classList}>
      <div className={innerClass}>
        {props.children}
      </div>
    </main>
  );
}

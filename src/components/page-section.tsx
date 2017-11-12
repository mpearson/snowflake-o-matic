import * as React from "react";
import * as classNames from "classnames";

export const PageSection: React.SFC<{className?: string}> = props => {
  const classList = classNames(
    props.className.toString(),
    "o-grid",
  );
  const innerClass = classNames(
    "o-grid__cell",
  );

  return (
    <section className={classList}>
      <div className={innerClass}>{props.children}</div>
    </section>
  );
}

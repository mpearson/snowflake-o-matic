import * as React from "react";
import * as classNames from "classnames";

export interface PageHeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PageHero: React.SFC<PageHeroProps> = props => {

  const classList = classNames(
    props.className,
    "u-centered",
    "u-letter-box--super",
  );

  return (
    <section className={classList}>
      <h1 className="c-heading u-window-box--none">
        {props.title}
      </h1>
      <h3 className="c-heading u-window-box--none">
        {props.subtitle}
      </h3>
      <div>
        {props.children}
      </div>
    </section>
  );
};

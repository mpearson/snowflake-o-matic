import "./main-layout.less";
import * as React from "react";
import { LayoutTopNav, LayoutTopNavLink } from "./components/layout-top-nav";
import { LayoutHeader } from "./components/layout-header";
import { LayoutMain } from "./components/layout-main";
import { LayoutFooter } from "./components/layout-footer";

export class MainLayout extends React.Component<{}, {}> {
  render() {
    const {children} = this.props;

    return (
      <div className="c-text">
        <LayoutHeader>
          <LayoutTopNav>
            <LayoutTopNavLink href="/" isPrimary className="nav-link"> Snowflake-O-Matic </LayoutTopNavLink>
          </LayoutTopNav>
        </LayoutHeader>

        <LayoutMain>
          {children}
        </LayoutMain>

        <LayoutFooter>
        </LayoutFooter>
      </div>
    );
  };
};

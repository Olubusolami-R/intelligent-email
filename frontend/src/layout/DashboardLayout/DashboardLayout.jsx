import React from "react";
import { Link, useLocation } from "react-router-dom";
import classes from "./DashboardLayout.module.css";
import { ReactComponent as InboxIcon } from "../../assets/inbox.svg";
import { ReactComponent as LogoutIcon } from "../../assets/logout.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";
import { ReactComponent as SendIcon } from "../../assets/send.svg";
import { Button } from "../../components/Button/Button";

const navItems = [
  {
    name: "Inbox",
    icon: <InboxIcon />,
    path: "/",
    counter: 0,
  },
  // {
  //   name: "Send",
  //   icon: <SendIcon />,
  //   path: "/send",
  // },
  {
    name: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
  },
  {
    name: "Logout",
    icon: <LogoutIcon />,
    path: "/login",
  },
];

export const DashboardLayout = ({ children, title }) => {
  const location = useLocation();

  return (
    <div>
      <div className={classes.left}>
        <div className={classes.header}>
          <h1>Hello and welcome!</h1>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link to={item.path} key={item.name}>
              <div
                className={`${classes.navItem} ${
                  location.pathname === item.path
                    ? classes.navItemActive
                    : undefined
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.counter > 0 && <span className={classes.counter}>0</span>}
              </div>
            </Link>
          ))}
        </nav>

        <div className={classes.floatingButton}>
          <Button size='small' text='+ New Message' />
        </div>
      </div>

      <div className={classes.right}>{children}</div>
    </div>
  );
};

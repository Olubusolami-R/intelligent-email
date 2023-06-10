import React from "react";
import classes from "./Tab.module.css";

const sizes = {
  small: classes.smallButton,
  medium: classes.mediumButton,
  large: classes.largeButton,
};

export const Tab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className={classes.tab}>
      {tabs.map((tab) => (
        <span
          className={activeTab === tab && classes.activeTab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </span>
      ))}
    </div>
  );
};

import React, { useState } from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import { Tab } from "../../components/Tab/Tab";
import classes from "./Inbox.module.css";
import { Empty } from "../../components/Empty/Empty";

const tabs = ["All", "Unreads"];

export const Inbox = () => {
  const [activeTab, setActiveTab] = useState("All");
  return (
    <DashboardLayout>
      <div className={classes.container}>
        <div className={classes.firstHalf}>
          <h1 className={classes.title}>Inbox</h1>
          <Tab activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          <div style={{ height: "60vh" }}>
            <Empty text='No message available' />
          </div>
        </div>

        <div className={classes.secondHalf}>
          <div style={{ height: "100vh" }}>
            <Empty text='No message available' />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

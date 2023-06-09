import React, { useState } from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import classes from "./Send.module.css";
import { Empty } from "../../components/Empty/Empty";
import { Tab } from "../../components/Tab/Tab";
const tabs = ["All", "Auto Reply"];
export const Send = () => {
  const [activeTab, setActiveTab] = useState("All");
  return (
    <DashboardLayout title='Send'>
      <div className={classes.container}>
        <div className={classes.firstHalf}>
          <h1 className={classes.title}>Send</h1>
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

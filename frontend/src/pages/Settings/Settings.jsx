import React from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import classes from "./Settings.module.css";
import { Button } from "../../components/Button/Button";
export const Settings = () => {
  return (
    <DashboardLayout>
      <div className={classes.wrapper}>
        <h1 className={classes.title}>Settings</h1>
        <div className={classes.select}>
          <label className={classes.container}>
            Enable auto-response
            <input type='radio' checked='checked' name='radio' />
            <span className={classes.checkmark}></span>
          </label>
          <label className={classes.container}>
            Disable auto-response
            <input type='radio' checked='checked' name='radio' />
            <span className={classes.checkmark}></span>
          </label>
        </div>

        <Button size='small' text='Save Settings' />
      </div>
    </DashboardLayout>
  );
};

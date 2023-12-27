import React, { useState, useEffect } from "react";
import axios from "axios";
import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import classes from "./Settings.module.css";
import { Button } from "../../components/Button/Button";

const storedUserId = localStorage.getItem('user_id');

export const Settings = () => {
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Fetch user preferences from the backend
    const storedUserId = localStorage.getItem('user_id');

    axios
      .get(`/get_user_preference/${storedUserId}`)
      .then((response) => {
        setAutoResponseEnabled(response.data.preference === "enabled");
      })
      .catch((error) => {
        console.error("Error fetching user preferences:", error);
      });
  }, []);
  
  const handleSaveSettings = () => {
    // Update user preference in the backend
    const newPreference = autoResponseEnabled ? "enabled" : "disabled";

    axios
      .post(`/update_user_preference/${storedUserId}`, { preference: newPreference })
      .then((response) => {
        setShowAlert(true);
        console.log("User preference updated successfully:", response.data);
        // You may want to show a success message or update the UI accordingly
      })
      .catch((error) => {
        console.error("Error updating user preference:", error);
        // Handle error and update UI accordingly
      });
  };

  return (
    <DashboardLayout>
      <div className={classes.wrapper}>
        <h1 className={classes.title}>Settings</h1>
        <div className={classes.select}>
          <label className={classes.container}>
            Enable auto-response
            <input
              type='radio'
              checked={autoResponseEnabled}
              onChange={() => setAutoResponseEnabled(true)}
              name='radio'
            />
            <span className={classes.checkmark}></span>
          </label>
          <label className={classes.container}>
            Disable auto-response
            <input
              type='radio'
              checked={!autoResponseEnabled}
              onChange={() => setAutoResponseEnabled(false)}
              name='radio'
            />
            <span className={classes.checkmark}></span>
          </label>
        </div>

        <Button size='small' text='Save Settings' onClick={handleSaveSettings} />
      </div>
    </DashboardLayout>
  );
};

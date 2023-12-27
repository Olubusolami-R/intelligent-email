import React, { useState, useEffect } from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import { Tab } from "../../components/Tab/Tab";
import classes from "./Inbox.module.css";
import { Empty } from "../../components/Empty/Empty";
import { Email } from "../../components/Email/Email";
import { EmailContent } from "../../components/EmailContent/EmailContent";
import axios from "axios";

const tabs = ["All", "Unreads"];
const storedUserId = localStorage.getItem('user_id');


export const Inbox = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  console.log(storedUserId)
  useEffect(() => {
    
    axios.get(`/retrieve_inbox/${storedUserId}`)
      .then((response) => {
        setEmails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
      });
  }, []);

  const markEmailAsRead = (emailId) => {
    console.log("Email id is:")
    console.log(emailId)
    axios
      .post(`/update_email/${storedUserId}/${emailId}`, { unread: false })
      .then((response) => {
        console.log(response)
        const updatedEmails = emails.map((email) => {
          if (email.id === emailId) {
            return { ...email, unread: false };
          }
          return email;
        });
        setEmails(updatedEmails);
      })
      .catch((error) => {
        console.error("Error updating email:", error);
      });
  };

  const unreadEmails = emails.filter((email) => email.unread);

  console.log('expandedEmail', expandedEmail)

  return (
    <DashboardLayout>
      <div className={classes.container}>
        <div className={classes.firstHalf}>
          <div className={classes.header}>
            <h1 className={classes.title}>Inbox</h1>
            <Tab activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          </div>
          {activeTab === "All" && (
            <>
              {emails.length === 0 ? (
                <div style={{ height: "60vh" }}>
                  <Empty text="No messages available" />
                </div>
              ) : (
                <div className={classes.emailContainer}>
                  {emails.map((email) => (
                    <Email
                      key={email.id}
                      onClick={() => 
                        {
                          setExpandedEmail(email);
                          markEmailAsRead(email.id); // Call the function to mark email as read
                        }
                      }
                      email={email}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "Unreads" && (
            <>
              {unreadEmails.length === 0 ? (
                <div style={{ height: "60vh" }}>
                  <Empty text="No unread messages available" />
                </div>
              ) : (
                <div className={classes.emailContainer}>
                  {unreadEmails.map((email) => (
                    <Email
                      key={email.id}
                      // onClick={() => setExpandedEmail(email)}
                      onClick={() => {
                        setExpandedEmail(email);
                        markEmailAsRead(email.id); // Call the function to mark email as read
                      }}
                      email={email}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={classes.secondHalf}>
          {expandedEmail !== null ? (
            <EmailContent email={expandedEmail} />
          ) : (
            <div style={{ height: "100vh" }}>
              <Empty text="No message available" />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};


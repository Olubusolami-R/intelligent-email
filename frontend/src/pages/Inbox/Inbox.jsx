import React, { useState, useMemo } from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import { Tab } from "../../components/Tab/Tab";
import classes from "./Inbox.module.css";
import { Empty } from "../../components/Empty/Empty";
import { Email } from "../../components/Email/Email";
import { EmailContent } from "../../components/EmailContent/EmailContent";

const tabs = ["All", "Unreads"];

const mockEmails = [
  {
    senderName: "Busolami Sogunle",
    subject: "Help Treat this ASAP",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: true,
    unread: false,
    dateTime: "24th June, 2023",
  },
  {
    senderName: "Omowunmi Sogunle",
    subject: "CYDM",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: false,
    unread: true,
    dateTime: "21st June, 2023",
  },
  {
    senderName: "TestName Sogunle",
    subject: "Hello, Nice to Meet You",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: true,
    unread: false,
    dateTime: "20th June, 2023",
  },
  {
    senderName: "Rose Mary",
    subject: "About your Scholarship",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: true,
    unread: false,
    dateTime: "11th June, 2023",
  },
];

// const mockEmails = [];
export const Inbox = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedEmail, setExpandedEmail] = useState(null);

  const unreadEmails = useMemo(
    () => mockEmails.filter((email) => email.unread),
    [mockEmails]
  );

  return (
    <DashboardLayout>
      <div className={classes.container}>
        <div className={classes.firstHalf}>
          <div className={classes.header}>
            <h1 className={classes.title}>Inbox</h1>
            <Tab
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
          </div>
          {activeTab === "All" && (
            <>
              {mockEmails.length === 0 ? (
                <div style={{ height: "60vh" }}>
                  <Empty text='No messages available' />
                </div>
              ) : (
                <div className={classes.emailContainer}>
                  {mockEmails.map((email) => (
                    <Email
                      onClick={() => setExpandedEmail(email)}
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
                  <Empty text='No unread messages available' />
                </div>
              ) : (
                <div className={classes.emailContainer}>
                  {unreadEmails.map((email) => (
                    <Email email={email} />
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
              <Empty text='No message available' />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

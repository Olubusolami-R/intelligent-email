import React, { useState, useMemo } from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import classes from "./Send.module.css";
import { Empty } from "../../components/Empty/Empty";
import { Tab } from "../../components/Tab/Tab";
import { EmailContent } from "../../components/EmailContent/EmailContent";
import { Email } from "../../components/Email/Email";
const tabs = ["All", "Auto Reply"];

const mockEmails = [
  {
    senderName: "Busolami Sogunle",
    subject: "Help Treat this ASAP",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: true,
    unread: false,
    dateTime: "24th June, 2023",
    content: [
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
    ],
  },
  {
    senderName: "Omowunmi Sogunle",
    subject: "CYDM",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: false,
    unread: true,
    dateTime: "21st June, 2023",
    content: [
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
    ],

    reply: {
      senderName: "Busola Sogunle",
      dateTime: "23rd June, 2023",
      isAutoReply: true,
      to: "Omowunmi Sogunle",
      content: [
        "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      ],
    },
  },
  {
    senderName: "TestName Sogunle",
    subject: "Hello, Nice to Meet You",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: true,
    unread: false,
    dateTime: "20th June, 2023",
    content: [
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
    ],

    reply: null,
  },
  {
    senderName: "Rose Mary",
    subject: "About your Scholarship",
    preview:
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet",
    isAutoReply: true,
    unread: false,
    dateTime: "11th June, 2023",
    content: [
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
      "Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit ametEmail snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet Email snippet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.",
    ],

    reply: null,
  },
];

export const Send = () => {
  const [activeTab, setActiveTab] = useState("All");

  const [expandedEmail, setExpandedEmail] = useState(null);

  const autoReplied = useMemo(
    () => mockEmails.filter((email) => email.isAutoReply),
    [mockEmails]
  );
  return (
    <DashboardLayout title='Send'>
      <div className={classes.container}>
        <div className={classes.firstHalf}>
          <div className={classes.header}>
            <h1 className={classes.title}>Send</h1>
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

          {activeTab === "Auto Reply" && (
            <>
              {autoReplied.length === 0 ? (
                <div style={{ height: "60vh" }}>
                  <Empty text='No autoReplied messages available' />
                </div>
              ) : (
                <div className={classes.emailContainer}>
                  {autoReplied.map((email) => (
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

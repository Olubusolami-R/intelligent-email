import React, { useState, useEffect } from "react";

import { DashboardLayout } from "../../layout/DashboardLayout/DashboardLayout";
import { Tab } from "../../components/Tab/Tab";
import classes from "./Inbox.module.css";
import { Empty } from "../../components/Empty/Empty";
import { Email } from "../../components/Email/Email";
import { EmailContent } from "../../components/EmailContent/EmailContent";
import axios from "axios";

const tabs = ["All", "Unreads"];

export const Inbox = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get("/retrieve_inbox")
      .then((response) => {
        setEmails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
      });
  }, []);

  // const unreadEmails = useMemo(
  //   () => emails.filter((email) => email.unread),
  //   [emails]
  // );

  const markEmailAsRead = (emailId) => {
    console.log("Email id is:")
    console.log(emailId)
    axios
      .post(`/update_email/${emailId}`, { unread: false })
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

//   return (
//     <DashboardLayout>
//       <div className={classes.container}>
//         <div className={classes.firstHalf}>
//           <div className={classes.header}>
//             <h1 className={classes.title}>Inbox</h1>
//             <Tab
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               tabs={tabs}
//             />
//           </div>
//           {activeTab === "All" && (
//             <>
//               {mockEmails.length === 0 ? (
//                 <div style={{ height: "60vh" }}>
//                   <Empty text='No messages available' />
//                 </div>
//               ) : (
//                 <div className={classes.emailContainer}>
//                   {mockEmails.map((email) => (
//                     <Email
//                       onClick={() => setExpandedEmail(email)}
//                       email={email}
//                     />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {activeTab === "Unreads" && (
//             <>
//               {unreadEmails.length === 0 ? (
//                 <div style={{ height: "60vh" }}>
//                   <Empty text='No unread messages available' />
//                 </div>
//               ) : (
//                 <div className={classes.emailContainer}>
//                   {unreadEmails.map((email) => (
//                     <Email email={email} />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         <div className={classes.secondHalf}>
//           {expandedEmail !== null ? (
//             <EmailContent email={expandedEmail} />
//           ) : (
//             <div style={{ height: "100vh" }}>
//               <Empty text='No message available' />
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

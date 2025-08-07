"use client";
import styles from "./settings.module.css";
import { useEffect, useRef, useState } from "react";
import { Cat, CatIcon, Settings, X } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';
import { login,logout, signup } from "@/app/utils/auth-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";
import Switch from "react-switch";
import { createClient } from "@/app/utils/supabase/client";
import { Mail, Lock } from "lucide-react";

export default function SettingsModal({}) {
  // State variables for managing modal visibility, settings, and user authentication.
  const [modalVisible, setModalVisible] = useState(false);
    const [settings, setSettings] = useState({
    dark: false,
    by2lay: false,
    intitle: false,
    shortitle: false,
    nolimit: false,
    threebar: false,
    pricecat: "stu",
    gridStructure: 0,
    language: 'en',
  });
  const [user, setUser] = useState();
  const [usermail, setUsermail] = useState("");
  const [userpass, setUserpass] = useState("");

  useEffect(() => {
    // Fetch settings from cookies and initialize state.
    const settingsString = getCookie('settings');
    if (settingsString && settingsString.length > 0) {
      const parsed = JSON.parse(settingsString);
      setSettings(parsed);
    }
    // Fetch user data from Supabase.
    async function fetchUserData() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data?.user);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    // Disable page scrolling when the settings modal is open.
    if (modalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalVisible]);


  // Toggle individual settings and update cookies.
    const handleSettingChange = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    setCookie('settings', JSON.stringify(updatedSettings));

    // Apply specific changes based on the setting toggled.
    if (key === "dark") {
      document.documentElement.setAttribute('data-theme', value ? "dark" : "light");
    }
    if (key === "by2lay" || key === "nolimit" || key === "shortitle" || key === "pricecat") {
      window.location.reload();
    }
  };



  // Handle user login.
  async function handleLogin() {
    const response = await login(usermail,userpass);
    if(!response?.error) {
      setUser(response?.user);
      toast.success('Login successful');
    } else {
      toast.error(response?.error);
    }
  }

  // Handle user signup.
  async function handleSignup() {
    const response = await signup(usermail,userpass);
    if(!response?.error) {
      setUser(response?.user);
      toast.success('Signup successful');
    } else {
      toast.error(response?.error);
    }
  }

  // Handle user logout.
  async function handleLogout() {
    const error = await logout();
    if(!error) {
      setUser(null);
      toast.success('Logged out');
    } else {
      toast.error(error);
    }
  }


  // Render the settings modal UI.
  return (
    <>
      {/* Button to open the settings modal */}
      <button className={styles.settingsButton} title="Settings and Account" onClick={() => setModalVisible(true)}>
        <Settings className={styles.filterIcon} />
      </button>
      {modalVisible && (
        <div className={styles.popupOverlay} onClick={() => setModalVisible(false)}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setModalVisible(false)} className={styles.popupCloseButton}><X /></button>
            <h2 className={styles.popupTitle}>Settings</h2>
            <Tabs defaultValue="general" className={styles.popupTabs}>
              <TabsList className={styles.popupTabsList}>
                {/* Tabs for general settings and identity management */}
                <TabsTrigger className={styles.popupTabsTrigger} value="general">General</TabsTrigger>
                <TabsTrigger className={styles.popupTabsTrigger} value="identity">Identity</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
               { /* Render general settings */}

                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("dark", e)} checked={settings.dark} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Dark mode</span>
                          <p className={styles.popupOptionDescription}>Turn of the lights</p>
                        </label>
                        </div>

                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("intitle", e)} checked={settings.intitle} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Additives in title</span>
                          <p className={styles.popupOptionDescription}>Display additives in the title (popup)</p>
                        </label>
                        </div>

                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("threebar", e)} checked={settings.threebar} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Bulletpoints</span>
                          <p className={styles.popupOptionDescription}>Display the meal title in a bullet point format (popup)</p>
                        </label>
                        </div>

                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("shortitle", e)} checked={settings.shortitle} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Short title</span>
                          <p className={styles.popupOptionDescription}>Only show a shortened version of the meal title</p>
                        </label>
                        </div>
                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("by2lay", e)} checked={settings.by2lay} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>New mobile layout</span>
                          <p className={styles.popupOptionDescription}>Show two instead of one meal in the same row</p>
                        </label>
                        </div>

                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("nolimit", e)} checked={settings.nolimit} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Remove limiter</span>
                          <p className={styles.popupOptionDescription}>Remove the limit to display more than 8 days in advance</p>
                        </label>
                        </div>

                        <div className={styles.seperator}></div>


                        <div className={styles.popupOption}>
                          <span style={{width: "100%", textAlign: "left"}}>Price category: </span>
                          <select className={styles.popupSelect} value={settings.pricecat} onChange={(e) => handleSettingChange("pricecat", e.target.value)} >
                          <option value="stu">Students</option>
                          <option value="bed">Employees</option>
                          <option value="gas">Guests</option>
                          </select>
                        </div>

                        <div className={styles.popupOption}>
                          <span style={{width: "100%", textAlign: "left"}}>Language (disabled): </span>
                          <select className={styles.popupSelect} disabled value={settings.lang} onChange={(e) => handleSettingChange("lang", e.target.value)} >
                          <option value="eng">English</option>
                          <option value="ger">German</option>
                          </select>
                        </div>

                        </TabsContent>

                        <TabsContent value="identity">
                        {/* Render identity management options */}
                <div className={styles.popupOption}>
                  {user ? (
                    <div className={styles.popupUserContainer}>
                      <p className={styles.popupUserEmail}>{user.email}{user.email.includes("zoe.") &&<CatIcon />}</p>
                      <button className={styles.popupButton} onClick={() => handleLogout()}>Logout</button>
                    </div>
                  ) : (
                    <div className={styles.popupUserContainer}>
                      {/* Login and signup inputs */}
                      <div className={styles.popupInputContainer}>
                        <label className={styles.popupLabel}><Mail size={16} />Email</label>
                        <input type="email" placeholder="example@rptu.de" maxLength={60} value={usermail} onChange={(e) => setUsermail(e.target.value)} className={styles.popupInput} />
                        <label className={styles.popupLabel}><Lock size={16} />Password</label>
                        <input type="password" placeholder="Password" maxLength={25} value={userpass} onChange={(e) => setUserpass(e.target.value)} className={styles.popupInput} />
                      </div>
                      <div className={styles.popupButtonContainer}>
                        <button className={styles.popupButton} onClick={() => handleLogin()}>Login</button><p>or</p>
                        <button className={styles.popupButton} onClick={() => handleSignup()}>Signup</button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
}

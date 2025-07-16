"use client";
import styles from "./settings.module.css";
import { useEffect, useRef, useState } from "react";
import { Settings, X } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';
import { login,logout, signup } from "@/app/utils/auth-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";
import Switch from "react-switch";
import { createClient } from "@/app/utils/supabase/client";

const settingslist =[ 
  { id: "dark", name: "Dark mode", enabled: true},
  { id: "by2lay", name: "Better mobile layout", enabled: true },
  { id: "intitle", name: "Additives in popup title", enabled: true },
  { id: "shortitle", name: "Supershort meal title", enabled: true },
  { id: "nolimit", name: "Remove limit of 8 days", enabled: true },
]

export default function SettingsModal({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [settings, setSettings] = useState([false,false,false,false,false]);
  const [user,setUser] = useState();
  const [usermail,setUsermail] = useState("");
  const [userpass,setUserpass] = useState("");

  useEffect(() => {
    // fetch cookies
    const settingscookie = getCookie('settings');
    const settingsObject = settingscookie ? JSON.parse(settingscookie) : {};
    const settingsArray = settingslist.map(setting => !!settingsObject[setting.id]);
    setSettings(settingsArray);
    async function fetchUserData() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if(data?.user) {
        setUser(data?.user);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalVisible]);


  function toggleSwitch(index, state) {
    setSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = state;
      return updatedSettings;
    });
    const updatedSettings = [...settings];
    updatedSettings[index] = state;
    const mappedSettings = settingslist.map((setting, index) => ({[setting.id]: updatedSettings[index]})).reduce((acc, cur) => ({...acc, ...cur}), {});
    setCookie('settings', JSON.stringify(mappedSettings));

    toast.success('Settings saved!');
    const changedSetting = settingslist[index].id;
    if(changedSetting === "dark") {
      document.documentElement.setAttribute('data-theme', state ? "dark" : "light");
    }
    if(changedSetting === "by2lay" || changedSetting === "nolimit" || changedSetting === "shortitle") {
      window.location.reload();
    }
  }

  async function handleLogin() {
    const response = await login(usermail,userpass);
    if(!response?.error) {
      setUser(response?.user);
      toast.success('Login successful');
    } else {
      toast.error(response?.error);
    }
  }

  async function handleSignup() {
    const response = await signup(usermail,userpass);
    if(!response?.error) {
      setUser(response?.user);
      toast.success('Signup successful');
    } else {
      toast.error(response?.error);
    }
  }

  async function handleLogout() {
    const error = await logout();
    if(!error) {
      setUser(null);
      toast.success('Logged out');
    } else {
      toast.error(error);
    }
  }


  return (
    <>
      <button className={styles.settingsButton} title="Settings and Account" onClick={() => setModalVisible(true)}>
        <Settings />
      </button>
      {modalVisible && (
        <div className={styles.popupOverlay} onClick={() => setModalVisible(false)}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModalVisible(false)} className={styles.popupCloseButton}><X /></button>
            <h2 className={styles.popupTitle}>Settings</h2>
            <Tabs defaultValue="general" className={styles.popupTabs}>
                <TabsList className={styles.popupTabsList}>
                    <TabsTrigger className={styles.popupTabsTrigger} value="general">General</TabsTrigger>
                    <TabsTrigger className={styles.popupTabsTrigger} value="identity">Identity</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  {settingslist.map((setting, index) => (
                    <div key={index} className={styles.popupOption}>
                      <label htmlFor={setting.id} className={styles.popupOptionLabel}>
                        <Switch onChange={(e) => toggleSwitch(index, e)} disabled={!setting.enabled} checked={settings[index]} onColor="#fbbf24"  />
                        <span>{setting.name}</span>
                      </label>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="identity">
                <div className={styles.popupOption}>
                  {user ? (
                  <button className={styles.popupButton} onClick={() => handleLogout()}>Logout</button>
                  ) : (<div className={styles.popupUserContainer}>
                    <div className={styles.popupInputContainer}>
                      <input type="email" placeholder="Email" value={usermail} onChange={(e) => setUsermail(e.target.value)} className={styles.popupInput} />
                      <input type="password" placeholder="Password" value={userpass} onChange={(e) => setUserpass(e.target.value)} className={styles.popupInput} />
                      </div>
                      <div className={styles.popupButtonContainer}>
                      <button className={styles.popupButton} onClick={() => handleLogin()}>Login</button>
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

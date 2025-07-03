"use client";
import styles from "./settings.module.css";
import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';
import { login } from "@/app/utils/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";
import Switch from "react-switch";

const settingslist =[ 
  { id: "dark", name: "Dark mode"},
  { id: "by2lay", name: "Better mobile layout" },
  { id: "intitle", name: "Additives in popup title" }]

export default function SettingsModal({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [settings, setSettings] = useState([false,false,false,false,false]);

  useEffect(() => {
    // fetch cookies
    const settingscookie = getCookie('settings');
    const settingsObject = settingscookie ? JSON.parse(settingscookie) : {};
    const settingsArray = settingslist.map(setting => !!settingsObject[setting.id]);
    setSettings(settingsArray);
  }, []);


  function toggleSwitch(index, state) {
    setSettings((prevSettings) => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = state;
      return updatedSettings;
    });
    const updatedSettings = [...settings];
    updatedSettings[index] = state;
    const mappedSettings = settingslist.map((setting, index) => ({[setting.id]: updatedSettings[index]})).reduce((acc, cur) => ({...acc, ...cur}), {});
    console.log(mappedSettings);
    setCookie('settings', JSON.stringify(mappedSettings));


    toast.success('Settings saved!');
    if(settingslist[index].id === "dark") {
      document.documentElement.setAttribute('data-theme', state ? "dark" : "light");
    }
    if(settingslist[index].id === "by2lay") {
      window.location.reload();
    }   
  }


  return (
    <>
      <button className={styles.settingsButton} onClick={() => setModalVisible(true)}>
        <Settings />
      </button>
      {modalVisible && (
        <div className={styles.popupOverlay} onClick={() => setModalVisible(false)}>
            <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
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
                        <Switch onChange={(e) => toggleSwitch(index, e)} checked={settings[index]} onColor="#fbbf24"  />
                        <span>{setting.name}</span>
                      </label>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="identity">
                  <p>Shibboleth login for comments and images?</p>
                <div className={styles.popupOption}>
                </div>
                </TabsContent>
            </Tabs>
            <button className={styles.popupButton} onClick={() => setModalVisible(false)}>Close</button>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
}

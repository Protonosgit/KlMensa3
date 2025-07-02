"use client";
import styles from "./settings.module.css";
import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';
import { login } from "@/app/utils/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";
import { set } from "date-fns";

const settingsList = [
  { id: "dark", name: "Dark mode" },
  { id: "by2lay", name: "Better mobile layout" },
  { id: "intitle", name: "Additives in popup title" },
];

export default function SettingsModal({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if(!getCookie('noid') === 'true') {
        login();
    }
    // fetch cookies
    const settingscookie = getCookie('settings');
    setSettings(settingscookie ? JSON.parse(settingscookie) : {});
  }, []);

  function saveSettings() {
    setCookie('settings', JSON.stringify(settings));
    toast.success('Settings saved!');
    setModalVisible(false);
    window.location.reload();
  }

  const Switch = ({ id, name }) => {
    return (
      <div className={styles.popupOption}>
        <label className={styles.switch}>
          <input type="checkbox" id={id} name={name} 
          checked={settings[id]} onChange={(e) => {setSettings({ ...settings, [id]: e.target.checked });}}
          />
          <span className={styles.slider}></span>
        </label>
        <p htmlFor={id}>{name}</p>
      </div>
    );
  };

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
                  {settingsList.map((setting) => (
                    <div key={setting.id} className={styles.popupOption}>
                      <Switch id={setting.id} name={setting.name} />
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="identity">
                <div className={styles.popupOption}>
                    <Switch id="noid" name="noid" />
                    <p htmlFor="noid">Ghost Mode👻 (No identity cookie)</p>
                </div>
                </TabsContent>
            </Tabs>
            <button className={styles.popupButton} onClick={saveSettings}>Save</button>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
}

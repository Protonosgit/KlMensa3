"use client";
import styles from "./settings.module.css";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { toast, Toaster } from 'react-hot-toast';
import { login } from "@/app/utils/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { getCookie, setCookie } from "@/app/utils/cookie-monster";

export default function SettingsModal({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isGhost, setIsGhost] = useState(false);

  useEffect(() => {
    if(!getCookie('noid') === 'true') {
        login();
    }
  }, []);

  function saveSettings(event) {
    event.preventDefault();
    // get switch info
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log(data);
  }

  return (
    <>
      <button className={styles.settingsButton} onClick={() => setModalVisible(true)} style={{display: 'none'}}>
        <Settings size={20} />
      </button>
      {modalVisible && (
        <div className={styles.popupOverlay} onClick={() => setModalVisible(false)}>
            <form className={styles.popupContent} onSubmit={saveSettings} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.popupTitle}>Settings</h2>
            <Tabs defaultValue="general" className={styles.popupTabs}>
                <TabsList className={styles.popupTabsList}>
                    <TabsTrigger className={styles.popupTabsTrigger} value="general">General</TabsTrigger>
                    <TabsTrigger className={styles.popupTabsTrigger} value="identity">Identity</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                <div className={styles.popupOption}>
                    <Switch id="darkside" name="darkside" />
                    <p htmlFor="darkside">Darkmode🌑</p>
                </div>
                <div className={styles.popupOption}>
                    <Switch id="disable-ads" name="disable-ads" />
                    <p htmlFor="disable-ads">Disable Ads (beta)</p>
                </div>
                <div className={styles.popupOption}>
                    <Switch id="disable-ads" name="disable-ads" />
                    <p htmlFor="disable-ads">Hide STT button</p>
                </div>
                </TabsContent>
                <TabsContent value="identity">
                <div className={styles.popupOption}>
                    <Switch id="noid" name="noid" />
                    <p htmlFor="noid">Ghost Mode👻 (No identity cookie)</p>
                </div>
                </TabsContent>
            </Tabs>
            <button className={styles.popupButton} type="submit">Save</button>
          </form>
        </div>
      )}
      <Toaster />
    </>
  );
}

"use client";
import styles from "./SettingsModal.module.css";
import shared from "@/styles/shared.module.css";
import { useEffect, useState } from "react";
import { Switch } from "./Switch";
import {
  CatIcon,
  ImageIcon,
  LayoutList,
  MailIcon,
  Settings,
  StarIcon,
  X,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { login, logout } from "@/app/utils/auth-actions";
import { getCookie, setCookie } from "@/app/utils/client-system";
import {
  revalidatePage,
  retrieveUserAccountData,
} from "@/app/utils/auth-actions";

export default function SettingsModal({}) {
  // State variables for managing modal visibility, settings, and user authentication
  const [modalVisible, setModalVisible] = useState(false);
  const [userAccountData, setUserAccountData] = useState({});
  const [selectedTab, setSelectedTab] = useState("general");

  const [settings, setSettings] = useState({
    dark: false,
    shortitle: false,
    nolimit: false,
    threebar: false,
    pricecat: "stu",
    layout: "list",
    language: "en",
    theme: "default",
    eyedef: "default",
    autoalt: false,
    notitime: "8",
    booknoti: false,
    schedulenoti: false,
  });
  const [loggedIn, setloggedIn] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    // Fetch settings from cookies and initialize state
    const settingsString = getCookie("settings")?.trim();
    if (!settingsString) setCookie("settings", JSON.stringify(settings));

    // Fetch user data from mkl
    async function fetchUserData() {
      const tokenString = getCookie("access_token");
      console.log(tokenString);
      if (tokenString) {
        setloggedIn(true);
        // const res = await fetch('https://www.mensa-kl.de/api/v1/about-user', { method: 'GET', headers: { Authorization: `Bearer ${tokenString}` }});
        // const user = await res.json();
        // setUser(user);
      }
    }
    fetchUserData();

    // async function checkSubscription() {
    //   if (Notification.permission === "granted") {
    //     const registration = await navigator.serviceWorker.ready;
    //     const subscription = await registration.pushManager.getSubscription();
    //     setIsSubscribed(!!subscription);
    //   } else {
    //     setIsSubscribed(false);
    //   }
    // }
    // checkSubscription();

    // Check if user just logged in to display toast notification
    const urlParams = new URLSearchParams(window.location.search);
    const autstat = urlParams.get("authstatus");
    if (autstat === "0") {
      toast.success("Login was successfull!");
      window.history.pushState({}, "", window.location.pathname);
    } else if (autstat === "1") {
      toast.error("Login attempt failed please try again!");
      window.history.pushState({}, "", window.location.pathname);
    }
    // console.log("If you can read this you are good enough to contribute to the repo!");
  }, []);

  // Detect back gesture on Android, Windows and maybe ios and close modal if open
  useEffect(() => {
    const handlePopState = () => {
      if (modalVisible) {
        setModalVisible(false);
      }
    };

    const handleEscapePress = (event) => {
      if (event.key === "Escape" && modalVisible) {
        setModalVisible(false);
        window.history.back();
      }
    };

    document.addEventListener("keydown", handleEscapePress);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [modalVisible]);

  function handleCloseModal() {
    setModalVisible(false);
    window.history.back();
  }

  useEffect(() => {
    // Disable page scrolling when the settings modal is open.
    if (modalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [modalVisible]);

  // Toggle individual settings and update cookies.
  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    setCookie("settings", JSON.stringify(updatedSettings));

    // Apply specific changes based on the setting toggled.
    if (key === "dark") {
      document.documentElement.setAttribute(
        "data-theme",
        value ? "dark" : "light"
      );
    }
    if (key === "layout") {
      document.documentElement.setAttribute("data-layout", value);
    }
    if (key === "eyedef") {
      document.documentElement.setAttribute("data-eyedef", value);
    }
    if (
      key === "by2lay" ||
      key === "nolimit" ||
      key === "shortitle" ||
      key === "pricecat"
    ) {
      //window.location.reload();
      revalidatePage();
    }
  };

  // Handle user logout.
  async function handleLogout() {
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
    document.location.reload();
  }

  // Render the settings modal UI.
  return (
    <>
      {/* Button to open the settings modal */}
      <button
        className={shared.headderButton}
        title="Settings and Account"
        onClick={() => {
          setModalVisible(true);
          window.history.pushState(
            null,
            "",
            window.location.href + "#settings"
          );
        }}
      >
        <Settings className={shared.headderIcon} />
      </button>
      {modalVisible && (
        <div className={shared.popupOverlay} onClick={() => handleCloseModal()}>
          <div
            className={shared.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleCloseModal()}
              className={styles.popupCloseButton}
            >
              <X />
            </button>
            <h2 className={styles.popupTitle}>Settings</h2>
            <div className={styles.tabsContainer}>
              <div className={styles.tabList}>
                <p
                  className={`${styles.tabElement} ${
                    selectedTab === "general" ? styles.tabElementActive : ""
                  }`}
                  onClick={() => setSelectedTab("general")}
                >
                  General
                </p>
                <p
                  className={`${styles.tabElement} ${
                    selectedTab === "notifications"
                      ? styles.tabElementActive
                      : ""
                  }`}
                  onClick={() => setSelectedTab("notifications")}
                >
                  Notification
                </p>
                <p
                  className={`${styles.tabElement} ${
                    selectedTab === "identity" ? styles.tabElementActive : ""
                  }`}
                  onClick={() => setSelectedTab("identity")}
                >
                  Account
                </p>
              </div>

              {selectedTab === "general" && (
                <>
                  {/* Render general settings */}
                  <Switch
                    id="darkmode"
                    title="Dark Mode"
                    description="Turn off the lights"
                    defaultChecked={settings.dark}
                    onChange={(checked) =>
                      handleSettingChange("dark", checked)
                    }
                  />
                  <Switch
                    id="darkmode"
                    title="Bulletpoints"
                    description="Display the meal title in a bullet point format (popup)"
                    defaultChecked={settings.threebar}
                    onChange={(checked) =>
                      handleSettingChange("threebar", checked)
                    }
                  />
                <Switch
                    id="darkmode"
                    title="Short Tile"
                    description="Only show a shortened version of the meal title"
                    defaultChecked={settings.shortitle}
                    onChange={(checked) =>
                      handleSettingChange("shortitle", checked)
                    }
                  />
                <Switch
                    id="darkmode"
                    title="No Limits"
                    description=" Remove the limit to display more than 8 days in advance (slow)"
                    defaultChecked={settings.nolimit}
                    onChange={(checked) =>
                      handleSettingChange("nolimit", checked)
                    }
                  />


                  <div className={shared.divider}></div>

                  <div className={styles.popupOption}>
                    <span style={{ width: "100%", textAlign: "left" }}>
                      Price category:{" "}
                    </span>
                    <select
                      className={styles.popupSelect}
                      value={settings.pricecat}
                      onChange={(e) =>
                        handleSettingChange("pricecat", e.target.value)
                      }
                    >
                      <option value="stu">Students</option>
                      <option value="bed">Employees</option>
                      <option value="gas">Guests</option>
                    </select>
                  </div>

                  <div
                    className={`${styles.popupOption} ${styles.mobileLayoutOption}`}
                  >
                    <span style={{ width: "100%", textAlign: "left" }}>
                      Layout:{" "}
                    </span>
                    <select
                      className={styles.popupSelect}
                      value={settings.layout}
                      onChange={(e) =>
                        handleSettingChange("layout", e.target.value)
                      }
                    >
                      <option value="list">Smol List</option>
                      <option value="biglist">Big list</option>
                      <option value="grid">Grid</option>
                    </select>
                  </div>

                  <div className={styles.popupOption}>
                    <span style={{ width: "100%", textAlign: "left" }}>
                      🅱️ Vision assistance:{" "}
                    </span>
                    <select
                      className={styles.popupSelect}
                      value={settings.eyedef}
                      onChange={(e) =>
                        handleSettingChange("eyedef", e.target.value)
                      }
                    >
                      <option value="">Normal vision</option>
                      <option value="dpm">Deuteranomaly/Protanomaly</option>
                      <option value="dpp">Deuteranopia/Protanopia</option>
                      <option value="cad">Cataracts/AMD</option>
                      <option value="pho">Photophobia</option>
                      <option value="tri">Tritanopia</option>
                      <option value="gry">Grayscale</option>
                    </select>
                  </div>

                  <div className={styles.popupOption}>
                    <span style={{ width: "100%", textAlign: "left" }}>
                      🅱️ Language:{" "}
                    </span>
                    <select
                      className={styles.popupSelect}
                      value={settings.lang}
                      onChange={(e) =>
                        handleSettingChange("lang", e.target.value)
                      }
                    >
                      <option value="eng">English</option>
                      {/* <option value="ger">German</option> */}
                    </select>
                  </div>
                </>
              )}
              {selectedTab === "notifications" && (
                <>
                  <h3 className={shared.centerFlat}>Under construction 🛠️</h3>

                  {/* <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("schedulenoti", e)} checked={settings.schedulenoti} className={styles.optionSwitch} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Push notifications</span>
                          <p className={styles.popupOptionDescription}>Receive todays meals in a push notification</p>
                        </label>
                        </div>

                        <div className={styles.popupOption}>
                          <Switch onChange={(e) => handleSettingChange("booknoti", e)} checked={settings.booknoti} className={styles.optionSwitch} onColor="#fbbf24"  />
                        <label className={styles.popupOptionLabel}>
                          <span>Bookmark notifications</span>
                          <p className={styles.popupOptionDescription}>Receive a notification when a bookmark is on the menu</p>
                        </label>
                        </div>

                        <div className={shared.divider}></div>

                        <div className={styles.popupOption}>
                          <span style={{width: "100%", textAlign: "left"}}>Time: </span>
                          <select className={styles.popupSelect} value={settings.notitime} onChange={(e) => handleSettingChange("notitime", e.target.value)} >
                          <option value="8">8am</option>
                          <option value="9">9am</option>
                          <option value="10">10am</option>
                          <option value="11">11am</option>
                          </select>
                        </div>

                        <div className={shared.divider}></div>

                        <p>Bookmarks</p> */}
                </>
              )}
              {selectedTab === "identity" && (
                <>
                  <h3 className={shared.centerFlat}>Under construction 🛠️</h3>
                  {/* Render identity management options */}
                  <div
                    className={styles.popupOption}
                    style={{ display: "none" }}
                  >
                    {loggedIn ? (
                      <div className={styles.popupUserContainer}>
                        <p className={styles.userAccounttext}>
                          <b>here should be your email</b>
                        </p>
                        {userAccountData?.metadata?.theme && <CatIcon />}
                        <div className={styles.activitySection}>
                          <div className={styles.activityBlob}>
                            {" "}
                            <StarIcon /> <p>Ratings: </p> <b> {0}</b>
                          </div>
                          <div className={styles.activityBlob}>
                            {" "}
                            <ImageIcon /> <p>Submissions: </p> <b> {0}</b>
                          </div>
                        </div>

                        <button
                          className={styles.popupButton}
                          onClick={() => handleLogout()}
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <a
                        href="/api/auth/login"
                        className={styles.popupUserContainer}
                      >
                        <button
                          className={styles.popupButton}
                          onClick={() => handleLogin()}
                        >
                          Login with MKL
                          <img src="/mkl_icon.webp" />
                        </button>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
}

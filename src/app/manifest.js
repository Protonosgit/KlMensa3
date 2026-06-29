export default function manifest() {
  return {
    name: "Kl-Mensa - Mensaplan",
    short_name: "KL mensa",
    description: "Mensaplan der RPTU in Kaiserslautern",
    //lang: 'en',
    categories: ["health", "tools", "education"],
    start_url: "/",
    //scope: '/',
    display: "standalone", // mb try fullscreen
    background_color: "#f3bd1d",
    theme_color: "#f3bd1d",
    orientation: "portrait",

    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      // {
      //   src: "/icon-512x512.png",
      //   sizes: "512x512",
      //   type: "image/png",
      //   purpose: "any maskable",
      // },
    ],

    screenshots: [
      {
        src: "/screenshots/home_page.jpeg",
        sizes: "1280x720", // 1080x2106
        type: "image/jpeg",
      },
      {
        src: "/screenshots/details_page.jpeg",
        sizes: "1280x720", // 1080x2106
        type: "image/jpeg",
      },
      {
        src: "/screenshots/settings_page.jpeg",
        sizes: "1280x720", // 1080x2106
        type: "image/jpeg",
      }
    ],

    // protocol_handlers: [
    //   {
    //     protocol: 'web+klmensa',
    //     url: '/?url=%s',
    //   },
    // ],
    
    // shortcuts: [
    //   {
    //     name: "Settings",
    //     url: "/#settings",
    //     description: "Settings page",
    //     icons: [{ src: "/shortcut.png", sizes: "96x96" }],
    //   },
    // ],
  };
}

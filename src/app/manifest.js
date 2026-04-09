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
        src: "/logo.png",
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

    // screenshots: [
    //   {
    //     src: "/screenshot1.png",
    //     sizes: "1280x720",
    //     type: "image/png",
    //   },
    // ],

    // protocol_handlers: [
    //   {
    //     protocol: 'web+myapp',
    //     url: '/?url=%s',
    //   },
    // ],
    
    // shortcuts: [
    //   {
    //     name: "About page",
    //     url: "/about",
    //     icons: [{ src: "/shortcut.png", sizes: "96x96" }],
    //   },
    // ],
  };
}

import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
process.env.ELECTRON_ROOT = path.join(process.env.APP_ROOT, "electron");
process.env.REACT_ROOT = path.join(process.env.APP_ROOT, "src");
process.env.RENDERED_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : process.env.RENDERED_DIST;
const windows = {};
const createWindow = (name, url = null) => {
  if (name in windows)
    throw new Error("Idk honestly we'll worry when we get here");
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(process.env.ELECTRON_ROOT, "preload.mjs")
    },
    show: false
  });
  if (url) {
    win.loadURL(url);
  } else if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.RENDERED_DIST, "index.html"));
  }
  win.once("ready-to-show", () => {
    win.show();
  });
  windows[name] = win;
};
app.on("window-all-closed", () => {
  app.quit();
  for (const winName in windows) {
    delete windows[winName];
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow("main");
  }
});
app.whenReady().then(() => {
  createWindow("main");
});

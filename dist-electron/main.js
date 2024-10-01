import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
const debouncePromise = (fn) => {
  let runningPromise = Promise.resolve();
  let cancelPrev = () => {
  };
  return () => {
    cancelPrev();
    let currRunning = true;
    runningPromise.then(() => {
      if (!currRunning) return;
      runningPromise = fn();
    });
    cancelPrev = () => currRunning = true;
  };
};
const debounce = (fn, delay = 200) => {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(void 0, args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};
const watchObj = (obj, dep) => {
  for (const key in obj) {
    if (typeof obj[key] === "object")
      obj[key] = watchObj(obj[key], dep);
  }
  return new Proxy(obj, {
    set(target, prop, val, receiver) {
      if (typeof val === "object")
        val = watchObj(val, dep);
      dep(target, prop, val);
      return Reflect.set(target, prop, val, receiver);
    },
    deleteProperty(target, prop) {
      dep(target, prop, null);
      return Reflect.deleteProperty(target, prop);
    }
  });
};
let instance = null;
const getPersistentStore = async () => {
  if (instance)
    return instance;
  const filePath = path.join(process.env.STORAGE_PATH, "persistent.json");
  let _store = {};
  try {
    const base = await readFile(filePath);
    _store = JSON.parse(base.toString("utf-8"));
  } catch (err) {
    console.error(err);
    _store = {};
  }
  instance = watchObj(_store, debounce(debouncePromise(
    () => writeFile(filePath, JSON.stringify(_store), {
      encoding: "utf-8"
    })
  ), 1500));
  return instance;
};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
process.env.ELECTRON_ROOT = path.join(process.env.APP_ROOT, "electron");
process.env.REACT_ROOT = path.join(process.env.APP_ROOT, "src");
process.env.RENDERED_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : process.env.RENDERED_DIST;
process.env.STORAGE_PATH = path.join(app.getPath("userData"), "storage");
const windows = {};
const createWindow = async (name, url = null) => {
  if (name in windows)
    throw new Error("Idk honestly we'll worry when we get here");
  const persistentStore = await getPersistentStore();
  if (!persistentStore[name]) {
    persistentStore[name] = {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
      isMaximized: false
    };
  }
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(process.env.ELECTRON_ROOT, "preload.mjs")
    },
    title: name,
    x: persistentStore[name].x,
    y: persistentStore[name].y,
    width: persistentStore[name].width,
    height: persistentStore[name].height,
    frame: false,
    show: false
  });
  if (persistentStore[name].isMaximized)
    win.maximize();
  if (url) {
    win.loadURL(url);
  } else if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.RENDERED_DIST, "index.html"));
  }
  win.on("resize", () => {
    const bounds = win.getBounds();
    persistentStore[name] = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: win.isMaximized()
    };
  });
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
Promise.all([
  app.whenReady(),
  getPersistentStore()
]).then(() => {
  createWindow("main");
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow("main");
    }
  });
});

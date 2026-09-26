use ts_bind::ts_bind_const;

pub mod usb;
mod web_usb;
mod hid_key;
mod hid_mouse;
mod macros;


#[cfg(debug_assertions)]
const  WEB_URL: &str = "http://localhost:5173/";

#[cfg(not(debug_assertions))]
const WEB_URL: &str = "https://sillygoose123.github.io/MacroBoard/";

#[ts_bind_const]
const MANUFACTURER: &'static str = "SillGoose123 & Leo";
#[ts_bind_const]
const PRODUCT: &'static str = "MacroBoard";
#[ts_bind_const]
const SERIAL_NUMBER: &'static str = "v1";
//https://pid.codes test id
#[ts_bind_const]
const USB_VID: u16 = 0x1209;
#[ts_bind_const]
const USB_PID: u16  = 0x0512;
// This is a randomly generated GUID to allow clients on Windows to find our device
const DEVICE_INTERFACE_GUIDS: &[&str] = &["{2c8e1090-8c5a-4ba5-a0cc-a01514a3c145}"];
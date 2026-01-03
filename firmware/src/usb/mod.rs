use ts_bind::ts_bind_const;

mod hid;
mod web;
pub mod usb_driver;

#[ts_bind_const]
const WEB_URL: &str = "macro.sillycode.tech";
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
const USB_PID: u16  = 0x0001;
// This is a randomly generated GUID to allow clients on Windows to find our device
const DEVICE_INTERFACE_GUIDS: &[&str] = &["{AFB9A6FB-30BA-44BC-9232-806CFC875321}"];
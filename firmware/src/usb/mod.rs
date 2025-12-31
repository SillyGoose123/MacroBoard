use usb_device::device::UsbVidPid;

pub mod hid;
mod web;

const WEB_URL: &str = "macro.sillycode.tech";
const USB_VID_PID: UsbVidPid = UsbVidPid(0x1209, 0x0001); //https://pid.codes test id
const MANUFACTURER: &'static str = "SillGoose123 & Leo";
const PRODUCT: &'static str = "MacroBoard";
const SERIAL_NUMBER: &'static str = "v1";
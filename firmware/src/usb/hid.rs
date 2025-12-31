use cortex_m::prelude::_embedded_hal_timer_CountDown;
use frunk::{HCons, HNil};
use seeeduino_xiao_rp2040::hal::Timer;
use seeeduino_xiao_rp2040::hal::fugit::ExtU32;
use seeeduino_xiao_rp2040::hal::timer::CountDown;
use seeeduino_xiao_rp2040::hal::usb::UsbBus;
use usb_device::class_prelude::UsbBusAllocator;
use usb_device::device::{StringDescriptors, UsbDevice};
use usb_device::prelude::UsbDeviceBuilder;
use usbd_human_interface_device::device::DeviceClass;
use usbd_human_interface_device::UsbHidError;
use usbd_human_interface_device::device::keyboard::{NKROBootKeyboard, NKROBootKeyboardConfig};
use usbd_human_interface_device::device::mouse::{WheelMouse, WheelMouseConfig, WheelMouseReport};
use usbd_human_interface_device::page::Keyboard;
use usbd_human_interface_device::prelude::{UsbHidClass, UsbHidClassBuilder};
use crate::usb::{MANUFACTURER, USB_VID_PID};

pub struct HID<'a> {
    tick_countdown: CountDown<'a>,
    usb_dev: UsbDevice<'a, UsbBus>,
    devices: UsbHidClass<'a, UsbBus, HCons<WheelMouse<'a, UsbBus>, HCons<NKROBootKeyboard<'a, UsbBus>, HNil>>>,
}

impl<'a> HID<'a> {
    pub fn init(usb_alloc: &'a UsbBusAllocator<UsbBus>, timer: &'a Timer) -> Self {
        let mut tick_countdown = timer.count_down();
        tick_countdown.start(1.millis());

        let devices = UsbHidClassBuilder::new()
            .add_device(NKROBootKeyboardConfig::default())
            .add_device(WheelMouseConfig::default())
            .build(&usb_alloc);

        let usb_dev = UsbDeviceBuilder::new(&usb_alloc, USB_VID_PID)
            .strings(&[StringDescriptors::default()
                .manufacturer(MANUFACTURER)
                .product("Keyboard & Mouse")
                .serial_number("TEST")])
            .unwrap()
            .build();

        Self {
            tick_countdown,
            usb_dev,
            devices,
        }
    }

    pub fn tick(&mut self) {
        if !self.tick_countdown.wait().is_ok() {
            return;
        }

        match self.devices.device::<NKROBootKeyboard<'_, _>, _>().tick() {
            Err(UsbHidError::WouldBlock) => {}
            Ok(_) => {}
            Err(e) => {
                core::panic!("Failed to process keyboard tick: {:?}", e)
            }
        };
    }

    pub fn send_key(&mut self, keys: [Keyboard; 12]) {
        match self.devices.device::<NKROBootKeyboard<'_, _>, _>().write_report(keys) {
            Err(UsbHidError::WouldBlock) => {}
            Err(UsbHidError::Duplicate) => {}
            Ok(_) => {}
            Err(e) => {
                core::panic!("Failed to write keyboard report: {:?}", e)
            }
        }
    }

  pub fn send_mouse(&mut self, report: WheelMouseReport) {
    match self.devices.device::<WheelMouse<'_, _>, _>().write_report(&report) {
      Err(UsbHidError::Duplicate) => {}
      Err(UsbHidError::WouldBlock) => {}
      Ok(_) => {}
      Err(e) => {
        core::panic!("Failed to write mouse report: {:?}", e)
      }
    }
  }
}

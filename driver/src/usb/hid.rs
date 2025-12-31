use cortex_m::prelude::_embedded_hal_timer_CountDown;
use frunk::{HCons, HNil};
use seeeduino_xiao_rp2040::hal::Timer;
use seeeduino_xiao_rp2040::hal::fugit::ExtU32;
use seeeduino_xiao_rp2040::hal::timer::CountDown;
use seeeduino_xiao_rp2040::hal::usb::UsbBus;
use usb_device::class_prelude::UsbBusAllocator;
use usb_device::device::{StringDescriptors, UsbDevice, UsbVidPid};
use usb_device::prelude::UsbDeviceBuilder;
use usbd_human_interface_device::UsbHidError;
use usbd_human_interface_device::device::keyboard::NKROBootKeyboard;
use usbd_human_interface_device::page::Keyboard;
use usbd_human_interface_device::prelude::{UsbHidClass, UsbHidClassBuilder};

pub struct HID<'a> {
    tick_countdown: CountDown<'a>,
    usb_dev: UsbDevice<'a, UsbBus>,
    keyboard: UsbHidClass<'a, UsbBus, HCons<NKROBootKeyboard<'a, UsbBus>, HNil>>,
}

impl<'a> HID<'a> {
    pub fn init(usb_alloc: &'a UsbBusAllocator<UsbBus>, timer: &'a Timer) -> Self {
        let mut tick_countdown = timer.count_down();
        tick_countdown.start(1.millis());

        let keyboard = UsbHidClassBuilder::new()
            .add_device(
                usbd_human_interface_device::device::keyboard::NKROBootKeyboardConfig::default(),
            )
            .build(&usb_alloc);

        //https://pid.codes test id
        let usb_dev = UsbDeviceBuilder::new(&usb_alloc, UsbVidPid(0x1209, 0x0001))
            .strings(&[StringDescriptors::default()
                .manufacturer("SillGoose123 & Leo")
                .product("Keyboard")
                .serial_number("TEST")])
            .unwrap()
            .build();

        Self {
            tick_countdown,
            usb_dev,
            keyboard,
        }
    }

    pub fn tick(&mut self) {
        if !self.tick_countdown.wait().is_ok() {
            return;
        }

        match self.keyboard.tick() {
            Err(UsbHidError::WouldBlock) => {}
            Ok(_) => {}
            Err(e) => {
                core::panic!("Failed to process keyboard tick: {:?}", e)
            }
        };
    }

    pub fn send_key(&mut self, keys: [Keyboard; 12]) {
      match self.keyboard.device().write_report(keys) {
        Err(UsbHidError::WouldBlock) => {}
        Err(UsbHidError::Duplicate) => {}
        Ok(_) => {}
        Err(e) => {
          core::panic!("Failed to write keyboard report: {:?}", e)
        }
      }
    }
}

use crate::usb::{MANUFACTURER, PRODUCT, SERIAL_NUMBER, USB_VID_PID, WEB_URL};
use seeeduino_xiao_rp2040::hal::Timer;
use seeeduino_xiao_rp2040::hal::usb::UsbBus;
use usb_device::bus::UsbBusAllocator;
use usb_device::device::{StringDescriptors, UsbDevice, UsbDeviceBuilder};
use usbd_webusb::{WebUsb, url_scheme};

pub struct Web<'a> {
    usb_dev: UsbDevice<'a, UsbBus>,
    web_usb: WebUsb<UsbBus>,
}

impl<'a> Web<'a> {
    pub fn init(usb_alloc: &'a UsbBusAllocator<UsbBus>, timer: &'a Timer) -> Self {
        let web_usb = WebUsb::new(&usb_alloc, url_scheme::HTTPS, WEB_URL);
        let usb_dev = UsbDeviceBuilder::new(&usb_alloc, USB_VID_PID)
            .strings(&[StringDescriptors::default()
                .manufacturer(MANUFACTURER)
                .product(PRODUCT)
                .serial_number(SERIAL_NUMBER)])
            .unwrap()
            .device_class(0x00) //per-interface
            .build();

        Self { usb_dev, web_usb }
    }

    pub fn tick(&mut self) {
        if !self.usb_dev.poll(&mut [&mut self.web_usb]) {
            return;
        }
    }
}

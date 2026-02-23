use embassy_executor::Spawner;
use embassy_rp::peripherals::USB;
use embassy_rp::{Peri, bind_interrupts};
use embassy_usb::{Builder, Config as UsbConfig, UsbDevice};

use crate::mk_static;
use crate::usb::hid_key::init_hid_key;
use crate::usb::hid_mouse::init_hid_mouse;
use crate::usb::{MANUFACTURER, PRODUCT, SERIAL_NUMBER, USB_PID, USB_VID};
use embassy_rp::usb::{Driver as UsbDriver, Driver, InterruptHandler};
use crate::usb::web_usb::init_web;

bind_interrupts!(struct Irqs {
    USBCTRL_IRQ => InterruptHandler<USB>;
});

pub fn init_usb(spawner: Spawner, usb: Peri<'static, USB>) {
    let driver = UsbDriver::new(usb, Irqs);

    let mut usb_cfg = UsbConfig::new(USB_VID, USB_PID);
    usb_cfg.manufacturer = Some(MANUFACTURER);
    usb_cfg.product = Some(PRODUCT);
    usb_cfg.serial_number = Some(SERIAL_NUMBER);
    usb_cfg.max_power = 100;
    usb_cfg.max_packet_size_0 = 64;
    usb_cfg.device_class = 0x00;
    usb_cfg.device_sub_class = 0;
    usb_cfg.device_protocol = 0;
    usb_cfg.composite_with_iads = false;

    mk_static!(config_descriptor_buf: mut [u8; 512] = [0u8; 512]);
    mk_static!(bos_descriptor_buf: mut [u8; 256] = [0u8; 256]);
    mk_static!(msos_descriptor_buf: mut [u8; 512] = [0u8; 512]);
    mk_static!(control_buf: mut [u8; 64] = [0u8; 64]);

    let mut builder = Builder::new(
        driver,
        usb_cfg,
        config_descriptor_buf,
        bos_descriptor_buf,
        msos_descriptor_buf,
        control_buf,
    );

    init_hid_key(spawner, &mut builder);
    init_hid_mouse(spawner, &mut builder);
    init_web(spawner, &mut builder);

    // RUN USB
    let usb = builder.build();
    spawner
        .spawn(usb_task(usb))
        .expect("Failed to spawn USB task");
}

#[embassy_executor::task]
async fn usb_task(mut usb: UsbDevice<'static, Driver<'static, USB>>) {
    usb.run().await;
}

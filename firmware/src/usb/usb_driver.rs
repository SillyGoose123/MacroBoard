use embassy_executor::Spawner;
use embassy_rp::{bind_interrupts, usb, Peri};
use embassy_rp::peripherals::USB;
use embassy_rp::usb::InterruptHandler;
use crate::config::Config;
use crate::driver_trait::Driver;
use crate::usb::hid::Hid;
use crate::usb::web::Web;

pub struct UsbDriver {
  web: Web,
  hid: Hid,
}


bind_interrupts!(struct Irqs {
    USBCTRL_IRQ => InterruptHandler<USB>;
});

impl Driver<Peri<'static, USB>> for  UsbDriver {
  fn init(spawner: Spawner, config: &Config, peri: Peri<USB>) -> Self {
    let driver = usb::Driver::new(peri, Irqs);
    

    let web = Web::init(&config);
    let hid = Hid::init();

    Self {
      web,
      hid
    }
  }
}
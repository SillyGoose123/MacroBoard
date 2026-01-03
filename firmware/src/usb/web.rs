use embassy_usb::class::web_usb::{Config as WebUsbConfig, State, Url};
use crate::usb::WEB_URL;

pub struct Web {
    pub state: State<'static>,
    pub config: WebUsbConfig<'static>,
}

impl Web {
    pub fn init() -> Self {
      let state = State::new();
      let web_config = WebUsbConfig {
        max_packet_size: 64,
        vendor_code: 1,
        landing_url: Some(Url::new(WEB_URL)),
      };


      Self {
          state,
          config: web_config,
        }
    }
}

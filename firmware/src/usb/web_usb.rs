use crate::bytes_trait::BytesConvert;
use crate::led::Flash;
use crate::summer::tones::Tone;
use crate::usb::{DEVICE_INTERFACE_GUIDS, WEB_URL};
use crate::{FLASH_CHANNEL, SUMMER_CHANNEL, byte_enum, mk_static, parse_bytes};
use embassy_executor::{Spawner, task};
use embassy_rp::peripherals::USB;
use embassy_rp::usb::{Driver, Endpoint as UsbEndpoint, In, Out};
use embassy_usb::class::web_usb::{Config as WebUsbConfig, State as WebState, Url, WebUsb};
use embassy_usb::driver::{Endpoint, EndpointOut};
use embassy_usb::{Builder, msos};
use smart_leds::RGB8;
use ts_bind::TsBind;

// Add custom usb class
pub fn init_web(spawner: Spawner, mut builder: &mut Builder<'static, Driver<'static, USB>>) {
    mk_static!(web_state: mut WebState = WebState::new());
    mk_static!(webusb_config: WebUsbConfig = WebUsbConfig {
      max_packet_size: 64,
      vendor_code: 1,
      landing_url: Some(Url::new(WEB_URL)),
    });
    WebUsb::configure(&mut builder, web_state, &webusb_config);

    // build & create interface
    builder.msos_feature(msos::CompatibleIdFeatureDescriptor::new("WINUSB", ""));
    let mut function = builder.function(0xFF, 0x0D, 0x0A); //vendor specific usb class
    function.msos_feature(msos::RegistryPropertyFeatureDescriptor::new(
        "DeviceInterfaceGUIDs",
        msos::PropertyData::RegMultiSz(DEVICE_INTERFACE_GUIDS),
    ));
    let mut interface = function.interface();
    let mut alt = interface.alt_setting(0xFF, 0x0D, 0x0A, None);
    let read_ep = alt.endpoint_bulk_out(None, 64);
    let write_ep = alt.endpoint_bulk_in(None, 64);
    spawner
        .spawn(web_usb_task(read_ep, write_ep))
        .expect("Failed to spawn web usb task");
}

#[task]
async fn web_usb_task(
    mut read_ep: UsbEndpoint<'static, USB, Out>,
    _write_ep: UsbEndpoint<'static, USB, In>,
) {
    loop {
        read_ep.wait_enabled().await;

        let mut data = [0; 64];
        while let Ok(data_size) = read_ep.read(data.as_mut()).await {
            if data_size == 0 {
                continue;
            }

            let command = Command::from_bytes(data[0]);
            if command.is_err() {
                continue;
            }

            command.unwrap().execute(&data[1..]).await;
        }
    }
}

byte_enum!(
    enum Command {
        ChangeConfig = 0x01,
        GetConfig = 0x02,
        Flash = 0x03,
        Summ = 0x04,
    }
);

impl Command {
    async fn execute(self, data: &[u8]) {
        match self {
            Command::Flash => {
                FLASH_CHANNEL
                    .send(parse_bytes!(Flash, data))
                    .await;
            }
            Command::Summ => {
                SUMMER_CHANNEL.send(parse_bytes!(Tone, data)).await;
            }
            Command::ChangeConfig => {}
            Command::GetConfig => {}
        }
    }
}

use crate::bytes_trait::BytesConvert;
use crate::config::Config;
use crate::led::Flash;
use crate::summer::tones::Tone;
use crate::usb::{DEVICE_INTERFACE_GUIDS, WEB_URL};
use crate::{CONFIG, FLASH_CHANNEL, SUMMER_CHANNEL, byte_enum, mk_static, parse_bytes};
use alloc::vec;
use alloc::vec::Vec;
use embassy_executor::{Spawner, task};
use embassy_rp::peripherals::USB;
use embassy_rp::usb::{Driver, Endpoint as UsbEndpoint, In, Out};
use embassy_usb::class::web_usb::{Config as WebUsbConfig, State as WebState, Url, WebUsb};
use embassy_usb::driver::{Endpoint, EndpointIn, EndpointOut};
use embassy_usb::msos::windows_version;
use embassy_usb::{Builder, msos};
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
    builder.msos_descriptor(windows_version::WIN8_1, 1);
    let mut function = builder.function(0xFF, 0x00, 0x00); //vendor 
    function.msos_feature(msos::CompatibleIdFeatureDescriptor::new("WINUSB", ""));
    function.msos_feature(msos::RegistryPropertyFeatureDescriptor::new(
        "DeviceInterfaceGUIDs",
        msos::PropertyData::RegMultiSz(DEVICE_INTERFACE_GUIDS),
    ));
    let mut interface = function.interface();
    let mut alt = interface.alt_setting(0xFF, 0x00, 0x00, None);
    let read_ep = alt.endpoint_bulk_out(None, 64);
    let write_ep = alt.endpoint_bulk_in(None, 64);

    spawner
        .spawn(web_usb_task(read_ep, write_ep))
        .expect("Failed to spawn web usb task");
}

#[task]
async fn web_usb_task(
    mut read_ep: UsbEndpoint<'static, USB, Out>,
    mut write_ep: UsbEndpoint<'static, USB, In>,
) {
    loop {
        read_ep.wait_enabled().await;

        let mut data = [0; 64];
        while let Ok(data_size) = read_ep.read(data.as_mut()).await {
            defmt::info!("web_usb_task: read {} bytes", data_size);
            if data_size == 0 {
                continue;
            }
            defmt::info!("web_usb_task: first byte is {}", data[0]);

            let command = Command::from_bytes(data[0]);
            if command.is_err() {
                continue;
            }

            let _ = write_ep
                .write(
                    command
                        .unwrap()
                        .execute(data.get(1..).unwrap_or(&[0]))
                        .await
                        .as_slice(),
                )
                .await;
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
    async fn execute(self, data: &[u8]) -> Vec<u8> {
        match self {
            Command::Flash => {
                FLASH_CHANNEL.send(parse_bytes!(Flash, data)).await;
                vec![0]
            }
            Command::Summ => {
                SUMMER_CHANNEL.send(parse_bytes!(Tone, data)).await;
                vec![0]
            }
            Command::ChangeConfig => {
                let mut guard = CONFIG.lock().await;
                *guard = Some(parse_bytes!(Config, data));
                match guard.as_mut().unwrap().store().await {
                    Ok(_) => vec![0],
                    Err(_) => vec![1],
                }
            }
            Command::GetConfig => {
                defmt::info!("get_config");
                let guard = CONFIG.lock().await;
                let mut bytes = vec![0];
                let config_bytes = guard.as_ref().unwrap().to_bytes();
                //cast to u32 is safe because this is a 32byte system
                //the length of config is appended to for the frontend to easily read the config
                bytes.extend((config_bytes.len() as u32).to_bytes());
                bytes.extend(config_bytes);
                defmt::info!("web_usb_task: read config bytes: {:?}", &bytes.as_slice());
                bytes
            }
        }
    }
}

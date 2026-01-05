use crate::{MOUSE_CHANNEL, mk_static};
use embassy_executor::{Spawner, task};
use embassy_rp::peripherals::USB;
use embassy_rp::usb::Driver;
use embassy_usb::Builder;
use embassy_usb::class::hid::{HidReaderWriter, State as HidState};
use usbd_hid::descriptor::{MouseReport, SerializedDescriptor};

pub fn init_hid_mouse(spawner: Spawner, mut builder: &mut Builder<'static, Driver<'static, USB>>) {
    mk_static!(hid_state: mut HidState = HidState::new());
    let config = embassy_usb::class::hid::Config {
        report_descriptor: MouseReport::desc(),
        request_handler: None,
        poll_ms: 60,
        max_packet_size: 64,
    };
    let hid = HidReaderWriter::<_, 1, 8>::new(&mut builder, hid_state, config);
    spawner.spawn(hid_mouse_task(hid)).expect("Failed to spawn hid mouse task.")
}

#[task]
async fn hid_mouse_task(hid: HidReaderWriter<'static, Driver<'static, USB>, 1, 8>) {
    let (_reader, mut writer) = hid.split();

    loop {
        let report = MOUSE_CHANNEL.receive().await;
        writer
            .write_serialize(&report)
            .await
            .expect("Writing Keyboard report fails.");
    }
}

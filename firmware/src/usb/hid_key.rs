use crate::{mk_static, KEY_CHANNEL};
use crate::key::key_action::SlimKeyReport;
use embassy_executor::{task, Spawner};
use embassy_rp::peripherals::USB;
use embassy_rp::usb::Driver;
use embassy_usb::Builder;
use embassy_usb::class::hid::{HidReaderWriter, State as HidState};
use usbd_hid::descriptor::{KeyboardReport, SerializedDescriptor};

pub fn init_hid_key(spawner: Spawner, mut builder: &mut Builder<'static, Driver<'static, USB>>) {
  mk_static!(hid_state: mut HidState = HidState::new());
  
  let config = embassy_usb::class::hid::Config {
    report_descriptor: KeyboardReport::desc(),
    request_handler: None,
    poll_ms: 10,
    max_packet_size: 8,
  };
  let hid = HidReaderWriter::<_, 1, 8>::new(&mut builder, hid_state, config);
  spawner
    .spawn(hid_key_task(hid))
    .expect("Failed to spawn hid key task.");
}

#[task] 
async fn hid_key_task(hid: HidReaderWriter<'static, Driver<'static, USB>, 1, 8>) {
    let (_reader, mut writer) = hid.split();

    loop {
        let report: SlimKeyReport = KEY_CHANNEL.receive().await;
        writer.write_serialize(&KeyboardReport {
            keycodes: report.keycodes,
            modifier: report.modifier,
            leds: 0,
            reserved: 0,
        }).await.expect("Writing Keyboard report fails.");
    }
}

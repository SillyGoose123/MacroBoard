use crate::key::key_action::SlimKeyReport;
use crate::{KEY_CHANNEL, mk_static};
use defmt::info;
use embassy_executor::{Spawner, task};
use embassy_rp::peripherals::USB;
use embassy_rp::usb::Driver;
use embassy_usb::Builder;
use embassy_usb::class::hid::{HidBootProtocol, HidReaderWriter, HidSubclass, State as HidState};
use usbd_hid::descriptor::{KeyboardReport, SerializedDescriptor};

pub fn init_hid_key(spawner: Spawner, mut builder: &mut Builder<'static, Driver<'static, USB>>) {
    mk_static!(hid_state: mut HidState = HidState::new());

    let config = embassy_usb::class::hid::Config {
        report_descriptor: KeyboardReport::desc(),
        request_handler: None,
        poll_ms: 10,
        max_packet_size: 8,
        hid_subclass: HidSubclass::Boot,
        hid_boot_protocol: HidBootProtocol::Keyboard,
    };
    let hid = HidReaderWriter::new(&mut builder, hid_state, config);
    spawner.spawn(hid_key_task(hid).expect("Failed to spawn hid key task."));
}

#[task]
async fn hid_key_task(hid: HidReaderWriter<'static, Driver<'static, USB>, 1, 8>) {
    let (_reader, mut writer) = hid.split();
    writer.ready().await;

    loop {
        info!("write");
        let report: SlimKeyReport = KEY_CHANNEL.receive().await;
        writer
            .write(&report.create_report())
            .await
            .expect("Writing Keyboard report fails.");
        // write empty report (prevents spamming)
        writer
            .write(&[0, 0, 0, 0, 0, 0, 0, 0])
            .await
            .expect("Writing keyboard clear failed!");
        KEY_CHANNEL.clear();
    }
}

impl SlimKeyReport {
  pub fn create_report(&self) -> [u8; 8] {
    [
      self.modifier,
      0,
      self.keycodes[0],
      self.keycodes[1],
      self.keycodes[2],
      self.keycodes[3],
      self.keycodes[4],
      self.keycodes[5],
    ]
  }
}

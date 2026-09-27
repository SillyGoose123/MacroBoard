use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;
use usbd_hid::descriptor::MouseReport;
use crate::key::key_action::SlimKeyReport;
use crate::{get_byte, KEY_CHANNEL, MOUSE_CHANNEL, SUMMER_CHANNEL, FLASH_CHANNEL};
use crate::bytes_trait::BytesConvert;
use crate::led::Flash;
use crate::summer::tones::Tone;

#[repr(u8)]
#[derive(TsBind, Copy, Clone)]
pub enum Action {
  KeyAction(SlimKeyReport) = 0x01,
  MouseAction(MouseReport) = 0x02,
  SummerAction(Tone) = 0x03,
  Flash(Flash) = 0x04
}

impl Action {
  pub async fn execute(&self) {
    match self {
      Action::KeyAction(report) => {
        KEY_CHANNEL.send(*report).await;
      }
      Action::MouseAction(report) => {
        MOUSE_CHANNEL.send(*report).await;
      }
      Action::SummerAction(summer_conf) => {
        SUMMER_CHANNEL.send(*summer_conf).await;
      },
      Action::Flash(flash) => {
        FLASH_CHANNEL.send(*flash).await;
      }
    }
  }
}

pub async fn execute_actions(actions: &Vec<Action>) {
  for action in actions {
    action.execute().await;
  }
}

impl BytesConvert for Action {
  fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
    match get_byte!(bytes, pointer) {
      0x1 => Self::KeyAction(SlimKeyReport::from_bytes(bytes, pointer)),
      0x2 => Self::MouseAction(MouseReport::from_bytes(bytes, pointer)),
      0x3=> Self::SummerAction(Tone::from_bytes(bytes, pointer)),
      _=> Self::Flash(Flash::from_bytes(bytes, pointer)),
    }
  }

  fn to_bytes(&self) -> Vec<u8> {
    let mut bytes = Vec::new();
    match self {
      Action::KeyAction(key_report) => {
        bytes.push(0x1);
        bytes.extend(key_report.to_bytes().to_vec());
      }
      Action::MouseAction(mouse_report) => {
        bytes.push(0x2);
        bytes.extend(mouse_report.to_bytes().to_vec());
      }
      Action::SummerAction(tone) => {
        bytes.push(0x3);
        bytes.extend(tone.to_bytes().to_vec());
      }
      Action::Flash(flash) => {
        bytes.push(0x4);
        bytes.extend(flash.to_bytes().to_vec());
      }
    }
    bytes
  }
}

impl BytesConvert for MouseReport {
  fn from_bytes(data: &[u8], pointer: &mut usize) -> Self {
    MouseReport {
      buttons: get_byte!(data, pointer),
      x: get_byte!(data, pointer) as i8,
      y: get_byte!(data, pointer) as i8,
      wheel: get_byte!(data, pointer) as i8,
      pan: get_byte!(data, pointer) as i8,
    }
  }

  fn to_bytes(&self) -> Vec<u8> {
    vec![
      self.buttons,
      self.x as u8,
      self.y as u8,
      self.wheel as u8,
      self.pan as u8,
    ]
  }
}

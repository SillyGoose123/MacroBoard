use crate::bytes_trait::BytesConvert;
use crate::summer::tones::Tone;
use crate::{KEY_CHANNEL, MOUSE_CHANNEL, SUMMER_CHANNEL};
use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;
use usbd_hid::descriptor::MouseReport;

#[derive(TsBind)]
pub enum KeyAction {
    KeyAction(SlimKeyReport),
    MouseAction(MouseReport),
    SummerAction(Tone),
}

impl KeyAction {
    pub async fn execute(&self) {
        match self {
            KeyAction::KeyAction(report) => {
                KEY_CHANNEL.send(*report).await;
            }
            KeyAction::MouseAction(report) => {
                MOUSE_CHANNEL.send(*report).await;
            }
            KeyAction::SummerAction(summer_conf) => {
                SUMMER_CHANNEL.send(*summer_conf).await;
            }
        }
    }
}

pub async fn execute_actions(actions: &Vec<KeyAction>) {
    for action in actions {
        action.execute().await;
    }
}

impl BytesConvert for KeyAction {
    fn from_bytes(bytes: &[u8]) -> Self {
        match bytes.get(0).unwrap_or(&0) {
            0x1 => Self::KeyAction(SlimKeyReport::from_bytes(&bytes[1..])),
            0x2 => Self::MouseAction(MouseReport::from_bytes(&bytes[1..])),
            _ => Self::SummerAction(Tone::from_bytes(&bytes[1..])),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        match self {
            KeyAction::KeyAction(key_report) => {
                bytes.push(0x1);
                bytes.append(key_report.to_bytes().to_vec().as_mut());
            }
            KeyAction::MouseAction(mouse_report) => {
                bytes.push(0x2);
                bytes.append(mouse_report.to_bytes().to_vec().as_mut());
            }
            KeyAction::SummerAction(tone) => {
                bytes.push(0x3);
                bytes.append(tone.to_bytes().to_vec().as_mut());
            }
        }
        bytes
    }
}

impl BytesConvert for MouseReport {
    fn from_bytes(data: &[u8]) -> Self {
        MouseReport {
            buttons: *data.get(0).unwrap_or(&0),
            x: *data.get(1).unwrap_or(&0) as i8,
            y: *data.get(2).unwrap_or(&0) as i8,
            wheel: *data.get(3).unwrap_or(&0) as i8,
            pan: *data.get(4).unwrap_or(&0) as i8,
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

#[derive(Clone, Copy)]
pub struct SlimKeyReport {
    pub modifier: u8,
    pub keycodes: [u8; 6],
}

impl BytesConvert for SlimKeyReport {
    fn from_bytes(bytes: &[u8]) -> Self {
        let mut keycodes = [0; 6];
        for i in 1..7 {
            keycodes[i - 1] = *bytes.get(i).unwrap_or(&0);
        }

        Self {
            modifier: *bytes.get(0).unwrap_or(&0),
            keycodes,
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes: [u8; 7] = [0; 7];
        bytes[0] = self.modifier;

        for i in 1..7 {
            bytes[i] = self.keycodes[i - 1];
        }

        bytes.to_vec()
    }
}

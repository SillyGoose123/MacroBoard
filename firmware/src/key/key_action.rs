use crate::bytes_trait::BytesConvert;
use crate::summer::tones::Tone;
use crate::{KEY_CHANNEL, MOUSE_CHANNEL, SUMMER_CHANNEL, get_byte};
use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;
use usbd_hid::descriptor::MouseReport;

#[derive(TsBind, Copy, Clone)]
pub enum Action {
    KeyAction(SlimKeyReport),
    MouseAction(MouseReport),
    SummerAction(Tone),
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
            _ => Self::SummerAction(Tone::from_bytes(bytes, pointer)),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        match self {
            Action::KeyAction(key_report) => {
                bytes.push(0x1);
                bytes.append(key_report.to_bytes().to_vec().as_mut());
            }
            Action::MouseAction(mouse_report) => {
                bytes.push(0x2);
                bytes.append(mouse_report.to_bytes().to_vec().as_mut());
            }
            Action::SummerAction(tone) => {
                bytes.push(0x3);
                bytes.append(tone.to_bytes().to_vec().as_mut());
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

#[derive(Clone, Copy)]
pub struct SlimKeyReport {
    pub modifier: u8,
    pub keycodes: [u8; 6],
}

impl BytesConvert for SlimKeyReport {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        Self {
            modifier: get_byte!(bytes, pointer),
            keycodes: BytesConvert::from_bytes(bytes, pointer),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = vec![self.modifier];
        bytes.append(self.keycodes.to_bytes().as_mut());
        bytes.to_vec()
    }
}

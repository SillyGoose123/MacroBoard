use crate::bytes_trait::BytesConvert;
use crate::key::key_action::KeyAction;
use alloc::vec::Vec;
use ts_bind::TsBind;

pub struct RotaryAction {
    pub plus: Vec<KeyAction>,
    pub minus: Vec<KeyAction>,
}

impl BytesConvert for RotaryAction {
    fn from_bytes(bytes: &[u8]) -> Self {
        todo!()
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut pointer = 0;
        todo!()
    }
}

#[derive(TsBind)]
pub struct KnobAction {
    pub(crate) rotary_action: RotaryAction,
    pub(crate) switch: Vec<KeyAction>,
}

impl BytesConvert for KnobAction {
    fn from_bytes(bytes: &[u8]) -> Self {
        todo!()
    }

    fn to_bytes(&self) -> Vec<u8> {
        todo!()
    }
}

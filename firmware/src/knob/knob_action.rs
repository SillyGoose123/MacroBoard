use crate::bytes_trait::BytesConvert;
use crate::key::key_action::Action;
use alloc::vec::Vec;
use ts_bind::TsBind;

#[derive(TsBind, Default)]
pub struct KnobAction {
    pub(crate) rotary_action: RotaryAction,
    pub(crate) switch: Vec<Action>,
}

impl BytesConvert for KnobAction {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        Self {
            rotary_action: BytesConvert::from_bytes(bytes, pointer),
            switch: BytesConvert::from_bytes(bytes, pointer),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        todo!()
    }
}

#[derive(TsBind, Default)]
pub struct RotaryAction {
    pub plus: Vec<Action>,
    pub minus: Vec<Action>,
}

impl BytesConvert for RotaryAction {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        let plus: Vec<Action> = BytesConvert::from_bytes(bytes, pointer);
        let minus = BytesConvert::from_bytes(bytes, pointer);

        RotaryAction { plus, minus }
    }

    fn to_bytes(&self) -> Vec<u8> {
        todo!()
    }
}

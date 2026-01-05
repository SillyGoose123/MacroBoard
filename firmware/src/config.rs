use crate::bytes_trait::BytesConvert;
use crate::key::key_action::Action;
use crate::knob::knob_action::{KnobAction, RotaryAction};
use crate::led::Effect;
use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;

#[derive(TsBind, Default)]
pub struct Config {
    pub switch_action: [Vec<Action>; 6],
    pub knob_action: KnobAction,
    pub effect: Effect,
}

impl Config {
    pub(crate) fn load() -> Self {
        Self {
            switch_action: [vec![], vec![], vec![], vec![], vec![], vec![]],
            knob_action: KnobAction {
                switch: vec![],
                rotary_action: RotaryAction {
                    plus: vec![],
                    minus: vec![],
                },
            },
            effect: Effect {
                colors: vec![],
                time_diff: 0,
            },
        }
    }

    pub(crate) fn store(&self) {}
}
//https://crates.io/crates/eeprom24x

impl BytesConvert for Config {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        Self {
            switch_action: BytesConvert::from_bytes(bytes, pointer),
            knob_action: BytesConvert::from_bytes(bytes, pointer),
            effect: BytesConvert::from_bytes(bytes, pointer),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.append(self.switch_action.to_bytes().as_mut());
        bytes.append(self.knob_action.to_bytes().as_mut());
        bytes.append(self.effect.to_bytes().as_mut());
        bytes
    }
}

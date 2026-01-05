use crate::key::key_action::KeyAction;
use crate::knob::knob_action::{KnobAction, RotaryAction};
use crate::led::Effect;
use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;
use crate::bytes_trait::BytesConvert;

#[derive(TsBind)]
pub struct Config {
    pub key_action: [Vec<KeyAction>; 6],
    pub knob_action: KnobAction,
    pub input_delay: u32,
    pub effect: Effect,
}

impl Config {
    pub(crate) fn load() -> Self {
        Self {
            key_action: [vec![], vec![], vec![], vec![], vec![], vec![]],
            knob_action: KnobAction {
                switch: vec![],
                rotary_action: RotaryAction {
                    plus: vec![],
                    minus: vec![],
                },
            },
            input_delay: 10,
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
  fn from_bytes(bytes: &[u8]) -> Self {
    let mut pointer = 0;
    todo!()
  }

  fn to_bytes(&self) -> Vec<u8> {
    todo!()
  }
}
use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;
use crate::key::key_action::KeyAction;
use crate::knob::knob_action::KnobAction;

#[derive(TsBind)]
pub struct Config {
    pub(crate) key_action: [Vec<KeyAction>; 6],
    knob_action: KnobAction,
    pub input_delay: u32,
}

impl Config {
    pub(crate) fn load() -> Self {
        Self {
            key_action: [vec![], vec![], vec![], vec![], vec![], vec![]],
            knob_action: KnobAction {},
            input_delay: 10,
        }
    }

    pub(crate) fn store(&self) {

    }
}
//https://crates.io/crates/eeprom24x

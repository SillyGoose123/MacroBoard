use models::KeyAction;
use models::KnobAction;
use alloc::vec;
use alloc::vec::Vec;


pub struct Config {
    pub(crate) key_action: [Vec<KeyAction>; 6],
    knob_action: Vec<KnobAction>,
    pub input_delay: u32,
}

impl Config {
    pub(crate) fn load() -> Self {
        Self {
            key_action: [vec![], vec![], vec![], vec![], vec![], vec![]],
            knob_action: vec![],
            input_delay: 10,
        }
    }

    pub(crate) fn store(&self) {

    }
}
//https://crates.io/crates/eeprom24x

use crate::config::Config;
use embedded_hal::digital::InputPin;
use seeeduino_xiao_rp2040::hal::gpio::{DynPinId, FunctionSioInput, Pin, PullDown};

pub struct Switches<'a> {
    pins: [Pin<DynPinId, FunctionSioInput, PullDown>; 6],
    config: &'a Config,
}

impl<'a> Switches<'a> {
    pub fn init(pins: [Pin<DynPinId, FunctionSioInput, PullDown>; 6], config: &'a Config) -> Self {
        Self {
            pins,
            config,
        }
    }

    // Gets executed in the while loop
    pub fn check(&mut self) {
        for (index, pin) in &mut self.pins.iter_mut().enumerate() {
            if pin.is_high().unwrap_or(false) {
                self.config.key_action[index]
                    .iter()
                    .for_each(|action| action.execute())
            }
        }
    }
}

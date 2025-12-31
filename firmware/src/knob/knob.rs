use crate::config::Config;
use seeeduino_xiao_rp2040::hal::gpio::{
    DynPinId, FunctionSioInput, Pin, PullDown,
};

pub struct Knob<'a> {
    rotary_pins: [Pin<DynPinId, FunctionSioInput, PullDown>; 2],
    switch: Pin<DynPinId, FunctionSioInput, PullDown>,
    config: &'a Config,
}

impl<'a> Knob<'a> {
    pub fn init(
        rotary_pins: [Pin<DynPinId, FunctionSioInput, PullDown>; 2],
        switch: Pin<DynPinId, FunctionSioInput, PullDown>,
        config: &'a Config,
    ) -> Self {
        Self {
            rotary_pins,
            switch,
            config,
        }
    }

    // Gets executed in the while loop
    pub fn check(&mut self) {

    }
}

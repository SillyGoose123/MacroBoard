use crate::def_enum;
use alloc::vec::Vec;
use smart_leds::{RGB8, colors};

#[derive(Eq, PartialEq)]
pub struct Effect {
    colors: Vec<RGB8>,
    time_diff: u32, //in milliseconds,
    ticks: u32,
}

impl Effect {
    pub(crate) const fn new(colors: Vec<RGB8>, time_diff: u32) -> Self {
        Self {
            colors,
            time_diff,
            ticks: 0,
        }
    }

    pub fn tick(&mut self) -> RGB8 {
        self.ticks += 1;
        if self.time_diff == 0 {
            return self.colors.first().unwrap_or(&colors::BLACK).clone();
        }

        if (self.time_diff * self.colors.len() as u32) < self.ticks {
            self.ticks = 0;
        }

        let index: usize = (self.ticks / self.time_diff) as usize;
        self.colors.get(index).unwrap_or(&colors::BLACK).clone()
    }
}

def_enum!(
  pub Effects => Effect {
    Rainbow => Effect::new(RAINBOW_COLORS.to_vec(), 250),
    Off => Effect::new(NONE_COLORS.to_vec(), 0),
  }
);

const RAINBOW_COLORS: &[RGB8] = &[colors::BLUE, colors::RED, colors::GREEN];
const NONE_COLORS: &[RGB8] = &[colors::BLACK];
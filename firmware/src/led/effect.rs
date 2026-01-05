use crate::bytes_trait::BytesConvert;
use crate::led::NUM_LEDS;
use alloc::vec::Vec;
use smart_leds::{RGB8, colors};
use ts_bind::TsBind;

#[derive(TsBind, Eq, PartialEq)]
pub struct Effect {
    pub(crate) colors: Vec<RGB8>,
    pub(crate) time_diff: u32, //in milliseconds,
}

impl Effect {
    pub(crate) const fn new(colors: Vec<RGB8>, time_diff: u32) -> Self {
        Self { colors, time_diff }
    }

    pub fn tick(&mut self, mut ticks: u32, mut index: u32) -> [RGB8; 5] {
        if ticks > self.time_diff {
            ticks = 0;
            index += 1;
        }

        let length = self.colors.len() as u32;
        if index > length {
            index -= length;
        }

        let mut rgb = [colors::BLACK; 5];
        for i in 0..NUM_LEDS {
            rgb[i] = self.get_index(index + i as u32);
        }

        rgb
    }

    fn get_index(&self, index: u32) -> RGB8 {
        let length = self.colors.len();
        let mut i = index;
        if index as usize > length {
            i -= length as u32;
        }

        *self.colors.get(i as usize).unwrap_or(&colors::BLACK)
    }
}

impl BytesConvert for Effect {
    fn from_bytes(bytes: &[u8]) -> Self {
        let mut colors = Vec::new();
        //read all colors
        for index in 5..(bytes[4] / 3 + 5) as usize {
            colors.push(RGB8::new(
                *bytes.get(index).unwrap_or(&0),
                *bytes.get(index + 1).unwrap_or(&0),
                *bytes.get(index + 2).unwrap_or(&0),
            ));
        }

        Effect {
            colors,
            time_diff: u32::from_le_bytes([
                *bytes.get(0).unwrap_or(&0),
                *bytes.get(1).unwrap_or(&0),
                *bytes.get(2).unwrap_or(&0),
                *bytes.get(3).unwrap_or(&0),
            ]),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();

        self.time_diff
            .to_le_bytes()
            .iter()
            .for_each(|c| bytes.push(*c));

        bytes.push(self.colors.len() as u8);
        for color in &self.colors {
            bytes.push(color.r);
            bytes.push(color.g);
            bytes.push(color.b);
        }

        bytes
    }
}
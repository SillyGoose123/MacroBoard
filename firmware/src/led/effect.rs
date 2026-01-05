use crate::bytes_trait::BytesConvert;
use crate::get_byte;
use crate::led::NUM_LEDS;
use alloc::vec;
use alloc::vec::Vec;
use smart_leds::{RGB8, colors};
use ts_bind::TsBind;

#[derive(TsBind, Eq, PartialEq, Default)]
pub struct Effect {
    pub(crate) colors: Vec<RGB8>,
    pub(crate) time_diff: u32, //in milliseconds,
}

impl Effect {
    pub(crate) const fn new(colors: Vec<RGB8>, time_diff: u32) -> Self {
        Self { colors, time_diff }
    }

    pub fn tick(&mut self, ticks: &mut u32, index: &mut u32) -> [RGB8; 5] {
        if *ticks > self.time_diff {
            *ticks = 0;
            *index += 1;
        }

        let length = self.colors.len() as u32;
        if *index > length {
            *index -= length;
        }

        let mut rgb = [colors::BLACK; 5];
        for i in 0..NUM_LEDS {
            rgb[i] = self.get_index(*index + i as u32);
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
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        let colors: Vec<RGB8> = BytesConvert::from_bytes(bytes, pointer);

        Effect {
            colors,
            time_diff: u32::from_le_bytes([
                get_byte!(bytes, pointer),
                get_byte!(bytes, pointer),
                get_byte!(bytes, pointer),
                get_byte!(bytes, pointer),
            ]),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();

        self.time_diff
            .to_le_bytes()
            .iter()
            .for_each(|c| bytes.push(*c));

        bytes.append(&mut self.colors.to_bytes());
        bytes
    }
}

impl BytesConvert for RGB8 {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        RGB8::new(
            get_byte!(bytes, pointer),
            get_byte!(bytes, pointer),
            get_byte!(bytes, pointer),
        )
    }

    fn to_bytes(&self) -> Vec<u8> {
        vec![self.r, self.g, self.b]
    }
}

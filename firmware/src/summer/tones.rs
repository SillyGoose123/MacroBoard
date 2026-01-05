use crate::bytes_trait::BytesConvert;
use crate::get_byte;
use alloc::vec::Vec;
use ts_bind::TsBind;

#[derive(TsBind, Copy, Clone)]
pub enum Tone {
    LOW,
    MEDIUM,
    DEFAULT,
    HIGH,
}

impl Tone {
    pub(crate) fn get_value(&self) -> u16 {
        match self {
            Tone::LOW => 1000,
            Tone::MEDIUM => 2000,
            Tone::DEFAULT => 4000,
            Tone::HIGH => 8000,
        }
    }
}

impl BytesConvert for Tone {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        match get_byte!(bytes, pointer) {
            1 => Tone::LOW,
            2 => Tone::MEDIUM,
            3 => Tone::HIGH,
            _ => Tone::DEFAULT,
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        [match self {
            Tone::LOW => 0x1,
            Tone::MEDIUM => 0x2,
            Tone::HIGH => 0x3,
            _ => 0x0,
        }]
        .to_vec()
    }
}

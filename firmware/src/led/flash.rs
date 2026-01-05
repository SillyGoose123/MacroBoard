use crate::bytes_trait::BytesConvert;
use crate::get_byte;
use alloc::vec::Vec;
use smart_leds::RGB8;
use ts_bind::TsBind;

#[derive(TsBind)]
pub struct Flash {
    pub rgb: RGB8,
    pub duration: u8,
}

impl BytesConvert for Flash {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        Flash {
            rgb: BytesConvert::from_bytes(bytes, pointer),
            duration: get_byte!(bytes, pointer),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = self.rgb.to_bytes();
        bytes.push(self.duration);
        bytes
    }
}

use crate::bytes_trait::BytesConvert;
use crate::get_byte;
use alloc::vec;
use alloc::vec::Vec;
use ts_bind::TsBind;

#[derive(Clone, Copy, TsBind)]
pub struct SlimKeyReport {
  pub modifier: u8,
  pub keycodes: [u8; 6],
}

impl BytesConvert for SlimKeyReport {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        Self {
            modifier: get_byte!(bytes, pointer),
            keycodes: BytesConvert::from_bytes(bytes, pointer),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = vec![self.modifier];
        bytes.extend(self.keycodes.to_bytes());
        bytes.to_vec()
    }
}

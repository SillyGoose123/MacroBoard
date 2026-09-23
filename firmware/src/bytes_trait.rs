use crate::get_byte;
use alloc::vec;
use alloc::vec::Vec;
use core::array::from_fn;

pub trait BytesConvert {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self;
    fn to_bytes(&self) -> Vec<u8>;
}

impl<T: BytesConvert> BytesConvert for Vec<T> {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        let length: usize = get_byte!(bytes, pointer) as usize;
        let mut elements = Vec::new();

        for _ in 1..length {
            let thing = T::from_bytes(bytes, pointer);
            elements.push(thing);
        }

        elements
    }

    fn to_bytes(&self) -> Vec<u8> {
        let length: usize = self.len();
        let mut bytes: Vec<u8> = Vec::new();
        bytes.push(length as u8);

        for thing in self {
            bytes.extend(thing.to_bytes());
        }

        bytes
    }
}

impl BytesConvert for u8 {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        get_byte!(bytes, pointer)
    }

    fn to_bytes(&self) -> Vec<u8> {
        vec![*self]
    }
}

impl<T: BytesConvert, const N: usize> BytesConvert for [T; N] {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        from_fn(|_| T::from_bytes(bytes, pointer))
    }

    fn to_bytes(&self) -> Vec<u8> {
        self.iter().flat_map(|item| item.to_bytes()).collect()
    }
}

impl BytesConvert for u32 {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        u32::from_le_bytes([
            get_byte!(bytes, pointer),
            get_byte!(bytes, pointer),
            get_byte!(bytes, pointer),
            get_byte!(bytes, pointer),
        ])
    }

    fn to_bytes(&self) -> Vec<u8> {
        u32::to_le_bytes(*self).to_vec()
    }
}

#[macro_export]
macro_rules! get_byte {
    // Reads the bytes & defaults to null and moves the pointer afterwards
    ($bytes:ident, $pointer:ident) => {
        || -> u8 {
            *$pointer += 1;
            *$bytes.get(*$pointer - 1).unwrap_or(&0)
        }()
    };
}

#[macro_export]
macro_rules! parse_bytes {
    ($name:ident, $value:expr) => {
        || -> $name {
            let mut pointer = 0;
            $name::from_bytes($value, &mut pointer)
        }()
    };
}

#[cfg(all(test, not(target_arch = "arm")))]
mod tests {
    use super::*;

    #[test]
    fn u32_to_bytes() {
        let input: u32 = 256;
        assert_eq!(input.to_bytes(), [0, 1, 0, 0])
    }

    #[test]
    fn u32_from_bytes() {
        let input = [0, 1, 0, 0];
        let mut pointer = 0;
        assert_eq!(u32::from_bytes(&input, &mut pointer), 256);
    }

    #[test]
    fn fixed_slice_to_bytes() {
        let input: [u8; 4] = [1, 2, 5, 6];
        assert_eq!(input.to_bytes(), input);
    }

    #[test]
    fn fixed_slice_from_bytes() {
        let input: [u8; 4] = [1, 2, 5, 6];
        let mut pointer = 0;
        let output: [u8; 4] = BytesConvert::from_bytes(&input, &mut pointer);
        assert_eq!(output , input);
    }

    #[test]
    fn u8_to_bytes() {
        let input: u8 = 12;
        assert_eq!(input.to_bytes(), [12])
    }

    #[test]
    fn u8_from_bytes() {
        let input = [12];
        let mut pointer = 0;
        assert_eq!(BytesConvert::from_bytes(&input, &mut pointer), 16);
    }
}

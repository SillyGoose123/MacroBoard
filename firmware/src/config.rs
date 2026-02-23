use crate::bytes_trait::BytesConvert;
use crate::key::key_action::Action;
use crate::knob::knob_action::KnobAction;
use crate::led::Effect;
use crate::{STORAGE, parse_bytes};
use alloc::vec::Vec;
use embassy_rp::flash::Error;
use ts_bind::TsBind;

#[derive(TsBind, Default, Clone)]
pub struct Config {
    pub switch_action: [Vec<Action>; 6],
    pub knob_action: KnobAction,
    pub effect: Effect,
}

impl Config {
    pub(crate) async fn load() -> Self {
        let mut storage = STORAGE.lock().await;
        if let Ok(bytes) = storage.as_mut().unwrap().read().await {
            return parse_bytes!(Config, bytes.as_slice());
        }

        Default::default()
    }

    // Is blocking
    pub(crate) async fn store(&self) -> Result<(), Error> {
        let mut storage = STORAGE.lock().await;
        storage
            .as_mut()
            .unwrap()
            .write(self.to_bytes().as_slice())?;
        Ok(())
    }
}

impl BytesConvert for Config {
    fn from_bytes(bytes: &[u8], pointer: &mut usize) -> Self {
        Self {
            switch_action: BytesConvert::from_bytes(bytes, pointer),
            knob_action: BytesConvert::from_bytes(bytes, pointer),
            effect: BytesConvert::from_bytes(bytes, pointer),
        }
    }

    fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::new();
        bytes.append(self.switch_action.to_bytes().as_mut());
        bytes.append(self.knob_action.to_bytes().as_mut());
        bytes.append(self.effect.to_bytes().as_mut());
        bytes
    }
}

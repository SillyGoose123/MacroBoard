use alloc::string::String;
use embassy_executor::Spawner;
use crate::config::Config;
use crate::driver_trait::Driver;

pub struct SwitchesDriver {

}

impl Driver<String> for SwitchesDriver {
  fn init(spawner: Spawner, config: &Config, peri: String) -> Self {
    Self {

    }
  }
}
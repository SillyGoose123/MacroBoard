use alloc::string::String;
use embassy_executor::Spawner;
use crate::config::Config;
use crate::driver_trait::Driver;

pub struct LedDriver {

}

impl Driver<String> for LedDriver {
  fn init(spawner: Spawner, config: &Config, peri: String) -> Self {
    Self {

    }
  }
}
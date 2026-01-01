use alloc::string::String;
use embassy_executor::Spawner;
use crate::config::Config;
use crate::driver_trait::Driver;

pub struct KnobDriver {

}

impl Driver<String> for  KnobDriver {
  fn init(spawner: Spawner, config: &Config, peri: String) -> Self {
    Self {

    }
  }
}
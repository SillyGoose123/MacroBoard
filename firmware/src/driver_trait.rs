use embassy_executor::Spawner;
use crate::config::Config;

pub trait Driver<T> {
  fn init(spawner: Spawner, config: &Config, peri: T) -> Self;
}
//TODO: ADD WHERE T === PERI
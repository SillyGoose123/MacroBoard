pub mod led;
mod effect;
mod flash;

use ts_bind::ts_bind_const;
pub use effect::Effect;
pub use flash::Flash;

/*pub use effect::Effects;*/

#[ts_bind_const]
pub const NUM_LEDS: usize = 5;